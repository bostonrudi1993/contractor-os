import { useState, useEffect } from "react";

// ─── STORAGE ─────────────────────────────────────────────────────────
const KEYS = {
  segment: "cos_segment", settings: "cos_settings", compliance: "cos_compliance",
  drivers: "cos_drivers", vehicles: "cos_vehicles", maintenance: "cos_maintenance",
  expenses: "cos_expenses", revenue: "cos_revenue", routes: "cos_routes",
  contracts: "cos_contracts", incidents: "cos_incidents", brokers: "cos_brokers",
  loads: "cos_loads", users: "cos_users", currentUser: "cos_current_user",
  notifications: "cos_notifications",
};
const stor = { get: (k,fb) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):fb; } catch { return fb; } }, set: (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} } };

// ─── SEGMENT CONFIG ───────────────────────────────────────────────────
const SEGMENTS = {
  otr: {
    id: "otr", label: "OTR / Owner Operator", icon: "🚛",
    tagline: "Load board hauling with your own authority",
    color: "#f59e0b", darkColor: "#92400e",
    nav: ["dashboard","analyze","boards","compliance","brokers","fleet","finance","reports","trends","users","settings"],
    features: { loadAnalysis:true, brokerScorecard:true, loadBoards:true, routeProfit:false, contractTracker:false, dspMetrics:false, stopMetrics:false },
  },
  fedex: {
    id: "fedex", label: "FedEx Ground / HD Contractor", icon: "📦",
    tagline: "ISP route management & compliance",
    color: "#6366f1", darkColor: "#3730a3",
    nav: ["dashboard","routes","compliance","drivers","fleet","finance","contracts","reports","trends","users","settings"],
    features: { loadAnalysis:false, brokerScorecard:false, loadBoards:false, routeProfit:true, contractTracker:true, dspMetrics:false, stopMetrics:true },
  },
  amazon: {
    id: "amazon", label: "Amazon DSP", icon: "📬",
    tagline: "Delivery Service Partner operations",
    color: "#f97316", darkColor: "#9a3412",
    nav: ["dashboard","routes","compliance","drivers","fleet","finance","contracts","reports","trends","users","settings"],
    features: { loadAnalysis:false, brokerScorecard:false, loadBoards:false, routeProfit:true, contractTracker:true, dspMetrics:true, stopMetrics:true },
  },
  lastmile: {
    id: "lastmile", label: "Last Mile (Lowe's / Home Depot)", icon: "🏠",
    tagline: "Home delivery contractor management",
    color: "#22c55e", darkColor: "#14532d",
    nav: ["dashboard","routes","compliance","drivers","fleet","finance","contracts","reports","trends","users","settings"],
    features: { loadAnalysis:false, brokerScorecard:false, loadBoards:false, routeProfit:true, contractTracker:true, dspMetrics:false, stopMetrics:true },
  },
  usps: {
    id: "usps", label: "USPS HCR Contractor", icon: "📮",
    tagline: "Highway Contract Route operations",
    color: "#3b82f6", darkColor: "#1e3a8a",
    nav: ["dashboard","routes","compliance","drivers","fleet","finance","contracts","reports","trends","users","settings"],
    features: { loadAnalysis:false, brokerScorecard:false, loadBoards:false, routeProfit:true, contractTracker:true, dspMetrics:false, stopMetrics:false },
  },
};

// ─── AI PROMPTS ───────────────────────────────────────────────────────
const ANALYZE_PROMPT = `You are a freight rate analyst for OTR owner-operators. Respond ONLY with this JSON (no markdown):
{"grossRate":0,"grossRPM":0,"fuelCost":0,"deadheadCost":0,"truckCost":0,"netRevenue":0,"netRPM":0,"grade":"A","verdict":"TAKE IT","verdictColor":"green","summary":"...","strengths":["..."],"concerns":["..."],"marketContext":"...","counterOffer":{"suggestedRate":0,"script":"..."}}`;

const PARSE_PROMPT = `Extract load details from pasted text. Respond ONLY with JSON (no markdown):
{"origin":"City, ST","destination":"City, ST","miles":null,"offeredRate":null,"commodity":"Unknown","pickupDate":"Unknown","brokerName":"Unknown","deadheadMiles":null}`;

const COMPLIANCE_PROMPT = `You are a DOT/FMCSA compliance expert for contract carriers. Answer practically — specific regulation, what's needed, where to file, deadline, penalty. Plain English a fleet owner can act on today.`;

const ROUTE_AI_PROMPT = `You are a route profitability analyst for contract delivery operations. Given route data, analyze profitability and give actionable recommendations. Respond ONLY with JSON (no markdown):
{"profitabilityScore":"A|B|C|D","verdict":"PROFITABLE|MARGINAL|LOSING","netPerStop":0,"netPerMile":0,"summary":"...","strengths":["..."],"concerns":["..."],"recommendations":["..."]}`;

// ─── HELPERS ──────────────────────────────────────────────────────────
const fmt$ = n => `$${(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const daysUntil = d => { if(!d) return null; return Math.ceil((new Date(d)-new Date())/86400000); };
const statusColor = d => { if(d===null) return "#444"; if(d<0) return "#ef4444"; if(d<=30) return "#ef4444"; if(d<=60) return "#f59e0b"; if(d<=90) return "#facc15"; return "#22c55e"; };
const statusLabel = d => { if(d===null) return "Not set"; if(d<0) return `OVERDUE ${Math.abs(d)}d`; if(d===0) return "TODAY"; if(d<=30) return `${d}d URGENT`; if(d<=90) return `${d}d Soon`; return `${d}d`; };
const gradeColor = g => ({A:"#22c55e",B:"#84cc16",C:"#f59e0b",D:"#ef4444"}[g]||"#555");

// ─── SHARED STYLES ────────────────────────────────────────────────────
const mkStyles = (accent) => ({
  input: {width:"100%",background:"#0f0f0f",border:"1px solid #2a2a2a",borderRadius:6,padding:"10px 14px",color:"#e8e4d8",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none"},
  label: {fontSize:9,color:"#555",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:5,display:"block"},
  card: {background:"#141414",border:"1px solid #222",borderRadius:8,padding:"18px 20px"},
  btn: {background:accent,color:"#0a0a0a",border:"none",padding:"10px 22px",borderRadius:6,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",letterSpacing:"0.08em"},
  ghost: {background:"transparent",border:"1px solid #2a2a2a",color:"#666",padding:"10px 18px",borderRadius:6,fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer"},
  danger: {background:"#ef4444",color:"#fff",border:"none",padding:"10px 22px",borderRadius:6,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"},
  section: {fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:800,color:"#e8e4d8",letterSpacing:"0.02em"},
});

// ─── SUB-COMPONENTS (defined outside main component to prevent remount issues) ──
const NavBtn = ({id,label,active,accent,onNav}) => (
  <button onClick={()=>onNav(id)} style={{background:active?"#1a1a1a":"transparent",border:"none",borderBottom:active?`2px solid ${accent}`:"2px solid transparent",color:active?accent:"#555",padding:"0 12px",height:50,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'DM Mono',monospace",transition:"all 0.15s",whiteSpace:"nowrap",flexShrink:0}}>{label}</button>
);

const SubNavComp = ({tabs,active,accent,onSelect}) => (
  <div style={{display:"flex",borderBottom:"1px solid #1e1e1e",background:"#0d0d0d",padding:"0 24px",overflowX:"auto"}}>
    {tabs.map(([id,label])=>(
      <button key={id} onClick={()=>onSelect(id)} style={{background:"transparent",border:"none",borderBottom:active===id?`2px solid ${accent}`:"2px solid transparent",color:active===id?accent:"#444",padding:"11px 14px",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap",transition:"all 0.15s"}}>{label}</button>
    ))}
  </div>
);

const StatCard = ({label,value,color,sub,card}) => (
  <div style={card}>
    <div style={{fontSize:28,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:color||"#f59e0b",lineHeight:1}}>{value}</div>
    <div style={{fontSize:9,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:5}}>{label}</div>
    {sub&&<div style={{fontSize:10,color:"#444",marginTop:3}}>{sub}</div>}
  </div>
);

const ExpiryBadgeComp = ({label,days}) => (
  <div style={{background:days<0?"#1c0505":days<=30?"#1a1005":"#141414",border:`1px solid ${statusColor(days)}33`,borderLeft:`3px solid ${statusColor(days)}`,borderRadius:6,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
    <span style={{fontSize:12,color:"#c8c4bc"}}>{label}</span>
    <span style={{fontSize:11,color:statusColor(days),fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{statusLabel(days)}</span>
  </div>
);

const LoaderComp = ({msg,accent}) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 0",gap:16}}>
    <div style={{width:36,height:36,border:`2px solid #1e1e1e`,borderTop:`2px solid ${accent}`,borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
    <div style={{fontSize:11,color:"#555"}}>{msg||"Processing..."}</div>
  </div>
);

const EditModalComp = ({modal,editForm,setEditForm,saveEdit,closeModal,accent,S,MODAL_CONFIGS}) => {
  if(!modal) return null;
  const config = MODAL_CONFIGS[modal.type];
  if(!config) return null;
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}} onClick={closeModal}>
      <div style={{background:"#141414",border:`1px solid ${accent}44`,borderRadius:10,padding:"28px 28px 24px",maxWidth:560,width:"100%",maxHeight:"85vh",overflowY:"auto",animation:"fadeUp 0.2s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#e8e4d8"}}>{config.title}</div>
          <button onClick={closeModal} style={{background:"transparent",border:"none",color:"#555",cursor:"pointer",fontSize:18,lineHeight:1}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          {config.fields.map(([field,label,type])=>{
            const isTextarea = type==="textarea";
            const isSelect = type.startsWith("select:");
            const options = isSelect ? type.replace("select:","").split("|") : [];
            const isFullWidth = isTextarea || field==="notes" || field==="name";
            return (
              <div key={field} style={{gridColumn:isFullWidth?"1/-1":"auto"}}>
                <label style={S.label}>{label}</label>
                {isTextarea ? (
                  <textarea value={editForm[field]||""} onChange={e=>setEditForm(p=>({...p,[field]:e.target.value}))} style={{...S.input,height:80,resize:"vertical"}}/>
                ) : isSelect ? (
                  <select value={editForm[field]||""} onChange={e=>setEditForm(p=>({...p,[field]:e.target.value}))} style={S.input}>
                    {options.map(o=><option key={o} value={o}>{o||"Select..."}</option>)}
                  </select>
                ) : (
                  <input type={type} value={editForm[field]||""} onChange={e=>setEditForm(p=>({...p,[field]:e.target.value}))} style={S.input}/>
                )}
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={saveEdit} style={S.btn}>Save Changes</button>
          <button onClick={closeModal} style={S.ghost}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
export default function ContractorOS() {
  const [segment, setSegment] = useState(() => stor.get(KEYS.segment, null));
  const [screen, setScreen] = useState("dashboard");
  const [settings, setSettings] = useState(() => stor.get(KEYS.settings, {mpg:8,dieselPrice:3.85,cpm:0.18,homeBase:"",companyName:""}));
  const [compliance, setCompliance] = useState(() => stor.get(KEYS.compliance, {trucks:[],drivers:[]}));
  const [vehicles, setVehicles] = useState(() => stor.get(KEYS.vehicles, []));
  const [drivers, setDrivers] = useState(() => stor.get(KEYS.drivers, []));
  const [maintenance, setMaintenance] = useState(() => stor.get(KEYS.maintenance, []));
  const [expenses, setExpenses] = useState(() => stor.get(KEYS.expenses, []));
  const [revenue, setRevenue] = useState(() => stor.get(KEYS.revenue, []));
  const [routes, setRoutes] = useState(() => stor.get(KEYS.routes, []));
  const [contracts, setContracts] = useState(() => stor.get(KEYS.contracts, []));
  const [incidents, setIncidents] = useState(() => stor.get(KEYS.incidents, []));
  const [brokers, setBrokers] = useState(() => stor.get(KEYS.brokers, []));
  const [loads, setLoads] = useState(() => stor.get(KEYS.loads, []));

  // UI state
  const [subScreen, setSubScreen] = useState(null);
  const [modal, setModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [aiLoading, setAiLoading] = useState(false);

  // Screen-level form state (lifted to avoid useState-in-IIFE bug)
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [driverForm, setDriverForm] = useState({name:"",route:"",payType:"per_mile",payRate:"",ytdPay:"",phone:"",hireDate:"",status:"active"});
  const [showAddIncident, setShowAddIncident] = useState(null);
  const [incidentForm, setIncidentForm] = useState({driverId:"",date:"",type:"delivery",description:"",severity:"minor"});
  const [editIncidentId, setEditIncidentId] = useState(null);
  const [editIncidentForm, setEditIncidentForm] = useState({});

  const [showAddMaint, setShowAddMaint] = useState(false);
  const [maintForm, setMaintForm] = useState({truckName:"",type:"",date:"",mileage:"",cost:"",notes:"",nextDueMiles:""});

  const [showAddContract, setShowAddContract] = useState(false);
  const [contractForm, setContractForm] = useState({name:"",company:"",startDate:"",renewalDate:"",value:"",status:"active",notes:""});

  const [showAddRevenue, setShowAddRevenue] = useState(false);
  const [revenueForm, setRevenueForm] = useState({date:"",description:"",amount:"",vehicle:""});
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({date:"",category:"fuel",amount:"",description:"",vehicle:""});
  const [excelImporting, setExcelImporting] = useState(false);
  const [excelResult, setExcelResult] = useState(null);

  // Phase 2 — Notifications
  const [notifications, setNotifications] = useState(() => stor.get(KEYS.notifications, []));
  const [notifPermission, setNotifPermission] = useState("default");

  // Phase 3 — Users / Roles
  const [users, setUsers] = useState(() => stor.get(KEYS.users, []));
  const [currentUser, setCurrentUser] = useState(() => stor.get(KEYS.currentUser, {id:"owner",name:"Owner",role:"owner",pin:""}));
  const [showAddUser, setShowAddUser] = useState(false);
  const [userForm, setUserForm] = useState({name:"",role:"driver",pin:"",driverId:""});
  const [pinEntry, setPinEntry] = useState(null); // {userId, enteredPin}
  const [switchingUser, setSwitchingUser] = useState(false);

  // Phase 4 — Trends
  const [trendsView, setTrendsView] = useState("monthly"); // monthly | weekly
  const [selectedRoute, setSelectedRoute] = useState("all");

  const [routeForm, setRouteForm] = useState({name:"",stops:"",miles:"",rate:"",stopRate:"",ratePerMile:"",driverPay:"",otherCosts:"",frequency:"Daily",vehicle:"",notes:""});
  const [brokerForm, setBrokerForm] = useState({name:"",paySpeed:"",rating:3,notes:"",blacklisted:false});

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({name:"",year:"",make:"",plate:"",dotInspection:"",ifta:"",irp:"",registration:""});
  const [showAddCompDriver, setShowAddCompDriver] = useState(false);
  const [compDriverForm, setCompDriverForm] = useState({name:"",cdlExpiry:"",medCardExpiry:"",mvrDue:"",drugTest:"",annualReview:""});
  const [aiResult, setAiResult] = useState(null);
  const [dotAnswer, setDotAnswer] = useState(null);
  const [dotQ, setDotQ] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [parsedLoad, setParsedLoad] = useState(null);
  const [loadForm, setLoadForm] = useState({origin:"",destination:"",miles:"",offeredRate:"",deadheadMiles:"",commodity:"",pickupDate:"",brokerName:""});
  const [analyzeStep, setAnalyzeStep] = useState("paste");

  // Persist all state
  useEffect(()=>{if(segment)stor.set(KEYS.segment,segment);},[segment]);
  useEffect(()=>{stor.set(KEYS.settings,settings);},[settings]);
  useEffect(()=>{stor.set(KEYS.compliance,compliance);},[compliance]);
  useEffect(()=>{stor.set(KEYS.vehicles,vehicles);},[vehicles]);
  useEffect(()=>{stor.set(KEYS.drivers,drivers);},[drivers]);
  useEffect(()=>{stor.set(KEYS.maintenance,maintenance);},[maintenance]);
  useEffect(()=>{stor.set(KEYS.expenses,expenses);},[expenses]);
  useEffect(()=>{stor.set(KEYS.revenue,revenue);},[revenue]);
  useEffect(()=>{stor.set(KEYS.routes,routes);},[routes]);
  useEffect(()=>{stor.set(KEYS.contracts,contracts);},[contracts]);
  useEffect(()=>{stor.set(KEYS.incidents,incidents);},[incidents]);
  useEffect(()=>{stor.set(KEYS.brokers,brokers);},[brokers]);
  useEffect(()=>{stor.set(KEYS.loads,loads);},[loads]);
  useEffect(()=>{stor.set(KEYS.users,users);},[users]);
  useEffect(()=>{stor.set(KEYS.currentUser,currentUser);},[currentUser]);
  useEffect(()=>{stor.set(KEYS.notifications,notifications);},[notifications]);

  const seg = segment ? SEGMENTS[segment] : null;
  const S = seg ? mkStyles(seg.color) : mkStyles("#f59e0b");
  const accent = seg?.color || "#f59e0b";

  // ── AI ─────────────────────────────────────────────────────────────
  const callAI = async (system, content, json=true) => {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages:[{role:"user",content}]}),
    });
    const d = await r.json();
    const text = d.content?.[0]?.text||"";
    if(!json) return text;
    try { return JSON.parse(text.replace(/```json|```/g,"").trim()); } catch { return null; }
  };

  const analyzeLoad = async () => {
    if(!loadForm.origin||!loadForm.destination||!loadForm.offeredRate) return;
    setAiLoading(true); setAiResult(null);
    const miles=parseFloat(loadForm.miles)||0, dead=parseFloat(loadForm.deadheadMiles)||0;
    const fuelEst=((miles+dead)/settings.mpg)*settings.dieselPrice;
    const result = await callAI(ANALYZE_PROMPT, `Origin:${loadForm.origin} Dest:${loadForm.destination} Miles:${miles} Dead:${dead} Rate:$${loadForm.offeredRate} Commodity:${loadForm.commodity||"?"} Broker:${loadForm.brokerName||"?"} MPG:${settings.mpg} Diesel:$${settings.dieselPrice} FuelEst:$${fuelEst.toFixed(2)} TruckCPM:$${settings.cpm}`);
    if(result) { setAiResult(result); setLoads(p=>[{id:Date.now(),date:new Date().toLocaleDateString(),load:{...loadForm},result},...p].slice(0,100)); }
    setAnalyzeStep("result"); setAiLoading(false);
  };

  const parseLoad = async () => {
    if(!pasteText.trim()) return;
    setAiLoading(true);
    const parsed = await callAI(PARSE_PROMPT, pasteText);
    if(parsed) setLoadForm({origin:parsed.origin||"",destination:parsed.destination||"",miles:parsed.miles||"",offeredRate:parsed.offeredRate||"",deadheadMiles:parsed.deadheadMiles||"",commodity:parsed.commodity||"",pickupDate:parsed.pickupDate||"",brokerName:parsed.brokerName||""});
    setAnalyzeStep("confirm"); setAiLoading(false);
  };

  const analyzeRoute = async (route) => {
    setAiLoading(true);
    const result = await callAI(ROUTE_AI_PROMPT, `Route:${route.name} Stops:${route.stops} Miles:${route.miles} ContractedRate:$${route.rate} FuelCost:$${((route.miles/settings.mpg)*settings.dieselPrice).toFixed(2)} TruckCPM:$${settings.cpm} DriverPay:$${route.driverPay||0} OtherCosts:$${route.otherCosts||0}`);
    if(result) { setRoutes(p=>p.map(r=>r.id===route.id?{...r,analysis:result}:r)); }
    setAiLoading(false);
  };

  const askDot = async () => {
    if(!dotQ.trim()) return;
    setAiLoading(true); setDotAnswer(null);
    const ans = await callAI(COMPLIANCE_PROMPT, dotQ, false);
    setDotAnswer(ans); setAiLoading(false);
  };

  const importExcelPL = async (file) => {
    setExcelImporting(true); setExcelResult(null);
    try {
      const text = await file.text();
      const result = await callAI(
        `You are a financial data extractor. Parse this CSV/text data from a QuickBooks or Excel P&L export and extract all line items. Respond ONLY with JSON (no markdown):
{"revenue":[{"description":"...","amount":0,"date":"YYYY-MM-DD","category":"revenue"}],
"expenses":[{"description":"...","amount":0,"date":"YYYY-MM-DD","category":"fuel|maintenance|insurance|driver_pay|other"}],
"summary":{"totalRevenue":0,"totalExpenses":0,"netProfit":0,"period":"..."}}`,
        `File name: ${file.name}\n\nContent:\n${text.slice(0,8000)}`
      );
      if(result) {
        setExcelResult(result);
      }
    } catch(e) {
      setExcelResult({error:"Could not parse file. Make sure it's a CSV or text export from QuickBooks or Excel."});
    }
    setExcelImporting(false);
  };

  const confirmExcelImport = () => {
    if(!excelResult||excelResult.error) return;
    const today = new Date().toISOString().slice(0,10);
    if(excelResult.revenue) setRevenue(p=>[...excelResult.revenue.map(r=>({...r,id:Date.now()+Math.random(),date:r.date||today})),...p]);
    if(excelResult.expenses) setExpenses(p=>[...excelResult.expenses.map(e=>({...e,id:Date.now()+Math.random(),date:e.date||today})),...p]);
    setExcelResult(null);
  };

  // ── PHASE 2: NOTIFICATIONS ────────────────────────────────────────
  const generateNotifications = () => {
    const notifs = [];
    const now = Date.now();
    // Compliance expiry alerts
    compliance.trucks.forEach(t => {
      [["dotInspection","DOT Inspection",t.name],["ifta","IFTA Renewal",t.name],["irp","IRP Plates",t.name],["registration","Registration",t.name]].forEach(([f,label,name])=>{
        const d = daysUntil(t[f]);
        if(d!==null && d<=90) notifs.push({id:`${t.id}-${f}`,type:"compliance",severity:d<=30?"urgent":d<=60?"warning":"info",title:`${label} Expiring`,body:`${name} — ${statusLabel(d)}`,days:d,date:t[f],ts:now});
      });
    });
    compliance.drivers.forEach(d => {
      [["cdlExpiry","CDL",d.name],["medCardExpiry","Med Card",d.name],["mvrDue","MVR Pull",d.name],["drugTest","Drug Test",d.name]].forEach(([f,label,name])=>{
        const dy = daysUntil(d[f]);
        if(dy!==null && dy<=90) notifs.push({id:`${d.id}-${f}`,type:"driver",severity:dy<=30?"urgent":dy<=60?"warning":"info",title:`${label} Due`,body:`${name} — ${statusLabel(dy)}`,days:dy,date:d[f],ts:now});
      });
    });
    // Contract renewals
    contracts.forEach(c => {
      const d = daysUntil(c.renewalDate);
      if(d!==null && d<=90) notifs.push({id:`contract-${c.id}`,type:"contract",severity:d<=30?"urgent":"warning",title:"Contract Renewal",body:`${c.name} — ${statusLabel(d)}`,days:d,date:c.renewalDate,ts:now});
    });
    return notifs.sort((a,b)=>a.days-b.days);
  };

  const requestPushPermission = async () => {
    if(!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if(perm==="granted") {
      new Notification("ContractorOS Alerts Enabled", {body:"You'll receive compliance and contract renewal reminders.",icon:"/icons/icon-192.png"});
    }
  };

  const sendTestNotif = () => {
    if(Notification.permission==="granted") {
      new Notification("🔴 Compliance Alert", {body:"DOT Inspection expiring in 14 days — Unit 1",icon:"/icons/icon-192.png"});
    }
  };

  // ── PHASE 3: ROLE HELPERS ─────────────────────────────────────────
  const canEdit = () => currentUser.role==="owner" || currentUser.role==="manager";
  const isOwner = () => currentUser.role==="owner";
  const getDriverForUser = () => drivers.find(d=>d.id===currentUser.driverId);

  const switchUser = (user) => {
    if(!user.pin) { setCurrentUser(user); setSwitchingUser(false); return; }
    setPinEntry({userId:user.id, enteredPin:"", user});
  };

  const confirmPin = () => {
    if(!pinEntry) return;
    if(pinEntry.enteredPin===pinEntry.user.pin) {
      setCurrentUser(pinEntry.user);
      setPinEntry(null);
      setSwitchingUser(false);
    } else {
      setPinEntry(p=>({...p,enteredPin:"",error:true}));
    }
  };

  // ── PHASE 1: PDF GENERATION ───────────────────────────────────────
  const generatePDF = (type) => {
    const win = window.open("","_blank");
    const styles = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; color: #1a1a1a; background: white; padding: 40px; }
        .header { border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
        .logo { font-size: 28px; font-weight: 900; letter-spacing: -0.02em; }
        .logo span { color: #f59e0b; }
        .meta { font-size: 12px; color: #666; text-align: right; }
        h2 { font-size: 20px; font-weight: 700; margin: 24px 0 12px; color: #1a1a1a; border-left: 4px solid #f59e0b; padding-left: 12px; }
        h3 { font-size: 15px; font-weight: 700; margin: 16px 0 8px; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
        th { background: #f5f5f5; padding: 8px 12px; text-align: left; font-weight: 700; border-bottom: 2px solid #ddd; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
        td { padding: 8px 12px; border-bottom: 1px solid #eee; vertical-align: top; }
        tr:hover td { background: #fafafa; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
        .badge-red { background: #fee2e2; color: #dc2626; }
        .badge-yellow { background: #fef9c3; color: #ca8a04; }
        .badge-green { background: #dcfce7; color: #16a34a; }
        .badge-blue { background: #dbeafe; color: #2563eb; }
        .stat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; }
        .stat-value { font-size: 28px; font-weight: 800; color: #f59e0b; }
        .stat-label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; font-size: 10px; color: #999; display: flex; justify-content: space-between; }
        .urgent { color: #dc2626; font-weight: 700; }
        .warning { color: #d97706; font-weight: 700; }
        .ok { color: #16a34a; }
        @media print { body { padding: 20px; } }
      </style>
    `;
    const now = new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
    const company = settings.companyName || "My Fleet";

    let body = "";

    if(type==="compliance") {
      const urgent = generateNotifications().filter(n=>n.severity==="urgent");
      const warning = generateNotifications().filter(n=>n.severity==="warning");
      body = `
        <div class="header">
          <div><div class="logo">CONTRACTOR<span>OS</span></div><div style="font-size:14px;color:#666;margin-top:4px;">Compliance Report</div></div>
          <div class="meta"><strong>${company}</strong><br/>${now}<br/>Generated by ContractorOS</div>
        </div>
        <div class="stat-grid">
          <div class="stat-card"><div class="stat-value">${compliance.trucks.length}</div><div class="stat-label">Vehicles on File</div></div>
          <div class="stat-card"><div class="stat-value">${compliance.drivers.length}</div><div class="stat-label">Drivers on File</div></div>
          <div class="stat-card"><div class="stat-value" style="color:${urgent.length>0?"#dc2626":"#16a34a"}">${urgent.length}</div><div class="stat-label">Urgent Items</div></div>
        </div>
        ${urgent.length>0?`<h2>🔴 Urgent — Action Required</h2><table><thead><tr><th>Item</th><th>Status</th><th>Date</th></tr></thead><tbody>${urgent.map(n=>`<tr><td>${n.title} — ${n.body.split("—")[0].trim()}</td><td class="urgent">${n.body.split("—")[1]||""}</td><td>${n.date||""}</td></tr>`).join("")}</tbody></table>`:""}
        ${warning.length>0?`<h2>⚠ Coming Up — 31–90 Days</h2><table><thead><tr><th>Item</th><th>Status</th><th>Date</th></tr></thead><tbody>${warning.map(n=>`<tr><td>${n.title} — ${n.body.split("—")[0].trim()}</td><td class="warning">${n.body.split("—")[1]||""}</td><td>${n.date||""}</td></tr>`).join("")}</tbody></table>`:""}
        <h2>Vehicle Files</h2><table><thead><tr><th>Unit</th><th>Year/Make</th><th>DOT Inspection</th><th>Registration</th><th>IFTA</th><th>IRP</th></tr></thead><tbody>
          ${compliance.trucks.map(t=>{
            const di=daysUntil(t.dotInspection),reg=daysUntil(t.registration),ifta=daysUntil(t.ifta),irp=daysUntil(t.irp);
            const cls=d=>d===null?"":d<=30?"urgent":d<=60?"warning":"ok";
            return `<tr><td><strong>${t.name}</strong></td><td>${t.year||""} ${t.make||""}</td><td class="${cls(di)}">${t.dotInspection||"—"}</td><td class="${cls(reg)}">${t.registration||"—"}</td><td class="${cls(ifta)}">${t.ifta||"—"}</td><td class="${cls(irp)}">${t.irp||"—"}</td></tr>`;
          }).join("")}
        </tbody></table>
        <h2>Driver Files</h2><table><thead><tr><th>Driver</th><th>CDL Expiry</th><th>Med Card</th><th>MVR Due</th><th>Drug Test</th><th>Annual Review</th></tr></thead><tbody>
          ${compliance.drivers.map(d=>{
            const cdl=daysUntil(d.cdlExpiry),med=daysUntil(d.medCardExpiry),mvr=daysUntil(d.mvrDue),drug=daysUntil(d.drugTest);
            const cls=dy=>dy===null?"":dy<=30?"urgent":dy<=60?"warning":"ok";
            return `<tr><td><strong>${d.name}</strong></td><td class="${cls(cdl)}">${d.cdlExpiry||"—"}</td><td class="${cls(med)}">${d.medCardExpiry||"—"}</td><td class="${cls(mvr)}">${d.mvrDue||"—"}</td><td class="${cls(drug)}">${d.drugTest||"—"}</td><td>${d.annualReview||"—"}</td></tr>`;
          }).join("")}
        </tbody></table>
        <h2>Federal Recurring Deadlines</h2><table><thead><tr><th>Filing</th><th>Due Date</th><th>Notes</th></tr></thead><tbody>
          ${[["IFTA Q1","Jan 31","Fuel tax Oct–Dec"],["IFTA Q2","Apr 30","Fuel tax Jan–Mar"],["IFTA Q3","Jul 31","Fuel tax Apr–Jun"],["IFTA Q4","Oct 31","Fuel tax Jul–Sep"],["UCR Registration","Dec 31","Opens Oct 1"],["MCS-150 Update","Every 2 years","Per USDOT# anniversary"],["Drug Clearinghouse","Annual per driver","Required employer query"]].map(([f,d,n])=>`<tr><td>${f}</td><td>${d}</td><td>${n}</td></tr>`).join("")}
        </tbody></table>
      `;
    }

    if(type==="drivers") {
      body = `
        <div class="header">
          <div><div class="logo">CONTRACTOR<span>OS</span></div><div style="font-size:14px;color:#666;margin-top:4px;">Driver File Summary</div></div>
          <div class="meta"><strong>${company}</strong><br/>${now}<br/>Generated by ContractorOS</div>
        </div>
        <div class="stat-grid">
          <div class="stat-card"><div class="stat-value">${drivers.length}</div><div class="stat-label">Total Drivers</div></div>
          <div class="stat-card"><div class="stat-value">${drivers.filter(d=>d.status==="active").length}</div><div class="stat-label">Active</div></div>
          <div class="stat-card"><div class="stat-value" style="color:${incidents.length>0?"#dc2626":"#16a34a"}">${incidents.length}</div><div class="stat-label">Total Incidents</div></div>
        </div>
        ${drivers.map(d=>{
          const driverIncs = incidents.filter(i=>i.driverId===d.id||i.driverName===d.name);
          const cdl=daysUntil(d.cdlExpiry),med=daysUntil(d.medCardExpiry);
          const cls=dy=>dy===null?"":dy<=30?"urgent":dy<=60?"warning":"ok";
          return `
            <h2>${d.name}</h2>
            <table><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>
              <tr><td>Status</td><td><span class="badge ${d.status==="active"?"badge-green":"badge-red"}">${d.status}</span></td></tr>
              <tr><td>Route / Assignment</td><td>${d.route||"Unassigned"}</td></tr>
              <tr><td>Hire Date</td><td>${d.hireDate||"—"}</td></tr>
              <tr><td>Pay Type</td><td>${d.payType?.replace("_"," ")||"—"} @ ${d.payRate||"—"}</td></tr>
              <tr><td>YTD Earnings</td><td>${d.ytdPay?fmt$(parseFloat(d.ytdPay)):"—"}</td></tr>
              <tr><td>CDL Expiry</td><td class="${cls(cdl)}">${d.cdlExpiry||"Not set"}</td></tr>
              <tr><td>Medical Card</td><td class="${cls(med)}">${d.medCardExpiry||"Not set"}</td></tr>
              <tr><td>Total Incidents</td><td style="color:${driverIncs.length>0?"#dc2626":"#16a34a"};font-weight:700">${driverIncs.length}</td></tr>
            </tbody></table>
            ${driverIncs.length>0?`<table style="margin-top:8px"><thead><tr><th>Date</th><th>Type</th><th>Severity</th><th>Description</th></tr></thead><tbody>${driverIncs.map(i=>`<tr><td>${i.date||"—"}</td><td>${i.type}</td><td class="${i.severity==="critical"||i.severity==="major"?"urgent":"warning"}">${i.severity}</td><td>${i.description}</td></tr>`).join("")}</tbody></table>`:"<p style='font-size:12px;color:#16a34a;margin:8px 0 16px'>✓ No incidents on record</p>"}
          `;
        }).join("")}
      `;
    }

    if(type==="pl") {
      const totalRev = revenue.reduce((s,r)=>s+parseFloat(r.amount||0),0);
      const totalExp = expenses.reduce((s,e)=>s+parseFloat(e.amount||0),0);
      const net = totalRev-totalExp;
      const expByCat = {};
      expenses.forEach(e=>{ expByCat[e.category]=(expByCat[e.category]||0)+parseFloat(e.amount||0); });
      body = `
        <div class="header">
          <div><div class="logo">CONTRACTOR<span>OS</span></div><div style="font-size:14px;color:#666;margin-top:4px;">Profit & Loss Report</div></div>
          <div class="meta"><strong>${company}</strong><br/>${now}<br/>Generated by ContractorOS</div>
        </div>
        <div class="stat-grid">
          <div class="stat-card"><div class="stat-value" style="color:#16a34a">${fmt$(totalRev)}</div><div class="stat-label">Total Revenue</div></div>
          <div class="stat-card"><div class="stat-value" style="color:#dc2626">${fmt$(totalExp)}</div><div class="stat-label">Total Expenses</div></div>
          <div class="stat-card"><div class="stat-value" style="color:${net>=0?"#16a34a":"#dc2626"}">${fmt$(net)}</div><div class="stat-label">Net Profit</div></div>
        </div>
        <h2>Revenue</h2><table><thead><tr><th>Date</th><th>Description</th><th>Vehicle</th><th style="text-align:right">Amount</th></tr></thead><tbody>
          ${revenue.map(r=>`<tr><td>${r.date||"—"}</td><td>${r.description||"Revenue"}</td><td>${r.vehicle||"—"}</td><td style="text-align:right;color:#16a34a;font-weight:700">${fmt$(parseFloat(r.amount||0))}</td></tr>`).join("")}
          <tr style="background:#f5f5f5"><td colspan="3"><strong>Total Revenue</strong></td><td style="text-align:right;font-weight:700;color:#16a34a">${fmt$(totalRev)}</td></tr>
        </tbody></table>
        <h2>Expenses by Category</h2><table><thead><tr><th>Category</th><th style="text-align:right">Total</th><th style="text-align:right">% of Revenue</th></tr></thead><tbody>
          ${Object.entries(expByCat).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>`<tr><td>${cat.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}</td><td style="text-align:right;color:#dc2626">${fmt$(amt)}</td><td style="text-align:right;color:#666">${totalRev>0?((amt/totalRev)*100).toFixed(1):0}%</td></tr>`).join("")}
          <tr style="background:#f5f5f5"><td><strong>Total Expenses</strong></td><td style="text-align:right;font-weight:700;color:#dc2626">${fmt$(totalExp)}</td><td></td></tr>
        </tbody></table>
        <h2>All Expenses</h2><table><thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Vehicle</th><th style="text-align:right">Amount</th></tr></thead><tbody>
          ${expenses.map(e=>`<tr><td>${e.date||"—"}</td><td>${(e.category||"").replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}</td><td>${e.description||"—"}</td><td>${e.vehicle||"—"}</td><td style="text-align:right;color:#dc2626">${fmt$(parseFloat(e.amount||0))}</td></tr>`).join("")}
        </tbody></table>
      `;
    }

    win.document.write(`<!DOCTYPE html><html><head><title>${company} — ContractorOS Report</title>${styles}</head><body>${body}<div class="footer"><span>ContractorOS — ${company}</span><span>Generated ${now}</span><span>Confidential</span></div></body></html>`);
    win.document.close();
    setTimeout(()=>win.print(),500);
  };

  // ── EDIT MODAL HELPERS ─────────────────────────────────────────────
  const openEdit = (type, item) => { setModal({type, item}); setEditForm({...item}); };
  const closeModal = () => { setModal(null); setEditForm({}); };

  const saveEdit = () => {
    if(!modal) return;
    const {type} = modal;
    if(type==="vehicle") setCompliance(p=>({...p,trucks:p.trucks.map(t=>t.id===editForm.id?{...editForm}:t)}));
    if(type==="compdriver") setCompliance(p=>({...p,drivers:p.drivers.map(d=>d.id===editForm.id?{...editForm}:d)}));
    if(type==="route") setRoutes(p=>p.map(r=>r.id===editForm.id?{...editForm}:r));
    if(type==="contract") setContracts(p=>p.map(c=>c.id===editForm.id?{...editForm}:c));
    if(type==="driver") setDrivers(p=>p.map(d=>d.id===editForm.id?{...editForm}:d));
    if(type==="maintenance") setMaintenance(p=>p.map(m=>m.id===editForm.id?{...editForm}:m));
    if(type==="revenue") setRevenue(p=>p.map(r=>r.id===editForm.id?{...editForm}:r));
    if(type==="expense") setExpenses(p=>p.map(e=>e.id===editForm.id?{...editForm}:e));
    if(type==="broker") setBrokers(p=>p.map(b=>b.id===editForm.id?{...editForm}:b));
    closeModal();
  };

  // Modal field configs per type
  const MODAL_CONFIGS = {
    vehicle: {
      title: "Edit Vehicle",
      fields: [
        ["name","Unit Name / #","text"],["year","Year","text"],["make","Make & Model","text"],
        ["plate","Plate #","text"],["dotInspection","DOT Inspection Expiry","date"],
        ["registration","Registration Expiry","date"],["ifta","IFTA Renewal","date"],["irp","IRP Plate Renewal","date"],
      ]
    },
    compdriver: {
      title: "Edit Driver File",
      fields: [
        ["name","Driver Name","text"],["cdlExpiry","CDL Expiry","date"],
        ["medCardExpiry","Medical Card Expiry","date"],["mvrDue","MVR Pull Due","date"],
        ["drugTest","Drug Test Due","date"],["annualReview","Annual Review Due","date"],
      ]
    },
    route: {
      title: "Edit Route",
      fields: [
        ["name","Route Name","text"],["stops","Number of Stops","text"],["miles","Miles per Run","text"],
        ["rate","Flat Contracted Rate ($)","text"],["stopRate","Rate Per Stop ($)","text"],
        ["ratePerMile","Rate Per Mile ($)","text"],["driverPay","Driver Pay ($)","text"],
        ["otherCosts","Other Costs ($)","text"],["frequency","Frequency","text"],["notes","Notes","textarea"],
      ]
    },
    contract: {
      title: "Edit Contract",
      fields: [
        ["name","Contract Name","text"],["company","Company / Client","text"],
        ["startDate","Start Date","date"],["renewalDate","Renewal / Expiry Date","date"],
        ["value","Annual Value ($)","text"],
        ["status","Status","select:active|up_for_renewal|in_negotiation|expired"],
        ["notes","Notes / Performance Requirements","textarea"],
      ]
    },
    driver: {
      title: "Edit Driver",
      fields: [
        ["name","Full Name","text"],["phone","Phone","text"],["hireDate","Hire Date","date"],
        ["route","Assigned Route","text"],
        ["payType","Pay Type","select:per_mile|per_stop|percentage|hourly|salary"],
        ["payRate","Pay Rate","text"],["ytdPay","YTD Earnings ($)","text"],
        ["status","Status","select:active|on_leave|terminated"],
      ]
    },
    maintenance: {
      title: "Edit Service Record",
      fields: [
        ["truckName","Vehicle","text"],["type","Service Type","text"],
        ["date","Date","date"],["mileage","Mileage","text"],
        ["cost","Cost ($)","text"],["nextDueMiles","Next Due (miles)","text"],
        ["notes","Notes","text"],
      ]
    },
    revenue: {
      title: "Edit Revenue Entry",
      fields: [
        ["date","Date","date"],["description","Description","text"],
        ["amount","Amount ($)","text"],["vehicle","Vehicle","text"],
      ]
    },
    expense: {
      title: "Edit Expense",
      fields: [
        ["date","Date","date"],
        ["category","Category","select:fuel|maintenance|insurance|tires|repairs|driver_pay|tolls|permits|registration|ifta|ucr|eld|uniforms|equipment|phone|other"],
        ["amount","Amount ($)","text"],["description","Description","text"],["vehicle","Vehicle","text"],
      ]
    },
    broker: {
      title: "Edit Broker",
      fields: [
        ["name","Broker Name","text"],
        ["paySpeed","Pay Speed","select:|Quick Pay (1-3d)|Net 7|Net 14|Net 21|Net 30|Net 45+|Slow / Problems"],
        ["rating","Rating (1-5)","select:5|4|3|2|1"],
        ["notes","Notes","textarea"],
      ]
    },
  };

  // ── COMPUTED ───────────────────────────────────────────────────────
  const totalRevenue = revenue.reduce((s,r)=>s+parseFloat(r.amount||0),0);
  const totalExpenses = expenses.reduce((s,e)=>s+parseFloat(e.amount||0),0);
  const netProfit = totalRevenue - totalExpenses;

  const getAllExpiryItems = () => {
    const items = [];
    compliance.trucks.forEach(t=>{
      if(t.dotInspection) items.push({label:`DOT Inspection — ${t.name}`,days:daysUntil(t.dotInspection)});
      if(t.registration) items.push({label:`Registration — ${t.name}`,days:daysUntil(t.registration)});
    });
    compliance.drivers.forEach(d=>{
      if(d.cdlExpiry) items.push({label:`CDL — ${d.name}`,days:daysUntil(d.cdlExpiry)});
      if(d.medCardExpiry) items.push({label:`Med Card — ${d.name}`,days:daysUntil(d.medCardExpiry)});
    });
    contracts.forEach(c=>{
      if(c.renewalDate) items.push({label:`Contract Renewal — ${c.name}`,days:daysUntil(c.renewalDate)});
    });
    return items.sort((a,b)=>(a.days??9999)-(b.days??9999));
  };
  const urgentItems = getAllExpiryItems().filter(i=>i.days!==null&&i.days<=30);

  // ── SEGMENT SELECTOR ───────────────────────────────────────────────
  if(!segment) {
    return (
      <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'DM Mono',monospace",padding:32}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap'); *{box-sizing:border-box} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{textAlign:"center",marginBottom:48,animation:"fadeUp 0.5s ease"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:"0.4em",color:"#444",textTransform:"uppercase",marginBottom:16}}>Welcome to</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:52,fontWeight:900,color:"#e8e4d8",lineHeight:1,letterSpacing:"-0.01em"}}>CONTRACTOR<span style={{color:"#f59e0b"}}>OS</span></div>
          <div style={{fontSize:12,color:"#555",marginTop:12,lineHeight:1.7}}>The complete operating system for contract carriers.<br/>Select your contractor type to get started.</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,maxWidth:900,width:"100%",animation:"fadeUp 0.5s 0.1s ease both"}}>
          {Object.values(SEGMENTS).map(s=>(
            <button key={s.id} onClick={()=>setSegment(s.id)} style={{background:"#111",border:`1px solid #222`,borderRadius:10,padding:"24px 26px",textAlign:"left",cursor:"pointer",transition:"all 0.2s",outline:"none",}} onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.background="#161616";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#222";e.currentTarget.style.background="#111";}}>
              <div style={{fontSize:28,marginBottom:12}}>{s.icon}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:6}}>{s.label}</div>
              <div style={{fontSize:11,color:"#555",lineHeight:1.6,marginBottom:16}}>{s.tagline}</div>
              <div style={{fontSize:10,color:s.color,letterSpacing:"0.15em",textTransform:"uppercase"}}>Select →</div>
            </button>
          ))}
        </div>
        <div style={{marginTop:32,fontSize:10,color:"#333",animation:"fadeUp 0.5s 0.2s ease both"}}>You can switch contractor types anytime in Settings</div>
      </div>
    );
  }

  // ── SHARED COMPONENTS ──────────────────────────────────────────────
  const navLabels = {dashboard:"Dashboard",analyze:"Analyze Load",boards:"Load Boards",compliance:"Compliance",brokers:"Brokers",fleet:"Fleet",finance:"Finance",routes:"Routes",drivers:"Drivers",contracts:"Contracts",reports:"Reports",trends:"P&L Trends",users:"Users",settings:"Settings"};
  const SubNav = ({tabs,active,onSelect}) => <SubNavComp tabs={tabs} active={active} accent={accent} onSelect={onSelect}/>;
  const Stat = ({label,value,color,sub}) => <StatCard label={label} value={value} color={color||accent} sub={sub} card={S.card}/>;
  const ExpiryBadge = ({label,days}) => <ExpiryBadgeComp label={label} days={days}/>;
  const Loader = ({msg}) => <LoaderComp msg={msg} accent={accent}/>;
  const handleNav = (id) => { setScreen(id); setSubScreen(null); setAiResult(null); setAnalyzeStep("paste"); };

  // ── RENDER ─────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",fontFamily:"'DM Mono','Courier New',monospace",color:"#d4d0c8",display:"flex",flexDirection:"column"}}>
      <EditModalComp modal={modal} editForm={editForm} setEditForm={setEditForm} saveEdit={saveEdit} closeModal={closeModal} accent={accent} S={S} MODAL_CONFIGS={MODAL_CONFIGS}/>

      {/* ── PIN ENTRY MODAL ── */}
      {pinEntry&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:20}}>
          <div style={{background:"#141414",border:`1px solid ${accent}44`,borderRadius:10,padding:"32px 28px",maxWidth:320,width:"100%",textAlign:"center"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#e8e4d8",marginBottom:4}}>Switch User</div>
            <div style={{fontSize:12,color:"#555",marginBottom:20}}>Signing in as <span style={{color:accent}}>{pinEntry.user.name}</span></div>
            <div style={{fontSize:11,color:"#555",marginBottom:10}}>Enter PIN</div>
            <input type="password" maxLength={6} value={pinEntry.enteredPin} onChange={e=>setPinEntry(p=>({...p,enteredPin:e.target.value,error:false}))} onKeyDown={e=>e.key==="Enter"&&confirmPin()} placeholder="••••" style={{...S.input,textAlign:"center",fontSize:24,letterSpacing:"0.3em",marginBottom:8}} autoFocus/>
            {pinEntry.error&&<div style={{fontSize:11,color:"#ef4444",marginBottom:8}}>Incorrect PIN — try again</div>}
            <div style={{display:"flex",gap:10,marginTop:12}}>
              <button className="hov" onClick={confirmPin} style={S.btn}>Confirm</button>
              <button onClick={()=>setPinEntry(null)} style={S.ghost}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── USER ROLE BAR ── */}
      {currentUser.role!=="owner"&&(
        <div style={{background:currentUser.role==="manager"?"#0d0d1a":"#0a100a",borderBottom:`1px solid ${currentUser.role==="manager"?"#2a2a5a":"#1a3a1a"}`,padding:"6px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{fontSize:10,color:currentUser.role==="manager"?"#8888cc":"#4ade80",letterSpacing:"0.15em",textTransform:"uppercase"}}>
            {currentUser.role==="manager"?"👔 Manager View":"🚗 Driver View"} — {currentUser.name}
            {currentUser.role==="driver"&&<span style={{color:"#555",marginLeft:8}}>Read only</span>}
          </div>
          <button onClick={()=>setSwitchingUser(true)} style={{background:"transparent",border:"1px solid #2a2a2a",color:"#555",padding:"3px 10px",fontSize:9,cursor:"pointer",borderRadius:3,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>Switch User</button>
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#0a0a0a}
        ::-webkit-scrollbar-thumb{background:#222;border-radius:2px}
        input,textarea,select{outline:none}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .hov:hover{opacity:0.85} .cardhov:hover{border-color:#333!important;background:#181818!important}
        select option{background:#111;color:#e8e4d8}
      `}</style>

      {/* TOP BAR */}
      <div style={{display:"flex",alignItems:"center",height:50,borderBottom:"1px solid #1e1e1e",background:"#0d0d0d",padding:"0 16px",gap:4,overflowX:"auto",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginRight:12,flexShrink:0}}>
          <div style={{width:30,height:30,background:accent,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:4,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,color:"#0a0a0a",letterSpacing:"0.05em"}}>CO</div>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:"#e8e4d8",lineHeight:1}}>CONTRACTOR<span style={{color:accent}}>OS</span></div>
            <div style={{fontSize:8,color:"#444",letterSpacing:"0.15em",textTransform:"uppercase"}}>{seg.icon} {seg.label}</div>
          </div>
        </div>
        <div style={{flex:1}}/>
        <button onClick={()=>setSegment(null)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,padding:"5px 12px",borderRadius:4,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginRight:8,flexShrink:0}}>Switch Type</button>
        {seg.nav.map(id=><NavBtn key={id} id={id} label={urgentItems.length>0&&id==="compliance"?`Compliance 🔴`:navLabels[id]||id} active={screen===id} accent={accent} onNav={handleNav}/>)}
      </div>

      {/* ══ DASHBOARD ══════════════════════════════════════════════════ */}
      {screen==="dashboard"&&(
        <div style={{flex:1,padding:24,maxWidth:1000,margin:"0 auto",width:"100%",animation:"fadeUp 0.3s ease"}}>
          <div style={{marginBottom:28}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:36,fontWeight:900,color:"#e8e4d8",lineHeight:1}}>
              {settings.companyName||"YOUR FLEET"}<br/>
              <span style={{color:accent,fontSize:28}}>OPERATIONS DASHBOARD</span>
            </div>
            <div style={{fontSize:11,color:"#555",marginTop:8}}>{seg.icon} {seg.label} · ContractorOS</div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
            <Stat label="Total Revenue" value={fmt$(totalRevenue)} color="#22c55e"/>
            <Stat label="Total Expenses" value={fmt$(totalExpenses)} color="#ef4444"/>
            <Stat label="Net Profit" value={fmt$(netProfit)} color={netProfit>=0?"#22c55e":"#ef4444"}/>
            <Stat label="Compliance Alerts" value={urgentItems.length} color={urgentItems.length>0?"#ef4444":"#22c55e"} sub={urgentItems.length>0?"Needs attention":"All clear"}/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
            <div style={S.card}>
              <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Quick Actions</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {seg.features.loadAnalysis&&<button className="cardhov" onClick={()=>setScreen("analyze")} style={{...S.card,padding:"10px 14px",fontSize:11,color:accent,cursor:"pointer",textAlign:"left",border:`1px solid ${accent}22`}}>→ Analyze a Load</button>}
                {seg.features.routeProfit&&<button className="cardhov" onClick={()=>setScreen("routes")} style={{...S.card,padding:"10px 14px",fontSize:11,color:accent,cursor:"pointer",textAlign:"left",border:`1px solid ${accent}22`}}>→ View Route Profitability</button>}
                <button className="cardhov" onClick={()=>setScreen("compliance")} style={{...S.card,padding:"10px 14px",fontSize:11,color:"#ef4444",cursor:"pointer",textAlign:"left",border:"1px solid #ef444422"}}>→ Check Compliance</button>
                <button className="cardhov" onClick={()=>{setScreen("fleet");setSubScreen("schedule");}} style={{...S.card,padding:"10px 14px",fontSize:11,color:"#f59e0b",cursor:"pointer",textAlign:"left",border:"1px solid #f59e0b22"}}>→ Fleet Upcoming Service</button>
                <button className="cardhov" onClick={()=>{setScreen("finance");setSubScreen("expenses");}} style={{...S.card,padding:"10px 14px",fontSize:11,color:"#22c55e",cursor:"pointer",textAlign:"left",border:"1px solid #22c55e22"}}>→ Log an Expense</button>
                {seg.features.contractTracker&&<button className="cardhov" onClick={()=>setScreen("contracts")} style={{...S.card,padding:"10px 14px",fontSize:11,color:"#8888cc",cursor:"pointer",textAlign:"left",border:"1px solid #8888cc22"}}>→ View Contracts</button>}
              </div>
            </div>
            <div style={S.card}>
              <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>
                {urgentItems.length>0?"⚠ Urgent Items":"Compliance Status"}
              </div>
              {urgentItems.length===0&&<div style={{fontSize:12,color:"#22c55e"}}>✓ No urgent compliance items</div>}
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {urgentItems.slice(0,4).map((item,i)=><ExpiryBadge key={i} {...item}/>)}
                {urgentItems.length>4&&<div style={{fontSize:10,color:"#555",textAlign:"center",paddingTop:4}}>+{urgentItems.length-4} more — check Compliance tab</div>}
              </div>
            </div>
          </div>

          {seg.features.loadAnalysis&&loads.length>0&&(
            <div style={S.card}>
              <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Recent Load Analysis</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {loads.slice(0,4).map(l=>(
                  <div key={l.id} style={{display:"flex",alignItems:"center",gap:12,padding:"7px 0",borderBottom:"1px solid #1a1a1a"}}>
                    <div style={{width:24,height:24,background:gradeColor(l.result?.grade)+"22",border:`1px solid ${gradeColor(l.result?.grade)}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,color:gradeColor(l.result?.grade),borderRadius:3,flexShrink:0}}>{l.result?.grade}</div>
                    <div style={{flex:1,minWidth:0}}><div style={{fontSize:11,color:"#c8c4bc",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.load.origin} → {l.load.destination}</div><div style={{fontSize:9,color:"#555"}}>{l.date} · {l.load.brokerName}</div></div>
                    <div style={{fontSize:12,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:l.result?.verdictColor==="green"?"#22c55e":l.result?.verdictColor==="yellow"?"#f59e0b":"#ef4444",flexShrink:0}}>{l.result?.verdict}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {seg.features.routeProfit&&routes.length>0&&(
            <div style={{...S.card,marginTop:16}}>
              <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Route Summary</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                {routes.slice(0,4).map(r=>(
                  <div key={r.id} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:6,padding:"12px 14px"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8",marginBottom:4}}>{r.name}</div>
                    <div style={{fontSize:10,color:"#555"}}>{r.stops} stops · {r.miles} mi</div>
                    {r.analysis&&<div style={{fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:gradeColor(r.analysis.profitabilityScore),marginTop:6}}>{r.analysis.verdict}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ OTR: ANALYZE LOAD ══════════════════════════════════════════ */}
      {screen==="analyze"&&seg.features.loadAnalysis&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"flex",borderBottom:"1px solid #1e1e1e",background:"#0d0d0d",padding:"0 24px"}}>
            {[["paste","Paste Load"],["confirm","Confirm"],["result","Score"]].map(([id,lbl],i)=>{
              const active=(analyzeStep===id);
              const done=(i===0&&analyzeStep!=="paste")||(i===1&&analyzeStep==="result");
              return <div key={id} style={{padding:"12px 16px",fontSize:10,color:active?accent:done?"#555":"#333",borderBottom:active?`2px solid ${accent}`:"2px solid transparent",letterSpacing:"0.1em",textTransform:"uppercase"}}><span style={{color:done?"#22c55e":active?accent:"#2a2a2a",marginRight:5}}>{done?"✓":`0${i+1}`}</span>{lbl}</div>;
            })}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:24,maxWidth:800,margin:"0 auto",width:"100%"}}>
            {aiLoading&&<Loader msg="Analyzing rate..."/>}

            {analyzeStep==="paste"&&!aiLoading&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:8}}>PASTE YOUR LOAD</div>
                <p style={{fontSize:11,color:"#555",marginBottom:16,lineHeight:1.8}}>Copy from DAT, Truckstop, broker email or text. Paste everything — AI extracts what it needs.</p>
                <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)} placeholder={"Chicago, IL to Nashville, TN\n487 miles | 42,000 lbs\nRate: $1,450\nPickup: Tomorrow 7am\nBroker: Coyote Logistics"} style={{...S.input,height:160,resize:"vertical",lineHeight:1.7}}/>
                <div style={{display:"flex",gap:12,marginTop:14}}>
                  <button className="hov" onClick={parseLoad} disabled={!pasteText.trim()} style={{...S.btn,opacity:pasteText.trim()?1:0.4}}>Parse Load →</button>
                  <button onClick={()=>setAnalyzeStep("confirm")} style={S.ghost}>Enter manually</button>
                </div>
              </div>
            )}

            {analyzeStep==="confirm"&&!aiLoading&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:8}}>CONFIRM DETAILS</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                  {[["origin","Origin *","City, ST"],["destination","Destination *","City, ST"],["miles","Loaded Miles","487"],["deadheadMiles","Deadhead Miles","0"],["offeredRate","Offered Rate ($) *","1450"],["commodity","Commodity","General freight"],["pickupDate","Pickup Date",""],["brokerName","Broker Name",""]].map(([f,lbl,ph])=>(
                    <div key={f}><label style={S.label}>{lbl}</label><input value={loadForm[f]} onChange={e=>setLoadForm(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input}/></div>
                  ))}
                </div>
                <div style={{display:"flex",gap:12}}>
                  <button className="hov" onClick={analyzeLoad} disabled={!loadForm.origin||!loadForm.destination||!loadForm.offeredRate} style={{...S.btn,opacity:(loadForm.origin&&loadForm.destination&&loadForm.offeredRate)?1:0.4}}>Score This Load →</button>
                  <button onClick={()=>setAnalyzeStep("paste")} style={S.ghost}>← Back</button>
                </div>
              </div>
            )}

            {analyzeStep==="result"&&aiResult&&!aiLoading&&(()=>{
              const vBg={green:"#051a0a",yellow:"#1a1505",red:"#1a0505"};
              const vBd={green:"#0d3a1a",yellow:"#3a2a0a",red:"#3a0a0a"};
              return (
                <div style={{animation:"fadeUp 0.3s ease"}}>
                  <div style={{background:vBg[aiResult.verdictColor]||"#111",border:`1px solid ${vBd[aiResult.verdictColor]||"#222"}`,borderRadius:8,padding:"20px 24px",display:"flex",alignItems:"center",gap:20,marginBottom:16}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:64,fontWeight:900,color:gradeColor(aiResult.grade),lineHeight:1}}>{aiResult.grade}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:800,color:aiResult.verdictColor==="green"?"#22c55e":aiResult.verdictColor==="yellow"?"#f59e0b":"#ef4444"}}>{aiResult.verdict}</div>
                      <div style={{fontSize:12,color:"#888",lineHeight:1.7,marginTop:4}}>{aiResult.summary}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:10,color:"#555",marginBottom:2}}>NET RPM</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:36,fontWeight:900,color:aiResult.verdictColor==="green"?"#22c55e":aiResult.verdictColor==="yellow"?"#f59e0b":"#ef4444"}}>${(aiResult.netRPM||0).toFixed(2)}</div>
                    </div>
                  </div>
                  <div style={{...S.card,marginBottom:14}}>
                    <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:12}}>Rate Breakdown</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                      {[["Gross Rate",fmt$(aiResult.grossRate),"#c8c4bc"],["Gross RPM",`$${(aiResult.grossRPM||0).toFixed(2)}/mi`,"#c8c4bc"],["Fuel Cost",`-${fmt$(aiResult.fuelCost)}`,"#ef4444"],["Deadhead",`-${fmt$(aiResult.deadheadCost)}`,"#ef4444"],["Truck Cost",`-${fmt$(aiResult.truckCost)}`,"#ef4444"],["Net Revenue",fmt$(aiResult.netRevenue),"#22c55e"]].map(([lbl,val,col])=>(
                        <div key={lbl} style={{padding:"8px 0",borderTop:"1px solid #1e1e1e"}}><div style={{fontSize:9,color:"#555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{lbl}</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:col}}>{val}</div></div>
                      ))}
                    </div>
                  </div>
                  {aiResult.counterOffer&&(
                    <div style={{background:"#110f00",border:"1px solid #2a2500",borderRadius:8,padding:"16px 20px",marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div><div style={{fontSize:9,color:"#5a5000",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:3}}>Negotiation Script</div><div style={{fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#f59e0b"}}>Counter: {fmt$(aiResult.counterOffer.suggestedRate)}</div></div>
                        <button onClick={()=>navigator.clipboard.writeText(aiResult.counterOffer.script)} style={{background:"#1a1500",border:"1px solid #2a2000",color:"#f59e0b",padding:"5px 12px",fontSize:9,cursor:"pointer",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>Copy</button>
                      </div>
                      <div style={{background:"#0a0900",border:"1px solid #1a1800",borderRadius:4,padding:"12px 14px",fontSize:12,color:"#c8c080",lineHeight:1.8,fontStyle:"italic"}}>"{aiResult.counterOffer.script}"</div>
                    </div>
                  )}
                  <div style={{display:"flex",gap:12}}>
                    <button className="hov" onClick={()=>{setAnalyzeStep("paste");setPasteText("");setAiResult(null);setLoadForm({origin:"",destination:"",miles:"",offeredRate:"",deadheadMiles:"",commodity:"",pickupDate:"",brokerName:""});}} style={S.btn}>→ Analyze Another</button>
                    <button onClick={()=>setScreen("dashboard")} style={S.ghost}>Dashboard</button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ══ LOAD BOARDS ════════════════════════════════════════════════ */}
      {screen==="boards"&&(
        <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
          <div style={{maxWidth:860,margin:"0 auto"}}>
            <div style={{...S.section,marginBottom:4}}>LOAD BOARD HUB</div>
            <p style={{fontSize:11,color:"#555",marginBottom:24,lineHeight:1.8}}>Open any board, find a load, copy the details, then come back and <span style={{color:accent,cursor:"pointer"}} onClick={()=>setScreen("analyze")}>paste into Analyze Load</span>.</p>
            <div style={{background:"#0c120c",border:"1px solid #1a2a1a",borderRadius:8,padding:"18px 22px",marginBottom:28}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#4ade80",marginBottom:12}}>📋 WHAT TO COPY</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                {[["✓ Origin & destination","City, ST"],["✓ Total miles","Loaded miles"],["✓ Offered rate","Flat or per mile"],["✓ Deadhead miles","Distance to pickup"],["✓ Commodity & weight","What you're hauling"],["✓ Broker name & ref #","For counter-offer script"]].map(([f,h],i)=>(
                  <div key={i} style={{padding:"6px 10px",borderTop:i>=2?"1px solid #0f1f0f":"none",display:"flex",gap:10}}><span style={{fontSize:11,color:"#4ade80"}}>{f}</span><span style={{fontSize:10,color:"#2d4a2d"}}>{h}</span></div>
                ))}
              </div>
            </div>
            {[
              {label:"Major Boards",items:[{name:"DAT One",url:"https://dat.com",desc:"Largest North American load board.",tag:"Most Popular",color:"#f59e0b"},{name:"Truckstop.com",url:"https://truckstop.com",desc:"Strong broker network, rate tools.",tag:"High Volume",color:"#60a5fa"},{name:"123Loadboard",url:"https://www.123loadboard.com",desc:"Budget-friendly alternative.",tag:"Budget",color:"#4ade80"}]},
              {label:"Box Truck Friendly",items:[{name:"Amazon Relay",url:"https://relay.amazon.com",desc:"Direct from Amazon. No broker fees.",tag:"Box Truck ✓",color:"#f59e0b",free:true},{name:"Uber Freight",url:"https://www.uberfreight.com",desc:"Instant rates, transparent pricing.",tag:"Instant Book",color:"#a78bfa",free:true},{name:"GoShip",url:"https://www.goship.com",desc:"Shipper-direct LTL and FTL.",tag:"Shipper Direct",color:"#60a5fa",free:true}]},
            ].map(cat=>(
              <div key={cat.label} style={{marginBottom:24}}>
                <div style={{fontSize:10,color:"#444",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:10}}>{cat.label}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
                  {cat.items.map(b=>(
                    <div key={b.name} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:8,padding:"16px 18px",display:"flex",flexDirection:"column",gap:8}} className="cardhov">
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8"}}>{b.name}</div>
                        <div style={{display:"flex",gap:4}}>{b.free&&<span style={{fontSize:8,padding:"2px 5px",background:"#052e16",color:"#4ade80",border:"1px solid #166534",borderRadius:2}}>FREE</span>}<span style={{fontSize:8,padding:"2px 5px",background:b.color+"18",color:b.color,border:`1px solid ${b.color}33`,borderRadius:2}}>{b.tag}</span></div>
                      </div>
                      <div style={{fontSize:11,color:"#555",flex:1}}>{b.desc}</div>
                      <a href={b.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",justifyContent:"space-between",background:"#0a0a0a",border:"1px solid #1e1e1e",borderRadius:4,padding:"7px 12px",fontSize:11,color:accent,textDecoration:"none",fontFamily:"'DM Mono',monospace"}}><span>Open →</span><span style={{fontSize:9,color:"#333"}}>new tab</span></a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ ROUTES (Non-OTR segments) ═══════════════════════════════════ */}
      {screen==="routes"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[["list","My Routes"],["add","Add Route"],["performance","Performance"]]} active={subScreen||"list"} onSelect={setSubScreen}/>
          <div style={{flex:1,overflowY:"auto",padding:24}}>
            {(!subScreen||subScreen==="list")&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={S.section}>ROUTE PROFITABILITY</div>
                  <button className="hov" onClick={()=>setSubScreen("add")} style={S.btn}>+ Add Route</button>
                </div>
                {routes.length===0&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No routes added yet. Click "+ Add Route" to get started.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {routes.map(r=>(
                    <div key={r.id} style={S.card}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8"}}>{r.name}</div>
                          <div style={{fontSize:10,color:"#555"}}>{r.stops} stops · {r.miles} mi · {r.frequency||"Daily"}</div>
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          {r.analysis&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:gradeColor(r.analysis.profitabilityScore)}}>{r.analysis.verdict}</div>}
                          <button onClick={()=>openEdit("route",r)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                          <button className="hov" onClick={()=>analyzeRoute(r)} style={{...S.btn,padding:"6px 14px",fontSize:11}}>Analyze</button>
                          <button onClick={()=>setRoutes(p=>p.filter(x=>x.id!==r.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                        {[
                          ["Flat Rate",fmt$(parseFloat(r.rate||0)),"#22c55e"],
                          ["Per Stop",r.stopRate?fmt$(parseFloat(r.stopRate)):"—","#4ade80"],
                          ["Per Mile",r.ratePerMile?`$${parseFloat(r.ratePerMile).toFixed(2)}/mi`:"—","#86efac"],
                          ["Fuel Est",fmt$((parseFloat(r.miles||0)/settings.mpg)*settings.dieselPrice),"#ef4444"],
                          ["Driver Pay",fmt$(parseFloat(r.driverPay||0)),"#f59e0b"],
                          ["Net Est",fmt$(parseFloat(r.rate||0)-((parseFloat(r.miles||0)/settings.mpg)*settings.dieselPrice)-parseFloat(r.driverPay||0)-parseFloat(r.otherCosts||0)),parseFloat(r.rate||0)-((parseFloat(r.miles||0)/settings.mpg)*settings.dieselPrice)-parseFloat(r.driverPay||0)>0?"#22c55e":"#ef4444"],
                          ["Stops",r.stops||"—","#c8c4bc"],
                          ["Miles",r.miles||"—","#c8c4bc"],
                        ].map(([lbl,val,col])=>(
                          <div key={lbl} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{lbl}</div><div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:col}}>{val}</div></div>
                        ))}
                      </div>
                      {r.analysis&&(
                        <div style={{marginTop:12,padding:"10px 14px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5}}>
                          <div style={{fontSize:11,color:"#888",lineHeight:1.7,marginBottom:8}}>{r.analysis.summary}</div>
                          {r.analysis.recommendations?.length>0&&r.analysis.recommendations.map((rec,i)=>(
                            <div key={i} style={{fontSize:11,color:accent,padding:"3px 0"}}>→ {rec}</div>
                          ))}
                        </div>
                      )}
                      {aiLoading&&<Loader msg="Analyzing route..."/>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subScreen==="add"&&(
              <div style={{maxWidth:600,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:20}}>ADD ROUTE</div>
                <div style={S.card}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {[["name","Route Name *","Route A / Zone 3"],["stops",seg.features.stopMetrics?"Number of Stops":"Deliveries","42"],["miles","Miles per Run","87"],["rate","Flat Contracted Rate ($)","485"],["stopRate","Rate Per Stop ($)","11.50"],["ratePerMile","Rate Per Mile ($)","2.10"],["driverPay","Driver Pay ($)","120"],["otherCosts","Other Costs ($)","25"]].map(([f,lbl,ph])=>(
                      <div key={f}><label style={S.label}>{lbl}</label><input value={routeForm[f]||""} onChange={e=>setRouteForm(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input}/></div>
                    ))}
                    <div><label style={S.label}>Frequency</label>
                      <select value={routeForm.frequency} onChange={e=>setRouteForm(p=>({...p,frequency:e.target.value}))} style={S.input}>
                        {["Daily","Mon-Fri","Mon-Sat","Alternate Days","Weekly"].map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div><label style={S.label}>Assigned Vehicle</label>
                      <select value={routeForm.vehicle} onChange={e=>setRouteForm(p=>({...p,vehicle:e.target.value}))} style={S.input}>
                        <option value="">Select...</option>
                        {compliance.trucks.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
                        <option value="Unassigned">Unassigned</option>
                      </select>
                    </div>
                    <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={routeForm.notes} onChange={e=>setRouteForm(p=>({...p,notes:e.target.value}))} placeholder="Special instructions, access notes, etc." style={S.input}/></div>
                  </div>
                  <div style={{display:"flex",gap:12,marginTop:16}}>
                    <button className="hov" onClick={()=>{ if(!routeForm.name)return; setRoutes(p=>[...p,{...routeForm,id:Date.now()}]); setRouteForm({name:"",stops:"",miles:"",rate:"",stopRate:"",ratePerMile:"",driverPay:"",otherCosts:"",frequency:"Daily",vehicle:"",notes:""}); setSubScreen("list"); }} style={S.btn}>Save Route</button>
                    <button onClick={()=>setSubScreen("list")} style={S.ghost}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {subScreen==="performance"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:20}}>ROUTE PERFORMANCE</div>
                {routes.filter(r=>r.analysis).length===0?<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No routes analyzed yet. Go to My Routes and click Analyze on each route.</div>:
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {routes.filter(r=>r.analysis).sort((a,b)=>parseFloat(b.rate||0)-parseFloat(a.rate||0)).map((r,i)=>(
                    <div key={r.id} style={{...S.card,display:"flex",alignItems:"center",gap:16}}>
                      <div style={{width:28,fontSize:12,color:"#555",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>#{i+1}</div>
                      <div style={{flex:1}}><div style={{fontSize:13,color:"#e8e4d8"}}>{r.name}</div><div style={{fontSize:10,color:"#555"}}>{r.stops} stops · {r.miles} mi</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Net/Stop</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:accent}}>{fmt$(r.analysis.netPerStop)}</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Net/Mile</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#22c55e"}}>{fmt$(r.analysis.netPerMile)}</div></div>
                      <div style={{width:32,height:32,background:gradeColor(r.analysis.profitabilityScore)+"22",border:`1px solid ${gradeColor(r.analysis.profitabilityScore)}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:gradeColor(r.analysis.profitabilityScore),borderRadius:4}}>{r.analysis.profitabilityScore}</div>
                    </div>
                  ))}
                </div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ COMPLIANCE ═════════════════════════════════════════════════ */}
      {screen==="compliance"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[["overview","Overview"],["vehicles","Vehicles"],["drivers_comp","Drivers"],["docs","Doc Guide"],["ask","Ask DOT AI"]]} active={subScreen||"overview"} onSelect={setSubScreen}/>
          <div style={{flex:1,overflowY:"auto",padding:24}}>
            {(!subScreen||subScreen==="overview")&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:4}}>COMPLIANCE CENTER</div>
                <p style={{fontSize:11,color:"#555",marginBottom:22,lineHeight:1.8}}>
                  {seg.id==="amazon"?"One compliance failure can end your DSP contract. Track everything here.":seg.id==="fedex"?"Protect your ISP route investment with proactive compliance tracking.":"One DOT audit with missing files = up to $16,000 in fines."}
                </p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
                  <Stat label="Vehicles" value={compliance.trucks.length} />
                  <Stat label="Drivers" value={compliance.drivers.length} color="#60a5fa"/>
                  <Stat label="Urgent ≤30d" value={urgentItems.length} color={urgentItems.length>0?"#ef4444":"#22c55e"}/>
                  <Stat label="Contracts" value={contracts.length} color="#8888cc"/>
                </div>
                {urgentItems.length>0&&(
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:10,color:"#ef4444",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8}}>🔴 Urgent Action Required</div>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>{urgentItems.map((item,i)=><ExpiryBadge key={i} {...item}/>)}</div>
                  </div>
                )}
                <div style={{background:"#0c0c14",border:"1px solid #1a1a2a",borderRadius:8,padding:"18px 22px"}}>
                  <div style={{fontSize:10,color:"#3a3a6a",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Federal Recurring Deadlines</div>
                  <div style={{display:"flex",flexDirection:"column",gap:0}}>
                    {[["IFTA Q1 Return","Jan 31","Fuel tax for Oct–Dec"],["IFTA Q2 Return","Apr 30","Fuel tax for Jan–Mar"],["IFTA Q3 Return","Jul 31","Fuel tax for Apr–Jun"],["IFTA Q4 Return","Oct 31","Fuel tax for Jul–Sep"],["UCR Registration","Dec 31","Opens Oct 1 — don't miss it"],["MCS-150 Update","Every 2 years","Based on USDOT# issuance date"],["Drug Clearinghouse","Annually per driver","Required employer query"],["ELD Log Retention","6 months minimum","Keep all HOS logs"]].map(([item,when,note],i)=>(
                      <div key={item} style={{display:"grid",gridTemplateColumns:"1fr auto",gap:0,padding:"10px 0",borderTop:i>0?"1px solid #14141e":"none",alignItems:"start"}}>
                        <div>
                          <div style={{fontSize:12,color:"#8888cc"}}>{item}</div>
                          <div style={{fontSize:10,color:"#3a3a5a",marginTop:2}}>{note}</div>
                        </div>
                        <div style={{fontSize:13,color:"#6060aa",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textAlign:"right",paddingLeft:20,whiteSpace:"nowrap"}}>{when}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {subScreen==="vehicles"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={S.section}>VEHICLE FILES</div>
                  <button className="hov" onClick={()=>setShowAddVehicle(!showAddVehicle)} style={S.btn}>{showAddVehicle?"Cancel":"+ Add Vehicle"}</button>
                </div>
                {showAddVehicle&&(
                  <div style={{...S.card,marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {[["name","Unit Name / # *","Unit 1"],["year","Year","2019"],["make","Make & Model","International 4300"],["plate","Plate #",""],["dotInspection","DOT Inspection Expiry","date"],["registration","Registration Expiry","date"],["ifta","IFTA Renewal","date"],["irp","IRP Plate Renewal","date"]].map(([f,lbl,ph])=>(
                        <div key={f}><label style={S.label}>{lbl}</label><input type={ph==="date"?"date":"text"} value={vehicleForm[f]} onChange={e=>setVehicleForm(p=>({...p,[f]:e.target.value}))} placeholder={ph!=="date"?ph:""} style={S.input}/></div>
                      ))}
                    </div>
                    <button className="hov" onClick={()=>{ if(!vehicleForm.name)return; setCompliance(p=>({...p,trucks:[...p.trucks,{...vehicleForm,id:Date.now()}]})); setVehicleForm({name:"",year:"",make:"",plate:"",dotInspection:"",ifta:"",irp:"",registration:""}); setShowAddVehicle(false); }} style={{...S.btn,marginTop:14}}>Save Vehicle</button>
                  </div>
                )}
                {compliance.trucks.length===0&&!showAddVehicle&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:32}}>No vehicles added yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {compliance.trucks.map(t=>(
                    <div key={t.id} style={S.card}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                        <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:"#e8e4d8"}}>{t.name}</div><div style={{fontSize:10,color:"#555"}}>{t.year} {t.make} {t.plate&&`· ${t.plate}`}</div></div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>openEdit("vehicle",t)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                          <button onClick={()=>setCompliance(p=>({...p,trucks:p.trucks.filter(x=>x.id!==t.id)}))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                        {[["DOT Inspection",t.dotInspection],["Registration",t.registration],["IFTA",t.ifta],["IRP Plates",t.irp]].map(([lbl,date])=>{
                          const d=daysUntil(date),c=statusColor(d);
                          return <div key={lbl} style={{background:"#0f0f0f",border:`1px solid ${c}22`,borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{lbl}</div><div style={{fontSize:12,color:c,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{date?new Date(date).toLocaleDateString():"—"}</div>{d!==null&&<div style={{fontSize:9,color:c,marginTop:2}}>{statusLabel(d)}</div>}</div>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subScreen==="drivers_comp"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={S.section}>DRIVER FILES</div>
                  <button className="hov" onClick={()=>setShowAddCompDriver(!showAddCompDriver)} style={{...S.btn,background:"#60a5fa"}}>{showAddCompDriver?"Cancel":"+ Add Driver"}</button>
                </div>
                {showAddCompDriver&&(
                  <div style={{...S.card,marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {[["name","Driver Name *","text"],["cdlExpiry","CDL Expiry","date"],["medCardExpiry","Medical Card Expiry","date"],["mvrDue","MVR Pull Due","date"],["drugTest","Drug Test Due","date"],["annualReview","Annual Review Due","date"]].map(([f,lbl,t])=>(
                        <div key={f}><label style={S.label}>{lbl}</label><input type={t} value={compDriverForm[f]} onChange={e=>setCompDriverForm(p=>({...p,[f]:e.target.value}))} style={S.input}/></div>
                      ))}
                    </div>
                    <button className="hov" onClick={()=>{ if(!compDriverForm.name)return; setCompliance(p=>({...p,drivers:[...p.drivers,{...compDriverForm,id:Date.now()}]})); setCompDriverForm({name:"",cdlExpiry:"",medCardExpiry:"",mvrDue:"",drugTest:"",annualReview:""}); setShowAddCompDriver(false); }} style={{...S.btn,background:"#60a5fa",marginTop:14}}>Save Driver</button>
                  </div>
                )}
                {compliance.drivers.length===0&&!showAddCompDriver&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:32}}>No drivers added yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {compliance.drivers.map(d=>(
                    <div key={d.id} style={S.card}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:"#e8e4d8"}}>{d.name}</div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>openEdit("compdriver",d)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                          <button onClick={()=>setCompliance(p=>({...p,drivers:p.drivers.filter(x=>x.id!==d.id)}))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                        {[["CDL",d.cdlExpiry],["Med Card",d.medCardExpiry],["MVR Due",d.mvrDue],["Drug Test",d.drugTest],["Annual Review",d.annualReview]].map(([lbl,date])=>{
                          const dy=daysUntil(date),c=statusColor(dy);
                          return <div key={lbl} style={{background:"#0f0f0f",border:`1px solid ${c}22`,borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{lbl}</div><div style={{fontSize:12,color:c,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{date?new Date(date).toLocaleDateString():"—"}</div>{dy!==null&&<div style={{fontSize:9,color:c,marginTop:2}}>{statusLabel(dy)}</div>}</div>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subScreen==="docs"&&(
              <div style={{maxWidth:820,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:4}}>DOCUMENT GUIDE</div>
                <p style={{fontSize:11,color:"#555",marginBottom:22,lineHeight:1.8}}>Every document, where it lives, and how long to keep it.</p>
                {[
                  {cat:"In Every Vehicle",color:"#ef4444",docs:[["Insurance Certificate","Current primary liability cert","Glove box / door pocket","Current always"],["Vehicle Registration","State registration","Glove box","Current always"],["IFTA License","Fuel tax license","Cab","Renew Jan 1"],["Annual DOT Inspection","Post-inspection certificate","In vehicle","12 months"],["Driver CDL","Driver's commercial license","Driver carries","Per CDL expiry"],["Medical Card","DOT physical certificate","Driver carries + office copy","1–2 years"]]},
                  {cat:"Driver Qualification File",color:"#60a5fa",docs:[["Driver Application","3-year employment history","DQ file","3 yrs post-separation"],["CDL Copy","Copy of current CDL","DQ file","Update on renewal"],["Annual MVR","State DMV record pull","DQ file","Pull annually, keep 3 yrs"],["Pre-Employment Drug Test","Negative result required","DQ file","5 years"],["Annual Driving Review","Signed MVR review","DQ file","3 years"],["Clearinghouse Query","FMCSA annual D&A check","DQ file","3 years"]]},
                  {cat:"Company Authority Files",color:"#22c55e",docs:[["MC/DOT Authority","FMCSA operating authority","Office + posted","Permanent"],["BOC-3 Filing","Process agent designation","Office file","Refile if agent changes"],["UCR Confirmation","Annual carrier registration","Office file","Renew Dec 31"],["MCS-150 Update","FMCSA biennial update","Office file","Every 2 years"],["Drug Program Records","Pool enrollment & results","Locked secure file","5 years min"],["Accident Register","All accident details","Office file","3 years"]]},
                ].map(sec=>(
                  <div key={sec.cat} style={{marginBottom:20}}>
                    <div style={{fontSize:10,color:sec.color,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8,display:"flex",alignItems:"center",gap:8}}><div style={{width:3,height:14,background:sec.color,borderRadius:2}}/>{sec.cat}</div>
                    <div style={{border:"1px solid #1e1e1e",borderRadius:6,overflow:"hidden"}}>
                      {sec.docs.map(([name,desc,loc,ret],i)=>(
                        <div key={name} style={{display:"grid",gridTemplateColumns:"2fr 2fr 1.5fr",borderTop:i>0?"1px solid #161616":"none",background:"#0f0f0f"}}>
                          <div style={{padding:"9px 13px",borderRight:"1px solid #161616"}}><div style={{fontSize:11,color:"#c8c4bc"}}>{name}</div><div style={{fontSize:9,color:"#555",marginTop:2}}>{desc}</div></div>
                          <div style={{padding:"9px 13px",borderRight:"1px solid #161616"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Where</div><div style={{fontSize:11,color:"#888"}}>{loc}</div></div>
                          <div style={{padding:"9px 13px"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Keep</div><div style={{fontSize:11,color:"#888"}}>{ret}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {subScreen==="ask"&&(
              <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:4}}>ASK DOT AI</div>
                <p style={{fontSize:11,color:"#555",marginBottom:18,lineHeight:1.8}}>Plain-English answers to any compliance question.</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
                  {["What goes in a driver qualification file?","When do I pull an MVR?","What is UCR and when to renew?","What triggers a DOT audit?","How to register with Drug Clearinghouse?","What is MCS-150?","How long keep HOS logs?","Documents required in vehicle?"].map(q=>(
                    <button key={q} onClick={()=>setDotQ(q)} style={{background:"#111",border:"1px solid #222",color:"#666",padding:"5px 10px",fontSize:10,borderRadius:4,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>{q}</button>
                  ))}
                </div>
                <div style={{display:"flex",gap:10,marginBottom:18}}>
                  <input value={dotQ} onChange={e=>setDotQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askDot()} placeholder="Ask any DOT/FMCSA compliance question..." style={{...S.input,flex:1}}/>
                  <button className="hov" onClick={askDot} disabled={!dotQ.trim()||aiLoading} style={{...S.danger,opacity:dotQ.trim()&&!aiLoading?1:0.4}}>{aiLoading?"...":"Ask →"}</button>
                </div>
                {aiLoading&&<Loader msg="Consulting FMCSA regulations..."/>}
                {dotAnswer&&!aiLoading&&<div style={{background:"#110f00",border:"1px solid #2a2000",borderRadius:8,padding:"18px 22px",animation:"fadeUp 0.3s ease"}}><div style={{fontSize:9,color:"#5a4a00",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>DOT AI Answer</div><div style={{fontSize:12,color:"#c8c4a0",lineHeight:1.9,whiteSpace:"pre-wrap"}}>{dotAnswer}</div><div style={{marginTop:14,fontSize:10,color:"#3a3000",borderTop:"1px solid #2a1800",paddingTop:10}}>⚠ Informational only. Verify with your state DOT and a compliance professional.</div></div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ DRIVERS ════════════════════════════════════════════════════ */}
      {screen==="drivers"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[["list","All Drivers"],["scorecards","Scorecards"],["incidents","Incidents"]]} active={subScreen||"list"} onSelect={setSubScreen}/>
          <div style={{flex:1,overflowY:"auto",padding:24}}>
            {(!subScreen||subScreen==="list")&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={S.section}>DRIVER MANAGEMENT</div>
                  <button className="hov" onClick={()=>setShowAddDriver(!showAddDriver)} style={{...S.btn,background:"#60a5fa"}}>{showAddDriver?"Cancel":"+ Add Driver"}</button>
                </div>
                {showAddDriver&&(
                  <div style={{...S.card,marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {[["name","Full Name *","text",""],["phone","Phone","text",""],["hireDate","Hire Date","date",""],["route","Assigned Route","text","Route A"]].map(([f,lbl,t,ph])=>(
                        <div key={f}><label style={S.label}>{lbl}</label><input type={t} value={driverForm[f]} onChange={e=>setDriverForm(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input}/></div>
                      ))}
                      <div><label style={S.label}>Pay Type</label>
                        <select value={driverForm.payType} onChange={e=>setDriverForm(p=>({...p,payType:e.target.value}))} style={S.input}>
                          <option value="per_mile">Per Mile</option><option value="per_stop">Per Stop</option><option value="percentage">% of Route</option><option value="hourly">Hourly</option><option value="salary">Salary</option>
                        </select>
                      </div>
                      <div><label style={S.label}>Pay Rate</label><input value={driverForm.payRate} onChange={e=>setDriverForm(p=>({...p,payRate:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                      <div><label style={S.label}>YTD Earnings ($)</label><input type="number" value={driverForm.ytdPay} onChange={e=>setDriverForm(p=>({...p,ytdPay:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                      <div><label style={S.label}>Status</label>
                        <select value={driverForm.status} onChange={e=>setDriverForm(p=>({...p,status:e.target.value}))} style={S.input}>
                          <option value="active">Active</option><option value="on_leave">On Leave</option><option value="terminated">Terminated</option>
                        </select>
                      </div>
                    </div>
                    <button className="hov" onClick={()=>{ if(!driverForm.name)return; setDrivers(p=>[...p,{...driverForm,id:Date.now(),incidents:[],scores:[]}]); setDriverForm({name:"",route:"",payType:"per_mile",payRate:"",ytdPay:"",phone:"",hireDate:"",status:"active"}); setShowAddDriver(false); }} style={{...S.btn,background:"#60a5fa",marginTop:14}}>Save Driver</button>
                  </div>
                )}
                {drivers.length===0&&!showAddDriver&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No drivers added yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {drivers.map(d=>(
                    <div key={d.id} style={{...S.card,display:"flex",alignItems:"center",gap:16}}>
                      <div style={{width:36,height:36,background:d.status==="active"?"#22c55e22":"#ef444422",border:`1px solid ${d.status==="active"?"#22c55e44":"#ef444444"}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:d.status==="active"?"#22c55e":"#ef4444",flexShrink:0}}>{d.name.charAt(0)}</div>
                      <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8"}}>{d.name}</div><div style={{fontSize:10,color:"#555"}}>{d.route||"No route"} · {d.payType==="per_mile"?`$${d.payRate}/mi`:d.payType==="per_stop"?`$${d.payRate}/stop`:d.payType==="percentage"?`${d.payRate}% of route`:d.payType==="hourly"?`$${d.payRate}/hr`:`$${d.payRate}/yr`}</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>YTD Pay</div><div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#22c55e"}}>{fmt$(parseFloat(d.ytdPay||0))}</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Incidents</div><div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:(d.incidents||[]).length>0?"#ef4444":"#22c55e"}}>{(d.incidents||[]).length}</div></div>
                      <button onClick={()=>openEdit("driver",d)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                      <button onClick={()=>setDrivers(p=>p.filter(x=>x.id!==d.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {subScreen==="scorecards"&&(
              <div style={{maxWidth:760,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:20}}>DRIVER SCORECARDS</div>
                {drivers.length===0?<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No drivers added yet.</div>:
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {drivers.map(d=>(
                    <div key={d.id} style={S.card}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:14}}>{d.name} — {d.route||"Unassigned"}</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:12}}>
                        {[["On-Time %","—"],["Package Care","—"],["Customer Rating","—"],["Incidents",(d.incidents||[]).length.toString()],["Tenure",d.hireDate?`${Math.floor((new Date()-new Date(d.hireDate))/86400000/30)}mo`:"—"]].map(([lbl,val])=>(
                          <div key={lbl} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px",textAlign:"center"}}><div style={{fontSize:9,color:"#555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>{lbl}</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:val==="0"?"#22c55e":lbl==="Incidents"&&val!=="0"?"#ef4444":accent}}>{val}</div></div>
                        ))}
                      </div>
                      <div style={{fontSize:10,color:"#444",fontStyle:"italic"}}>Connect telematics data (e.g. Amazon Mentor, FedEx GPS) to populate real-time scores.</div>
                    </div>
                  ))}
                </div>}
              </div>
            )}
            {subScreen==="incidents"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={S.section}>INCIDENT LOG</div>
                  <button className="hov" onClick={()=>{setShowAddIncident(showAddIncident?"hide":"show");setEditIncidentId(null);}} style={S.danger}>{showAddIncident&&showAddIncident!=="hide"?"Cancel":"+ Log Incident"}</button>
                </div>

                {/* Add form */}
                {showAddIncident&&showAddIncident!=="hide"&&(
                  <div style={{...S.card,marginBottom:18,border:"1px solid #ef444433"}}>
                    <div style={{fontSize:10,color:"#ef4444",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:14}}>New Incident</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Driver *</label>
                        <select value={incidentForm.driverId} onChange={e=>setIncidentForm(p=>({...p,driverId:e.target.value}))} style={S.input}>
                          <option value="">Select driver...</option>
                          {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </div>
                      <div><label style={S.label}>Date</label><input type="date" value={incidentForm.date} onChange={e=>setIncidentForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Type</label>
                        <select value={incidentForm.type} onChange={e=>setIncidentForm(p=>({...p,type:e.target.value}))} style={S.input}>
                          <option value="delivery">Delivery Issue</option><option value="vehicle">Vehicle Damage</option><option value="accident">Accident</option><option value="customer">Customer Complaint</option><option value="safety">Safety Violation</option><option value="other">Other</option>
                        </select>
                      </div>
                      <div><label style={S.label}>Severity</label>
                        <select value={incidentForm.severity} onChange={e=>setIncidentForm(p=>({...p,severity:e.target.value}))} style={S.input}>
                          <option value="minor">Minor</option><option value="moderate">Moderate</option><option value="major">Major</option><option value="critical">Critical</option>
                        </select>
                      </div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Description *</label><input value={incidentForm.description} onChange={e=>setIncidentForm(p=>({...p,description:e.target.value}))} placeholder="What happened? Include location, vehicle, outcome." style={S.input}/></div>
                    </div>
                    <button className="hov" onClick={()=>{
                      if(!incidentForm.description) return;
                      const driver = drivers.find(d=>d.id===incidentForm.driverId);
                      const inc = {...incidentForm, id:Date.now(), driverName:driver?.name||"Unknown"};
                      setIncidents(p=>[inc,...p]);
                      if(driver) setDrivers(p=>p.map(d=>d.id===incidentForm.driverId?{...d,incidents:[...(d.incidents||[]),inc]}:d));
                      setIncidentForm({driverId:"",date:"",type:"delivery",description:"",severity:"minor"});
                      setShowAddIncident(null);
                    }} style={{...S.danger,marginTop:14}}>Save Incident</button>
                  </div>
                )}

                {/* Driver incident summary strip */}
                {drivers.length>0&&(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8,marginBottom:20}}>
                    {drivers.map(d=>{
                      const driverIncs = incidents.filter(i=>i.driverId===d.id||(i.driverName===d.name));
                      const count = driverIncs.length;
                      const critical = driverIncs.filter(i=>i.severity==="critical"||i.severity==="major").length;
                      return (
                        <div key={d.id} style={{background:count===0?"#0a0f0a":critical>0?"#1a0808":"#120e00",border:`1px solid ${count===0?"#1a2a1a":critical>0?"#3a1010":"#2a1e00"}`,borderRadius:6,padding:"12px 14px",cursor:"pointer"}}
                          onClick={()=>{/* filter to this driver */}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</div>
                          <div style={{display:"flex",gap:10,alignItems:"center"}}>
                            <div style={{textAlign:"center"}}>
                              <div style={{fontSize:20,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:count===0?"#22c55e":critical>0?"#ef4444":"#f59e0b"}}>{count}</div>
                              <div style={{fontSize:8,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Total</div>
                            </div>
                            {critical>0&&<div style={{textAlign:"center"}}>
                              <div style={{fontSize:20,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:"#ef4444"}}>{critical}</div>
                              <div style={{fontSize:8,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Major+</div>
                            </div>}
                            {count===0&&<div style={{fontSize:10,color:"#2d4a2d"}}>Clean record</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Incident list */}
                {incidents.length===0&&!showAddIncident&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No incidents logged yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {incidents.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0)).map(inc=>{
                    const sc={minor:"#555",moderate:"#f59e0b",major:"#f87171",critical:"#ef4444"}[inc.severity]||"#555";
                    const isEditing = editIncidentId===inc.id;
                    return (
                      <div key={inc.id} style={{...S.card,borderLeft:`3px solid ${sc}`,background:isEditing?"#1a1a0a":"#141414"}}>
                        {isEditing?(
                          <div>
                            <div style={{fontSize:10,color:"#f59e0b",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Editing Incident</div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                              <div><label style={S.label}>Driver</label>
                                <select value={editIncidentForm.driverId||""} onChange={e=>setEditIncidentForm(p=>({...p,driverId:e.target.value,driverName:drivers.find(d=>d.id===e.target.value)?.name||p.driverName}))} style={S.input}>
                                  <option value="">Unknown</option>
                                  {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                              </div>
                              <div><label style={S.label}>Date</label><input type="date" value={editIncidentForm.date||""} onChange={e=>setEditIncidentForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                              <div><label style={S.label}>Type</label>
                                <select value={editIncidentForm.type||"delivery"} onChange={e=>setEditIncidentForm(p=>({...p,type:e.target.value}))} style={S.input}>
                                  <option value="delivery">Delivery Issue</option><option value="vehicle">Vehicle Damage</option><option value="accident">Accident</option><option value="customer">Customer Complaint</option><option value="safety">Safety Violation</option><option value="other">Other</option>
                                </select>
                              </div>
                              <div><label style={S.label}>Severity</label>
                                <select value={editIncidentForm.severity||"minor"} onChange={e=>setEditIncidentForm(p=>({...p,severity:e.target.value}))} style={S.input}>
                                  <option value="minor">Minor</option><option value="moderate">Moderate</option><option value="major">Major</option><option value="critical">Critical</option>
                                </select>
                              </div>
                              <div style={{gridColumn:"1/-1"}}><label style={S.label}>Description</label><input value={editIncidentForm.description||""} onChange={e=>setEditIncidentForm(p=>({...p,description:e.target.value}))} style={S.input}/></div>
                            </div>
                            <div style={{display:"flex",gap:8}}>
                              <button onClick={()=>{
                                const updated = {...inc,...editIncidentForm};
                                // Update in global incidents
                                setIncidents(p=>p.map(i=>i.id===inc.id?updated:i));
                                // Update in driver's incidents array
                                setDrivers(p=>p.map(d=>({...d,incidents:(d.incidents||[]).map(i=>i.id===inc.id?updated:i)})));
                                setEditIncidentId(null);
                              }} style={S.btn}>Save Changes</button>
                              <button onClick={()=>setEditIncidentId(null)} style={S.ghost}>Cancel</button>
                            </div>
                          </div>
                        ):(
                          <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                            <div style={{flex:1,minWidth:0}}>
                              {/* Driver name badge */}
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                                <div style={{background:sc+"22",border:`1px solid ${sc}44`,borderRadius:3,padding:"2px 8px",fontSize:10,color:sc,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>{inc.severity}</div>
                                <div style={{fontSize:10,color:"#f59e0b",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{inc.driverName||"Unknown Driver"}</div>
                                <div style={{fontSize:10,color:"#444"}}>· {inc.type?.replace(/_/g," ")} · {inc.date||"No date"}</div>
                              </div>
                              <div style={{fontSize:12,color:"#c8c4bc",lineHeight:1.6}}>{inc.description}</div>
                            </div>
                            <div style={{display:"flex",gap:6,flexShrink:0}}>
                              <button onClick={()=>{setEditIncidentId(inc.id);setEditIncidentForm({...inc});}} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                              <button onClick={()=>{
                                setIncidents(p=>p.filter(i=>i.id!==inc.id));
                                setDrivers(p=>p.map(d=>({...d,incidents:(d.incidents||[]).filter(i=>i.id!==inc.id)})));
                              }} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ FLEET / MAINTENANCE ════════════════════════════════════════ */}
      {screen==="fleet"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[["log","Maintenance Log"],["schedule","Upcoming Service"]]} active={subScreen||"log"} onSelect={setSubScreen}/>
          <div style={{flex:1,overflowY:"auto",padding:24}}>
            {(!subScreen||subScreen==="log")&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={S.section}>MAINTENANCE LOG</div>
                  <button className="hov" onClick={()=>setShowAddMaint(!showAddMaint)} style={S.btn}>{showAddMaint?"Cancel":"+ Log Service"}</button>
                </div>
                {showAddMaint&&(
                  <div style={{...S.card,marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Vehicle *</label>
                        <select value={maintForm.truckName} onChange={e=>setMaintForm(p=>({...p,truckName:e.target.value}))} style={S.input}>
                          <option value="">Select...</option>
                          {compliance.trucks.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div><label style={S.label}>Service Type *</label>
                        <select value={maintForm.type} onChange={e=>setMaintForm(p=>({...p,type:e.target.value}))} style={S.input}>
                          <option value="">Select...</option>
                          {["Oil Change","Tire Rotation","Tire Replacement","Brake Service","Brake Replacement","Air Filter","Transmission Service","Battery","Alternator","Suspension","Annual DOT Inspection","PM Service","Roadside Repair","Body Repair","Other"].map(t=><option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div><label style={S.label}>Date</label><input type="date" value={maintForm.date} onChange={e=>setMaintForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Mileage</label><input type="number" value={maintForm.mileage} onChange={e=>setMaintForm(p=>({...p,mileage:e.target.value}))} placeholder="142500" style={S.input}/></div>
                      <div><label style={S.label}>Cost ($)</label><input type="number" value={maintForm.cost} onChange={e=>setMaintForm(p=>({...p,cost:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                      <div><label style={S.label}>Next Due (miles)</label><input type="number" value={maintForm.nextDueMiles} onChange={e=>setMaintForm(p=>({...p,nextDueMiles:e.target.value}))} placeholder="147500" style={S.input}/></div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={maintForm.notes} onChange={e=>setMaintForm(p=>({...p,notes:e.target.value}))} placeholder="Shop name, parts, etc." style={S.input}/></div>
                    </div>
                    <button className="hov" onClick={()=>{ if(!maintForm.truckName||!maintForm.type)return; setMaintenance(p=>[{...maintForm,id:Date.now()},...p]); setMaintForm({truckName:"",type:"",date:"",mileage:"",cost:"",notes:"",nextDueMiles:""}); setShowAddMaint(false); }} style={{...S.btn,marginTop:14}}>Save Record</button>
                  </div>
                )}
                {maintenance.length===0&&!showAddMaint&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No maintenance records yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {maintenance.map(m=>(
                    <div key={m.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{m.truckName} — {m.type}</div><div style={{fontSize:10,color:"#555"}}>{m.date} {m.mileage?`· ${parseInt(m.mileage).toLocaleString()} mi`:""} {m.notes?`· ${m.notes}`:""}</div></div>
                      {m.cost&&<div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#ef4444",flexShrink:0}}>{fmt$(parseFloat(m.cost))}</div>}
                      {m.nextDueMiles&&<div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:9,color:"#555"}}>Next</div><div style={{fontSize:12,color:"#f59e0b"}}>{parseInt(m.nextDueMiles).toLocaleString()} mi</div></div>}
                      <button onClick={()=>openEdit("maintenance",m)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace",flexShrink:0}}>Edit</button>
                      <button onClick={()=>setMaintenance(p=>p.filter(x=>x.id!==m.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12,flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {subScreen==="schedule"&&(
              <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:20}}>UPCOMING SERVICE</div>
                {maintenance.filter(m=>m.nextDueMiles).length===0?<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No upcoming service items set.</div>:
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {maintenance.filter(m=>m.nextDueMiles).sort((a,b)=>parseInt(a.nextDueMiles)-parseInt(b.nextDueMiles)).map(m=>(
                    <div key={m.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{m.type} — {m.truckName}</div><div style={{fontSize:10,color:"#555"}}>Last: {m.date||"Unknown"} {m.mileage?`at ${parseInt(m.mileage).toLocaleString()} mi`:""}</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#555"}}>Next Due</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#f59e0b"}}>{parseInt(m.nextDueMiles).toLocaleString()} mi</div></div>
                    </div>
                  ))}
                </div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ CONTRACTS ══════════════════════════════════════════════════ */}
      {screen==="contracts"&&(
        <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <div style={S.section}>CONTRACT TRACKER</div>
                <div style={{fontSize:11,color:"#555",marginTop:4}}>Track renewal dates, performance requirements, and contract value.</div>
              </div>
              <button className="hov" onClick={()=>setShowAddContract(!showAddContract)} style={{...S.btn,background:"#8888cc"}}>{showAddContract?"Cancel":"+ Add Contract"}</button>
            </div>
            {showAddContract&&(
              <div style={{...S.card,marginBottom:18}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Contract Name *</label><input value={contractForm.name} onChange={e=>setContractForm(p=>({...p,name:e.target.value}))} placeholder={seg.id==="fedex"?"FedEx ISP Agreement":seg.id==="amazon"?"DSP Operating Agreement":seg.id==="usps"?"HCR Contract":"Contract name"} style={S.input}/></div>
                  <div><label style={S.label}>Company / Client</label><input value={contractForm.company} onChange={e=>setContractForm(p=>({...p,company:e.target.value}))} placeholder="FedEx Ground, Amazon, etc." style={S.input}/></div>
                  <div><label style={S.label}>Start Date</label><input type="date" value={contractForm.startDate} onChange={e=>setContractForm(p=>({...p,startDate:e.target.value}))} style={S.input}/></div>
                  <div><label style={S.label}>Renewal / Expiry Date</label><input type="date" value={contractForm.renewalDate} onChange={e=>setContractForm(p=>({...p,renewalDate:e.target.value}))} style={S.input}/></div>
                  <div><label style={S.label}>Annual Contract Value ($)</label><input type="number" value={contractForm.value} onChange={e=>setContractForm(p=>({...p,value:e.target.value}))} placeholder="500000" style={S.input}/></div>
                  <div><label style={S.label}>Status</label>
                    <select value={contractForm.status} onChange={e=>setContractForm(p=>({...p,status:e.target.value}))} style={S.input}>
                      <option value="active">Active</option><option value="up_for_renewal">Up for Renewal</option><option value="in_negotiation">In Negotiation</option><option value="expired">Expired</option>
                    </select>
                  </div>
                  <div style={{gridColumn:"1/-1"}}><label style={S.label}>Key Notes / Performance Requirements</label><textarea value={contractForm.notes} onChange={e=>setContractForm(p=>({...p,notes:e.target.value}))} placeholder="Performance metrics, compliance requirements, escalation contacts..." style={{...S.input,height:80,resize:"vertical"}}/></div>
                </div>
                <button className="hov" onClick={()=>{ if(!contractForm.name)return; setContracts(p=>[...p,{...contractForm,id:Date.now()}]); setContractForm({name:"",company:"",startDate:"",renewalDate:"",value:"",status:"active",notes:""}); setShowAddContract(false); }} style={{...S.btn,background:"#8888cc",marginTop:14}}>Save Contract</button>
              </div>
            )}
            {contracts.length===0&&!showAddContract&&(
              <div style={{...S.card,textAlign:"center",padding:40}}>
                <div style={{fontSize:13,color:"#555",marginBottom:8}}>No contracts tracked yet.</div>
                <div style={{fontSize:11,color:"#444",lineHeight:1.7}}>
                  {seg.id==="fedex"?"Your FedEx ISP agreement is your most valuable asset. Add it here to track renewal dates and performance requirements.":seg.id==="amazon"?"Your DSP operating agreement governs everything. Track its renewal date and compliance requirements here.":"Add your contracts to track renewal dates and protect your business."}
                </div>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {contracts.map(c=>{
                const d=daysUntil(c.renewalDate),col=statusColor(d);
                const statusBg={active:"#051a05",up_for_renewal:"#1a1005",in_negotiation:"#05051a",expired:"#1a0505"}[c.status]||"#111";
                const statusC={active:"#22c55e",up_for_renewal:"#f59e0b",in_negotiation:"#8888cc",expired:"#ef4444"}[c.status]||"#555";
                return (
                  <div key={c.id} style={{...S.card,background:statusBg,borderLeft:`3px solid ${statusC}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                      <div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8"}}>{c.name}</div>
                        <div style={{fontSize:10,color:"#555"}}>{c.company} {c.startDate?`· Started ${c.startDate}`:""}</div>
                      </div>
                      <div style={{display:"flex",gap:10,alignItems:"center"}}>
                        <span style={{fontSize:9,color:statusC,border:`1px solid ${statusC}33`,padding:"2px 8px",borderRadius:3,textTransform:"uppercase",letterSpacing:"0.1em"}}>{c.status.replace(/_/g," ")}</span>
                        <button onClick={()=>openEdit("contract",c)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                        <button onClick={()=>setContracts(p=>p.filter(x=>x.id!==c.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:c.notes?12:0}}>
                      <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Annual Value</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#22c55e"}}>{c.value?fmt$(parseFloat(c.value)):"—"}</div></div>
                      <div style={{background:"#0f0f0f",border:`1px solid ${col}22`,borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Renewal Date</div><div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:col}}>{c.renewalDate?new Date(c.renewalDate).toLocaleDateString():"Not set"}</div>{d!==null&&<div style={{fontSize:9,color:col,marginTop:2}}>{statusLabel(d)}</div>}</div>
                      <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Monthly Value</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#8888cc"}}>{c.value?fmt$(parseFloat(c.value)/12):"—"}</div></div>
                    </div>
                    {c.notes&&<div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"10px 14px",fontSize:11,color:"#888",lineHeight:1.7}}>{c.notes}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* ══ FINANCE ════════════════════════════════════════════════════ */}
      {screen==="finance"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[["pl","P&L Dashboard"],["revenue","Revenue"],["expenses","Expenses"],["import","Import from Excel/QB"]]} active={subScreen||"pl"} onSelect={setSubScreen}/>
          <div style={{flex:1,overflowY:"auto",padding:24}}>
            {(!subScreen||subScreen==="pl")&&(
              <div style={{maxWidth:900,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:20}}>PROFIT & LOSS</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
                  <Stat label="Total Revenue" value={fmt$(totalRevenue)} color="#22c55e"/>
                  <Stat label="Total Expenses" value={fmt$(totalExpenses)} color="#ef4444"/>
                  <Stat label="Net Profit" value={fmt$(netProfit)} color={netProfit>=0?"#22c55e":"#ef4444"}/>
                </div>
                {(()=>{
                  const months={};
                  revenue.forEach(r=>{ if(!r.date)return; const k=r.date.slice(0,7); if(!months[k])months[k]={rev:0,exp:0}; months[k].rev+=parseFloat(r.amount||0); });
                  expenses.forEach(e=>{ if(!e.date)return; const k=e.date.slice(0,7); if(!months[k])months[k]={rev:0,exp:0}; months[k].exp+=parseFloat(e.amount||0); });
                  const sorted=Object.entries(months).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,6);
                  if(!sorted.length) return <div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:32}}>No financial data yet. Add revenue and expenses to see your P&L.</div>;
                  return (
                    <div style={S.card}>
                      <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Monthly Summary</div>
                      {sorted.map(([month,d])=>{
                        const net=d.rev-d.exp;
                        return <div key={month} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #1a1a1a"}}>
                          <span style={{fontSize:11,color:"#888"}}>{month}</span>
                          <div style={{display:"flex",gap:20,alignItems:"center"}}>
                            <span style={{fontSize:10,color:"#22c55e"}}>{fmt$(d.rev)} rev</span>
                            <span style={{fontSize:10,color:"#ef4444"}}>{fmt$(d.exp)} exp</span>
                            <span style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:net>=0?"#22c55e":"#ef4444"}}>{fmt$(net)}</span>
                          </div>
                        </div>;
                      })}
                    </div>
                  );
                })()}
                <div style={{display:"flex",gap:12,marginTop:16}}>
                  <button className="hov" onClick={()=>setSubScreen("revenue")} style={S.btn}>+ Add Revenue</button>
                  <button className="hov" onClick={()=>setSubScreen("expenses")} style={{...S.btn,background:"#ef4444"}}>+ Add Expense</button>
                </div>
              </div>
            )}

            {subScreen==="revenue"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={S.section}>REVENUE</div>
                  <button className="hov" onClick={()=>setShowAddRevenue(!showAddRevenue)} style={S.btn}>{showAddRevenue?"Cancel":"+ Add Revenue"}</button>
                </div>
                {showAddRevenue&&(
                  <div style={{...S.card,marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Date</label><input type="date" value={revenueForm.date} onChange={e=>setRevenueForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Amount ($) *</label><input type="number" value={revenueForm.amount} onChange={e=>setRevenueForm(p=>({...p,amount:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                      <div><label style={S.label}>Source / Description</label><input value={revenueForm.description} onChange={e=>setRevenueForm(p=>({...p,description:e.target.value}))} placeholder={seg.id==="otr"?"Broker/Load":"Route payment / settlement"} style={S.input}/></div>
                      <div><label style={S.label}>Vehicle</label>
                        <select value={revenueForm.vehicle} onChange={e=>setRevenueForm(p=>({...p,vehicle:e.target.value}))} style={S.input}>
                          <option value="">All / General</option>
                          {compliance.trucks.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <button className="hov" onClick={()=>{ if(!revenueForm.amount)return; setRevenue(p=>[{...revenueForm,id:Date.now()},...p]); setRevenueForm({date:"",description:"",amount:"",vehicle:""}); setShowAddRevenue(false); }} style={{...S.btn,marginTop:14}}>Save Revenue</button>
                  </div>
                )}
                {revenue.length===0&&!showAddRevenue&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No revenue logged yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {revenue.map(r=>(
                    <div key={r.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{r.description||"Revenue"}</div><div style={{fontSize:10,color:"#555"}}>{r.date} {r.vehicle?`· ${r.vehicle}`:""}</div></div>
                      <div style={{fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#22c55e",flexShrink:0}}>{fmt$(parseFloat(r.amount||0))}</div>
                      <button onClick={()=>openEdit("revenue",r)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace",flexShrink:0}}>Edit</button>
                      <button onClick={()=>setRevenue(p=>p.filter(x=>x.id!==r.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12,flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subScreen==="expenses"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={S.section}>EXPENSES</div>
                  <button className="hov" onClick={()=>setShowAddExpense(!showAddExpense)} style={{...S.btn,background:"#ef4444"}}>{showAddExpense?"Cancel":"+ Add Expense"}</button>
                </div>
                {showAddExpense&&(
                  <div style={{...S.card,marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Date</label><input type="date" value={expenseForm.date} onChange={e=>setExpenseForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Category</label>
                        <select value={expenseForm.category} onChange={e=>setExpenseForm(p=>({...p,category:e.target.value}))} style={S.input}>
                          {["fuel","maintenance","insurance","tires","repairs","driver_pay","tolls","permits","registration","ifta","ucr","eld","uniforms","equipment","phone","other"].map(c=><option key={c} value={c}>{c.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
                        </select>
                      </div>
                      <div><label style={S.label}>Amount ($) *</label><input type="number" value={expenseForm.amount} onChange={e=>setExpenseForm(p=>({...p,amount:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                      <div><label style={S.label}>Vehicle</label>
                        <select value={expenseForm.vehicle} onChange={e=>setExpenseForm(p=>({...p,vehicle:e.target.value}))} style={S.input}>
                          <option value="">All / General</option>
                          {compliance.trucks.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                      </div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Description</label><input value={expenseForm.description} onChange={e=>setExpenseForm(p=>({...p,description:e.target.value}))} placeholder="Optional notes" style={S.input}/></div>
                    </div>
                    <button className="hov" onClick={()=>{ if(!expenseForm.amount)return; setExpenses(p=>[{...expenseForm,id:Date.now()},...p]); setExpenseForm({date:"",category:"fuel",amount:"",description:"",vehicle:""}); setShowAddExpense(false); }} style={{...S.btn,background:"#ef4444",marginTop:14}}>Save Expense</button>
                  </div>
                )}
                {expenses.length===0&&!showAddExpense&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No expenses logged yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {expenses.map(e=>(
                    <div key={e.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{e.category.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())} {e.description?`— ${e.description}`:""}</div><div style={{fontSize:10,color:"#555"}}>{e.date} {e.vehicle?`· ${e.vehicle}`:""}</div></div>
                      <div style={{fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#ef4444",flexShrink:0}}>{fmt$(parseFloat(e.amount||0))}</div>
                      <button onClick={()=>openEdit("expense",e)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace",flexShrink:0}}>Edit</button>
                      <button onClick={()=>setExpenses(p=>p.filter(x=>x.id!==e.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12,flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subScreen==="import"&&(
              <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:4}}>IMPORT FROM EXCEL / QUICKBOOKS</div>
                <p style={{fontSize:11,color:"#555",marginBottom:22,lineHeight:1.8}}>
                  Export your P&L from QuickBooks Online or Excel as a CSV file, then drop it here. ContractorOS will read it and automatically create your revenue and expense entries.
                </p>

                {/* How to export guide */}
                <div style={{background:"#0c0c14",border:"1px solid #1a1a2a",borderRadius:8,padding:"16px 20px",marginBottom:20}}>
                  <div style={{fontSize:10,color:"#3a3a6a",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:12}}>How to Export from QuickBooks</div>
                  {[
                    ["1","Go to Reports → Profit and Loss"],
                    ["2","Set your date range"],
                    ["3","Click Export / Print → Export to CSV"],
                    ["4","Save the file and upload it below"],
                  ].map(([n,step])=>(
                    <div key={n} style={{display:"flex",gap:12,padding:"6px 0",borderTop:n!=="1"?"1px solid #14141e":"none",alignItems:"center"}}>
                      <div style={{width:20,height:20,background:"#1a1a2a",border:"1px solid #2a2a4a",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#6060aa",flexShrink:0}}>{n}</div>
                      <div style={{fontSize:11,color:"#8888cc"}}>{step}</div>
                    </div>
                  ))}
                  <div style={{marginTop:10,fontSize:10,color:"#3a3a5a",fontStyle:"italic"}}>Excel users: Save your spreadsheet as CSV (File → Save As → CSV) before uploading.</div>
                </div>

                {/* Upload area */}
                {!excelResult&&!excelImporting&&(
                  <label style={{display:"block",cursor:"pointer"}}>
                    <div style={{border:"2px dashed #2a2a4a",borderRadius:8,padding:"40px 24px",textAlign:"center",background:"#0d0d14",transition:"all 0.2s"}}
                      onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#6060aa";}}
                      onDragLeave={e=>{e.currentTarget.style.borderColor="#2a2a4a";}}
                      onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)importExcelPL(f);}}>
                      <div style={{fontSize:32,marginBottom:12}}>📊</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:6}}>Drop your CSV file here</div>
                      <div style={{fontSize:11,color:"#555",marginBottom:16}}>or click to browse</div>
                      <div style={{fontSize:10,color:"#3a3a5a"}}>Supports: QuickBooks CSV export, Excel CSV, plain text P&L</div>
                    </div>
                    <input type="file" accept=".csv,.txt,.xls,.xlsx" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)importExcelPL(f);}}/>
                  </label>
                )}

                {excelImporting&&(
                  <div style={{...S.card,textAlign:"center",padding:40}}>
                    <div style={{width:36,height:36,border:`2px solid #1e1e1e`,borderTop:`2px solid ${accent}`,borderRadius:"50%",animation:"spin 0.7s linear infinite",margin:"0 auto 16px"}}/>
                    <div style={{fontSize:12,color:"#555"}}>Reading your file and extracting line items...</div>
                  </div>
                )}

                {excelResult&&!excelResult.error&&(
                  <div style={{animation:"fadeUp 0.3s ease"}}>
                    <div style={{...S.card,marginBottom:14,background:"#051a05",border:"1px solid #0d3a1a"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#22c55e",marginBottom:10}}>✓ File Parsed Successfully</div>
                      {excelResult.summary&&(
                        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
                          {[["Revenue",fmt$(excelResult.summary.totalRevenue||0),"#22c55e"],["Expenses",fmt$(excelResult.summary.totalExpenses||0),"#ef4444"],["Net Profit",fmt$(excelResult.summary.netProfit||0),(excelResult.summary.netProfit||0)>=0?"#22c55e":"#ef4444"]].map(([lbl,val,col])=>(
                            <div key={lbl} style={{background:"#0a0f0a",border:"1px solid #1a2a1a",borderRadius:5,padding:"10px 12px"}}>
                              <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{lbl}</div>
                              <div style={{fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:col}}>{val}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{fontSize:11,color:"#2d5a2d",marginBottom:14}}>
                        Found {excelResult.revenue?.length||0} revenue items and {excelResult.expenses?.length||0} expense items.
                        {excelResult.summary?.period&&` Period: ${excelResult.summary.period}`}
                      </div>
                      <div style={{display:"flex",gap:10}}>
                        <button className="hov" onClick={confirmExcelImport} style={S.btn}>Import All Items →</button>
                        <button onClick={()=>setExcelResult(null)} style={S.ghost}>Cancel</button>
                      </div>
                    </div>

                    {/* Preview */}
                    {excelResult.revenue?.slice(0,3).map((r,i)=>(
                      <div key={i} style={{...S.card,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div><div style={{fontSize:11,color:"#c8c4bc"}}>{r.description}</div><div style={{fontSize:9,color:"#555"}}>Revenue · {r.date}</div></div>
                        <div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#22c55e"}}>{fmt$(r.amount)}</div>
                      </div>
                    ))}
                    {excelResult.expenses?.slice(0,3).map((e,i)=>(
                      <div key={i} style={{...S.card,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div><div style={{fontSize:11,color:"#c8c4bc"}}>{e.description}</div><div style={{fontSize:9,color:"#555"}}>{e.category} · {e.date}</div></div>
                        <div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#ef4444"}}>{fmt$(e.amount)}</div>
                      </div>
                    ))}
                    {((excelResult.revenue?.length||0)+(excelResult.expenses?.length||0))>6&&(
                      <div style={{fontSize:11,color:"#555",textAlign:"center",padding:"10px 0"}}>...and {((excelResult.revenue?.length||0)+(excelResult.expenses?.length||0))-6} more items</div>
                    )}
                  </div>
                )}

                {excelResult?.error&&(
                  <div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010"}}>
                    <div style={{fontSize:13,color:"#ef4444",marginBottom:8}}>⚠ Import Failed</div>
                    <div style={{fontSize:11,color:"#7a4040",marginBottom:14}}>{excelResult.error}</div>
                    <button onClick={()=>setExcelResult(null)} style={S.ghost}>Try Again</button>
                  </div>
                )}

                {/* QuickBooks API note */}
                <div style={{marginTop:24,background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:8,padding:"16px 20px"}}>
                  <div style={{fontSize:10,color:"#444",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>🔌 QuickBooks Direct Sync — Coming Soon</div>
                  <div style={{fontSize:11,color:"#444",lineHeight:1.7}}>A direct QuickBooks Online integration will automatically sync your P&L without any manual export. Requires a QB developer account and Intuit app review — on the roadmap for Phase 2.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {screen==="brokers"&&!seg.features.brokerScorecard&&(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,padding:32}}>
          <div style={{fontSize:32}}>🚫</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,color:"#555"}}>Broker tools are for OTR operators</div>
          <div style={{fontSize:12,color:"#444",textAlign:"center",maxWidth:400,lineHeight:1.7}}>Switch to OTR / Owner Operator mode in Settings to access broker scorecards and lane intelligence.</div>
          <button onClick={()=>setScreen("settings")} style={S.btn}>Go to Settings →</button>
        </div>
      )}
      {screen==="brokers"&&seg.features.brokerScorecard&&(()=>{
        const laneStats=()=>{
          const lanes={};
          loads.forEach(l=>{ if(!l.load?.origin||!l.load?.destination)return; const k=`${l.load.origin} → ${l.load.destination}`; if(!lanes[k])lanes[k]={count:0,total:0}; lanes[k].count++; lanes[k].total+=l.result?.netRPM||0; });
          return Object.entries(lanes).map(([lane,d])=>({lane,count:d.count,avg:d.total/d.count})).sort((a,b)=>b.avg-a.avg);
        };
        return (
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <SubNav tabs={[["scores","Scoreboard"],["lanes","Lanes"],["blacklist","Blacklist"],["add","Add Broker"]]} active={subScreen||"scores"} onSelect={setSubScreen}/>
            <div style={{flex:1,overflowY:"auto",padding:24}}>
              {(!subScreen||subScreen==="scores")&&(
                <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{...S.section,marginBottom:20}}>BROKER SCOREBOARD</div>
                  {brokers.filter(b=>!b.blacklisted).length===0&&loads.length===0&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No broker data yet. Analyze loads or add brokers manually.</div>}
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[...new Set([...brokers.map(b=>b.name),...loads.map(l=>l.load?.brokerName).filter(Boolean)])].filter(name=>!brokers.find(b=>b.name===name&&b.blacklisted)).map((name,i)=>{
                      const manual=brokers.find(b=>b.name===name);
                      const bLoads=loads.filter(l=>l.load?.brokerName===name);
                      const avgNet=bLoads.length?bLoads.reduce((s,l)=>s+(l.result?.netRPM||0),0)/bLoads.length:0;
                      return (
                        <div key={name} style={{...S.card,display:"flex",alignItems:"center",gap:16}} className="cardhov">
                          <div style={{width:26,fontSize:11,color:"#444",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>#{i+1}</div>
                          <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8"}}>{name}</div>{manual?.notes&&<div style={{fontSize:10,color:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{manual.notes}</div>}</div>
                          {manual?.rating&&<div style={{fontSize:12,color:"#f59e0b",letterSpacing:2}}>{"★".repeat(manual.rating)}</div>}
                          {manual?.paySpeed&&<div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Pay Speed</div><div style={{fontSize:11,color:"#8888cc"}}>{manual.paySpeed}</div></div>}
                          {bLoads.length>0&&<div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Loads</div><div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#c8c4bc"}}>{bLoads.length}</div></div>}
                          {bLoads.length>0&&<div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Avg Net RPM</div><div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:avgNet>=1.5?"#22c55e":avgNet>=1?"#f59e0b":"#ef4444"}}>${avgNet.toFixed(2)}/mi</div></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {subScreen==="lanes"&&(
                <div style={{maxWidth:760,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{...S.section,marginBottom:20}}>LANE INTELLIGENCE</div>
                  {laneStats().length===0?<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No lane data yet. Analyze loads to populate lanes.</div>:
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {laneStats().map((l,i)=>(
                      <div key={l.lane} style={{...S.card,display:"flex",alignItems:"center",gap:14}} className="cardhov">
                        <div style={{width:24,fontSize:11,color:"#444",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>#{i+1}</div>
                        <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{l.lane}</div><div style={{fontSize:10,color:"#555"}}>{l.count} load{l.count>1?"s":""}</div></div>
                        <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#555"}}>Avg Net RPM</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:l.avg>=1.5?"#22c55e":l.avg>=1?"#f59e0b":"#ef4444"}}>${l.avg.toFixed(2)}/mi</div></div>
                      </div>
                    ))}
                  </div>}
                </div>
              )}
              {subScreen==="blacklist"&&(
                <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{...S.section,marginBottom:20}}>BLACKLIST</div>
                  {brokers.filter(b=>b.blacklisted).length===0?<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No blacklisted brokers.</div>:
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {brokers.filter(b=>b.blacklisted).map(b=>(
                      <div key={b.id} style={{...S.card,background:"#1a0808",border:"1px solid #3a1010",display:"flex",alignItems:"center",gap:14}}>
                        <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#ef4444"}}>{b.name}</div>{b.notes&&<div style={{fontSize:10,color:"#7a4040"}}>{b.notes}</div>}</div>
                        <button onClick={()=>setBrokers(p=>p.map(x=>x.id===b.id?{...x,blacklisted:false}:x))} style={{background:"transparent",border:"1px solid #3a1010",color:"#7a4040",padding:"5px 12px",fontSize:10,cursor:"pointer",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>Remove</button>
                      </div>
                    ))}
                  </div>}
                </div>
              )}
              {subScreen==="add"&&(
                <div style={{maxWidth:600,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{...S.section,marginBottom:20}}>ADD BROKER</div>
                  <div style={S.card}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Broker Name *</label><input value={brokerForm.name} onChange={e=>setBrokerForm(p=>({...p,name:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Pay Speed</label>
                        <select value={brokerForm.paySpeed} onChange={e=>setBrokerForm(p=>({...p,paySpeed:e.target.value}))} style={S.input}>
                          <option value="">Select...</option>
                          {["Quick Pay (1-3d)","Net 7","Net 14","Net 21","Net 30","Net 45+","Slow / Problems"].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div><label style={S.label}>Rating (1–5)</label>
                        <select value={brokerForm.rating} onChange={e=>setBrokerForm(p=>({...p,rating:parseInt(e.target.value)}))} style={S.input}>
                          {[5,4,3,2,1].map(n=><option key={n} value={n}>{"★".repeat(n)} {n}/5</option>)}
                        </select>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:18}}>
                        <input type="checkbox" checked={brokerForm.blacklisted} onChange={e=>setBrokerForm(p=>({...p,blacklisted:e.target.checked}))} style={{accentColor:"#ef4444",width:14,height:14}}/>
                        <label style={{fontSize:11,color:"#ef4444",cursor:"pointer"}}>Add to Blacklist</label>
                      </div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><textarea value={brokerForm.notes} onChange={e=>setBrokerForm(p=>({...p,notes:e.target.value}))} placeholder="Pay issues, good loads, contacts..." style={{...S.input,height:70,resize:"vertical"}}/></div>
                    </div>
                    <button className="hov" onClick={()=>{ if(!brokerForm.name)return; setBrokers(p=>[...p,{...brokerForm,id:Date.now()}]); setBrokerForm({name:"",paySpeed:"",rating:3,notes:"",blacklisted:false}); setSubScreen("scores"); }} style={{...S.btn,marginTop:14}}>Save Broker</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ══ PHASE 1: REPORTS ═══════════════════════════════════════════ */}
      {screen==="reports"&&(
        <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <div style={{...S.section,marginBottom:4}}>REPORTS</div>
            <p style={{fontSize:11,color:"#555",marginBottom:28,lineHeight:1.8}}>Generate professional PDF reports. Opens in a new tab — use your browser's print dialog to save as PDF or print.</p>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16,marginBottom:28}}>
              {[
                {
                  icon:"🛡️",title:"Compliance Report",desc:"Full compliance status — vehicle files, driver files, upcoming expirations, federal deadlines. Perfect for DOT audit prep.",color:"#ef4444",
                  stats:`${compliance.trucks.length} vehicles · ${compliance.drivers.length} drivers · ${generateNotifications().filter(n=>n.severity==="urgent").length} urgent items`,
                  action:()=>generatePDF("compliance")
                },
                {
                  icon:"👥",title:"Driver File Summary",desc:"Complete driver roster with compliance status, pay info, incident history, and tenure. Useful for HR audits and insurance reviews.",color:"#60a5fa",
                  stats:`${drivers.length} drivers · ${incidents.length} total incidents`,
                  action:()=>generatePDF("drivers")
                },
                {
                  icon:"💰",title:"Profit & Loss Report",desc:"Full P&L with revenue detail, expenses by category, and net profit. Ready to hand to your accountant or lender.",color:"#22c55e",
                  stats:`${fmt$(revenue.reduce((s,r)=>s+parseFloat(r.amount||0),0))} revenue · ${fmt$(expenses.reduce((s,e)=>s+parseFloat(e.amount||0),0))} expenses`,
                  action:()=>generatePDF("pl")
                },
              ].map(r=>(
                <div key={r.title} style={{...S.card,display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{fontSize:32}}>{r.icon}</div>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:4}}>{r.title}</div>
                    <div style={{fontSize:11,color:"#555",lineHeight:1.7,marginBottom:8}}>{r.desc}</div>
                    <div style={{fontSize:10,color:r.color,marginBottom:12}}>{r.stats}</div>
                  </div>
                  <button className="hov" onClick={r.action} style={{...S.btn,background:r.color,marginTop:"auto"}}>Generate PDF →</button>
                </div>
              ))}
            </div>

            {/* Notifications section */}
            <div style={{...S.card,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:2}}>Push Notifications</div>
                  <div style={{fontSize:11,color:"#555"}}>Get alerts on your phone before compliance items expire</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  {notifPermission!=="granted"&&<button className="hov" onClick={requestPushPermission} style={S.btn}>Enable Alerts</button>}
                  {notifPermission==="granted"&&<button className="hov" onClick={sendTestNotif} style={{...S.btn,background:"#22c55e"}}>Send Test</button>}
                </div>
              </div>
              {notifPermission==="granted"&&<div style={{fontSize:11,color:"#22c55e"}}>✓ Push notifications enabled — you'll receive compliance and contract renewal alerts</div>}
              {notifPermission==="denied"&&<div style={{fontSize:11,color:"#ef4444"}}>Notifications blocked. Go to browser settings → Site Settings → Notifications to re-enable.</div>}
              {notifPermission==="default"&&<div style={{fontSize:11,color:"#555"}}>Click "Enable Alerts" to receive push notifications for compliance deadlines, incidents, and contract renewals.</div>}
            </div>

            {/* Active alerts */}
            {(()=>{
              const notifs = generateNotifications();
              return notifs.length>0?(
                <div>
                  <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:10}}>Current Alerts ({notifs.length})</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {notifs.slice(0,10).map(n=>(
                      <div key={n.id} style={{...S.card,display:"flex",alignItems:"center",gap:14,borderLeft:`3px solid ${n.severity==="urgent"?"#ef4444":"#f59e0b"}`,background:n.severity==="urgent"?"#1a0808":"#120e00"}}>
                        <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{n.title}</div><div style={{fontSize:10,color:"#555"}}>{n.body}</div></div>
                        <div style={{fontSize:11,color:n.severity==="urgent"?"#ef4444":"#f59e0b",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,flexShrink:0}}>{n.severity==="urgent"?"🔴 URGENT":"🟡 SOON"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ):(<div style={{...S.card,textAlign:"center",color:"#22c55e",fontSize:12,padding:24}}>✓ No active compliance alerts — everything looks good!</div>);
            })()}
          </div>
        </div>
      )}

      {/* ══ PHASE 4: P&L TRENDS ════════════════════════════════════════ */}
      {screen==="trends"&&(()=>{
        // Build monthly data
        const monthlyData = (()=>{
          const months = {};
          revenue.forEach(r=>{
            if(!r.date) return;
            const k = r.date.slice(0,7);
            if(!months[k]) months[k]={month:k,revenue:0,expenses:0,routes:{}};
            months[k].revenue += parseFloat(r.amount||0);
          });
          expenses.forEach(e=>{
            if(!e.date) return;
            const k = e.date.slice(0,7);
            if(!months[k]) months[k]={month:k,revenue:0,expenses:0,routes:{}};
            months[k].expenses += parseFloat(e.amount||0);
          });
          return Object.values(months).sort((a,b)=>a.month.localeCompare(b.month)).map(m=>({...m,net:m.revenue-m.expenses,margin:m.revenue>0?((m.revenue-m.expenses)/m.revenue*100).toFixed(1):0}));
        })();

        // Build per-route data with revenue log entries by route name
        const routeTrends = routes.map(r=>{
          const routeRevEntries = revenue.filter(rv=>(rv.description||"").toLowerCase().includes(r.name.toLowerCase()));
          const months={};
          routeRevEntries.forEach(rv=>{
            if(!rv.date) return;
            const k=rv.date.slice(0,7);
            if(!months[k]) months[k]={month:k,revenue:0};
            months[k].revenue+=parseFloat(rv.amount||0);
          });
          return {...r, monthlyRevenue:Object.values(months).sort((a,b)=>a.month.localeCompare(b.month))};
        });

        const maxRev = Math.max(...monthlyData.map(m=>m.revenue),1);
        const maxNet = Math.max(...monthlyData.map(m=>Math.abs(m.net)),1);

        return (
          <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
            <div style={{maxWidth:1000,margin:"0 auto"}}>
              <div style={{...S.section,marginBottom:4}}>P&L TRENDS</div>
              <p style={{fontSize:11,color:"#555",marginBottom:22,lineHeight:1.8}}>Month over month revenue, expenses, and net profit. Route-level breakdown shows which lanes are improving or declining.</p>

              {/* View toggle */}
              <div style={{display:"flex",gap:8,marginBottom:22}}>
                {[["monthly","Monthly"],["weekly","By Route"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setTrendsView(v)} style={{background:trendsView===v?accent:"transparent",color:trendsView===v?"#0a0a0a":"#555",border:`1px solid ${trendsView===v?accent:"#2a2a2a"}`,padding:"7px 18px",borderRadius:4,fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>{l}</button>
                ))}
              </div>

              {monthlyData.length===0?(
                <div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No financial data yet. Add revenue and expenses in Finance to see trends.</div>
              ):(
                <>
                {trendsView==="monthly"&&(
                  <>
                    {/* Bar chart */}
                    <div style={{...S.card,marginBottom:20}}>
                      <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>Monthly Revenue vs Expenses</div>
                      <div style={{display:"flex",alignItems:"flex-end",gap:8,height:180,padding:"0 8px"}}>
                        {monthlyData.map(m=>(
                          <div key={m.month} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                            <div style={{width:"100%",display:"flex",gap:2,alignItems:"flex-end",height:150}}>
                              <div style={{flex:1,background:"#22c55e",borderRadius:"3px 3px 0 0",height:`${(m.revenue/maxRev)*140}px`,minHeight:2,transition:"height 0.5s ease"}} title={`Revenue: ${fmt$(m.revenue)}`}/>
                              <div style={{flex:1,background:"#ef4444",borderRadius:"3px 3px 0 0",height:`${(m.expenses/maxRev)*140}px`,minHeight:2,transition:"height 0.5s ease"}} title={`Expenses: ${fmt$(m.expenses)}`}/>
                            </div>
                            <div style={{fontSize:8,color:"#444",textAlign:"center",whiteSpace:"nowrap"}}>{m.month.slice(5)}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{display:"flex",gap:16,marginTop:10,fontSize:10,color:"#555"}}>
                        <span><span style={{display:"inline-block",width:10,height:10,background:"#22c55e",borderRadius:2,marginRight:4}}/>Revenue</span>
                        <span><span style={{display:"inline-block",width:10,height:10,background:"#ef4444",borderRadius:2,marginRight:4}}/>Expenses</span>
                      </div>
                    </div>

                    {/* Net profit line */}
                    <div style={{...S.card,marginBottom:20}}>
                      <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>Net Profit Trend</div>
                      <div style={{position:"relative",height:100,padding:"0 8px"}}>
                        <svg width="100%" height="100" viewBox={`0 0 ${Math.max(monthlyData.length*60,300)} 100`} preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3"/>
                              <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          {monthlyData.length>1&&(()=>{
                            const w = Math.max(monthlyData.length*60,300);
                            const points = monthlyData.map((m,i)=>{
                              const x = (i/(monthlyData.length-1))*w;
                              const y = 90 - ((m.net+maxNet)/(maxNet*2))*80;
                              return `${x},${y}`;
                            });
                            const areaPoints = `${points[0].split(",")[0]},90 ${points.join(" ")} ${points[points.length-1].split(",")[0]},90`;
                            return <>
                              <polygon points={areaPoints} fill="url(#netGrad)"/>
                              <polyline points={points.join(" ")} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinejoin="round"/>
                              {monthlyData.map((m,i)=>{
                                const x=(i/(monthlyData.length-1))*w;
                                const y=90-((m.net+maxNet)/(maxNet*2))*80;
                                return <circle key={i} cx={x} cy={y} r="4" fill={m.net>=0?"#22c55e":"#ef4444"} stroke="#0a0a0a" strokeWidth="1.5"/>;
                              })}
                            </>;
                          })()}
                          <line x1="0" y1="90" x2="100%" y2="90" stroke="#1e1e1e" strokeWidth="1"/>
                          <line x1="0" y1={90-80*0.5} x2="100%" y2={90-80*0.5} stroke="#1a1a1a" strokeWidth="1" strokeDasharray="4,4"/>
                        </svg>
                      </div>
                    </div>

                    {/* Monthly table */}
                    <div style={S.card}>
                      <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Monthly Summary</div>
                      <div style={{overflowX:"auto"}}>
                        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                          <thead>
                            <tr style={{borderBottom:"1px solid #1e1e1e"}}>
                              {["Month","Revenue","Expenses","Net Profit","Margin"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:h==="Month"?"left":"right",fontSize:9,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase"}}>{h}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {[...monthlyData].reverse().map(m=>(
                              <tr key={m.month} style={{borderBottom:"1px solid #141414"}}>
                                <td style={{padding:"10px 12px",color:"#c8c4bc",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{m.month}</td>
                                <td style={{padding:"10px 12px",textAlign:"right",color:"#22c55e"}}>{fmt$(m.revenue)}</td>
                                <td style={{padding:"10px 12px",textAlign:"right",color:"#ef4444"}}>{fmt$(m.expenses)}</td>
                                <td style={{padding:"10px 12px",textAlign:"right",fontWeight:700,color:m.net>=0?"#22c55e":"#ef4444"}}>{fmt$(m.net)}</td>
                                <td style={{padding:"10px 12px",textAlign:"right",color:parseFloat(m.margin)>=20?"#22c55e":parseFloat(m.margin)>=10?"#f59e0b":"#ef4444"}}>{m.margin}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {trendsView==="weekly"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:16}}>
                    <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase"}}>Route Profitability — All Time</div>
                    {routes.length===0?<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:32}}>No routes added. Add routes in the Routes screen first.</div>:
                    routes.map(r=>{
                      const netEst = parseFloat(r.rate||0)-((parseFloat(r.miles||0)/settings.mpg)*settings.dieselPrice)-parseFloat(r.driverPay||0)-parseFloat(r.otherCosts||0);
                      const margin = parseFloat(r.rate||0)>0?(netEst/parseFloat(r.rate))*100:0;
                      const grade = margin>=30?"A":margin>=20?"B":margin>=10?"C":"D";
                      return (
                        <div key={r.id} style={S.card}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                            <div>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:"#e8e4d8"}}>{r.name}</div>
                              <div style={{fontSize:10,color:"#555"}}>{r.stops||0} stops · {r.miles||0} mi · {r.frequency||"Daily"}</div>
                            </div>
                            <div style={{display:"flex",gap:10,alignItems:"center"}}>
                              <div style={{width:36,height:36,background:gradeColor(grade)+"22",border:`1px solid ${gradeColor(grade)}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:gradeColor(grade),borderRadius:4}}>{grade}</div>
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
                            {[["Contracted",fmt$(parseFloat(r.rate||0)),"#22c55e"],["Est Expenses",fmt$(parseFloat(r.rate||0)-netEst),"#ef4444"],["Net Profit",fmt$(netEst),netEst>=0?"#22c55e":"#ef4444"],["Margin",`${margin.toFixed(1)}%`,parseFloat(margin)>=20?"#22c55e":parseFloat(margin)>=10?"#f59e0b":"#ef4444"]].map(([lbl,val,col])=>(
                              <div key={lbl} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}>
                                <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{lbl}</div>
                                <div style={{fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:col}}>{val}</div>
                              </div>
                            ))}
                          </div>
                          {/* Mini profitability bar */}
                          <div>
                            <div style={{fontSize:9,color:"#555",marginBottom:4}}>Profitability</div>
                            <div style={{height:8,background:"#1a1a1a",borderRadius:4,overflow:"hidden"}}>
                              <div style={{height:"100%",width:`${Math.min(100,Math.max(0,margin))}%`,background:parseFloat(margin)>=20?"#22c55e":parseFloat(margin)>=10?"#f59e0b":"#ef4444",borderRadius:4,transition:"width 0.5s ease"}}/>
                            </div>
                          </div>
                          {r.analysis&&(
                            <div style={{marginTop:10,padding:"8px 12px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:4,fontSize:11,color:"#888",lineHeight:1.6}}>{r.analysis.summary}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* ══ PHASE 3: USERS & ROLES ═════════════════════════════════════ */}
      {screen==="users"&&(
        <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <div style={{...S.section,marginBottom:4}}>USERS & ROLES</div>
            <p style={{fontSize:11,color:"#555",marginBottom:22,lineHeight:1.8}}>Control who can access ContractorOS and what they can do. Owner sees everything. Managers can edit. Drivers see read-only views of their own information.</p>

            {/* Current user */}
            <div style={{...S.card,marginBottom:20,border:`1px solid ${accent}44`,background:"#0f0f0a"}}>
              <div style={{fontSize:10,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Currently Signed In</div>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:44,height:44,background:accent+"22",border:`1px solid ${accent}44`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:accent}}>{currentUser.name.charAt(0)}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8"}}>{currentUser.name}</div>
                  <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>{currentUser.role}</div>
                </div>
                {users.length>0&&<button onClick={()=>setSwitchingUser(true)} style={{...S.ghost,fontSize:10}}>Switch User</button>}
              </div>
            </div>

            {/* Switch user panel */}
            {switchingUser&&(
              <div style={{...S.card,marginBottom:20,border:"1px solid #2a2a4a"}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Switch To</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {/* Owner always available */}
                  <div className="cardhov" onClick={()=>{setCurrentUser({id:"owner",name:"Owner",role:"owner",pin:""});setSwitchingUser(false);}} style={{...S.card,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:32,height:32,background:accent+"22",border:`1px solid ${accent}44`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:accent}}>O</div>
                    <div style={{flex:1}}><div style={{fontSize:12,color:"#e8e4d8"}}>Owner</div><div style={{fontSize:10,color:"#555"}}>Full access</div></div>
                    <div style={{fontSize:9,color:"#22c55e",border:"1px solid #22c55e44",padding:"2px 7px",borderRadius:3}}>OWNER</div>
                  </div>
                  {users.map(u=>(
                    <div key={u.id} className="cardhov" onClick={()=>switchUser(u)} style={{...S.card,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:32,height:32,background:"#2a2a2a",border:"1px solid #3a3a3a",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#888"}}>{u.name.charAt(0)}</div>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#e8e4d8"}}>{u.name}</div><div style={{fontSize:10,color:"#555"}}>{u.driverId?`Driver: ${drivers.find(d=>d.id===u.driverId)?.name||"Unknown"}`:"No driver linked"}</div></div>
                      <div style={{fontSize:9,color:u.role==="manager"?"#8888cc":"#4ade80",border:`1px solid ${u.role==="manager"?"#8888cc44":"#4ade8044"}`,padding:"2px 7px",borderRadius:3,textTransform:"uppercase"}}>{u.role}</div>
                      {u.pin&&<div style={{fontSize:9,color:"#555"}}>🔒 PIN</div>}
                    </div>
                  ))}
                </div>
                <button onClick={()=>setSwitchingUser(false)} style={{...S.ghost,marginTop:12,fontSize:10}}>Cancel</button>
              </div>
            )}

            {/* Add user */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase"}}>Team Members ({users.length})</div>
              <button className="hov" onClick={()=>setShowAddUser(!showAddUser)} style={S.btn}>{showAddUser?"Cancel":"+ Add User"}</button>
            </div>

            {showAddUser&&(
              <div style={{...S.card,marginBottom:18,border:`1px solid ${accent}22`}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Name *</label><input value={userForm.name} onChange={e=>setUserForm(p=>({...p,name:e.target.value}))} placeholder="Full name" style={S.input}/></div>
                  <div><label style={S.label}>Role</label>
                    <select value={userForm.role} onChange={e=>setUserForm(p=>({...p,role:e.target.value}))} style={S.input}>
                      <option value="manager">Manager — can edit everything</option>
                      <option value="driver">Driver — read-only, own info only</option>
                    </select>
                  </div>
                  <div><label style={S.label}>PIN (optional)</label><input type="password" maxLength={6} value={userForm.pin} onChange={e=>setUserForm(p=>({...p,pin:e.target.value}))} placeholder="4-6 digits" style={S.input}/></div>
                  {userForm.role==="driver"&&<div><label style={S.label}>Link to Driver</label>
                    <select value={userForm.driverId} onChange={e=>setUserForm(p=>({...p,driverId:e.target.value}))} style={S.input}>
                      <option value="">Select driver...</option>
                      {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>}
                </div>
                <div style={{marginTop:10,padding:"10px 12px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:4,fontSize:10,color:"#555",lineHeight:1.7}}>
                  <strong style={{color:"#888"}}>Manager:</strong> Can view and edit all data — routes, compliance, drivers, finance.<br/>
                  <strong style={{color:"#888"}}>Driver:</strong> Read-only access. If linked, they can see their own route, compliance dates, and incident history.
                </div>
                <button className="hov" onClick={()=>{
                  if(!userForm.name) return;
                  setUsers(p=>[...p,{...userForm,id:Date.now()}]);
                  setUserForm({name:"",role:"driver",pin:"",driverId:""});
                  setShowAddUser(false);
                }} style={{...S.btn,marginTop:14}}>Save User</button>
              </div>
            )}

            {users.length===0&&!showAddUser&&(
              <div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:32}}>
                No team members added yet. Add managers or drivers to give them controlled access.
              </div>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {users.map(u=>(
                <div key={u.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:36,height:36,background:u.role==="manager"?"#1a1a2a":"#0a120a",border:`1px solid ${u.role==="manager"?"#2a2a5a":"#1a3a1a"}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:u.role==="manager"?"#8888cc":"#4ade80",flexShrink:0}}>{u.name.charAt(0)}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8"}}>{u.name}</div>
                    <div style={{fontSize:10,color:"#555"}}>{u.role==="manager"?"Manager — full edit access":"Driver — read only"}{u.driverId&&` · ${drivers.find(d=>d.id===u.driverId)?.name||"Driver linked"}`}{u.pin&&" · PIN protected"}</div>
                  </div>
                  <div style={{fontSize:9,color:u.role==="manager"?"#8888cc":"#4ade80",border:`1px solid ${u.role==="manager"?"#8888cc44":"#4ade8044"}`,padding:"2px 8px",borderRadius:3,textTransform:"uppercase",flexShrink:0}}>{u.role}</div>
                  <button onClick={()=>setUsers(p=>p.filter(x=>x.id!==u.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12,flexShrink:0}}>✕</button>
                </div>
              ))}
            </div>

            {/* Role guide */}
            <div style={{marginTop:24,background:"#0c0c14",border:"1px solid #1a1a2a",borderRadius:8,padding:"16px 20px"}}>
              <div style={{fontSize:10,color:"#3a3a6a",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:12}}>Role Permissions</div>
              <table style={{width:"100%",fontSize:11,borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"1px solid #1a1a2a"}}>{["Feature","Owner","Manager","Driver"].map(h=><th key={h} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:"#555",letterSpacing:"0.1em",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
                <tbody>
                  {[["View all data","✓","✓","Own only"],["Add/Edit records","✓","✓","✗"],["Delete records","✓","✓","✗"],["View P&L / Finance","✓","✓","✗"],["Generate PDF reports","✓","✓","✗"],["Manage users","✓","✗","✗"],["Switch contractor type","✓","✗","✗"]].map(([feat,...perms])=>(
                    <tr key={feat} style={{borderBottom:"1px solid #14141e"}}>
                      <td style={{padding:"7px 10px",color:"#888"}}>{feat}</td>
                      {perms.map((p,i)=><td key={i} style={{padding:"7px 10px",color:p==="✓"?"#22c55e":p==="✗"?"#ef4444":"#f59e0b",fontWeight:700}}>{p}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ SETTINGS ═══════════════════════════════════════════════════ */}
      {screen==="settings"&&(
        <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
          <div style={{maxWidth:600,margin:"0 auto"}}>
            <div style={{...S.section,marginBottom:20}}>SETTINGS</div>
            <div style={{...S.card,marginBottom:16}}>
              <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Company Info</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["companyName","Company Name","My Fleet LLC"],["homeBase","Home Base (City, ST)","Greer, SC"]].map(([f,lbl,ph])=>(
                  <div key={f}><label style={S.label}>{lbl}</label><input value={settings[f]||""} onChange={e=>setSettings(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input}/></div>
                ))}
              </div>
            </div>
            <div style={{...S.card,marginBottom:16}}>
              <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Vehicle Cost Settings</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["mpg","Truck MPG","8"],["dieselPrice","Diesel Price ($/gal)","3.85"],["cpm","Cost Per Mile ($)","0.18"]].map(([f,lbl,ph])=>(
                  <div key={f}><label style={S.label}>{lbl}</label><input value={settings[f]||""} onChange={e=>setSettings(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input}/></div>
                ))}
              </div>
            </div>
            <div style={{...S.card,marginBottom:16}}>
              <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Contractor Type</div>
              <div style={{fontSize:11,color:"#888",marginBottom:12}}>Currently: {seg.icon} {seg.label}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {Object.values(SEGMENTS).map(s=>(
                  <button key={s.id} onClick={()=>{setSegment(s.id);setScreen("dashboard");}} style={{background:segment===s.id?s.color+"22":"#0f0f0f",border:`1px solid ${segment===s.id?s.color+"44":"#1e1e1e"}`,borderRadius:6,padding:"10px 14px",textAlign:"left",cursor:"pointer",color:segment===s.id?s.color:"#666",fontSize:11,fontFamily:"'DM Mono',monospace",transition:"all 0.15s"}}>
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{padding:"12px 16px",background:"#0d0d14",border:"1px solid #1a1a2a",borderRadius:6}}>
              <div style={{fontSize:9,color:"#3a3a6a",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4}}>Auto-Saved</div>
              <div style={{fontSize:11,color:"#4a4a8a"}}>All data saves automatically to your browser.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
