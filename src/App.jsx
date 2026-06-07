import { useState, useEffect, useCallback } from "react";
import { makeDb } from "./supabase.js";
import {
  useUser,
  useOrganization,
  useOrganizationList,
  useClerk,
  SignIn,
  SignUp,
  OrganizationProfile,
  CreateOrganization,
} from "@clerk/clerk-react";

// ─── STORAGE ─────────────────────────────────────────────────────────
const KEYS = {
  segment: "cos_segment", settings: "cos_settings", compliance: "cos_compliance",
  drivers: "cos_drivers", vehicles: "cos_vehicles", maintenance: "cos_maintenance",
  expenses: "cos_expenses", revenue: "cos_revenue", routes: "cos_routes",
  contracts: "cos_contracts", incidents: "cos_incidents", brokers: "cos_brokers",
  loads: "cos_loads", users: "cos_users", currentUser: "cos_current_user",
  notifications: "cos_notifications", filings: "cos_filings",
  // ── v10: New feature keys ──
  payroll: "cos_payroll", fuelLog: "cos_fuel_log", invoices: "cos_invoices",
  odometer: "cos_odometer", tires: "cos_tires", documents: "cos_documents",
  dispatches: "cos_dispatches", contacts: "cos_contacts", hosLog: "cos_hos_log",
  stopProfitLog: "cos_stop_profit", settlementLog: "cos_settlement_log", scheduleData: "cos_schedule_data",
  coachingLog: "cos_coaching_log", appearanceLog: "cos_appearance_log", dnrLog: "cos_dnr_log",
  tripSheets: "cos_trip_sheets", vanInspectionLog: "cos_van_inspection_log", bidTracker: "cos_bid_tracker",
  deadMilesLog: "cos_dead_miles_log", loadHistory: "cos_load_history", whiteGloveLog: "cos_white_glove_log",
};
const stor = { get: (k,fb) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):fb; } catch { return fb; } }, set: (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} } };

// Default federal filings — pre-seeded, always present
const DEFAULT_FILINGS = [
  {id:"ifta-q1", name:"IFTA Q1 Return", dueDate:"Jan 31", frequency:"Annual", notes:"Fuel tax for Oct–Dec quarter", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"ifta-q2", name:"IFTA Q2 Return", dueDate:"Apr 30", frequency:"Annual", notes:"Fuel tax for Jan–Mar quarter", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"ifta-q3", name:"IFTA Q3 Return", dueDate:"Jul 31", frequency:"Annual", notes:"Fuel tax for Apr–Jun quarter", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"ifta-q4", name:"IFTA Q4 Return", dueDate:"Oct 31", frequency:"Annual", notes:"Fuel tax for Jul–Sep quarter", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"ucr",     name:"UCR Registration", dueDate:"Dec 31", frequency:"Annual", notes:"Opens Oct 1 — don't miss it", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"mcs150",  name:"MCS-150 Update", dueDate:"Every 2 years", frequency:"Biennial", notes:"Based on USDOT# issuance date — check FMCSA portal", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"clearinghouse", name:"Drug Clearinghouse Query", dueDate:"Annual per driver", frequency:"Annual", notes:"Required employer query — once per driver per year", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"eld",     name:"ELD Log Retention", dueDate:"Ongoing — 6 months", frequency:"Ongoing", notes:"Keep all HOS logs minimum 6 months", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
];

// ─── SEGMENT CONFIG ───────────────────────────────────────────────────
const SEGMENTS = {
  otr: {
    id: "otr", label: "OTR / Owner Operator", icon: "🚛",
    tagline: "Load board hauling with your own authority",
    color: "#f59e0b", darkColor: "#92400e",
    nav: ["dashboard","analyze","boards","compliance","brokers","fleet","finance","payroll","invoices","dispatch","contacts","documents","reports","trends","users","settings","fmcsa","data","deadmiles"],
    features: { loadAnalysis:true, brokerScorecard:true, loadBoards:true, routeProfit:false, contractTracker:false, dspMetrics:false, stopMetrics:false },
  },
  fedex: {
    id: "fedex", label: "FedEx Ground / HD Contractor", icon: "📦",
    tagline: "ISP route management & compliance",
    color: "#6366f1", darkColor: "#3730a3",
    nav: ["dashboard","routes","compliance","drivers","dispatch","fleet","finance","payroll","invoices","contacts","documents","contracts","stopprofit","settlement","driverschedule","reports","trends","users","settings","fmcsa","data"],
    features: { loadAnalysis:false, brokerScorecard:false, loadBoards:false, routeProfit:true, contractTracker:true, dspMetrics:false, stopMetrics:true },
  },
  amazon: {
    id: "amazon", label: "Amazon DSP", icon: "📬",
    tagline: "Delivery Service Partner operations",
    color: "#f97316", darkColor: "#9a3412",
    nav: ["dashboard","routes","compliance","drivers","dispatch","fleet","finance","payroll","invoices","contacts","documents","contracts","settlement","driverschedule","scorecard","reports","trends","users","settings","fmcsa","data"],
    features: { loadAnalysis:false, brokerScorecard:false, loadBoards:false, routeProfit:true, contractTracker:true, dspMetrics:true, stopMetrics:true },
  },
  lastmile: {
    id: "lastmile", label: "Last Mile (Lowe's / Home Depot)", icon: "🏠",
    tagline: "Home delivery contractor management",
    color: "#22c55e", darkColor: "#14532d",
    nav: ["dashboard","routes","compliance","drivers","dispatch","fleet","finance","payroll","invoices","contacts","documents","contracts","stopprofit","reports","trends","users","settings","fmcsa","data"],
    features: { loadAnalysis:false, brokerScorecard:false, loadBoards:false, routeProfit:true, contractTracker:true, dspMetrics:false, stopMetrics:true },
  },
  usps: {
    id: "usps", label: "USPS HCR Contractor", icon: "📮",
    tagline: "Highway Contract Route operations",
    color: "#3b82f6", darkColor: "#1e3a8a",
    nav: ["dashboard","routes","compliance","drivers","dispatch","fleet","finance","payroll","invoices","contacts","documents","contracts","reports","trends","users","settings","fmcsa","data"],
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
const fmtDate = d => { if(!d) return "—"; const parts = d.split("-"); if(parts.length===3) return `${parseInt(parts[1])}/${parseInt(parts[2])}/${parts[0]}`; return new Date(d).toLocaleDateString(); };

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
      {/* ══ FMCSA LOOKUP ══════════════════════════════════════════════ */}
      {/* ══ SCORECARD (FedEx/Amazon/LastMile) ══════════════════════ */}
      {screen==="scorecard"&&(()=>{
        const isFedex = segment==="fedex";
        const isAmazon = segment==="amazon";
        const isLastMile = segment==="lastmile";
        const isUsps = segment==="usps";

        // FedEx metrics
        const fedexMetrics = [
          {key:"pickupCompliance",label:"Pickup Compliance",target:99,unit:"%",color:"#f59e0b"},
          {key:"deliveryCompliance",label:"Delivery Compliance",target:98,unit:"%",color:"#22c55e"},
          {key:"packageHandling",label:"Package Handling",target:99,unit:"%",color:"#60a5fa"},
          {key:"uniformCompliance",label:"Uniform / Vehicle Compliance",target:100,unit:"%",color:"#8888cc"},
          {key:"onTimePickup",label:"On-Time Pickup",target:97,unit:"%",color:"#f59e0b"},
          {key:"routeCompletion",label:"Route Completion Rate",target:99,unit:"%",color:"#22c55e"},
        ];

        // Amazon DSP metrics
        const amazonMetrics = [
          {key:"dart",label:"DART Score",target:98,unit:"%",color:"#f59e0b",desc:"Delivery Associate Reliability Today"},
          {key:"dcr",label:"DCR — Delivery Completion Rate",target:99,unit:"%",color:"#22c55e"},
          {key:"pod",label:"POD — Photo On Delivery",target:99,unit:"%",color:"#60a5fa"},
          {key:"mentor",label:"Mentor Safety Score (avg)",target:800,unit:"pts",color:"#8888cc"},
          {key:"contactCompliance",label:"Delivery Contact Compliance",target:97,unit:"%",color:"#f59e0b"},
          {key:"attendanceRate",label:"Driver Attendance Rate",target:98,unit:"%",color:"#22c55e"},
        ];

        // Last Mile / Lowe's metrics
        const lastmileMetrics = [
          {key:"stopCompletion",label:"Stop Completion Rate",target:99,unit:"%",color:"#22c55e"},
          {key:"onTimeDelivery",label:"On-Time Delivery",target:97,unit:"%",color:"#f59e0b"},
          {key:"customerSatisfaction",label:"Customer Satisfaction (CSAT)",target:95,unit:"%",color:"#60a5fa"},
          {key:"damageRate",label:"Damage-Free Rate",target:99,unit:"%",color:"#8888cc"},
          {key:"signatureCapture",label:"Signature Capture Rate",target:98,unit:"%",color:"#f59e0b"},
          {key:"callAhead",label:"Call-Ahead Compliance",target:95,unit:"%",color:"#22c55e"},
        ];

        // USPS metrics
        const uspsMetrics = [
          {key:"routeCompletion",label:"Route Completion Rate",target:100,unit:"%",color:"#22c55e"},
          {key:"onTime",label:"On-Time Performance",target:97,unit:"%",color:"#f59e0b"},
          {key:"vehicleInspection",label:"Vehicle Inspection Compliance",target:100,unit:"%",color:"#60a5fa"},
          {key:"substituteAvail",label:"Substitute Driver Availability",target:90,unit:"%",color:"#8888cc"},
          {key:"mailSecurity",label:"Mail Security Compliance",target:100,unit:"%",color:"#ef4444"},
        ];

        const metrics = isFedex?fedexMetrics:isAmazon?amazonMetrics:isLastMile?lastmileMetrics:uspsMetrics;
        const segLabel = isFedex?"FedEx Ground":isAmazon?"Amazon DSP":isLastMile?"Last Mile / Lowe's":"USPS Contract";

        // Get this week's scorecard entry
        const thisWeek = scorecardData.find(s=>s.week===scorecardWeek)||{week:scorecardWeek};
        const updateMetric = (key,val) => {
          const existing = scorecardData.find(s=>s.week===scorecardWeek);
          if(existing) {
            setScorecardData(p=>p.map(s=>s.week===scorecardWeek?{...s,[key]:val}:s));
          } else {
            setScorecardData(p=>[{week:scorecardWeek,[key]:val},...p]);
          }
        };

        const overallScore = metrics.reduce((sum,m)=>{
          const val = parseFloat(thisWeek[m.key]||0);
          const pct = m.unit==="%" ? val : Math.min((val/m.target)*100,100);
          return sum + pct;
        },0) / metrics.length;

        return(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
              <div>
                <div style={{...S.section}}>{segLabel.toUpperCase()} SCORECARD</div>
                <div style={{fontSize:11,color:"#555",marginTop:4}}>Track your weekly performance metrics. Enter your scores from your contractor portal.</div>
              </div>
              <div style={{textAlign:"center",background:"#141414",border:`1px solid ${accent}44`,borderRadius:8,padding:"12px 18px"}}>
                <div style={{fontSize:32,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,color:overallScore>=95?"#22c55e":overallScore>=85?"#f59e0b":"#ef4444"}}>{isNaN(overallScore)?"-":overallScore.toFixed(0)}%</div>
                <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Overall Score</div>
              </div>
            </div>

            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <label style={{...S.label,marginBottom:0,whiteSpace:"nowrap"}}>Week of:</label>
              <input type="date" value={scorecardWeek} onChange={e=>setScorecardWeek(e.target.value)} style={{...S.input,maxWidth:180}}/>
            </div>

            {/* ── D15: Amazon scorecard import ── */}
            {isAmazon&&<div style={{...S.card,marginBottom:16}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:8}}>Import Weekly Scorecard</div>
              <div style={{fontSize:11,color:"#888",marginBottom:8}}>Upload a photo/screenshot of your Amazon scorecard to auto-fill metrics.</div>
              <input type="file" accept="image/*,.pdf" onChange={async e=>{
                const file=e.target.files?.[0];if(!file)return;
                setScorecardImporting(true);setScorecardImportResult(null);setScorecardImportError("");
                try{
                  const reader=new FileReader();
                  reader.onload=async ev=>{
                    const base64=ev.target.result.split(",")[1];
                    const apiKey=import.meta.env.VITE_ANTHROPIC_API_KEY;
                    if(!apiKey){setScorecardImportError("No API key. Set VITE_ANTHROPIC_API_KEY.");setScorecardImporting(false);return;}
                    try{
                      const resp=await fetch("https://api.anthropic.com/v1/messages",{
                        method:"POST",
                        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
                        body:JSON.stringify({model:"claude-haiku-4-5",max_tokens:500,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:file.type,data:base64}},{type:"text",text:"This is an Amazon DSP weekly scorecard. Extract metrics: DART, DCR, POD compliance, Contact Compliance, DNR rate, Customer Escalations, Mentor score, Seatbelt compliance. Return ONLY a JSON object with these keys: dart, dcr, pod, contactCompliance, attendanceRate. Numeric values only. No markdown."}]}]})
                      });
                      const data=await resp.json();
                      const text=data.content?.[0]?.text||"{}";
                      let parsed={};try{parsed=JSON.parse(text.replace(/```json|```/g,"").trim());}catch{setScorecardImportError("Could not parse.");setScorecardImporting(false);return;}
                      setScorecardImportResult(parsed);setScorecardImporting(false);
                      // Auto-apply
                      Object.entries(parsed).forEach(([k,v])=>updateMetric(k,String(v)));
                    }catch(err){setScorecardImportError("API error: "+err.message);setScorecardImporting(false);}
                  };
                  reader.readAsDataURL(file);
                }catch(err){setScorecardImportError(err.message);setScorecardImporting(false);}
                e.target.value="";
              }} style={{...S.input,padding:"6px",marginBottom:8}}/>
              {scorecardImporting&&<div style={{fontSize:11,color:accent}}>⏳ Analyzing scorecard...</div>}
              {scorecardImportError&&<div style={{fontSize:11,color:"#ef4444"}}>{scorecardImportError}</div>}
              {scorecardImportResult&&<div style={{...S.card,background:"#081a08",border:"1px solid #22c55e44",marginTop:8}}>
                <div style={{fontSize:11,color:"#22c55e",marginBottom:6}}>✓ Imported {Object.keys(scorecardImportResult).length} metrics.</div>
              </div>}
            </div>}

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12,marginBottom:24}}>
              {metrics.map(m=>{
                const val = thisWeek[m.key]||"";
                const numVal = parseFloat(val||0);
                const pct = m.unit==="%"?numVal:Math.min((numVal/m.target)*100,100);
                const status = pct>=m.target?"#22c55e":pct>=(m.target-5)?"#f59e0b":"#ef4444";
                return(
                  <div key={m.key} style={{...S.card,borderTop:`3px solid ${m.color}`}}>
                    <div style={{fontSize:11,color:"#888",marginBottom:8,lineHeight:1.4}}>{m.label}</div>
                    {m.desc&&<div style={{fontSize:9,color:"#444",marginBottom:6}}>{m.desc}</div>}
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
                      <input type="number" value={val} onChange={e=>updateMetric(m.key,e.target.value)} placeholder={m.target.toString()} style={{...S.input,maxWidth:90}} min={0} max={m.unit==="%"?100:undefined}/>
                      <div style={{fontSize:9,color:"#555"}}>{m.unit}</div>
                      <div style={{marginLeft:"auto",fontSize:10,color:val?status:"#444",fontWeight:700}}>Target: {m.target}{m.unit}</div>
                    </div>
                    <div style={{height:4,background:"#1e1e1e",borderRadius:2}}>
                      <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:val?status:m.color,borderRadius:2,transition:"width 0.3s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weekly history */}
            {scorecardData.length>0&&(
              <div style={S.card}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>Score History</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {[...scorecardData].sort((a,b)=>new Date(b.week)-new Date(a.week)).slice(0,8).map(week=>{
                    const weekAvg = metrics.reduce((sum,m)=>{
                      const v=parseFloat(week[m.key]||0);
                      return sum+(m.unit==="%"?v:Math.min((v/m.target)*100,100));
                    },0)/metrics.length;
                    return(
                      <div key={week.week} style={{display:"flex",alignItems:"center",gap:12,padding:"6px 0",borderBottom:"1px solid #1a1a1a"}}>
                        <div style={{fontSize:11,color:"#888",width:90,flexShrink:0}}>{fmtDate(week.week)}</div>
                        <div style={{flex:1,height:6,background:"#1e1e1e",borderRadius:3}}>
                          <div style={{height:"100%",width:`${Math.min(weekAvg,100)}%`,background:weekAvg>=95?"#22c55e":weekAvg>=85?"#f59e0b":"#ef4444",borderRadius:3}}/>
                        </div>
                        <div style={{fontSize:12,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:weekAvg>=95?"#22c55e":weekAvg>=85?"#f59e0b":"#ef4444",width:40,textAlign:"right"}}>{isNaN(weekAvg)?"-":weekAvg.toFixed(0)}%</div>
                        <button onClick={()=>setScorecardData(p=>p.filter(s=>s.week!==week.week))} style={{background:"transparent",border:"none",color:"#333",cursor:"pointer",fontSize:11}}>✕</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Segment-specific tips */}
            <div style={{marginTop:16,background:"#0a0a14",border:"1px solid #1a1a2a",borderRadius:6,padding:"14px 18px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>{segLabel} Tips</div>
              {isFedex&&<div style={{fontSize:11,color:"#555",lineHeight:1.9}}>• Pickup compliance is the most-watched FedEx metric — missing pickups triggers contractor reviews<br/>• Vehicle appearance inspections happen randomly — keep trucks clean and branded<br/>• Route completion below 99% for 3+ weeks can trigger ISP contract review<br/>• Log incidents in the Drivers → Incidents screen immediately — delays hurt your rating</div>}
              {isAmazon&&<div style={{fontSize:11,color:"#555",lineHeight:1.9}}>• DART below 95% for 2 consecutive weeks flags your DSP for coaching<br/>• Mentor scores below 700 require mandatory retraining — check scores weekly<br/>• POD compliance dropped below 98% is the #1 reason DSPs lose packages<br/>• Keep a rescue driver on standby for unexpected driver callouts</div>}
              {isLastMile&&<div style={{fontSize:11,color:"#555",lineHeight:1.9}}>• Always call ahead for large item deliveries (appliances, lumber) — it's contractually required<br/>• Log every delivery attempt with timestamp even if no one is home<br/>• Damage claims over 0.5% of stops triggers Lowe's contract review<br/>• White glove delivery requires two-person team — log both drivers</div>}
              {isUsps&&<div style={{fontSize:11,color:"#555",lineHeight:1.9}}>• HCR routes must be completed regardless of volume — no partial days<br/>• Substitute drivers must be pre-approved by your postmaster before running routes<br/>• Vehicle inspection forms must be completed daily and kept 90 days<br/>• Mail security incidents must be reported within 1 hour — no exceptions</div>}
            </div>
          </div>
        </div>
        );
      })()}

      {screen==="fmcsa"&&(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
            <div style={{...S.section,marginBottom:4}}>FMCSA CARRIER LOOKUP</div>
            <p style={{fontSize:11,color:"#555",marginBottom:20,lineHeight:1.8}}>Enter your USDOT number to pull your carrier profile from the FMCSA SAFER database. Verify your authority status, safety rating, and auto-fill your company name.</p>
            <div style={{...S.card,marginBottom:20,border:`1px solid ${accent}33`}}>
              <label style={S.label}>USDOT Number</label>
              <div style={{display:"flex",gap:10,marginBottom:8}}>
                <input value={fmcsaDot} onChange={e=>setFmcsaDot(e.target.value.replace(/\D/g,""))} onKeyDown={e=>e.key==="Enter"&&lookupDOT()} placeholder="Enter your DOT number (numbers only)" style={{...S.input,flex:1}} maxLength={10}/>
                <button className="hov" onClick={lookupDOT} style={{...S.btn,flexShrink:0}}>{fmcsaLoading?"Looking up...":"Lookup →"}</button>
              </div>
              <div style={{fontSize:10,color:"#444"}}>Your USDOT number is on your operating authority certificate and cab card. Find it at <a href="https://safer.fmcsa.dot.gov" target="_blank" rel="noreferrer" style={{color:accent}}>safer.fmcsa.dot.gov</a></div>
            </div>
            {fmcsaError&&<div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010",color:"#f87171",fontSize:12,marginBottom:16}}>{fmcsaError}</div>}
            {fmcsaLoading&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:32,animation:"fadeUp 0.3s ease"}}>
              <div style={{width:32,height:32,border:"3px solid #1e1e1e",borderTop:`3px solid ${accent}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px"}}/>
              Querying FMCSA SAFER database...
              <div style={{fontSize:10,color:"#444",marginTop:8}}>This may take 5–10 seconds. FMCSA's servers can be slow.</div>
            </div>}
            {!fmcsaLoading&&!fmcsaResult&&!fmcsaError&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>Enter your USDOT number above and click Lookup → to pull your carrier profile from the FMCSA SAFER database.</div>}
            {fmcsaResult&&(
              <div style={{...S.card,border:`1px solid ${accent}33`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#e8e4d8"}}>{fmcsaResult.legalName||"Unknown"}</div>
                    {fmcsaResult.dbaName&&<div style={{fontSize:11,color:"#666"}}>DBA: {fmcsaResult.dbaName}</div>}
                  </div>
                  <div style={{background:fmcsaResult.opStatus?.toLowerCase().includes("authorized")?"#051a05":"#1a0808",border:`1px solid ${fmcsaResult.opStatus?.toLowerCase().includes("authorized")?"#22c55e44":"#ef444444"}`,borderRadius:6,padding:"6px 14px",textAlign:"center",flexShrink:0}}>
                    <div style={{fontSize:11,color:fmcsaResult.opStatus?.toLowerCase().includes("authorized")?"#22c55e":"#ef4444",fontWeight:700}}>{fmcsaResult.opStatus||"Unknown"}</div>
                    <div style={{fontSize:9,color:"#555"}}>Operating Status</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10,marginBottom:16}}>
                  {[["USDOT #",fmcsaResult.dotNum],["MC/Docket #",fmcsaResult.mcNum||"—"],["Safety Rating",fmcsaResult.safetyRating||"Not Rated"],["Power Units",fmcsaResult.powerUnits||"—"],["Drivers",fmcsaResult.drivers||"—"],["Phone",fmcsaResult.phone||"—"]].map(([lbl,val])=>val&&(
                    <div key={lbl} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}>
                      <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{lbl}</div>
                      <div style={{fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#c8c4bc"}}>{val}</div>
                    </div>
                  ))}
                </div>
                {fmcsaResult.address&&<div style={{fontSize:11,color:"#666",marginBottom:16}}>📍 {fmcsaResult.address}</div>}
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="hov" onClick={applyToSettings} style={{...S.btn,fontSize:11}}>Apply Company Name to Settings</button>
                  <a href={`https://safer.fmcsa.dot.gov/query.asp?query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${fmcsaResult.dotNum}`} target="_blank" rel="noreferrer" style={{...S.ghost,textDecoration:"none",fontSize:11,padding:"10px 18px",display:"inline-block"}}>View Full FMCSA Profile ↗</a>
                </div>
              </div>
            )}
            <div style={{...S.card,marginTop:20,background:"#0a0f1a",border:"1px solid #1a1a3a"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>FMCSA Forms Renewal Calendar</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[["MCS-150","Every 2 years from USDOT issuance date","Register/update at fmcsa.dot.gov/registration"],["UCR","Annual — renew by Dec 31 each year","Register at ucr.gov"],["IFTA","Quarterly filings + annual license renewal","File with your base state"],["IRP","Annual renewal","File with your base state DMV"],["Drug Clearinghouse","Annual query per driver","Login at clearinghouse.fmcsa.dot.gov"],["BOC-3","One-time, refile if agent changes","Use a registered process agent"],["Insurance (BMC-91)","Keep current — no lapse","Filed by your insurer to FMCSA"]].map(([form,freq,notes])=>(
                  <div key={form} style={{display:"flex",gap:14,padding:"8px 0",borderBottom:"1px solid #1a1a2a"}}>
                    <div style={{width:120,flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:accent}}>{form}</div>
                    <div style={{flex:1}}><div style={{fontSize:11,color:"#c8c4bc"}}>{freq}</div><div style={{fontSize:10,color:"#444"}}>{notes}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ FOOTER + BUG REPORT ════════════════════════════════════════ */}
      {showBugReport&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20}} onClick={()=>setShowBugReport(false)}>
          <div style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:10,padding:"28px 32px",maxWidth:480,width:"100%"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#e8e4d8",marginBottom:4}}>Report a Bug / Contact</div>
            <div style={{fontSize:11,color:"#555",marginBottom:16}}>Found something broken? Have a feature idea? Reach out directly.</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
              <div><label style={S.label}>Your Email (optional)</label><input value={bugForm.email} onChange={e=>setBugForm(p=>({...p,email:e.target.value}))} placeholder="so we can follow up" style={S.input}/></div>
              <div><label style={S.label}>Subject</label><input value={bugForm.subject} onChange={e=>setBugForm(p=>({...p,subject:e.target.value}))} placeholder="Bug: ..., Feature request: ..." style={S.input}/></div>
              <div><label style={S.label}>Description *</label><textarea value={bugForm.description} onChange={e=>setBugForm(p=>({...p,description:e.target.value}))} placeholder="Describe what happened, what screen you were on, and what you expected..." style={{...S.input,height:90,resize:"vertical"}}/></div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <a href={`mailto:bostonrudi1993@gmail.com?subject=${encodeURIComponent(bugForm.subject||"ContractorOS Feedback")}&body=${encodeURIComponent((bugForm.email?"From: "+bugForm.email+"\n\n":"")+bugForm.description)}`} style={{...S.btn,textDecoration:"none",display:"inline-block",fontSize:12}} onClick={()=>setShowBugReport(false)}>Send Email →</a>
              <button onClick={()=>setShowBugReport(false)} style={{...S.ghost,fontSize:11}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Clerk Org Profile Modal */}
      {showOrgProfile&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:20}} onClick={()=>setShowOrgProfile(false)}>
          <div style={{maxWidth:860,width:"100%",maxHeight:"90vh",overflow:"auto",borderRadius:10}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8"}}>Manage Team</div>
              <button onClick={()=>setShowOrgProfile(false)} style={{background:"transparent",border:"none",color:"#555",fontSize:22,cursor:"pointer"}}>✕</button>
            </div>
            <OrganizationProfile routing="virtual" appearance={{elements:{rootBox:{width:"100%"},card:{backgroundColor:"#141414",border:"1px solid #2a2a2a",boxShadow:"none"}}}}/>
          </div>
        </div>
      )}

      {/* Validation Toast */}
      {validationMsg&&(
        <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"#1a0808",border:"1px solid #ef444466",color:"#f87171",padding:"10px 20px",borderRadius:6,fontSize:11,zIndex:600,animation:"fadeUp 0.2s ease",whiteSpace:"nowrap",fontFamily:"'DM Mono',monospace",letterSpacing:"0.05em"}}>
          ⚠ {validationMsg}
        </div>
      )}

      {/* App Footer */}
      <div style={{flexShrink:0,borderTop:"2px solid #333",background:"#0d0d0d",padding:"16px 24px"}}>
        <div style={{fontSize:10,color:"#ffffff",lineHeight:1.9,marginBottom:10}}>
          © 2025–{new Date().getFullYear()} <strong>ContractorOS LLC</strong>. All rights reserved. ContractorOS LLC is a proprietary fleet management platform. Unauthorized reproduction, distribution, modification, or use of this software, its design, code, or content — in whole or in part — is strictly prohibited without express written permission. Built for independent contractors and fleet operators.
        </div>
        <div style={{display:"flex",gap:20,alignItems:"center"}}>
          <button onClick={()=>setShowBugReport(true)} style={{background:"transparent",border:"1px solid #444",color:"#ffffff",fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",padding:"4px 12px",borderRadius:4}}>Report a Bug</button>
          <a href="mailto:bostonrudi1993@gmail.com" style={{color:"#ffffff",fontSize:10,textDecoration:"none",fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em"}}>Contact Us</a>
          <div style={{marginLeft:"auto",fontSize:9,color:"#555"}}>contractoroshub.com</div>
        </div>
      </div>

    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
// ── Error Boundary ────────────────────────────────────────────────────────────
import React from "react";
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("ContractorOS Error:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#0a0a0a",padding:24,flexDirection:"column",gap:16,fontFamily:"'DM Mono',monospace"}}>
          <div style={{fontSize:32}}>⚠</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:800,color:"#e8e4d8"}}>Something went wrong</div>
          <div style={{fontSize:12,color:"#555",textAlign:"center",maxWidth:400,lineHeight:1.8}}>
            ContractorOS hit an unexpected error. Your data is safe — it's saved in the cloud.<br/>
            Refresh the page to continue.
          </div>
          <div style={{fontSize:10,color:"#333",background:"#141414",border:"1px solid #2a2a2a",borderRadius:6,padding:"10px 16px",maxWidth:500,wordBreak:"break-all"}}>
            {this.state.error?.message}
          </div>
          <button onClick={()=>window.location.reload()} style={{background:"#f59e0b",color:"#0a0a0a",border:"none",padding:"12px 28px",borderRadius:6,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,cursor:"pointer",letterSpacing:"0.05em"}}>
            Refresh Page →
          </button>
          <button onClick={()=>this.setState({hasError:false,error:null})} style={{background:"transparent",border:"1px solid #2a2a2a",color:"#555",padding:"8px 20px",borderRadius:6,fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer"}}>
            Try Without Refreshing
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Auth wrapper — shown before the main app ─────────────────────────────────
function AuthGate() {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { userMemberships, isLoaded: listLoaded } = useOrganizationList({ userMemberships: true });
  const [authView, setAuthView] = useState("signin"); // signin | signup | create_org | select_org

  if (!userLoaded) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0a0a",flexDirection:"column",gap:16}}>
      <div style={{width:48,height:48,border:"3px solid #1e1e1e",borderTop:"3px solid #f59e0b",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // Not signed in — show sign in / sign up
  if (!isSignedIn) return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{marginBottom:24,textAlign:"center"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:"#e8e4d8",letterSpacing:"0.05em"}}>
          CONTRACTOR<span style={{color:"#f59e0b"}}>OS</span>
        </div>
        <div style={{fontSize:11,color:"#555",marginTop:4,letterSpacing:"0.15em",textTransform:"uppercase"}}>Fleet Operating System</div>
      </div>
      {authView === "signin"
        ? <SignIn
          routing="virtual"
          afterSignInUrl="/app"
          appearance={{elements:{rootBox:{width:"100%",maxWidth:400}}}}
        />
        : <SignUp
          routing="virtual"
          afterSignUpUrl="/app"
          appearance={{elements:{rootBox:{width:"100%",maxWidth:400}}}}
        />
      }
      <button onClick={()=>setAuthView(authView==="signin"?"signup":"signin")}
        style={{marginTop:16,background:"transparent",border:"none",color:"#555",fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>
        {authView==="signin"?"Don't have an account? Sign up →":"Already have an account? Sign in →"}
      </button>
    </div>
  );

  // Signed in but no org — prompt to create or join one
  if (orgLoaded && !organization) {
    const hasMemberships = listLoaded && userMemberships?.data?.length > 0;
    return (
      <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{marginBottom:24,textAlign:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:"#e8e4d8"}}>
            CONTRACTOR<span style={{color:"#f59e0b"}}>OS</span>
          </div>
          <div style={{fontSize:11,color:"#555",marginTop:4}}>Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}</div>
        </div>
        <div style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:10,padding:"28px 32px",maxWidth:420,width:"100%",textAlign:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#e8e4d8",marginBottom:8}}>Set Up Your Company</div>
          <div style={{fontSize:11,color:"#555",marginBottom:24,lineHeight:1.8}}>
            ContractorOS organizes data by company. Create your company to get started, or ask your owner to invite you.
          </div>
          {hasMemberships ? (
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Your Companies</div>
              {userMemberships.data.map(m=>(
                <button key={m.organization.id}
                  onClick={()=>m.organization.setActive()}
                  style={{display:"block",width:"100%",background:"#0f0f0f",border:"1px solid #2a2a2a",borderRadius:6,padding:"12px 16px",color:"#e8e4d8",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,marginBottom:8,textAlign:"left"}}>
                  {m.organization.name}
                  <span style={{fontSize:10,color:"#555",fontFamily:"'DM Mono',monospace",fontWeight:400,marginLeft:10}}>{m.role}</span>
                </button>
              ))}
            </div>
          ) : null}
          <CreateOrganization
            routing="virtual"
            afterCreateOrganizationUrl="/app"
            appearance={{
              elements: {
                rootBox: { width: "100%" },
                card: { backgroundColor: "transparent", border: "none", boxShadow: "none", padding: 0 },
              }
            }}
          />
        </div>
      </div>
    );
  }

  // Signed in with org — render main app
  return <ContractorOS />;
}

function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <AuthGate />
    </ErrorBoundary>
  );
}
export default AppWithErrorBoundary;

function ContractorOS() {
  const { organization } = useOrganization();
  const { user } = useUser();
  const { signOut } = useClerk();
  // Use org ID as the data scope — all users in the same org share data
  const db = makeDb(organization?.id);

  // Send Day 0 onboarding email on first login
  useEffect(()=>{
    if(!user) return;
    const sentKey = `cos_onboard_email_${user.id}`;
    if(localStorage.getItem(sentKey)) return;
    const email = user.emailAddresses?.[0]?.emailAddress;
    const name = user.firstName ? `${user.firstName} ${user.lastName||""}`.trim() : "";
    if(!email) return;
    localStorage.setItem(sentKey, "1");
    fetch("/api/onboarding-email", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({email, name, day:0, companyName: organization?.name||""})
    }).catch(()=>{}); // Fire and forget — don't block the app
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user?.id]);
  const [segment, setSegment] = useState(() => { try { return localStorage.getItem("cos_segment_locked") || null; } catch { return null; } });
  const [onboardStep, setOnboardStep] = useState(0); // 0 = not started, 1-5 = steps, 6 = done
  const [onboardDismissed, setOnboardDismissed] = useState(() => { try { return localStorage.getItem("cos_onboard_done") === "1"; } catch { return false; } });

  const [compliance, setCompliance] = useState({trucks:[],drivers:[]});
  const [drivers, setDrivers] = useState([]);

  // Schedule Day 3 and Day 7 emails
  useEffect(()=>{
    if(!user) return;
    const email = user.emailAddresses?.[0]?.emailAddress;
    if(!email) return;
    const signupDateKey = `cos_signup_date_${user.id}`;
    if(!localStorage.getItem(signupDateKey)) {
      localStorage.setItem(signupDateKey, Date.now().toString());
    }
    const signupDate = parseInt(localStorage.getItem(signupDateKey)||"0");
    const daysSince = (Date.now() - signupDate) / (1000*60*60*24);
    const sendEmail = (day) => {
      const sentKey = `cos_onboard_email_day${day}_${user.id}`;
      if(localStorage.getItem(sentKey)) return;
      localStorage.setItem(sentKey,"1");
      fetch("/api/onboarding-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,name:user.firstName||"",day,companyName:organization?.name||"",hasDrivers:drivers.length>0,hasTrucks:compliance?.trucks?.length>0})}).catch(()=>{});
    };
    if(daysSince >= 3) sendEmail(3);
    if(daysSince >= 7) sendEmail(7);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user?.id, drivers.length, compliance?.trucks?.length]);
  // Derive role from Clerk org membership
  // org:admin = owner, org:member with manager role = manager, else driver
  const clerkRole = organization?.membership?.role; // "org:admin" or "org:member"
  const clerkUserName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.emailAddresses?.[0]?.emailAddress || "User";

  const [screen, setScreen] = useState("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [settings, setSettings] = useState({mpg:8,dieselPrice:3.85,cpm:0.18,homeBase:"",companyName:""});
  const [vehicles, setVehicles] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loads, setLoads] = useState([]);

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
  const [maintCustomVehicle, setMaintCustomVehicle] = useState("");

  const [showAddContract, setShowAddContract] = useState(false);
  const [contractForm, setContractForm] = useState({name:"",company:"",startDate:"",renewalDate:"",value:"",status:"active",notes:""});

  const [showAddRevenue, setShowAddRevenue] = useState(false);
  const [revenueForm, setRevenueForm] = useState({date:"",description:"",amount:"",vehicle:""});
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({date:"",category:"fuel",amount:"",description:"",vehicle:""});
  const [excelImporting, setExcelImporting] = useState(false);
  const [excelResult, setExcelResult] = useState(null);

  // Phase 2 — Notifications
  const [notifications, setNotifications] = useState([]);
  const [notifPermission, setNotifPermission] = useState("default");
  const [showAlertSetup, setShowAlertSetup] = useState(false);
  const [alertPhone, setAlertPhone] = useState(()=>{try{return localStorage.getItem("cos_alert_phone")||"";}catch{return "";}});
  const [alertEmail, setAlertEmail] = useState(()=>{try{return localStorage.getItem("cos_alert_email")||"";}catch{return "";}});

  // Filings tracker
  const [filings, setFilings] = useState(DEFAULT_FILINGS); // cloud load merges in useEffect
  const [editFilingId, setEditFilingId] = useState(null);
  const [editFilingForm, setEditFilingForm] = useState({});
  const [showAddFiling, setShowAddFiling] = useState(false);
  const [newFilingForm, setNewFilingForm] = useState({name:"",dueDate:"",frequency:"Annual",notes:"",filedDate:"",confirmationNum:"",filedNotes:""});

  // Phase 3 — Users / Roles
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({id:"owner",name:"Owner",role:"owner",pin:""});
  const [showAddUser, setShowAddUser] = useState(false);
  const [userForm, setUserForm] = useState({name:"",role:"driver",pin:"",driverId:""});
  const [pinEntry, setPinEntry] = useState(null); // {userId, enteredPin}
  const [switchingUser, setSwitchingUser] = useState(false);

  // Phase 4 — Trends
  const [trendsView, setTrendsView] = useState("monthly"); // monthly | weekly
  const [selectedRoute, setSelectedRoute] = useState("all");

  const [routeForm, setRouteForm] = useState({name:"",stops:"",miles:"",rate:"",stopRate:"",ratePerMile:"",driverPay:"",otherCosts:"",frequency:"Daily",vehicle:"",notes:""});
  const [brokerForm, setBrokerForm] = useState({name:"",phone:"",email:"",paySpeed:"",rating:3,notes:"",blacklisted:false});

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({name:"",nickname:"",vin:"",year:"",make:"",plate:"",dotInspection:"",ifta:"",irp:"",registration:"",insuranceExpiry:""});
  const [showAddCompDriver, setShowAddCompDriver] = useState(false);
  const [compDriverForm, setCompDriverForm] = useState({name:"",cdlExpiry:"",medCardExpiry:"",mvrDue:"",drugTest:"",annualReview:""});
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState("");
  const [dotAnswer, setDotAnswer] = useState(null);
  const [dotQ, setDotQ] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [parsedLoad, setParsedLoad] = useState(null);
  const [loadForm, setLoadForm] = useState({origin:"",destination:"",miles:"",offeredRate:"",deadheadMiles:"",commodity:"",pickupDate:"",brokerName:""});
  const [analyzeStep, setAnalyzeStep] = useState("paste");
  const [dbLoaded, setDbLoaded] = useState(false);

  // ── v10: New feature state ──────────────────────────────────────────
  const [payroll, setPayroll] = useState([]);
  const [fuelLog, setFuelLog] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [odometer, setOdometer] = useState([]);
  const [tires, setTires] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [hosLog, setHosLog] = useState([]);
  // New feature UI state
  const [payrollSub, setPayrollSub] = useState("runs");
  const [payrollShowAdd, setPayrollShowAdd] = useState(false);
  const [payrollForm, setPayrollForm] = useState({driverId:"",periodStart:"",periodEnd:"",miles:"",hours:"",stops:"",days:"",loadRevenue:"",manualAmount:"",notes:""});
  const [payrollPreview, setPayrollPreview] = useState(null);
  const [payStub, setPayStub] = useState(null);
  const [fuelSub, setFuelSub] = useState("log");
  const [fuelShowAdd, setFuelShowAdd] = useState(false);
  const [fuelForm, setFuelForm] = useState({truckName:"",date:"",gallons:"",pricePerGallon:"",totalCost:"",odometer:"",state:"",cardType:"company",notes:""});
  const [invoiceSub, setInvoiceSub] = useState("open");
  const [invoiceEditId, setInvoiceEditId] = useState(null);
  const [invoiceEditForm, setInvoiceEditForm] = useState({});
  const [invoiceShowAdd, setInvoiceShowAdd] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({invoiceNum:"",clientName:"",amount:"",issueDate:"",dueDate:"",description:"",status:"open",notes:""});
  const [odomSub, setOdomSub] = useState("log");
  const [odomShowAdd, setOdomShowAdd] = useState(false);
  const [odomForm, setOdomForm] = useState({truckName:"",date:"",reading:"",state:"",notes:""});
  const [tireShowAdd, setTireShowAdd] = useState(false);
  const [tireForm, setTireForm] = useState({truckName:"",date:"",position:"",brand:"",size:"",treadDepth:"",cost:"",mileageInstalled:"",status:"active",notes:""});
  const [docFilter, setDocFilter] = useState("all");
  const [docShowAdd, setDocShowAdd] = useState(false);
  const [docForm, setDocForm] = useState({name:"",type:"Rate Confirmation",date:"",linkedTo:"",notes:"",fileName:""});
  const [docFileData, setDocFileData] = useState(null);
  const [docEditId, setDocEditId] = useState(null);
  const [docEditForm, setDocEditForm] = useState({});
  const [dispatchShowAdd, setDispatchShowAdd] = useState(false);
  const [dispatchFilter, setDispatchFilter] = useState("active");
  const [dispatchForm, setDispatchForm] = useState({driverId:"",vehicleName:"",routeName:"",origin:"",destination:"",date:"",pickupTime:"",notes:"",status:"assigned"});
  const [contactShowAdd, setContactShowAdd] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const [contactFilter, setContactFilter] = useState("all");
  const [contactForm, setContactForm] = useState({name:"",company:"",type:"Client",phone:"",email:"",address:"",notes:"",paySpeed:"",rating:""});
  const [driverExtraSub, setDriverExtraSub] = useState("onboarding");
  const [hosShowAdd, setHosShowAdd] = useState(false);
  const [hosForm, setHosForm] = useState({driverId:"",date:"",hoursOnDuty:"",hoursDriving:"",hoursOffDuty:"",miles:"",notes:""});
  const [selectedOnboardDriver, setSelectedOnboardDriver] = useState("");
  const [dataSub, setDataSub] = useState("backup");
  const [fmcsaDot, setFmcsaDot] = useState("");
  const [fmcsaResult, setFmcsaResult] = useState(null);
  const [fmcsaLoading, setFmcsaLoading] = useState(false);
  const [fmcsaError, setFmcsaError] = useState("");
  const [showBugReport, setShowBugReport] = useState(false);
  const [scorecardWeek, setScorecardWeek] = useState(() => new Date().toISOString().slice(0,10));
  const [scorecardData, setScorecardData] = useState(() => { try { return JSON.parse(localStorage.getItem("cos_scorecard")||"[]"); } catch { return []; } });
  const [bugForm, setBugForm] = useState({subject:"",description:"",email:""});
  const [incidentFollowUpId, setIncidentFollowUpId] = useState(null);
  const [validationMsg, setValidationMsg] = useState("");
  const showValidation = (msg) => { setValidationMsg(msg); setTimeout(()=>setValidationMsg(""), 3000); };
  const [showOrgProfile, setShowOrgProfile] = useState(false);

  // ── v24: New feature state ──────────────────────────────────────────
  const [stopProfitLog, setStopProfitLog] = useState([]);
  const [settlementLog, setSettlementLog] = useState([]);
  const [scheduleData, setScheduleData] = useState({});
  const [coachingLog, setCoachingLog] = useState([]);
  const [appearanceLog, setAppearanceLog] = useState([]);
  const [dnrLog, setDnrLog] = useState([]);
  const [tripSheets, setTripSheets] = useState([]);
  const [vanInspectionLog, setVanInspectionLog] = useState([]);
  const [bidTracker, setBidTracker] = useState([]);
  const [deadMilesLog, setDeadMilesLog] = useState([]);
  const [loadHistory, setLoadHistory] = useState([]);
  const [whiteGloveLog, setWhiteGloveLog] = useState([]);

  // Sub-tab UI state for v24
  const [subTab_drivers, setSubTab_drivers] = useState("list");
  const [routesSubTab, setRoutesSubTab] = useState("list");
  const [fleetSubTab, setFleetSubTab] = useState("log");
  const [financeSubTab, setFinanceSubTab] = useState("pl");
  const [contractsSubTab, setContractsSubTab] = useState("contracts");
  const [analyzeSubTab, setAnalyzeSubTab] = useState("analyze");

  // Stop Profit
  const [stopProfitTab, setStopProfitTab] = useState("entry");
  const [stopProfitForm, setStopProfitForm] = useState({date:"",stops:"",revenuePerStop:"",driverPay:"",fuelCost:"",vehicleCost:"",otherCosts:""});
  const [weekOffset, setWeekOffset] = useState(0);

  // Settlement
  const [settlementTab, setSettlementTab] = useState("entry");
  const [settlementForm, setSettlementForm] = useState({weekEnding:"",stops:"",ratePerStop:"",stopBonuses:"",fuelSurcharge:"",amountDeposited:"",depositDate:"",notes:""});

  // Schedule
  const [scheduleTab, setScheduleTab] = useState("weekly");
  const [scheduleWeekOffset, setScheduleWeekOffset] = useState(0);
  const [minDrivers, setMinDrivers] = useState(3);

  // Coaching
  const [coachingForm, setCoachingForm] = useState({date:"",driverId:"",issueType:"Harsh Braking",description:"",actionTaken:"",followUpDate:"",followUpComplete:false,outcome:""});
  const [showCoachingAdd, setShowCoachingAdd] = useState(false);

  // Appearance
  const [appearVehicle, setAppearVehicle] = useState("");
  const [appearDate, setAppearDate] = useState("");
  const [appearItems, setAppearItems] = useState({decals:false,noStickers:false,exterior:false,cab:false,uniform:false,noUnreportedDamage:false,cargo:false});

  // DNR
  const [dnrForm, setDnrForm] = useState({date:"",driverId:"",address:"",packageId:"",description:"",responseSubmittedToAmazon:false,responseDate:"",resolution:"Pending",notes:""});
  const [showDnrAdd, setShowDnrAdd] = useState(false);

  // Trip Sheets
  const [tripSheetForm, setTripSheetForm] = useState({date:"",driverId:"",routeId:"",origin:"",destination:"",scheduledDeparture:"",actualDeparture:"",scheduledArrival:"",actualArrival:"",miles:"",vehicleId:"",fuelAdded:"",incidents:"",supervisorNotes:"",mailClasses:[]});
  const [showTripSheetAdd, setShowTripSheetAdd] = useState(false);

  // Bid Tracker
  const [bidForm, setBidForm] = useState({routeId:"",routeDescription:"",bidSubmittedDate:"",bidAmount:"",estimatedMilesPerYear:"",estimatedFuelCost:"",estimatedLaborCost:"",estimatedVehicleCost:"",estimatedTotalCost:"",estimatedNetAnnual:"",awardStatus:"Pending",awardDate:"",actualCostAfter30Days:"",actualCostAfter60Days:"",lessonLearned:"",notes:""});
  const [showBidAdd, setShowBidAdd] = useState(false);
  const [bidsTab, setBidsTab] = useState("active");

  // Van Inspection
  const [vanInspectVehicle, setVanInspectVehicle] = useState("");
  const [vanInspectDate, setVanInspectDate] = useState("");
  const [vanInspectItems, setVanInspectItems] = useState({exterior:false,tires:"Good",lights:false,cargo:false,device:false,seatbelt:false,noWarnings:false,driverAck:false});

  // Fuel Card
  const [fuelCardPasteText, setFuelCardPasteText] = useState("");
  const [fuelCardParsed, setFuelCardParsed] = useState([]);

  // Dead Miles
  const [deadMilesForm, setDeadMilesForm] = useState({date:"",fromLocation:"",toLocation:"",emptyMiles:"",reason:"Looking for load",notes:""});
  const [showDeadMilesAdd, setShowDeadMilesAdd] = useState(false);

  // Load History
  const [loadHistoryUpdateId, setLoadHistoryUpdateId] = useState(null);
  const [loadHistoryUpdateForm, setLoadHistoryUpdateForm] = useState({actualNet:"",notes:""});

  // White Glove
  const [whiteGloveOpen, setWhiteGloveOpen] = useState(null);

  // Scorecard import
  const [scorecardImporting, setScorecardImporting] = useState(false);
  const [scorecardImportResult, setScorecardImportResult] = useState(null);
  const [scorecardImportError, setScorecardImportError] = useState("");

  // Persist all state
  // ── Segment & settings stay in localStorage (tiny, sync, no cloud needed) ──
  useEffect(()=>{if(segment)stor.set(KEYS.segment,segment);},[segment]);
  useEffect(()=>{stor.set(KEYS.settings,settings);},[settings]);
  useEffect(()=>{try{localStorage.setItem("cos_scorecard",JSON.stringify(scorecardData));}catch{}},[scorecardData]);

  // ── Load ALL cloud data once on mount ────────────────────────────────────
  useEffect(()=>{
    let cancelled = false;
    (async()=>{
      const D = KEYS;
      const [
        _compliance, _vehicles, _drivers, _maintenance, _expenses, _revenue,
        _routes, _contracts, _incidents, _brokers, _loads, _users, _currentUser,
        _notifications, _filings, _payroll, _fuelLog, _invoices, _odometer,
        _tires, _documents, _dispatches, _contacts, _hosLog,
        _stopProfitLog, _settlementLog, _scheduleData, _coachingLog, _appearanceLog,
        _dnrLog, _tripSheets, _vanInspectionLog, _bidTracker, _deadMilesLog, _loadHistory, _whiteGloveLog,
      ] = await Promise.all([
        db.get(D.compliance,  {trucks:[],drivers:[]}),
        db.get(D.vehicles,    []),
        db.get(D.drivers,     []),
        db.get(D.maintenance, []),
        db.get(D.expenses,    []),
        db.get(D.revenue,     []),
        db.get(D.routes,      []),
        db.get(D.contracts,   []),
        db.get(D.incidents,   []),
        db.get(D.brokers,     []),
        db.get(D.loads,       []),
        db.get(D.users,       []),
        db.get(D.currentUser, {id:"owner",name:"Owner",role:"owner",pin:""}),
        db.get(D.notifications, []),
        db.get(D.filings,     null),
        db.get(D.payroll,     []),
        db.get(D.fuelLog,     []),
        db.get(D.invoices,    []),
        db.get(D.odometer,    []),
        db.get(D.tires,       []),
        db.get(D.documents,   []),
        db.get(D.dispatches,  []),
        db.get(D.contacts,    []),
        db.get(D.hosLog,      []),
        db.get(D.stopProfitLog, []),
        db.get(D.settlementLog, []),
        db.get(D.scheduleData, {}),
        db.get(D.coachingLog, []),
        db.get(D.appearanceLog, []),
        db.get(D.dnrLog, []),
        db.get(D.tripSheets, []),
        db.get(D.vanInspectionLog, []),
        db.get(D.bidTracker, []),
        db.get(D.deadMilesLog, []),
        db.get(D.loadHistory, []),
        db.get(D.whiteGloveLog, []),
      ]);
      if(cancelled) return;
      setCompliance(_compliance);
      setVehicles(_vehicles);
      setDrivers(_drivers);
      setMaintenance(_maintenance);
      setExpenses(_expenses);
      setRevenue(_revenue);
      setRoutes(_routes);
      setContracts(_contracts);
      setIncidents(_incidents);
      setBrokers(_brokers);
      setLoads(_loads);
      setUsers(_users);
      setCurrentUser(_currentUser);
      setNotifications(_notifications);
      // Filings: merge saved with defaults (same logic as before)
      if(_filings){
        const saved=_filings; const merged=[...DEFAULT_FILINGS];
        merged.forEach((f,i)=>{const s=saved.find(x=>x.id===f.id);if(s){merged[i]={...f,...s};}});
        saved.filter(s=>!DEFAULT_FILINGS.find(f=>f.id===s.id)).forEach(s=>merged.push(s));
        setFilings(merged);
      }
      setPayroll(_payroll);
      setFuelLog(_fuelLog);
      setInvoices(_invoices);
      setOdometer(_odometer);
      setTires(_tires);
      setDocuments(_documents);
      setDispatches(_dispatches);
      setContacts(_contacts);
      setHosLog(_hosLog);
      setStopProfitLog(_stopProfitLog);
      setSettlementLog(_settlementLog);
      setScheduleData(_scheduleData);
      setCoachingLog(_coachingLog);
      setAppearanceLog(_appearanceLog);
      setDnrLog(_dnrLog);
      setTripSheets(_tripSheets);
      setVanInspectionLog(_vanInspectionLog);
      setBidTracker(_bidTracker);
      setDeadMilesLog(_deadMilesLog);
      setLoadHistory(_loadHistory);
      setWhiteGloveLog(_whiteGloveLog);
      setDbLoaded(true);
    })();
    return ()=>{ cancelled=true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  // ── Save to cloud whenever state changes (debounced via useEffect) ────────
  useEffect(()=>{if(dbLoaded)db.set(KEYS.compliance,compliance);},[compliance,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.vehicles,vehicles);},[vehicles,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.drivers,drivers);},[drivers,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.maintenance,maintenance);},[maintenance,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.expenses,expenses);},[expenses,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.revenue,revenue);},[revenue,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.routes,routes);},[routes,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.contracts,contracts);},[contracts,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.incidents,incidents);},[incidents,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.brokers,brokers);},[brokers,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.loads,loads);},[loads,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.users,users);},[users,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.currentUser,currentUser);},[currentUser,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.notifications,notifications);},[notifications,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.filings,filings);},[filings,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.payroll,payroll);},[payroll,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.fuelLog,fuelLog);},[fuelLog,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.invoices,invoices);},[invoices,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.odometer,odometer);},[odometer,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.tires,tires);},[tires,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.documents,documents);},[documents,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.dispatches,dispatches);},[dispatches,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.contacts,contacts);},[contacts,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.hosLog,hosLog);},[hosLog,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.stopProfitLog,stopProfitLog);},[stopProfitLog,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.settlementLog,settlementLog);},[settlementLog,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.scheduleData,scheduleData);},[scheduleData,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.coachingLog,coachingLog);},[coachingLog,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.appearanceLog,appearanceLog);},[appearanceLog,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.dnrLog,dnrLog);},[dnrLog,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.tripSheets,tripSheets);},[tripSheets,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.vanInspectionLog,vanInspectionLog);},[vanInspectionLog,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.bidTracker,bidTracker);},[bidTracker,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.deadMilesLog,deadMilesLog);},[deadMilesLog,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.loadHistory,loadHistory);},[loadHistory,dbLoaded]);
  useEffect(()=>{if(dbLoaded)db.set(KEYS.whiteGloveLog,whiteGloveLog);},[whiteGloveLog,dbLoaded]);

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
    setAiLoading(true); setDotAnswer(""); setAiError("");
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if(!apiKey) { setAiError("Anthropic API key not configured. Add VITE_ANTHROPIC_API_KEY to Vercel environment variables."); setAiLoading(false); return; }
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:`You are a DOT/FMCSA compliance expert for US commercial trucking. Answer this question clearly and practically for an owner-operator or fleet manager. Be specific, cite relevant regulations where applicable, and flag any time-sensitive deadlines. Question: ${dotQ}`}]})
      });
      if(!res.ok) { const err = await res.json(); throw new Error(err.error?.message||`API error ${res.status}`); }
      const data = await res.json();
      const answer = data.content?.[0]?.text;
      if(!answer) throw new Error("No response from AI");
      setDotAnswer(answer);
    } catch(err) {
      setAiError(`DOT AI error: ${err.message}. Try again or check your API key.`);
    }
    setAiLoading(false);
  };;

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

  const requestPushPermission = () => { setShowAlertSetup(true); };
  const confirmAlertSetup = async () => {
    localStorage.setItem("cos_alert_phone", alertPhone);
    localStorage.setItem("cos_alert_email", alertEmail);
    setShowAlertSetup(false);
    if(!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if(perm==="granted"){new Notification("ContractorOS LLC Alerts Enabled",{body:"Compliance alerts enabled."+(alertPhone?" SMS: "+alertPhone:""),icon:"/icons/icon-192.png"});}
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
        ["name","Unit Name / #","text"],["nickname","Nickname (optional)","text"],
        ["vin","VIN or Last 6 Digits","text"],["year","Year","text"],
        ["make","Make & Model","text"],["plate","Plate #","text"],
        ["dotInspection","DOT Inspection Expiry","date"],["registration","Registration Expiry","date"],
        ["ifta","IFTA Renewal","date"],["irp","IRP Plate Renewal","date"],
        ["insuranceExpiry","Liability Insurance Expiry","date"],
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
        ["payType","Pay Type","select:per_mile|per_stop|per_day|percentage|hourly|salary"],
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
      if(t.insuranceExpiry) items.push({label:`Insurance Expiry — ${t.name}`,days:daysUntil(t.insuranceExpiry)});
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
            <button key={s.id} onClick={()=>{setSegment(s.id);localStorage.setItem("cos_segment_locked",s.id);if(!onboardDismissed)setOnboardStep(1);setScreen("dashboard");}} style={{background:"#111",border:`1px solid #222`,borderRadius:10,padding:"24px 26px",textAlign:"left",cursor:"pointer",transition:"all 0.2s",outline:"none",}} onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.background="#161616";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#222";e.currentTarget.style.background="#111";}}>
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
  const navLabels = {dashboard:"Dashboard",analyze:"Analyze Load",boards:"Load Boards",compliance:"Compliance",brokers:segment==="otr"?"Brokers":"Clients",fleet:"Fleet",finance:"Finance",routes:"Routes",drivers:"Drivers",contracts:"Contracts",reports:"Reports",trends:"P&L Trends",users:"Users",settings:"Settings",payroll:"Payroll",invoices:"Invoices",dispatch:"Dispatch",contacts:"Contacts",documents:"Documents",data:"Data & Backup",fmcsa:"FMCSA Lookup",scorecard:"Scorecard",stopprofit:"Stop Profit",settlement:"Settlement",driverschedule:"Schedule",claims:"Claims",deadmiles:"Dead Miles"};
  const SubNav = ({tabs,active,onSelect}) => <SubNavComp tabs={tabs} active={active} accent={accent} onSelect={onSelect}/>;
  const Stat = ({label,value,color,sub}) => <StatCard label={label} value={value} color={color||accent} sub={sub} card={S.card}/>;
  const ExpiryBadge = ({label,days}) => <ExpiryBadgeComp label={label} days={days}/>;
  const Loader = ({msg}) => <LoaderComp msg={msg} accent={accent}/>;
  // ── FMCSA lookup functions ──────────────────────────────────────────
  const lookupDOT = async () => {
    if(!fmcsaDot.trim()) return;
    setFmcsaLoading(true); setFmcsaError(""); setFmcsaResult(null);
    const dot = fmcsaDot.trim().replace(/\D/g,"");
    const apiKey = import.meta.env.VITE_FMCSA_API_KEY;
    try {
      let result = null;
      if(apiKey) {
        const apiUrl = `https://mobile.fmcsa.dot.gov/qc/services/carriers/${dot}?webKey=${apiKey}`;
        const res = await fetch(apiUrl);
        if(res.ok) {
          const json = await res.json();
          const c = json?.content?.carrier;
          if(c) {
            result = {
              legalName: c.legalName||c.name||"—",
              dbaName: c.dbaName||null,
              address: [c.phyStreet,c.phyCity,c.phyState,c.phyZipcode].filter(Boolean).join(", ")||null,
              phone: c.telephone||null,
              mcNum: c.mcNumber?`MC-${c.mcNumber}`:null,
              safetyRating: c.safetyRating||"Not Rated",
              powerUnits: c.totalPowerUnits?.toString()||null,
              drivers: c.totalDrivers?.toString()||null,
              opStatus: c.statusCode==="A"?"Authorized":c.statusCode==="I"?"Inactive":c.statusCode||null,
              entityType: c.carrierOperation?.carrierOperationDesc||null,
              dotNum: dot,
            };
          }
        }
      }
      if(!result) {
        const saferUrl = `https://safer.fmcsa.dot.gov/query.asp?query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${dot}`;
        const proxyRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(saferUrl)}`);
        const proxyJson = await proxyRes.json();
        const html = proxyJson.contents||"";
        const getVal = (label) => {
          const re = new RegExp(`${label}[\s\S]{0,30}?<td[^>]*>([^<]{1,80})`,"i");
          const m = html.match(re);
          return m?m[1].replace(/&amp;/g,"&").replace(/&nbsp;/g," ").trim():null;
        };
        const legalName=getVal("Legal Name");
        const opStatus=getVal("Operating Status")||getVal("Operating Authority Status");
        if(html.length>200&&(legalName||opStatus)){
          result={legalName:legalName||"Unknown",dbaName:getVal("DBA Name"),address:getVal("Physical Address"),phone:getVal("Phone"),mcNum:getVal("Docket Number"),safetyRating:getVal("Safety Rating"),powerUnits:getVal("Power Units"),drivers:getVal("Drivers"),opStatus,entityType:getVal("Entity Type"),dotNum:dot};
        }
      }
      if(result){setFmcsaResult(result);}
      else{setFmcsaError(`No carrier found for DOT# ${dot}. Verify at safer.fmcsa.dot.gov`);}
    } catch(err) {
      setFmcsaError("Lookup failed. Check your internet connection or visit safer.fmcsa.dot.gov directly.");
    }
    setFmcsaLoading(false);
  };
  const applyToSettings = () => {
    if(!fmcsaResult) return;
    setSettings(p=>({...p,companyName:fmcsaResult.legalName||p.companyName}));
    alert("Company name applied to Settings.");
  };

  const handleNav = (id) => { setScreen(id); setSubScreen(null); setAiResult(null); setAnalyzeStep("paste"); setNavOpen(false); };

  // ── RENDER ─────────────────────────────────────────────────────────
  // Show loading screen while data loads from Supabase
  if(!dbLoaded) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0a0a",flexDirection:"column",gap:16}}>
      <div style={{width:48,height:48,border:"3px solid #1e1e1e",borderTop:`3px solid ${segment?SEGMENTS[segment]?.color||"#f59e0b":"#f59e0b"}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,color:"#555",letterSpacing:"0.1em"}}>LOADING YOUR DATA...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",fontFamily:"'DM Mono','Courier New',monospace",color:"#d4d0c8",display:"flex",flexDirection:"column"}}>
      <EditModalComp modal={modal} editForm={editForm} setEditForm={setEditForm} saveEdit={saveEdit} closeModal={closeModal} accent={accent} S={S} MODAL_CONFIGS={MODAL_CONFIGS}/>

      {/* ══ ONBOARDING MODAL ════════════════════════════════════════ */}
      {onboardStep > 0 && onboardStep <= 5 && !onboardDismissed && (()=>{
        const steps = [
          { num:1, title:"Navigate the App", icon:"☰", desc:"Tap the ☰ hamburger menu in the top-left corner to open navigation. All screens are accessible from there — compliance, fleet, drivers, finance, and more.", action:"Open Menu", screen:null, specialAction:()=>setNavOpen(true) },
          { num:2, title:"Add Your First Truck", icon:"🚛", desc:"Let's get your fleet set up. Add your truck so compliance tracking and fuel logs work correctly.", action:"Go to Fleet", screen:"fleet" },
          { num:3, title:"Add Your First Driver", icon:"👤", desc:"Add yourself or your first driver. This unlocks payroll, HOS logs, and onboarding checklists.", action:"Go to Drivers", screen:"drivers" },
          { num:4, title:"Set Compliance Dates", icon:"🛡", desc:"Enter your DOT inspection, registration, and insurance expiry dates. The app will alert you before they expire.", action:"Go to Compliance", screen:"compliance" },
          { num:5, title:"Log Your First Expense", icon:"💰", desc:"Add a fuel fill-up or maintenance cost. This starts building your profit & loss picture automatically.", action:"Go to Finance", screen:"finance" },
        ];
        const step = steps[onboardStep - 1];
        const pct = (onboardStep / 5) * 100;
        return (
          <div style={{position:"fixed",bottom:20,right:20,width:320,background:"#141414",border:`1px solid ${accent}44`,borderRadius:10,padding:"20px 22px",zIndex:400,boxShadow:"0 8px 32px rgba(0,0,0,0.6)",animation:"fadeUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.15em"}}>Getting Started — Step {onboardStep} of 5</div>
              <button onClick={()=>{setOnboardDismissed(true);localStorage.setItem("cos_onboard_done","1");}} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:14,lineHeight:1}}>✕</button>
            </div>
            <div style={{height:3,background:"#1e1e1e",borderRadius:2,marginBottom:16}}>
              <div style={{height:"100%",width:`${pct}%`,background:accent,borderRadius:2,transition:"width 0.4s ease"}}/>
            </div>
            <div style={{fontSize:24,marginBottom:8}}>{step.icon}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"#e8e4d8",marginBottom:6}}>{step.title}</div>
            <div style={{fontSize:11,color:"#666",lineHeight:1.7,marginBottom:16}}>{step.desc}</div>
            <div style={{display:"flex",gap:8}}>
              <button className="hov" onClick={()=>{if(step.specialAction){step.specialAction();}else{handleNav(step.screen);}setOnboardStep(s=>s+1);}} style={{...S.btn,fontSize:12,flex:1}}>{step.action} →</button>
              {onboardStep < 5 && <button onClick={()=>setOnboardStep(s=>s+1)} style={{...S.ghost,fontSize:10,padding:"10px 12px"}}>Skip</button>}
            </div>
          </div>
        );
      })()}

      {onboardStep === 6 && !onboardDismissed && (
        <div style={{position:"fixed",bottom:20,right:20,width:320,background:"#0a150a",border:"1px solid #22c55e44",borderRadius:10,padding:"20px 22px",zIndex:400,boxShadow:"0 8px 32px rgba(0,0,0,0.6)",animation:"fadeUp 0.3s ease"}}>
          <div style={{fontSize:24,marginBottom:8}}>🎉</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"#22c55e",marginBottom:6}}>Setup Complete!</div>
          <div style={{fontSize:11,color:"#666",lineHeight:1.7,marginBottom:16}}>ContractorOS is ready to run your operation. Your data saves automatically to the cloud.</div>
          <button className="hov" onClick={()=>{setOnboardDismissed(true);localStorage.setItem("cos_onboard_done","1");}} style={{...S.btn,background:"#22c55e",width:"100%",fontSize:12}}>Let's Go →</button>
        </div>
      )}

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
        /* Hamburger nav universal — no responsive overrides needed */
        @keyframes drawerIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
      `}</style>

      {/* ── MOBILE DRAWER OVERLAY ─────────────────────────────────── */}
      {navOpen&&<div onClick={()=>setNavOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,backdropFilter:"blur(2px)"}}/>}

      {/* ── LEFT SLIDE DRAWER (mobile) ────────────────────────────── */}
      <div style={{position:"fixed",top:0,left:0,height:"100%",width:260,background:"#0d0d0d",borderRight:"1px solid #1e1e1e",zIndex:201,transform:navOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.25s cubic-bezier(0.4,0,0.2,1)",display:"flex",flexDirection:"column",overflowY:"auto"}}>
        {/* Drawer header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",borderBottom:"1px solid #1e1e1e",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,background:accent,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:4,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,color:"#0a0a0a"}}>CO</div>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:"#e8e4d8",lineHeight:1}}>CONTRACTOR<span style={{color:accent}}>OS</span></div>
              <div style={{fontSize:8,color:"#444",letterSpacing:"0.12em",textTransform:"uppercase"}}>{seg.icon} {seg.label}</div>
            </div>
          </div>
          <button onClick={()=>setNavOpen(false)} style={{background:"transparent",border:"none",color:"#555",fontSize:20,cursor:"pointer",padding:"4px 8px",lineHeight:1}}>✕</button>
        </div>
        {/* Drawer nav items */}
        <div style={{flex:1,padding:"8px 0"}}>
          {seg.nav.map(id=>{
            const isActive=screen===id;
            const label=urgentItems.length>0&&id==="compliance"?"Compliance 🔴":navLabels[id]||id;
            const NAV_ICONS={dashboard:"◈",analyze:"⚡",boards:"📋",compliance:"🛡",brokers:"🤝",fleet:"🚛",finance:"💰",routes:"🗺",drivers:"👤",contracts:"📄",reports:"📊",trends:"📈",users:"👥",settings:"⚙",payroll:"💵",invoices:"🧾",dispatch:"📡",contacts:"📞",documents:"📁",data:"💾",fmcsa:"🏛",scorecard:"📊",stopprofit:"📍",settlement:"💳",driverschedule:"📅",claims:"📋",deadmiles:"🛣"};
            return(
              <button key={id} onClick={()=>handleNav(id)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"11px 18px",background:isActive?accent+"18":"transparent",border:"none",borderLeft:isActive?`3px solid ${accent}`:"3px solid transparent",color:isActive?accent:"#666",fontSize:12,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",textAlign:"left",transition:"all 0.12s"}}>
                <span style={{fontSize:14,width:20,textAlign:"center",flexShrink:0}}>{NAV_ICONS[id]||"·"}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        {/* Drawer footer */}
        <div style={{padding:"12px 18px",borderTop:"1px solid #1e1e1e",flexShrink:0}}>
          <div style={{fontSize:10,color:"#333",textAlign:"center",padding:"4px 0"}}>{seg.icon} {seg.label}</div>
        </div>
      </div>

      {/* TOP BAR — universal hamburger */}
      <div style={{display:"flex",alignItems:"center",height:50,borderBottom:"1px solid #1e1e1e",background:"#0d0d0d",padding:"0 16px",gap:10,flexShrink:0,position:"sticky",top:0,zIndex:100}}>
        <button onClick={()=>setNavOpen(true)} style={{background:"transparent",border:"none",color:"#888",fontSize:22,cursor:"pointer",padding:"4px 8px",lineHeight:1,flexShrink:0}} aria-label="Open menu">☰</button>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{width:30,height:30,background:accent,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:4,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,color:"#0a0a0a"}}>CO</div>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:"#e8e4d8",lineHeight:1}}>CONTRACTOR<span style={{color:accent}}>OS</span></div>
            <div style={{fontSize:8,color:"#444",letterSpacing:"0.15em",textTransform:"uppercase"}}>{seg.icon} {seg.label}</div>
          </div>
        </div>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,color:"#e8e4d8",textTransform:"uppercase",letterSpacing:"0.08em"}}>{navLabels[screen]||screen}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          {urgentItems.length>0&&<button onClick={()=>handleNav("compliance")} style={{background:"#1a0808",border:"1px solid #ef444433",color:"#ef4444",padding:"4px 10px",borderRadius:4,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>🔴 {urgentItems.length}</button>}
          {user?.emailAddresses?.[0]?.emailAddress==="bostonrudi1993@gmail.com"&&(
            <button onClick={()=>{setSegment(null);localStorage.removeItem("cos_segment_locked");}} style={{background:"#1a0a00",border:"1px solid #f59e0b44",color:"#f59e0b",padding:"4px 10px",borderRadius:4,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>👑 SWITCH TYPE</button>
          )}
        </div>
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

            {aiError&&!aiLoading&&analyzeStep!=="result"&&(<div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010",color:"#f87171",fontSize:11,padding:16,marginBottom:12,animation:"fadeUp 0.3s ease"}}>⚠ {aiError}<br/><span style={{fontSize:9,color:"#7a4040"}}>Check your VITE_ANTHROPIC_API_KEY in Vercel, or try again.</span></div>)}
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

            {analyzeStep!=="paste"&&!aiLoading&&!aiResult&&aiError&&(<div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010",color:"#f87171",fontSize:12,padding:20,marginBottom:16,animation:"fadeUp 0.3s ease"}}>⚠ {aiError}<br/><span style={{fontSize:10,color:"#7a4040"}}>Check your API key in Vercel environment variables, or try again in a moment.</span></div>)}
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
                    <button className="hov" onClick={()=>{
                      setLoadHistory(prev=>[{id:Date.now(),date:new Date().toISOString().slice(0,10),origin:loadForm.origin,destination:loadForm.destination,miles:loadForm.miles,offeredRate:loadForm.offeredRate,grossRPM:parseFloat(loadForm.miles)>0?(parseFloat(loadForm.offeredRate)/parseFloat(loadForm.miles)).toFixed(3):0,grade:aiResult?.grade||"—",verdict:"TAKE",brokerName:loadForm.brokerName,actualOutcome:null},...prev].slice(0,200));
                      setAnalyzeStep("paste");setPasteText("");setAiResult(null);setLoadForm({origin:"",destination:"",miles:"",offeredRate:"",deadheadMiles:"",commodity:"",pickupDate:"",brokerName:""});
                    }} style={{...S.btn,background:"#22c55e"}}>✓ Take It</button>
                    <button className="hov" onClick={()=>{
                      setLoadHistory(prev=>[{id:Date.now(),date:new Date().toISOString().slice(0,10),origin:loadForm.origin,destination:loadForm.destination,miles:loadForm.miles,offeredRate:loadForm.offeredRate,grossRPM:parseFloat(loadForm.miles)>0?(parseFloat(loadForm.offeredRate)/parseFloat(loadForm.miles)).toFixed(3):0,grade:aiResult?.grade||"—",verdict:"PASS",brokerName:loadForm.brokerName,actualOutcome:null},...prev].slice(0,200));
                      setAnalyzeStep("paste");setPasteText("");setAiResult(null);setLoadForm({origin:"",destination:"",miles:"",offeredRate:"",deadheadMiles:"",commodity:"",pickupDate:"",brokerName:""});
                    }} style={{...S.btn,background:"#ef4444"}}>✗ Pass</button>
                    <button className="hov" onClick={()=>{setAnalyzeStep("paste");setPasteText("");setAiResult(null);setLoadForm({origin:"",destination:"",miles:"",offeredRate:"",deadheadMiles:"",commodity:"",pickupDate:"",brokerName:""});}} style={S.btn}>→ Analyze Another</button>
                    <button onClick={()=>setAnalyzeSubTab("history")} style={S.ghost}>View History</button>
                  </div>
                </div>
              );
            })()}
            {/* ── D10: Load History ── */}
            {analyzeSubTab==="history"&&segment==="otr"&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8"}}>Load History</div>
                  <button className="hov" onClick={()=>setAnalyzeSubTab("analyze")} style={{...S.btn,fontSize:10,padding:"4px 12px"}}>← Back to Analyze</button>
                </div>
                {loadHistory.length>0&&(()=>{
                  const taken=loadHistory.filter(l=>l.verdict==="TAKE");
                  const avgRPM=taken.length>0?(taken.reduce((s,l)=>s+parseFloat(l.grossRPM||0),0)/taken.length).toFixed(3):0;
                  return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12,marginBottom:16}}>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Total Analyzed</div><div style={{fontSize:24,fontWeight:700,color:accent}}>{loadHistory.length}</div></div>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Avg RPM (Taken)</div><div style={{fontSize:24,fontWeight:700,color:accent}}>${avgRPM}</div></div>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Pass Rate</div><div style={{fontSize:24,fontWeight:700,color:accent}}>{loadHistory.length>0?(loadHistory.filter(l=>l.verdict==="PASS").length/loadHistory.length*100).toFixed(0):0}%</div></div>
                  </div>;
                })()}
                {loadHistory.length===0&&<div style={{color:"#555",fontSize:12}}>No load history yet. Analyze loads and click Take It or Pass.</div>}
                {loadHistory.map(l=>(
                  <div key={l.id} style={{...S.card,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:13,color:"#e8e4d8"}}>{l.origin} → {l.destination}</div>
                        <div style={{fontSize:11,color:"#888"}}>{l.date} · {l.brokerName||"—"} · ${parseFloat(l.offeredRate||0).toFixed(0)} · {l.miles}mi</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <span style={{fontSize:11,padding:"2px 8px",borderRadius:3,background:l.verdict==="TAKE"?"#22c55e33":"#ef444433",color:l.verdict==="TAKE"?"#22c55e":"#ef4444"}}>{l.verdict}</span>
                        <div style={{fontSize:10,color:accent,marginTop:4}}>{l.grade} grade</div>
                      </div>
                    </div>
                    {loadHistoryUpdateId===l.id?(
                      <div style={{marginTop:8}}>
                        <input placeholder="Actual Net Earned $" value={loadHistoryUpdateForm.actualNet} onChange={e=>setLoadHistoryUpdateForm(p=>({...p,actualNet:e.target.value}))} style={{...S.input,marginBottom:6}}/>
                        <div style={{display:"flex",gap:6}}>
                          <button className="hov" onClick={()=>{setLoadHistory(p=>p.map(x=>x.id===l.id?{...x,actualOutcome:loadHistoryUpdateForm.actualNet}:x));setLoadHistoryUpdateId(null);setLoadHistoryUpdateForm({actualNet:"",notes:""}); }} style={S.btn}>Save</button>
                          <button className="hov" onClick={()=>setLoadHistoryUpdateId(null)} style={{...S.btn,background:"#333"}}>Cancel</button>
                        </div>
                      </div>
                    ):(
                      <button className="hov" onClick={()=>{setLoadHistoryUpdateId(l.id);setLoadHistoryUpdateForm({actualNet:l.actualOutcome||"",notes:""});}} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer",marginTop:6}}>Update Outcome</button>
                    )}
                  </div>
                ))}
              </div>
            )}
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
          <SubNav tabs={[["list","My Routes"],["add","Add Route"],["performance","Performance"],...(segment==="amazon"?[["dnr","DNR Cases"]]:segment==="usps"?[["tripsheets","Trip Sheets"]]:[])]  } active={subScreen||"list"} onSelect={setSubScreen}/>
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
                        {compliance.trucks.map(t=><option key={t.id} value={t.name}>{t.name}{t.nickname?` "${t.nickname}"`:""}{ t.vin?` · ${t.vin.slice(-6)}`:""}</option>)}
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

            {/* ── D4: DNR Cases ── */}
            {subScreen==="dnr"&&segment==="amazon"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8"}}>DNR Case Log</div>
                  <button className="hov" onClick={()=>setShowDnrAdd(p=>!p)} style={S.btn}>+ Add Case</button>
                </div>
                {(()=>{
                  const weekStart=new Date();weekStart.setDate(weekStart.getDate()-weekStart.getDay());
                  const weekDisp=dispatches.filter(d=>d.date>=weekStart.toISOString().slice(0,10)).length;
                  const weekDnr=dnrLog.filter(d=>d.date>=weekStart.toISOString().slice(0,10)).length;
                  const rate=weekDisp>0?(weekDnr/weekDisp*100):0;
                  return rate>0.5?<div style={{...S.card,background:"#1a0808",border:"1px solid #ef444455",color:"#ef4444",fontSize:12,marginBottom:12}}>🚨 DNR rate above threshold ({rate.toFixed(2)}%) — review with Amazon portal</div>:null;
                })()}
                {showDnrAdd&&<div style={{...S.card,marginBottom:16}}>
                  <input type="date" value={dnrForm.date} onChange={e=>setDnrForm(p=>({...p,date:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <select value={dnrForm.driverId} onChange={e=>setDnrForm(p=>({...p,driverId:e.target.value}))} style={{...S.input,marginBottom:8}}>
                    <option value="">Select Driver</option>
                    {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <input placeholder="Customer Address" value={dnrForm.address} onChange={e=>setDnrForm(p=>({...p,address:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <input placeholder="Package ID (optional)" value={dnrForm.packageId} onChange={e=>setDnrForm(p=>({...p,packageId:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <textarea placeholder="Description" value={dnrForm.description} onChange={e=>setDnrForm(p=>({...p,description:e.target.value}))} style={{...S.input,marginBottom:8,minHeight:60}}/>
                  <select value={dnrForm.resolution} onChange={e=>setDnrForm(p=>({...p,resolution:e.target.value}))} style={{...S.input,marginBottom:8}}>
                    {["Pending","Cleared","Penalized"].map(r=><option key={r}>{r}</option>)}
                  </select>
                  <label style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#888",marginBottom:8}}>
                    <input type="checkbox" checked={dnrForm.responseSubmittedToAmazon} onChange={e=>setDnrForm(p=>({...p,responseSubmittedToAmazon:e.target.checked}))}/> Response Submitted to Amazon
                  </label>
                  <input placeholder="Notes" value={dnrForm.notes} onChange={e=>setDnrForm(p=>({...p,notes:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <button className="hov" onClick={()=>{
                    const drv=drivers.find(d=>d.id===dnrForm.driverId);
                    setDnrLog(p=>[{id:Date.now(),driverName:drv?.name||"",...dnrForm},...p]);
                    setDnrForm({date:"",driverId:"",address:"",packageId:"",description:"",responseSubmittedToAmazon:false,responseDate:"",resolution:"Pending",notes:""});
                    setShowDnrAdd(false);
                  }} style={S.btn}>Save Case</button>
                </div>}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12,marginBottom:16}}>
                  <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Open Cases</div><div style={{fontSize:24,fontWeight:700,color:"#ef4444"}}>{dnrLog.filter(d=>d.resolution==="Pending").length}</div></div>
                  <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Cleared</div><div style={{fontSize:24,fontWeight:700,color:"#22c55e"}}>{dnrLog.filter(d=>d.resolution==="Cleared").length}</div></div>
                  <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Penalized</div><div style={{fontSize:24,fontWeight:700,color:"#ef4444"}}>{dnrLog.filter(d=>d.resolution==="Penalized").length}</div></div>
                </div>
                {dnrLog.length===0&&<div style={{color:"#555",fontSize:12}}>No DNR cases logged.</div>}
                {dnrLog.map(d=>(
                  <div key={d.id} style={{...S.card,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:13,color:"#e8e4d8"}}>{d.driverName} · {d.address}</div>
                        <div style={{fontSize:11,color:"#888"}}>{d.date} · {d.description}</div>
                        {d.responseSubmittedToAmazon&&<div style={{fontSize:10,color:"#22c55e",marginTop:2}}>✓ Response submitted</div>}
                      </div>
                      <span style={{fontSize:11,padding:"2px 8px",borderRadius:3,background:d.resolution==="Cleared"?"#22c55e33":d.resolution==="Penalized"?"#ef444433":"#f59e0b33",color:d.resolution==="Cleared"?"#22c55e":d.resolution==="Penalized"?"#ef4444":"#f59e0b"}}>{d.resolution}</span>
                    </div>
                    <div style={{display:"flex",gap:6,marginTop:8}}>
                      {["Cleared","Penalized"].map(r=><button key={r} className="hov" onClick={()=>setDnrLog(p=>p.map(x=>x.id===d.id?{...x,resolution:r}:x))} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer"}}>{r}</button>)}
                      <button className="hov" onClick={()=>setDnrLog(p=>p.filter(x=>x.id!==d.id))} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:"1px solid #ef444444",background:"transparent",color:"#ef4444",cursor:"pointer"}}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── D5: Trip Sheets ── */}
            {subScreen==="tripsheets"&&segment==="usps"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8"}}>Trip Sheets</div>
                  <button className="hov" onClick={()=>setShowTripSheetAdd(p=>!p)} style={S.btn}>+ Add Trip Sheet</button>
                </div>
                {showTripSheetAdd&&<div style={{...S.card,marginBottom:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>New Trip Sheet</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <input type="date" value={tripSheetForm.date} onChange={e=>setTripSheetForm(p=>({...p,date:e.target.value}))} style={S.input}/>
                    <select value={tripSheetForm.driverId} onChange={e=>setTripSheetForm(p=>({...p,driverId:e.target.value}))} style={S.input}>
                      <option value="">Select Driver</option>
                      {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <input placeholder="Origin" value={tripSheetForm.origin} onChange={e=>setTripSheetForm(p=>({...p,origin:e.target.value}))} style={S.input}/>
                    <input placeholder="Destination" value={tripSheetForm.destination} onChange={e=>setTripSheetForm(p=>({...p,destination:e.target.value}))} style={S.input}/>
                    <input type="time" placeholder="Sched. Departure" value={tripSheetForm.scheduledDeparture} onChange={e=>setTripSheetForm(p=>({...p,scheduledDeparture:e.target.value}))} style={S.input}/>
                    <input type="time" placeholder="Actual Departure" value={tripSheetForm.actualDeparture} onChange={e=>setTripSheetForm(p=>({...p,actualDeparture:e.target.value}))} style={S.input}/>
                    <input placeholder="Miles" type="number" value={tripSheetForm.miles} onChange={e=>setTripSheetForm(p=>({...p,miles:e.target.value}))} style={S.input}/>
                    <input placeholder="Fuel Added (gal)" type="number" value={tripSheetForm.fuelAdded} onChange={e=>setTripSheetForm(p=>({...p,fuelAdded:e.target.value}))} style={S.input}/>
                  </div>
                  <div style={{marginBottom:8}}>
                    <div style={{fontSize:11,color:"#888",marginBottom:4}}>Mail Classes:</div>
                    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                      {["First Class","Priority","Package","Periodicals","Other"].map(mc=>(
                        <label key={mc} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#e8e4d8"}}>
                          <input type="checkbox" checked={(tripSheetForm.mailClasses||[]).includes(mc)} onChange={e=>setTripSheetForm(p=>({...p,mailClasses:e.target.checked?[...(p.mailClasses||[]),mc]:(p.mailClasses||[]).filter(x=>x!==mc)}))}/>
                          {mc}
                        </label>
                      ))}
                    </div>
                  </div>
                  <textarea placeholder="Incidents" value={tripSheetForm.incidents} onChange={e=>setTripSheetForm(p=>({...p,incidents:e.target.value}))} style={{...S.input,marginBottom:8,minHeight:50}}/>
                  <button className="hov" onClick={()=>{
                    const drv=drivers.find(d=>d.id===tripSheetForm.driverId);
                    setTripSheets(p=>[{id:Date.now(),driverName:drv?.name||"",...tripSheetForm},...p]);
                    setTripSheetForm({date:"",driverId:"",routeId:"",origin:"",destination:"",scheduledDeparture:"",actualDeparture:"",scheduledArrival:"",actualArrival:"",miles:"",vehicleId:"",fuelAdded:"",incidents:"",supervisorNotes:"",mailClasses:[]});
                    setShowTripSheetAdd(false);
                  }} style={S.btn}>Save Trip Sheet</button>
                </div>}
                <button className="hov" onClick={()=>{
                  const rows=[["Date","Driver","Origin","Destination","Miles","Sched Dep","Actual Dep","Fuel Added","Mail Classes"],...tripSheets.map(t=>[t.date,t.driverName,t.origin,t.destination,t.miles,t.scheduledDeparture,t.actualDeparture,t.fuelAdded,(t.mailClasses||[]).join("|")])];
                  const csv=rows.map(r=>r.join(",")).join("\n");
                  const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="trip_sheets.csv";a.click();
                }} style={{...S.btn,marginBottom:16}}>Export CSV</button>
                {tripSheets.length===0&&<div style={{color:"#555",fontSize:12}}>No trip sheets logged yet.</div>}
                {tripSheets.map(t=>(
                  <div key={t.id} style={{...S.card,marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div><div style={{fontSize:12,color:"#e8e4d8"}}>{t.date} · {t.driverName}</div><div style={{fontSize:11,color:"#888"}}>{t.origin}→{t.destination} · {t.miles}mi</div></div>
                      <button className="hov" onClick={()=>setTripSheets(p=>p.filter(x=>x.id!==t.id))} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:"1px solid #ef444444",background:"transparent",color:"#ef4444",cursor:"pointer"}}>Delete</button>
                    </div>
                  </div>
                ))}
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
                {/* Federal Filings Tracker */}
                <div style={{background:"#0c0c14",border:"1px solid #1a1a2a",borderRadius:8,padding:"18px 22px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div>
                      <div style={{fontSize:10,color:"#3a3a6a",letterSpacing:"0.2em",textTransform:"uppercase"}}>Federal Recurring Filings</div>
                      <div style={{fontSize:10,color:"#2a2a4a",marginTop:3}}>Track completion dates, confirmation numbers, and notes for each filing</div>
                    </div>
                    {canEdit()&&<button className="hov" onClick={()=>setShowAddFiling(!showAddFiling)} style={{background:"transparent",border:"1px solid #2a2a5a",color:"#8888cc",padding:"5px 12px",fontSize:10,cursor:"pointer",borderRadius:4,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>{showAddFiling?"Cancel":"+ Custom Deadline"}</button>}
                  </div>

                  {/* Add custom filing form */}
                  {showAddFiling&&canEdit()&&(
                    <div style={{background:"#0f0f1a",border:"1px solid #2a2a4a",borderRadius:6,padding:"14px 16px",marginBottom:16}}>
                      <div style={{fontSize:9,color:"#4a4a8a",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>New Custom Deadline</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                        <div><label style={S.label}>Filing / Deadline Name *</label><input value={newFilingForm.name} onChange={e=>setNewFilingForm(p=>({...p,name:e.target.value}))} placeholder="e.g. State Fuel Tax, Business License" style={S.input}/></div>
                        <div><label style={S.label}>Due Date</label><input value={newFilingForm.dueDate} onChange={e=>setNewFilingForm(p=>({...p,dueDate:e.target.value}))} placeholder="e.g. Mar 15, Quarterly, Annual" style={S.input}/></div>
                        <div><label style={S.label}>Frequency</label>
                          <select value={newFilingForm.frequency} onChange={e=>setNewFilingForm(p=>({...p,frequency:e.target.value}))} style={S.input}>
                            {["Annual","Quarterly","Monthly","Biennial","Ongoing","One-time"].map(o=><option key={o}>{o}</option>)}
                          </select>
                        </div>
                        <div><label style={S.label}>Notes</label><input value={newFilingForm.notes} onChange={e=>setNewFilingForm(p=>({...p,notes:e.target.value}))} placeholder="What is this filing for?" style={S.input}/></div>
                      </div>
                      <button className="hov" onClick={()=>{
                        if(!newFilingForm.name) return;
                        setFilings(p=>[...p,{...newFilingForm,id:`custom-${Date.now()}`,federal:false,filedDate:"",confirmationNum:"",filedNotes:""}]);
                        setNewFilingForm({name:"",dueDate:"",frequency:"Annual",notes:"",filedDate:"",confirmationNum:"",filedNotes:""});
                        setShowAddFiling(false);
                      }} style={{...S.btn,background:"#6366f1",fontSize:11,padding:"7px 16px"}}>Add Deadline</button>
                    </div>
                  )}

                  {/* Filings list */}
                  <div style={{display:"flex",flexDirection:"column",gap:0}}>
                    {filings.map((filing,i)=>{
                      const isEditing = editFilingId===filing.id;
                      const isFiled = !!filing.filedDate;
                      const statusColor = isFiled?"#22c55e":"#f59e0b";
                      const statusLabel = isFiled?"Filed":"Pending";
                      return (
                        <div key={filing.id} style={{borderTop:i>0?"1px solid #14141e":"none",padding:"12px 0"}}>
                          {isEditing&&canEdit()?(
                            /* Edit form */
                            <div style={{background:"#0f0f1a",border:`1px solid ${accent}33`,borderRadius:6,padding:"14px 16px"}}>
                              <div style={{fontSize:9,color:"#4a4a8a",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Editing: {filing.name}</div>
                              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                                {!filing.federal&&<div><label style={S.label}>Filing Name</label><input value={editFilingForm.name||""} onChange={e=>setEditFilingForm(p=>({...p,name:e.target.value}))} style={S.input}/></div>}
                                {!filing.federal&&<div><label style={S.label}>Due Date</label><input value={editFilingForm.dueDate||""} onChange={e=>setEditFilingForm(p=>({...p,dueDate:e.target.value}))} style={S.input}/></div>}
                                <div><label style={S.label}>Last Filed Date</label><input type="date" value={editFilingForm.filedDate||""} onChange={e=>setEditFilingForm(p=>({...p,filedDate:e.target.value}))} style={S.input}/></div>
                                <div><label style={S.label}>Confirmation # / Reference</label><input value={editFilingForm.confirmationNum||""} onChange={e=>setEditFilingForm(p=>({...p,confirmationNum:e.target.value}))} placeholder="Confirmation or reference number" style={S.input}/></div>
                                <div style={{gridColumn:"1/-1"}}><label style={S.label}>Filing Notes</label><input value={editFilingForm.filedNotes||""} onChange={e=>setEditFilingForm(p=>({...p,filedNotes:e.target.value}))} placeholder="Who filed it, any issues, follow-up needed..." style={S.input}/></div>
                              </div>
                              <div style={{display:"flex",gap:8}}>
                                <button className="hov" onClick={()=>{
                                  setFilings(p=>p.map(f=>f.id===filing.id?{...f,...editFilingForm}:f));
                                  setEditFilingId(null);
                                }} style={{...S.btn,fontSize:11,padding:"7px 16px"}}>Save</button>
                                <button onClick={()=>setEditFilingId(null)} style={{...S.ghost,fontSize:10,padding:"7px 14px"}}>Cancel</button>
                                {!filing.federal&&<button onClick={()=>{setFilings(p=>p.filter(f=>f.id!==filing.id));setEditFilingId(null);}} style={{background:"transparent",border:"1px solid #3a1010",color:"#7a4040",padding:"7px 12px",fontSize:10,cursor:"pointer",borderRadius:4,fontFamily:"'DM Mono',monospace",marginLeft:"auto"}}>Delete</button>}
                              </div>
                            </div>
                          ):(
                            /* Display row */
                            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"start"}}>
                              <div style={{minWidth:0}}>
                                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                                  <div style={{fontSize:12,color:"#8888cc",fontWeight:600}}>{filing.name}</div>
                                  {!filing.federal&&<span style={{fontSize:8,color:"#6366f1",border:"1px solid #6366f133",padding:"1px 6px",borderRadius:2,letterSpacing:"0.1em"}}>CUSTOM</span>}
                                  <span style={{fontSize:9,color:statusColor,border:`1px solid ${statusColor}44`,padding:"1px 6px",borderRadius:2,letterSpacing:"0.08em",textTransform:"uppercase"}}>{statusLabel}</span>
                                </div>
                                <div style={{fontSize:10,color:"#3a3a5a",marginBottom:isFiled?4:0}}>{filing.notes}</div>
                                {isFiled&&(
                                  <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                                    <span style={{fontSize:10,color:"#22c55e"}}>✓ Filed: {new Date(filing.filedDate).toLocaleDateString()}</span>
                                    {filing.confirmationNum&&<span style={{fontSize:10,color:"#555"}}>Ref: {filing.confirmationNum}</span>}
                                    {filing.filedNotes&&<span style={{fontSize:10,color:"#555",fontStyle:"italic"}}>"{filing.filedNotes}"</span>}
                                  </div>
                                )}
                              </div>
                              <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                                <div style={{textAlign:"right"}}>
                                  <div style={{fontSize:13,color:"#6060aa",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,whiteSpace:"nowrap"}}>{filing.dueDate}</div>
                                  <div style={{fontSize:9,color:"#3a3a5a"}}>{filing.frequency}</div>
                                </div>
                                {canEdit()&&(
                                  <button onClick={()=>{setEditFilingId(filing.id);setEditFilingForm({...filing});}} style={{background:"transparent",border:`1px solid ${accent}33`,color:accent,cursor:"pointer",fontSize:9,padding:"3px 8px",borderRadius:3,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>
                                    {isFiled?"Update":"Mark Filed"}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!canEdit()&&(
                    <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #14141e",fontSize:10,color:"#2a2a4a",fontStyle:"italic"}}>Read only — Owner or Manager access required to edit filings</div>
                  )}
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
                      {[
                        ["name","Unit Name / # *","Unit 1, Truck 1"],
                        ["nickname","Nickname (optional)","Blue Box, Big Red"],
                        ["vin","VIN or Last 6 Digits","3ALACWDT..."],
                        ["year","Year","2019"],
                        ["make","Make & Model","International 4300"],
                        ["plate","Plate #",""],
                        ["dotInspection","DOT Inspection Expiry","date"],
                        ["registration","Registration Expiry","date"],
                        ["ifta","IFTA Renewal","date"],
                        ["irp","IRP Plate Renewal","date"],
        ["insuranceExpiry","Liability Insurance Expiry","date"],
                      ].map(([f,lbl,ph])=>(
                        <div key={f}><label style={S.label}>{lbl}</label><input type={ph==="date"?"date":"text"} value={vehicleForm[f]||""} onChange={e=>setVehicleForm(p=>({...p,[f]:e.target.value}))} placeholder={ph!=="date"?ph:""} style={S.input}/></div>
                      ))}
                    </div>
                    <button className="hov" onClick={()=>{ if(!vehicleForm.name){showValidation("Truck name is required");return;} setCompliance(p=>({...p,trucks:[...p.trucks,{...vehicleForm,id:Date.now()}]})); setVehicleForm({name:"",nickname:"",vin:"",year:"",make:"",plate:"",dotInspection:"",ifta:"",irp:"",registration:"",insuranceExpiry:""}); setShowAddVehicle(false); }} style={{...S.btn,marginTop:14}}>Save Vehicle</button>
                  </div>
                )}
                {compliance.trucks.length===0&&!showAddVehicle&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:32}}>No vehicles added yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {compliance.trucks.map(t=>(
                    <div key={t.id} style={S.card}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:"#e8e4d8"}}>{t.name}{t.nickname&&<span style={{color:accent,marginLeft:8,fontSize:14}}>"{t.nickname}"</span>}</div>
                          <div style={{fontSize:10,color:"#555"}}>{t.year} {t.make} {t.plate&&`· ${t.plate}`}{t.vin&&<span style={{color:"#444",marginLeft:6}}>· VIN: {t.vin}</span>}</div>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>openEdit("vehicle",t)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                          <button onClick={()=>setCompliance(p=>({...p,trucks:p.trucks.filter(x=>x.id!==t.id)}))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {[["DOT Inspection",t.dotInspection],["Registration",t.registration],["IFTA",t.ifta],["IRP Plates",t.irp],["Insurance",t.insuranceExpiry]].map(([lbl,date])=>{
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
                {aiError&&!aiLoading&&screen==="compliance"&&<div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010",color:"#f87171",fontSize:11,marginBottom:12}}>{aiError}</div>}
                {dotAnswer&&!aiLoading&&<div style={{background:"#110f00",border:"1px solid #2a2000",borderRadius:8,padding:"18px 22px",animation:"fadeUp 0.3s ease"}}><div style={{fontSize:9,color:"#5a4a00",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>DOT AI Answer</div><div style={{fontSize:12,color:"#c8c4a0",lineHeight:1.9,whiteSpace:"pre-wrap"}}>{dotAnswer}</div><div style={{marginTop:14,fontSize:10,color:"#3a3000",borderTop:"1px solid #2a1800",paddingTop:10}}>⚠ Informational only. Verify with your state DOT and a compliance professional.</div></div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ DRIVERS ════════════════════════════════════════════════════ */}
      {screen==="drivers"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[["list","All Drivers"],["scorecards","Scorecards"],["incidents","Incidents"],["onboarding","Onboarding"],["hos","HOS Log"],...((segment==="fedex")?[["coaching","Coaching Log"],["appearance","Appearance"]]:[])]  } active={subScreen||"list"} onSelect={setSubScreen}/>
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
                          <option value="per_mile">Per Mile</option><option value="per_stop">Per Stop</option><option value="per_day">Per Day</option><option value="percentage">% of Route</option><option value="hourly">Hourly</option><option value="salary">Salary</option>
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
                    <button className="hov" onClick={()=>{ if(!driverForm.name){showValidation("Driver name is required");return;} if(!driverForm.payRate){showValidation("Pay rate is required");return;} setDrivers(p=>[...p,{...driverForm,id:Date.now(),incidents:[],scores:[]}]); setDriverForm({name:"",route:"",payType:"per_mile",payRate:"",ytdPay:"",phone:"",hireDate:"",status:"active"}); setShowAddDriver(false); }} style={{...S.btn,background:"#60a5fa",marginTop:14}}>Save Driver</button>
                  </div>
                )}
                {drivers.length===0&&!showAddDriver&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No drivers added yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {drivers.map(d=>(
                    <div key={d.id} style={{...S.card,display:"flex",alignItems:"center",gap:16}}>
                      <div style={{width:36,height:36,background:d.status==="active"?"#22c55e22":"#ef444422",border:`1px solid ${d.status==="active"?"#22c55e44":"#ef444444"}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:d.status==="active"?"#22c55e":"#ef4444",flexShrink:0}}>{d.name.charAt(0)}</div>
                      <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8"}}>{d.name}</div><div style={{fontSize:10,color:"#555"}}>{d.route||"No route"} · {d.payType==="per_mile"?`$${d.payRate}/mi`:d.payType==="per_stop"?`$${d.payRate}/stop`:d.payType==="per_day"?`$${d.payRate}/day`:d.payType==="percentage"?`${d.payRate}% of route`:d.payType==="hourly"?`$${d.payRate}/hr`:`$${d.payRate}/yr`}</div></div>
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
                      const driver = drivers.find(d=>String(d.id)===String(incidentForm.driverId));
                      const inc = {...incidentForm, id:Date.now(), driverName:driver?.name||"Unknown", driverId:driver?.id||incidentForm.driverId};
                      setIncidents(p=>[inc,...p]);
                      if(driver) setDrivers(p=>p.map(d=>String(d.id)===String(incidentForm.driverId)?{...d,incidents:[...(d.incidents||[]),inc]}:d));
                      setIncidentForm({driverId:"",date:"",type:"delivery",description:"",severity:"minor"});
                      setShowAddIncident(null);
                    }} style={{...S.danger,marginTop:14}}>Save Incident</button>
                  </div>
                )}

                {/* Driver incident summary strip */}
                {drivers.length>0&&(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8,marginBottom:20}}>
                    {drivers.map(d=>{
                      const driverIncs = incidents.filter(i=>String(i.driverId)===String(d.id)||i.driverName===d.name);
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
                                const updatedDriver = drivers.find(d=>String(d.id)===String(editIncidentForm.driverId));
                                const updated = {...inc,...editIncidentForm, driverName:updatedDriver?.name||editIncidentForm.driverName||inc.driverName};
                                // Update in global incidents
                                setIncidents(p=>p.map(i=>i.id===inc.id?updated:i));
                                // Update in all driver incident arrays
                                setDrivers(p=>p.map(d=>({...d,incidents:(d.incidents||[]).map(i=>i.id===inc.id?updated:i)})));
                                // If driver changed, add to new driver's array if not already there
                                if(updatedDriver && String(updatedDriver.id)!==String(inc.driverId)) {
                                  setDrivers(p=>p.map(d=>String(d.id)===String(updatedDriver.id)?{...d,incidents:[...(d.incidents||[]).filter(i=>i.id!==updated.id),updated]}:d));
                                }
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

            {(subScreen==="onboarding"||subScreen==="hos")&&(()=>{
              const ONBOARDING_STEPS=[{id:"application",label:"Employment Application",req:true},{id:"background",label:"Background Check Ordered",req:true},{id:"background_clear",label:"Background Check — Cleared",req:true},{id:"pre_drug_test",label:"Pre-Employment Drug Test",req:true},{id:"drug_clear",label:"Drug Test — Negative Result",req:true},{id:"clearinghouse_query",label:"FMCSA Drug Clearinghouse Query",req:true},{id:"cdl_copy",label:"CDL Copy on File",req:true},{id:"medical_card",label:"Medical Card Copy on File",req:true},{id:"mvr",label:"MVR (Motor Vehicle Record) Pulled",req:true},{id:"driving_history_3yr",label:"3-Year Driving/Employment History Verified",req:true},{id:"orientation",label:"Orientation / Safety Training Completed",req:true},{id:"orientation_signed",label:"Orientation Sign-off Form Signed",req:true},{id:"i9",label:"I-9 Employment Eligibility",req:true},{id:"direct_deposit",label:"Direct Deposit / Pay Setup",req:false},{id:"uniform",label:"Uniform / Equipment Issued",req:false},{id:"eld_training",label:"ELD / HOS Training",req:false},{id:"handbook",label:"Company Handbook Acknowledged",req:false}];
              const toggleStep=(driverId,stepId)=>setDrivers(prev=>prev.map(d=>{if(String(d.id)!==String(driverId))return d;const checklist=d.onboarding||{};return{...d,onboarding:{...checklist,[stepId]:checklist[stepId]?null:new Date().toISOString().slice(0,10)}};}));
              const weeklyHOS=(driverId)=>{const now=new Date();const weekAgo=new Date(now-7*86400000);return hosLog.filter(h=>String(h.driverId)===String(driverId)&&new Date(h.date)>=weekAgo).reduce((s,h)=>({driving:s.driving+parseFloat(h.hoursDriving||0),onDuty:s.onDuty+parseFloat(h.hoursOnDuty||0)}),{driving:0,onDuty:0});};
              const selDriver=drivers.find(d=>String(d.id)===String(selectedOnboardDriver));
              return(
              <div style={{maxWidth:800,margin:"0 auto",padding:24,animation:"fadeUp 0.3s ease"}}>
                {subScreen==="onboarding"&&(
                  <>
                    <div style={{...S.section,marginBottom:4}}>DRIVER ONBOARDING</div>
                    <p style={{fontSize:11,color:"#555",marginBottom:20,lineHeight:1.8}}>Track every required step when hiring a new driver. DOT requires most of these before the first day behind the wheel.</p>
                    <div style={{marginBottom:16}}><label style={S.label}>Select Driver</label><select value={selectedOnboardDriver} onChange={e=>setSelectedOnboardDriver(e.target.value)} style={{...S.input,maxWidth:320}}><option value="">Choose a driver...</option>{drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                    {selDriver&&(()=>{
                      const checklist=selDriver.onboarding||{};
                      const required=ONBOARDING_STEPS.filter(s=>s.req);
                      const completed=ONBOARDING_STEPS.filter(s=>checklist[s.id]).length;
                      const pct=Math.round((completed/ONBOARDING_STEPS.length)*100);
                      const readyToDrive=required.every(s=>checklist[s.id]);
                      const OnboardDetail = () => (
                        <>
                        <div style={{...S.card,marginBottom:16,display:"flex",alignItems:"center",gap:16}}>
                          <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#e8e4d8"}}>{selDriver.name}</div><div style={{fontSize:11,color:"#555"}}>Hired: {fmtDate(selDriver.hireDate)||"Not set"}</div></div>
                          <div style={{textAlign:"center"}}><div style={{fontSize:32,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,color:pct===100?"#22c55e":pct>60?"#f59e0b":"#ef4444"}}>{pct}%</div><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Complete</div></div>
                          <div style={{background:readyToDrive?"#051a05":"#1a0808",border:`1px solid ${readyToDrive?"#22c55e44":"#ef444444"}`,borderRadius:6,padding:"8px 16px",textAlign:"center"}}><div style={{fontSize:12,color:readyToDrive?"#22c55e":"#ef4444",fontWeight:700}}>{readyToDrive?"✓ DOT Ready":"⚠ Not Ready"}</div><div style={{fontSize:9,color:"#555"}}>Required items</div></div>
                        </div>
                        <div style={{fontSize:10,color:"#ef4444",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Required (DOT)</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
                          {required.map(step=>(
                            <div key={step.id} onClick={()=>toggleStep(selDriver.id,step.id)} style={{...S.card,display:"flex",alignItems:"center",gap:12,cursor:"pointer",borderLeft:`3px solid ${checklist[step.id]?"#22c55e":"#ef4444"}`,background:checklist[step.id]?"#0a150a":"#141414"}}>
                              <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${checklist[step.id]?"#22c55e":"#444"}`,background:checklist[step.id]?"#22c55e22":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,color:"#22c55e"}}>{checklist[step.id]?"✓":""}</div>
                              <div style={{flex:1,fontSize:12,color:checklist[step.id]?"#888":"#c8c4bc"}}>{step.label}</div>
                              {checklist[step.id]&&<div style={{fontSize:10,color:"#22c55e55"}}>{checklist[step.id]}</div>}
                            </div>
                          ))}
                        </div>
                        <div style={{fontSize:10,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Optional / Company Policy</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          {ONBOARDING_STEPS.filter(s=>!s.req).map(step=>(
                            <div key={step.id} onClick={()=>toggleStep(selDriver.id,step.id)} style={{...S.card,display:"flex",alignItems:"center",gap:12,cursor:"pointer",borderLeft:`3px solid ${checklist[step.id]?"#22c55e":"#333"}`,opacity:checklist[step.id]?0.7:1}}>
                              <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${checklist[step.id]?"#22c55e":"#333"}`,background:checklist[step.id]?"#22c55e22":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,color:"#22c55e"}}>{checklist[step.id]?"✓":""}</div>
                              <div style={{flex:1,fontSize:12,color:"#888"}}>{step.label}</div>
                            </div>
                          ))}
                        </div>
                        </>
                      );
                      return <OnboardDetail/>;
                    })()}
                    {!selDriver&&selectedOnboardDriver&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>Driver not found.</div>}
                    {drivers.length===0&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>Add drivers in the All Drivers tab first.</div>}
                  </>
                )}
                {subScreen==="hos"&&(
                  <>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                      <div><div style={S.section}>HOURS OF SERVICE</div><div style={{fontSize:11,color:"#555",marginTop:4}}>Federal limit: 11 hrs driving, 14 hrs on-duty per day. Keep 6 months minimum.</div></div>
                      <button className="hov" onClick={()=>setHosShowAdd(!hosShowAdd)} style={S.btn}>{hosShowAdd?"Cancel":"+ Log Hours"}</button>
                    </div>
                    {drivers.filter(d=>d.status==="active").length>0&&(
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:20}}>
                        {drivers.filter(d=>d.status==="active").map(d=>{const week=weeklyHOS(d.id);const over=week.driving>60;return(
                          <div key={d.id} style={{...S.card,borderTop:`3px solid ${over?"#ef4444":week.driving>50?"#f59e0b":"#22c55e"}`}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8",marginBottom:8}}>{d.name}</div>
                            <div style={{fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:over?"#ef4444":"#e8e4d8"}}>{week.driving.toFixed(1)} hrs</div>
                            <div style={{fontSize:9,color:"#555"}}>driving · {week.onDuty.toFixed(1)} on-duty this week</div>
                            <div style={{marginTop:8,height:4,background:"#1e1e1e",borderRadius:2}}><div style={{height:"100%",width:`${Math.min((week.driving/60)*100,100)}%`,background:over?"#ef4444":week.driving>50?"#f59e0b":"#22c55e",borderRadius:2}}/></div>
                            <div style={{fontSize:9,color:"#555",marginTop:3}}>{Math.max(0,60-week.driving).toFixed(1)} hrs remaining (60hr limit)</div>
                          </div>
                        );})}
                      </div>
                    )}
                    {hosShowAdd&&(<div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                        <div><label style={S.label}>Driver *</label><select value={hosForm.driverId} onChange={e=>setHosForm(p=>({...p,driverId:e.target.value}))} style={S.input}><option value="">Select driver...</option>{drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                        <div><label style={S.label}>Date *</label><input type="date" value={hosForm.date} onChange={e=>setHosForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Hours Driving (max 11)</label><input type="number" step="0.5" max="11" value={hosForm.hoursDriving} onChange={e=>setHosForm(p=>({...p,hoursDriving:e.target.value}))} placeholder="11" style={S.input}/></div>
                        <div><label style={S.label}>Hours On-Duty (max 14)</label><input type="number" step="0.5" max="14" value={hosForm.hoursOnDuty} onChange={e=>setHosForm(p=>({...p,hoursOnDuty:e.target.value}))} placeholder="14" style={S.input}/></div>
                        <div><label style={S.label}>Hours Off-Duty</label><input type="number" step="0.5" value={hosForm.hoursOffDuty} onChange={e=>setHosForm(p=>({...p,hoursOffDuty:e.target.value}))} placeholder="10 min required" style={S.input}/></div>
                        <div><label style={S.label}>Miles Driven</label><input type="number" value={hosForm.miles} onChange={e=>setHosForm(p=>({...p,miles:e.target.value}))} placeholder="0" style={S.input}/></div>
                        <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={hosForm.notes} onChange={e=>setHosForm(p=>({...p,notes:e.target.value}))} placeholder="Breakdown, delay, inspection..." style={S.input}/></div>
                      </div>
                      <button className="hov" onClick={()=>{if(!hosForm.driverId||!hosForm.date)return;const drv=drivers.find(d=>String(d.id)===String(hosForm.driverId));setHosLog(p=>[{...hosForm,id:Date.now(),driverName:drv?.name||"Unknown"},...p]);setHosForm(prev=>({...prev,date:"",hoursOnDuty:"",hoursDriving:"",hoursOffDuty:"",miles:"",notes:""}));setHosShowAdd(false);}} style={{...S.btn,marginTop:14}}>Save HOS Log</button>
                    </div>)}
                    {hosLog.length===0&&!hosShowAdd&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No HOS records yet. Log driver hours daily to stay DOT compliant (6-month retention required).</div>}
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {[...hosLog].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(h=>{const dOver=parseFloat(h.hoursDriving||0)>11;const oOver=parseFloat(h.hoursOnDuty||0)>14;const viol=dOver||oOver;return(
                        <div key={h.id} style={{...S.card,display:"flex",alignItems:"center",gap:14,borderLeft:`3px solid ${viol?"#ef4444":"#22c55e"}`}}>
                          <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{h.driverName} — {h.date}</div><div style={{fontSize:10,color:"#555"}}>Driving: <span style={{color:dOver?"#ef4444":"#888"}}>{h.hoursDriving||0}h</span> · On-duty: <span style={{color:oOver?"#ef4444":"#888"}}>{h.hoursOnDuty||0}h</span> · Off: {h.hoursOffDuty||0}h{h.miles?` · ${h.miles} mi`:""}{h.notes?` · ${h.notes}`:""}</div>{viol&&<div style={{fontSize:10,color:"#ef4444",marginTop:3}}>⚠ HOS Violation: {dOver?"Driving >11hr":"On-duty >14hr"}</div>}</div>
                          <button onClick={()=>setHosLog(p=>p.filter(x=>x.id!==h.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      );})}
                    </div>
                  </>
                )}
              </div>
              );
            })()}

            {/* ── D3: HOS warning banner ── */}
            {subScreen==="hos"&&(segment==="fedex"||segment==="amazon")&&false&&null}

            {/* ── D1: Coaching Log ── */}
            {subScreen==="coaching"&&segment==="fedex"&&(
              <div style={{maxWidth:800,margin:"0 auto",padding:24,animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8"}}>Driver Coaching Log</div>
                  <button className="hov" onClick={()=>setShowCoachingAdd(p=>!p)} style={S.btn}>+ Add Entry</button>
                </div>
                {showCoachingAdd&&<div style={{...S.card,marginBottom:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>New Coaching Entry</div>
                  <input type="date" value={coachingForm.date} onChange={e=>setCoachingForm(p=>({...p,date:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <select value={coachingForm.driverId} onChange={e=>setCoachingForm(p=>({...p,driverId:e.target.value}))} style={{...S.input,marginBottom:8}}>
                    <option value="">Select Driver</option>
                    {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <select value={coachingForm.issueType} onChange={e=>setCoachingForm(p=>({...p,issueType:e.target.value}))} style={{...S.input,marginBottom:8}}>
                    {["Harsh Braking","Speeding","Seatbelt","Missed Stop","Late Scan","Appearance","Other"].map(t=><option key={t}>{t}</option>)}
                  </select>
                  <textarea placeholder="Description" value={coachingForm.description} onChange={e=>setCoachingForm(p=>({...p,description:e.target.value}))} style={{...S.input,marginBottom:8,minHeight:60}}/>
                  <textarea placeholder="Action Taken" value={coachingForm.actionTaken} onChange={e=>setCoachingForm(p=>({...p,actionTaken:e.target.value}))} style={{...S.input,marginBottom:8,minHeight:60}}/>
                  <input type="date" placeholder="Follow-up Date" value={coachingForm.followUpDate} onChange={e=>setCoachingForm(p=>({...p,followUpDate:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <input placeholder="Outcome" value={coachingForm.outcome} onChange={e=>setCoachingForm(p=>({...p,outcome:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <label style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#888",marginBottom:10}}>
                    <input type="checkbox" checked={coachingForm.followUpComplete} onChange={e=>setCoachingForm(p=>({...p,followUpComplete:e.target.checked}))}/> Follow-up Complete
                  </label>
                  <button className="hov" onClick={()=>{
                    const drv=drivers.find(d=>d.id===coachingForm.driverId);
                    setCoachingLog(p=>[{id:Date.now(),driverName:drv?.name||"",...coachingForm},...p]);
                    setCoachingForm({date:"",driverId:"",issueType:"Harsh Braking",description:"",actionTaken:"",followUpDate:"",followUpComplete:false,outcome:""});
                    setShowCoachingAdd(false);
                  }} style={S.btn}>Save Entry</button>
                </div>}
                <div style={{fontSize:12,fontWeight:700,color:accent,marginBottom:8}}>Open ({coachingLog.filter(c=>!c.followUpComplete).length})</div>
                {coachingLog.filter(c=>!c.followUpComplete).length===0&&<div style={{color:"#555",fontSize:12,marginBottom:16}}>No open coaching entries.</div>}
                {coachingLog.filter(c=>!c.followUpComplete).map(c=>{
                  const overdue=c.followUpDate&&new Date(c.followUpDate)<new Date();
                  return <div key={c.id} style={{...S.card,marginBottom:8,border:overdue?"1px solid #ef444455":""}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:"#e8e4d8"}}>{c.driverName} — {c.issueType}</div>
                        <div style={{fontSize:11,color:"#888"}}>{c.date} · Follow-up: {c.followUpDate||"—"}{overdue&&<span style={{color:"#ef4444",marginLeft:4}}>⚠ OVERDUE</span>}</div>
                        <div style={{fontSize:11,color:"#888",marginTop:4}}>{c.description}</div>
                      </div>
                      <button className="hov" onClick={()=>setCoachingLog(p=>p.map(x=>x.id===c.id?{...x,followUpComplete:true}:x))} style={{fontSize:10,padding:"3px 10px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer"}}>Complete</button>
                    </div>
                  </div>;
                })}
                {coachingLog.filter(c=>c.followUpComplete).length>0&&<>
                  <div style={{fontSize:12,fontWeight:700,color:"#555",marginBottom:8,marginTop:16}}>Completed ({coachingLog.filter(c=>c.followUpComplete).length})</div>
                  {coachingLog.filter(c=>c.followUpComplete).map(c=>(
                    <div key={c.id} style={{...S.card,marginBottom:6,opacity:0.7}}>
                      <div style={{fontSize:12,color:"#e8e4d8"}}>{c.driverName} — {c.issueType} <span style={{fontSize:10,color:"#22c55e"}}>✓ Complete</span></div>
                      <div style={{fontSize:11,color:"#888"}}>{c.date} · {c.outcome||"No outcome noted"}</div>
                    </div>
                  ))}
                </>}
              </div>
            )}

            {/* ── D2: Appearance Tracker ── */}
            {subScreen==="appearance"&&segment==="fedex"&&(
              <div style={{maxWidth:800,margin:"0 auto",padding:24,animation:"fadeUp 0.3s ease"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>Vehicle Appearance Tracker</div>
                <div style={{...S.card,marginBottom:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>Weekly Inspection</div>
                  <select value={appearVehicle} onChange={e=>setAppearVehicle(e.target.value)} style={{...S.input,marginBottom:8}}>
                    <option value="">Select Truck</option>
                    {(compliance.trucks||[]).map((t,i)=><option key={i} value={t.name||t.truckName}>{t.name||t.truckName||"Truck "+(i+1)}</option>)}
                  </select>
                  <input type="date" value={appearDate} onChange={e=>setAppearDate(e.target.value)} style={{...S.input,marginBottom:8}}/>
                  {[["decals","FedEx decals intact and clean"],["noStickers","No unauthorized stickers/markings"],["exterior","Exterior clean"],["cab","Cab interior clean"],["uniform","Driver uniform compliance"],["noUnreportedDamage","No unreported visible damage"],["cargo","Cargo area clean"]].map(([key,label])=>(
                    <label key={key} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#e8e4d8",marginBottom:6}}>
                      <input type="checkbox" checked={appearItems[key]||false} onChange={e=>setAppearItems(p=>({...p,[key]:e.target.checked}))}/>
                      {label}
                    </label>
                  ))}
                  <button className="hov" style={{...S.btn,marginTop:8}} onClick={()=>{
                    if(!appearVehicle||!appearDate)return;
                    const passCount=Object.values(appearItems).filter(Boolean).length;
                    setAppearanceLog(p=>[{id:Date.now(),vehicle:appearVehicle,date:appearDate,items:{...appearItems},passCount,totalItems:7},...p]);
                    setAppearItems({decals:false,noStickers:false,exterior:false,cab:false,uniform:false,noUnreportedDamage:false,cargo:false});
                  }}>Save Inspection</button>
                </div>
                {(compliance.trucks||[]).filter(t=>{
                  const name=t.name||t.truckName;
                  const recent=appearanceLog.filter(a=>a.vehicle===name).sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
                  return !recent||((Date.now()-new Date(recent.date).getTime())>7*24*3600*1000);
                }).map((t,i)=><div key={i} style={{...S.card,marginBottom:8,background:"#1a1005",border:"1px solid #f59e0b44",color:"#f59e0b",fontSize:11}}>⚠ {t.name||t.truckName} — no appearance check in 7+ days</div>)}
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:8,marginTop:8}}>Inspection History</div>
                {appearanceLog.length===0&&<div style={{color:"#555",fontSize:12}}>No inspections logged yet.</div>}
                {appearanceLog.slice(0,20).map(a=>(
                  <div key={a.id} style={{...S.card,marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:13,color:"#e8e4d8"}}>{a.vehicle} · {a.date}</div>
                        <div style={{fontSize:11,color:"#888"}}>{a.passCount}/{a.totalItems} items passed</div>
                      </div>
                      <span style={{fontSize:11,padding:"2px 8px",borderRadius:3,background:a.passCount===a.totalItems?"#22c55e33":"#ef444433",color:a.passCount===a.totalItems?"#22c55e":"#ef4444"}}>{a.passCount===a.totalItems?"PASS":"FAIL"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

      {/* ══ FLEET / MAINTENANCE ════════════════════════════════════════ */}
      {screen==="fleet"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[["log","Maintenance Log"],["schedule","Upcoming Service"],["fuel","Fuel Log"],["odometer","Odometer / Miles"],["tires","Tires"],...(segment==="amazon"?[["vaninspect","Van Inspection"]]:segment==="otr"?[["fuelcard","Fuel Card"]]:[])]  } active={subScreen||"log"} onSelect={setSubScreen}/>
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
                        <select value={maintForm.truckName} onChange={e=>{setMaintForm(p=>({...p,truckName:e.target.value}));if(e.target.value!=="__other__")setMaintCustomVehicle("");}} style={S.input}>
                          <option value="">Select vehicle...</option>
                          {compliance.trucks.map(t=>(
                            <option key={t.id} value={t.name}>
                              {t.name}{t.nickname?` "${t.nickname}"`:""}
                              {t.vin?` · VIN:${t.vin.slice(-6)}`:""}
                              {t.year?` · ${t.year}`:""}
                              {t.make?` ${t.make}`:""}
                            </option>
                          ))}
                          <option value="__other__">+ Enter custom vehicle name / VIN</option>
                        </select>
                        {maintForm.truckName==="__other__"&&(
                          <input
                            value={maintCustomVehicle}
                            onChange={e=>setMaintCustomVehicle(e.target.value)}
                            placeholder="Type vehicle name, nickname, or VIN..."
                            style={{...S.input,marginTop:6}}
                            autoFocus
                          />
                        )}
                        {compliance.trucks.length===0&&(
                          <div style={{fontSize:9,color:"#555",marginTop:5}}>No vehicles in Compliance yet — you can enter a custom name above, or <span style={{color:accent,cursor:"pointer"}} onClick={()=>{setScreen("compliance");setSubScreen("vehicles");}}>add vehicles to Compliance first</span>.</div>
                        )}
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
                    <button className="hov" onClick={()=>{
                      const vehicleName = maintForm.truckName==="__other__" ? maintCustomVehicle.trim() : maintForm.truckName;
                      if(!vehicleName||!maintForm.type) return;
                      const mEntry={...maintForm,truckName:vehicleName,id:Date.now()};
                      setMaintenance(p=>[mEntry,...p]);
                      if(parseFloat(mEntry.cost||0)>0){setExpenses(p=>[{id:Date.now()+1,date:mEntry.date,category:"maintenance",amount:mEntry.cost,description:`Maintenance — ${vehicleName||mEntry.truckName||""}${mEntry.type?" · "+mEntry.type:""}`,vehicle:vehicleName||mEntry.truckName,source:"maintenance_log"},...p]);}
                      setMaintForm({truckName:"",type:"",date:"",mileage:"",cost:"",notes:"",nextDueMiles:""});
                      setMaintCustomVehicle("");
                      setShowAddMaint(false);
                    }} style={{...S.btn,marginTop:14}}>Save Record</button>
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
            {subScreen==="fuel"&&(
              <div style={{flex:1,overflowY:"auto",padding:24}}>
                <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                    <div><div style={S.section}>FUEL LOG</div><div style={{fontSize:11,color:"#555",marginTop:4}}>Track every fill-up per truck. IFTA-ready state breakdown.</div></div>
                    <button className="hov" onClick={()=>setFuelShowAdd(!fuelShowAdd)} style={S.btn}>{fuelShowAdd?"Cancel":"+ Log Fuel"}</button>
                  </div>
                  {(()=>{const totalGal=fuelLog.reduce((s,r)=>s+parseFloat(r.gallons||0),0);const totalCost=fuelLog.reduce((s,r)=>s+parseFloat(r.totalCost||0),0);return(
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                      {[["Total Gallons",totalGal.toFixed(0)+" gal","#60a5fa"],["Total Fuel Cost",fmt$(totalCost),"#ef4444"],["Avg $/Gal",totalGal>0?fmt$(totalCost/totalGal):"$0.00",accent]].map(([lbl,val,col])=>(
                        <div key={lbl} style={S.card}><div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:col}}>{val}</div><div style={{fontSize:9,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:4}}>{lbl}</div></div>
                      ))}
                    </div>
                  );})()}
                  {fuelShowAdd&&(
                    <div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                        <div><label style={S.label}>Truck *</label><select value={fuelForm.truckName} onChange={e=>setFuelForm(p=>({...p,truckName:e.target.value}))} style={S.input}><option value="">Select...</option>{compliance.trucks.map(v=><option key={v.id} value={v.name}>{v.name}{v.nickname?` "${v.nickname}"`:""}  </option>)}<option value="__other__">+ Enter manually</option></select>{fuelForm.truckName==="__other__"&&<input value={fuelForm._customTruck||""} onChange={e=>setFuelForm(p=>({...p,_customTruck:e.target.value}))} placeholder="Truck name/unit #" style={{...S.input,marginTop:6}}/>}</div>
                        <div><label style={S.label}>Date *</label><input type="date" value={fuelForm.date} onChange={e=>setFuelForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Gallons *</label><input type="number" value={fuelForm.gallons} onChange={e=>{const g=e.target.value;const total=(parseFloat(g||0)*parseFloat(fuelForm.pricePerGallon||0)).toFixed(2);setFuelForm(p=>({...p,gallons:g,totalCost:total>0?total:p.totalCost}));}} placeholder="100" style={S.input}/></div>
                        <div><label style={S.label}>Price / Gallon ($)</label><input type="number" step="0.001" value={fuelForm.pricePerGallon} onChange={e=>{const p2=e.target.value;const total=(parseFloat(fuelForm.gallons||0)*parseFloat(p2||0)).toFixed(2);setFuelForm(p=>({...p,pricePerGallon:p2,totalCost:total>0?total:p.totalCost}));}} placeholder="3.85" style={S.input}/></div>
                        <div><label style={S.label}>Total Cost ($)</label><input type="number" value={fuelForm.totalCost} onChange={e=>setFuelForm(p=>({...p,totalCost:e.target.value}))} placeholder="385.00" style={S.input}/></div>
                        <div><label style={S.label}>Odometer (miles)</label><input type="number" value={fuelForm.odometer} onChange={e=>setFuelForm(p=>({...p,odometer:e.target.value}))} placeholder="142500" style={S.input}/></div>
                        <div><label style={S.label}>State (IFTA)</label><input value={fuelForm.state} onChange={e=>setFuelForm(p=>({...p,state:e.target.value.toUpperCase()}))} placeholder="SC" maxLength={2} style={S.input}/></div>
                        <div><label style={S.label}>Card Type</label><select value={fuelForm.cardType} onChange={e=>setFuelForm(p=>({...p,cardType:e.target.value}))} style={S.input}>{["company","EFS / Comcheck","Comdata","Relay","Cash","Other"].map(t=><option key={t} value={t.toLowerCase().replace(/ /g,"_")}>{t}</option>)}</select></div>
                        <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes (truck stop, DEF added, etc.)</label><input value={fuelForm.notes} onChange={e=>setFuelForm(p=>({...p,notes:e.target.value}))} style={S.input}/></div>
                      </div>
                      <button className="hov" onClick={()=>{const name=fuelForm.truckName==="__other__"?(fuelForm._customTruck||""):fuelForm.truckName;if(!name||!fuelForm.gallons||!fuelForm.date)return;const fuelEntry={...fuelForm,truckName:name,id:Date.now()};
                    setFuelLog(p=>[fuelEntry,...p]);
                    // Auto-sync to expenses
                    if(fuelEntry.totalCost){setExpenses(p=>[{id:Date.now()+1,date:fuelEntry.date,category:"fuel",amount:fuelEntry.totalCost,description:`Fuel — ${name}${fuelEntry.gallons?` (${fuelEntry.gallons} gal)`:""}${fuelEntry.state?` · ${fuelEntry.state}`:""}`,vehicle:name,source:"fuel_log"},...p]);}
                    setFuelForm({truckName:"",date:"",gallons:"",pricePerGallon:"",totalCost:"",odometer:"",state:"",cardType:"company",notes:""});setFuelShowAdd(false);}} style={{...S.btn,marginTop:14}}>Save Fuel Entry</button>
                    </div>
                  )}
                  {fuelLog.length===0&&!fuelShowAdd&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No fuel entries yet.</div>}
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {fuelLog.map(r=>(<div key={r.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{r.truckName} — {r.gallons} gal{r.state?` · ${r.state}`:""}</div><div style={{fontSize:10,color:"#555"}}>{fmtDate(r.date)} · {r.cardType}{r.odometer?` · ${parseInt(r.odometer).toLocaleString()} mi`:""}{r.notes?` · ${r.notes}`:""}</div></div>
                      <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#ef4444"}}>{fmt$(parseFloat(r.totalCost||0))}</div>{r.pricePerGallon&&<div style={{fontSize:9,color:"#555"}}>${parseFloat(r.pricePerGallon).toFixed(3)}/gal</div>}</div>
                      <button onClick={()=>setFuelLog(p=>p.filter(x=>x.id!==r.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                    </div>))}
                  </div>
                </div>
              </div>
            )}
            {subScreen==="odometer"&&(
              <div style={{flex:1,overflowY:"auto",padding:24}}>
                <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                    <div><div style={S.section}>ODOMETER LOG</div><div style={{fontSize:11,color:"#555",marginTop:4}}>Log readings to track real miles per truck. Pairs with fuel log for IFTA.</div></div>
                    <button className="hov" onClick={()=>setOdomShowAdd(!odomShowAdd)} style={S.btn}>{odomShowAdd?"Cancel":"+ Log Reading"}</button>
                  </div>
                  {odomShowAdd&&(<div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Truck *</label><select value={odomForm.truckName} onChange={e=>setOdomForm(p=>({...p,truckName:e.target.value}))} style={S.input}><option value="">Select...</option>{compliance.trucks.map(v=><option key={v.id} value={v.name}>{v.name}{v.nickname?` "${v.nickname}"`:""}</option>)}</select></div>
                      <div><label style={S.label}>Date *</label><input type="date" value={odomForm.date} onChange={e=>setOdomForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Odometer Reading (miles) *</label><input type="number" value={odomForm.reading} onChange={e=>setOdomForm(p=>({...p,reading:e.target.value}))} placeholder="142500" style={S.input}/></div>
                      <div><label style={S.label}>State (IFTA miles)</label><input value={odomForm.state} onChange={e=>setOdomForm(p=>({...p,state:e.target.value.toUpperCase()}))} placeholder="SC" maxLength={2} style={S.input}/></div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={odomForm.notes} onChange={e=>setOdomForm(p=>({...p,notes:e.target.value}))} placeholder="Start of week, end of week, etc." style={S.input}/></div>
                    </div>
                    <button className="hov" onClick={()=>{if(!odomForm.truckName||!odomForm.reading)return;setOdometer(p=>[{...odomForm,id:Date.now()},...p]);setOdomForm(prev=>({...prev,date:"",reading:"",state:"",notes:""}));setOdomShowAdd(false);}} style={{...S.btn,marginTop:14}}>Save Reading</button>
                  </div>)}
                  {(()=>{
                    const byTruck={};
                    odometer.forEach(r=>{if(!byTruck[r.truckName])byTruck[r.truckName]=[];byTruck[r.truckName].push(r);});
                    Object.values(byTruck).forEach(arr=>{arr.sort((a,b)=>new Date(a.date)-new Date(b.date));});
                    if(Object.keys(byTruck).length>0) return(
                      <div style={{marginBottom:20}}>
                        <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:12}}>Mileage Summary</div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                          {Object.entries(byTruck).map(([truck,arr])=>{const total=arr.length>=2?parseInt(arr[arr.length-1].reading||0)-parseInt(arr[0].reading||0):0;return(
                            <div key={truck} style={S.card}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8",marginBottom:6}}>{truck}</div><div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:accent}}>{total.toLocaleString()} mi</div><div style={{fontSize:9,color:"#555",marginTop:3}}>Latest: {parseInt(arr[arr.length-1]?.reading||0).toLocaleString()}</div></div>
                          );})}
                        </div>
                      </div>
                    );
                  })()}
                  {odometer.length===0&&!odomShowAdd&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No odometer readings yet. Log start and end of week to track mileage.</div>}
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {[...odometer].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(r=>(<div key={r.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{r.truckName}{r.state?` — ${r.state}`:""}</div><div style={{fontSize:10,color:"#555"}}>{fmtDate(r.date)}{r.notes?` · ${r.notes}`:""}</div></div>
                      <div style={{fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:accent,flexShrink:0}}>{parseInt(r.reading||0).toLocaleString()} mi</div>
                      <button onClick={()=>setOdometer(p=>p.filter(x=>x.id!==r.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                    </div>))}
                  </div>
                </div>
              </div>
            )}
            {subScreen==="tires"&&(
              <div style={{flex:1,overflowY:"auto",padding:24}}>
                <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                    <div><div style={S.section}>TIRE MANAGEMENT</div><div style={{fontSize:11,color:"#555",marginTop:4}}>Track tires by position, tread depth, and replacement cost.</div></div>
                    <button className="hov" onClick={()=>setTireShowAdd(!tireShowAdd)} style={S.btn}>{tireShowAdd?"Cancel":"+ Add Tire Record"}</button>
                  </div>
                  {(()=>{const totalSpent=tires.reduce((s,t)=>s+parseFloat(t.cost||0),0);const active=tires.filter(t=>t.status==="active").length;return(
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                      {[["Active Tires",active.toString(),accent],["Total Records",tires.length.toString(),"#888"],["Total Invested",fmt$(totalSpent),"#ef4444"]].map(([lbl,val,col])=>(
                        <div key={lbl} style={S.card}><div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:col}}>{val}</div><div style={{fontSize:9,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:4}}>{lbl}</div></div>
                      ))}
                    </div>
                  );})()}
                  {tireShowAdd&&(<div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Truck *</label><select value={tireForm.truckName} onChange={e=>setTireForm(p=>({...p,truckName:e.target.value}))} style={S.input}><option value="">Select...</option>{compliance.trucks.map(v=><option key={v.id} value={v.name}>{v.name}</option>)}<option value="__other__">+ Enter manually</option></select>{tireForm.truckName==="__other__"&&<input value={tireForm._customTruck||""} onChange={e=>setTireForm(p=>({...p,_customTruck:e.target.value}))} placeholder="Truck name/unit #" style={{...S.input,marginTop:6}}/>}</div>
                      <div><label style={S.label}>Position *</label><select value={tireForm.position} onChange={e=>setTireForm(p=>({...p,position:e.target.value}))} style={S.input}><option value="">Select position...</option><option value="All Positions">All Positions (Full Set)</option>{["Front Left (Steer)","Front Right (Steer)","Rear Left Inner (Drive)","Rear Left Outer (Drive)","Rear Right Inner (Drive)","Rear Right Outer (Drive)","Spare","Trailer Left Front","Trailer Right Front","Trailer Left Rear","Trailer Right Rear"].map(pos=><option key={pos} value={pos}>{pos}</option>)}</select></div>
                      <div><label style={S.label}>Date Installed</label><input type="date" value={tireForm.date} onChange={e=>setTireForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Brand / Model</label><input value={tireForm.brand} onChange={e=>setTireForm(p=>({...p,brand:e.target.value}))} placeholder="Michelin XDN2, Bridgestone..." style={S.input}/></div>
                      <div><label style={S.label}>Size</label><input value={tireForm.size} onChange={e=>setTireForm(p=>({...p,size:e.target.value}))} placeholder="11R22.5" style={S.input}/></div>
                      <div><label style={S.label}>Tread Depth (32nds)</label><input type="number" value={tireForm.treadDepth} onChange={e=>setTireForm(p=>({...p,treadDepth:e.target.value}))} placeholder="New=32, Min=4" style={S.input}/></div>
                      <div><label style={S.label}>Cost ($)</label><input type="number" value={tireForm.cost} onChange={e=>setTireForm(p=>({...p,cost:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                      <div><label style={S.label}>Mileage at Install</label><input type="number" value={tireForm.mileageInstalled} onChange={e=>setTireForm(p=>({...p,mileageInstalled:e.target.value}))} placeholder="142500" style={S.input}/></div>
                      <div><label style={S.label}>Status</label><select value={tireForm.status} onChange={e=>setTireForm(p=>({...p,status:e.target.value}))} style={S.input}><option value="active">Active / Installed</option><option value="replaced">Replaced</option><option value="scrap">Scrap</option></select></div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={tireForm.notes} onChange={e=>setTireForm(p=>({...p,notes:e.target.value}))} placeholder="Vendor, warranty info..." style={S.input}/></div>
                    </div>
                    <button className="hov" onClick={()=>{const name=tireForm.truckName==="__other__"?(tireForm._customTruck||""):tireForm.truckName;if(!name||!tireForm.position)return;setTires(p=>[{...tireForm,truckName:name,id:Date.now()},...p]);setTireForm({truckName:"",date:"",position:"",brand:"",size:"",treadDepth:"",cost:"",mileageInstalled:"",status:"active",notes:""});setTireShowAdd(false);}} style={{...S.btn,marginTop:14}}>Save Tire Record</button>
                  </div>)}
                  {tires.length===0&&!tireShowAdd&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No tire records yet.</div>}
                  {(()=>{const byTruck={};tires.filter(t=>t.status==="active").forEach(t=>{if(!byTruck[t.truckName])byTruck[t.truckName]=[];byTruck[t.truckName].push(t);});if(!Object.keys(byTruck).length)return null;return Object.entries(byTruck).map(([truck,ts])=>(
                    <div key={truck} style={{...S.card,marginBottom:12}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>{truck}</div>
                      {ts.map(t=>{const tread=parseInt(t.treadDepth||0);const tc=tread===0?"#555":tread<=4?"#ef4444":tread<=8?"#f59e0b":"#22c55e";return(
                        <div key={t.id} style={{display:"flex",alignItems:"center",gap:14,padding:"8px 0",borderBottom:"1px solid #1a1a1a"}}>
                          <div style={{flex:1}}><div style={{fontSize:11,color:"#c8c4bc"}}>{t.position}</div><div style={{fontSize:10,color:"#555"}}>{t.brand||"—"} {t.size||""}{t.date?` · ${fmtDate(t.date)}`:""}</div></div>
                          {t.treadDepth&&<div style={{textAlign:"center"}}><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:tc}}>{t.treadDepth}/32</div><div style={{fontSize:8,color:"#555",textTransform:"uppercase"}}>Tread</div></div>}
                          {t.cost&&<div style={{fontSize:13,color:"#ef4444",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,flexShrink:0}}>{fmt$(parseFloat(t.cost))}</div>}
                          <button onClick={()=>setTires(p=>p.filter(x=>x.id!==t.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      );})}
                    </div>
                  ));})}
                </div>
              </div>
            )}

            {/* ── D6: Van Inspection ── */}
            {subScreen==="vaninspect"&&segment==="amazon"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>Van Pre-Trip Inspection</div>
                <div style={{...S.card,marginBottom:16}}>
                  <div style={{fontSize:12,fontWeight:700,color:accent,marginBottom:8}}>Today's Status</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                    {(compliance.trucks||[]).map((t,i)=>{
                      const name=t.name||t.truckName||"Truck "+(i+1);
                      const today=new Date().toISOString().slice(0,10);
                      const done=vanInspectionLog.some(v=>v.vehicle===name&&v.date===today);
                      return <div key={i} style={{...S.card,border:`1px solid ${done?"#22c55e44":"#ef444444"}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div><div style={{fontSize:12,color:"#e8e4d8"}}>{name}</div><div style={{fontSize:10,color:done?"#22c55e":"#ef4444"}}>{done?"✓ Inspected":"✗ Not Inspected"}</div></div>
                        {!done&&<button className="hov" onClick={()=>{setVanInspectVehicle(name);setVanInspectDate(today);}} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer"}}>Inspect</button>}
                      </div>;
                    })}
                  </div>
                </div>
                <div style={{...S.card,marginBottom:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>New Inspection</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <select value={vanInspectVehicle} onChange={e=>setVanInspectVehicle(e.target.value)} style={S.input}>
                      <option value="">Select Vehicle</option>
                      {(compliance.trucks||[]).map((t,i)=><option key={i} value={t.name||t.truckName}>{t.name||t.truckName||"Truck "+(i+1)}</option>)}
                    </select>
                    <input type="date" value={vanInspectDate} onChange={e=>setVanInspectDate(e.target.value)} style={S.input}/>
                  </div>
                  {[["exterior","Exterior damage check"],["lights","Lights and signals working"],["cargo","Cargo area clean and organized"],["device","Delivery device charged"],["seatbelt","Seatbelt functional"],["noWarnings","No dashboard warning lights"],["driverAck","Driver acknowledgment"]].map(([key,label])=>(
                    <label key={key} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#e8e4d8",marginBottom:6}}>
                      <input type="checkbox" checked={vanInspectItems[key]||false} onChange={e=>setVanInspectItems(p=>({...p,[key]:e.target.checked}))}/>
                      {label}
                    </label>
                  ))}
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:12,color:"#888",display:"block",marginBottom:4}}>Tire Condition:</label>
                    <select value={vanInspectItems.tires||"Good"} onChange={e=>setVanInspectItems(p=>({...p,tires:e.target.value}))} style={{...S.input,width:"auto"}}>
                      <option>Good</option><option>Monitor</option><option>Replace</option>
                    </select>
                  </div>
                  <button className="hov" onClick={()=>{
                    if(!vanInspectVehicle||!vanInspectDate)return;
                    setVanInspectionLog(p=>[{id:Date.now(),vehicle:vanInspectVehicle,date:vanInspectDate,items:{...vanInspectItems},time:new Date().toLocaleTimeString()},...p]);
                    setVanInspectItems({exterior:false,tires:"Good",lights:false,cargo:false,device:false,seatbelt:false,noWarnings:false,driverAck:false});
                    setVanInspectVehicle(""); setVanInspectDate("");
                  }} style={S.btn}>Save Inspection</button>
                </div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:8}}>Recent Inspections</div>
                {vanInspectionLog.length===0&&<div style={{color:"#555",fontSize:12}}>No inspections logged yet.</div>}
                {vanInspectionLog.slice(0,20).map(v=>(
                  <div key={v.id} style={{...S.card,marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div><div style={{fontSize:12,color:"#e8e4d8"}}>{v.vehicle} · {v.date} {v.time&&`@ ${v.time}`}</div>
                      <div style={{fontSize:11,color:"#888"}}>Tires: {v.items?.tires||"Good"}</div></div>
                      <span style={{fontSize:10,color:v.items?.tires==="Replace"?"#ef4444":"#22c55e"}}>{v.items?.tires==="Replace"?"⚠ Replace Tires":"✓ OK"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── D7: Fuel Card ── */}
            {subScreen==="fuelcard"&&segment==="otr"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8",marginBottom:8}}>Fuel Card Reconciliation</div>
                <div style={{...S.card,marginBottom:16,background:"#0f0f1a",border:"1px solid #1e1e3e"}}>
                  <div style={{fontSize:11,color:"#888",lineHeight:1.8}}>
                    Paste your fuel card transactions below, one per line.<br/>
                    Format: <code style={{color:accent}}>DATE, LOCATION, GALLONS, AMOUNT</code>
                  </div>
                </div>
                <textarea value={fuelCardPasteText} onChange={e=>setFuelCardPasteText(e.target.value)} placeholder="Paste transactions here..." style={{...S.input,minHeight:160,marginBottom:8,fontFamily:"'DM Mono',monospace",fontSize:11}}/>
                <button className="hov" style={{...S.btn,marginBottom:16}} onClick={()=>{
                  const lines=fuelCardPasteText.split("\n").filter(l=>l.trim());
                  const parsed=lines.map(line=>{
                    const parts=line.split(",").map(s=>s.trim());
                    const date=parts[0]||"";const location=parts[1]||"";const gallons=parseFloat(parts[2])||0;const amount=parseFloat(parts[3])||0;
                    const match=fuelLog.find(f=>f.date===date&&Math.abs(parseFloat(f.totalCost||0)-amount)<5);
                    const dup=fuelLog.filter(f=>f.date===date&&Math.abs(parseFloat(f.totalCost||0)-amount)<5).length>1;
                    return {date,location,gallons,amount,status:dup?"Duplicate":match?"Matched":"Unmatched",matchId:match?.id};
                  });
                  setFuelCardParsed(parsed);
                }}>Parse Transactions</button>
                {fuelCardParsed.length>0&&<>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12,marginBottom:16}}>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Transactions</div><div style={{fontSize:24,fontWeight:700,color:accent}}>{fuelCardParsed.length}</div></div>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Total Amount</div><div style={{fontSize:24,fontWeight:700,color:accent}}>${fuelCardParsed.reduce((s,t)=>s+t.amount,0).toFixed(2)}</div></div>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Matched</div><div style={{fontSize:24,fontWeight:700,color:"#22c55e"}}>{fuelCardParsed.filter(t=>t.status==="Matched").length}</div></div>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Unmatched</div><div style={{fontSize:24,fontWeight:700,color:"#f59e0b"}}>{fuelCardParsed.filter(t=>t.status==="Unmatched").length}</div></div>
                  </div>
                  <button className="hov" style={{...S.btn,marginBottom:12}} onClick={()=>{
                    const unmatched=fuelCardParsed.filter(t=>t.status==="Unmatched");
                    unmatched.forEach(t=>setFuelLog(p=>[...p,{id:Date.now()+Math.random(),date:t.date,truckName:"",gallons:String(t.gallons),totalCost:String(t.amount),state:"",cardType:"fuel_card_import",notes:t.location,source:"fuel_card_import"}]));
                    setFuelCardParsed(prev=>prev.map(t=>t.status==="Unmatched"?{...t,status:"Matched"}:t));
                  }}>Import All Unmatched ({fuelCardParsed.filter(t=>t.status==="Unmatched").length})</button>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                      <thead><tr>{["Date","Location","Gallons","Amount","Status","Action"].map(h=><th key={h} style={{textAlign:"left",color:"#555",padding:"6px 8px",borderBottom:"1px solid #1e1e1e"}}>{h}</th>)}</tr></thead>
                      <tbody>
                        {fuelCardParsed.map((t,i)=>(
                          <tr key={i} style={{background:t.status==="Unmatched"?"#1a1505":"transparent"}}>
                            <td style={{padding:"6px 8px",color:"#e8e4d8"}}>{t.date}</td>
                            <td style={{padding:"6px 8px",color:"#888"}}>{t.location}</td>
                            <td style={{padding:"6px 8px",color:"#e8e4d8"}}>{t.gallons}</td>
                            <td style={{padding:"6px 8px",color:"#e8e4d8"}}>${t.amount.toFixed(2)}</td>
                            <td style={{padding:"6px 8px"}}><span style={{fontSize:10,padding:"2px 6px",borderRadius:3,background:t.status==="Matched"?"#22c55e33":t.status==="Duplicate"?"#88888833":"#f59e0b33",color:t.status==="Matched"?"#22c55e":t.status==="Duplicate"?"#888":"#f59e0b"}}>{t.status}</span></td>
                            <td style={{padding:"6px 8px"}}>{t.status==="Unmatched"&&<button className="hov" onClick={()=>{
                              setFuelLog(p=>[...p,{id:Date.now(),date:t.date,truckName:"",gallons:String(t.gallons),totalCost:String(t.amount),state:"",cardType:"fuel_card_import",notes:t.location,source:"fuel_card_import"}]);
                              setFuelCardParsed(prev=>prev.map((x,j)=>j===i?{...x,status:"Matched"}:x));
                            }} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer"}}>Add</button>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>}
              </div>
            )}

      {/* ══ CONTRACTS ══════════════════════════════════════════════════ */}
      {screen==="contracts"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {segment==="usps"&&<SubNav tabs={[["contracts","Contracts"],["bidtracker","Bid Tracker"]]} active={contractsSubTab} onSelect={setContractsSubTab}/>}
          <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
          {/* ── D8: Bid Tracker ── */}
          {contractsSubTab==="bidtracker"&&segment==="usps"&&(
            <div style={{maxWidth:800,margin:"0 auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8"}}>HCR Bid Tracker</div>
                <button className="hov" onClick={()=>setBidsTab(bidsTab==="active"?"history":"active")} style={{...S.btn,fontSize:11}}>{bidsTab==="active"?"View History":"Active Bids"}</button>
              </div>
              <button className="hov" onClick={()=>setShowBidAdd(p=>!p)} style={{...S.btn,marginBottom:12}}>+ Add Bid</button>
              {showBidAdd&&<div style={{...S.card,marginBottom:16}}>
                <input placeholder="Route Description" value={bidForm.routeDescription} onChange={e=>setBidForm(p=>({...p,routeDescription:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <input type="date" placeholder="Submitted Date" value={bidForm.bidSubmittedDate} onChange={e=>setBidForm(p=>({...p,bidSubmittedDate:e.target.value}))} style={S.input}/>
                  <input placeholder="Bid Amount $" type="number" value={bidForm.bidAmount} onChange={e=>setBidForm(p=>({...p,bidAmount:e.target.value}))} style={S.input}/>
                  <input placeholder="Est. Miles/Year" type="number" value={bidForm.estimatedMilesPerYear} onChange={e=>setBidForm(p=>({...p,estimatedMilesPerYear:e.target.value}))} style={S.input}/>
                  <input placeholder="Est. Fuel Cost $" type="number" value={bidForm.estimatedFuelCost} onChange={e=>setBidForm(p=>({...p,estimatedFuelCost:e.target.value}))} style={S.input}/>
                  <input placeholder="Est. Labor Cost $" type="number" value={bidForm.estimatedLaborCost} onChange={e=>setBidForm(p=>({...p,estimatedLaborCost:e.target.value}))} style={S.input}/>
                  <input placeholder="Est. Vehicle Cost $" type="number" value={bidForm.estimatedVehicleCost} onChange={e=>setBidForm(p=>({...p,estimatedVehicleCost:e.target.value}))} style={S.input}/>
                </div>
                <select value={bidForm.awardStatus} onChange={e=>setBidForm(p=>({...p,awardStatus:e.target.value}))} style={{...S.input,marginBottom:8}}>
                  <option>Pending</option><option>Awarded</option><option>Not Awarded</option>
                </select>
                <textarea placeholder="Notes" value={bidForm.notes} onChange={e=>setBidForm(p=>({...p,notes:e.target.value}))} style={{...S.input,marginBottom:8,minHeight:60}}/>
                <button className="hov" onClick={()=>{
                  const totalCost=(parseFloat(bidForm.estimatedFuelCost||0)+parseFloat(bidForm.estimatedLaborCost||0)+parseFloat(bidForm.estimatedVehicleCost||0));
                  const netAnnual=parseFloat(bidForm.bidAmount||0)-totalCost;
                  setBidTracker(p=>[{id:Date.now(),estimatedTotalCost:totalCost,estimatedNetAnnual:netAnnual,...bidForm},...p]);
                  setBidForm({routeId:"",routeDescription:"",bidSubmittedDate:"",bidAmount:"",estimatedMilesPerYear:"",estimatedFuelCost:"",estimatedLaborCost:"",estimatedVehicleCost:"",estimatedTotalCost:"",estimatedNetAnnual:"",awardStatus:"Pending",awardDate:"",actualCostAfter30Days:"",actualCostAfter60Days:"",lessonLearned:"",notes:""});
                  setShowBidAdd(false);
                }} style={S.btn}>Save Bid</button>
              </div>}
              {bidsTab==="active"&&<>
                {bidTracker.filter(b=>b.awardStatus==="Pending").length===0&&<div style={{color:"#555",fontSize:12}}>No pending bids.</div>}
                {bidTracker.filter(b=>b.awardStatus==="Pending").map(b=>{
                  const daysSince=b.bidSubmittedDate?Math.floor((Date.now()-new Date(b.bidSubmittedDate).getTime())/(1000*60*60*24)):0;
                  return <div key={b.id} style={{...S.card,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"#e8e4d8"}}>{b.routeDescription}</div>
                        <div style={{fontSize:11,color:"#888"}}>Submitted: {b.bidSubmittedDate||"—"} · {daysSince}d ago</div>
                        <div style={{fontSize:12,color:parseFloat(b.estimatedNetAnnual||0)>0?"#22c55e":"#ef4444"}}>Est. Net/Year: ${parseFloat(b.estimatedNetAnnual||0).toFixed(0)}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:16,fontWeight:700,color:accent}}>${parseFloat(b.bidAmount||0).toFixed(0)}</div>
                        <div style={{display:"flex",gap:4,marginTop:4}}>
                          {["Awarded","Not Awarded"].map(s=><button key={s} className="hov" onClick={()=>setBidTracker(p=>p.map(x=>x.id===b.id?{...x,awardStatus:s,awardDate:new Date().toISOString().slice(0,10)}:x))} style={{fontSize:9,padding:"2px 6px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer"}}>{s}</button>)}
                        </div>
                      </div>
                    </div>
                  </div>;
                })}
              </>}
              {bidsTab==="history"&&<>
                {bidTracker.filter(b=>b.awardStatus!=="Pending").length===0&&<div style={{color:"#555",fontSize:12}}>No completed bids yet.</div>}
                {bidTracker.filter(b=>b.awardStatus!=="Pending").map(b=>(
                  <div key={b.id} style={{...S.card,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div><div style={{fontSize:13,color:"#e8e4d8"}}>{b.routeDescription}</div><div style={{fontSize:11,color:"#888"}}>{b.bidSubmittedDate}</div></div>
                      <span style={{fontSize:11,padding:"2px 8px",borderRadius:3,background:b.awardStatus==="Awarded"?"#22c55e33":"#ef444433",color:b.awardStatus==="Awarded"?"#22c55e":"#ef4444"}}>{b.awardStatus}</span>
                    </div>
                  </div>
                ))}
              </>}
            </div>
          )}
          {(contractsSubTab==="contracts"||segment!=="usps")&&<div style={{maxWidth:800,margin:"0 auto"}}>
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
                <button className="hov" onClick={()=>{ if(!contractForm.name){showValidation("Contract name is required");return;} setContracts(p=>[...p,{...contractForm,id:Date.now()}]); setContractForm({name:"",company:"",startDate:"",renewalDate:"",value:"",status:"active",notes:""}); setShowAddContract(false); }} style={{...S.btn,background:"#8888cc",marginTop:14}}>Save Contract</button>
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
          </div>}
          </div>
        </div>
      )}
      {/* ══ FINANCE ════════════════════════════════════════════════════ */}
      {screen==="finance"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[["pl","P&L Dashboard"],["revenue","Revenue"],["expenses","Expenses"],["import","Import from Excel/QB"],...(segment==="otr"?[["deadmiles","Dead Miles"]]:[])]  } active={subScreen||"pl"} onSelect={setSubScreen}/>
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
                          {compliance.trucks.map(t=><option key={t.id} value={t.name}>{t.name}{t.nickname?` "${t.nickname}"`:""}{ t.vin?` · ${t.vin.slice(-6)}`:""}</option>)}
                        </select>
                      </div>
                    </div>
                    <button className="hov" onClick={()=>{ if(!revenueForm.amount){showValidation("Amount is required");return;} if(!revenueForm.date){showValidation("Date is required");return;} setRevenue(p=>[{...revenueForm,id:Date.now()},...p]); setRevenueForm({date:"",description:"",amount:"",vehicle:""}); setShowAddRevenue(false); }} style={{...S.btn,marginTop:14}}>Save Revenue</button>
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
                          {compliance.trucks.map(t=><option key={t.id} value={t.name}>{t.name}{t.nickname?` "${t.nickname}"`:""}{ t.vin?` · ${t.vin.slice(-6)}`:""}</option>)}
                        </select>
                      </div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Description</label><input value={expenseForm.description} onChange={e=>setExpenseForm(p=>({...p,description:e.target.value}))} placeholder="Optional notes" style={S.input}/></div>
                    </div>
                    <button className="hov" onClick={()=>{ if(!expenseForm.amount){showValidation("Amount is required");return;} if(!expenseForm.date){showValidation("Date is required");return;} setExpenses(p=>[{...expenseForm,id:Date.now()},...p]); setExpenseForm({date:"",category:"fuel",amount:"",description:"",vehicle:""}); setShowAddExpense(false); }} style={{...S.btn,background:"#ef4444",marginTop:14}}>Save Expense</button>
                  </div>
                )}
                {expenses.length===0&&!showAddExpense&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No expenses logged yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {expenses.map(e=>(
                    <div key={e.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,color:"#c8c4bc",display:"flex",alignItems:"center",gap:8}}>
                          {e.category.replace(/_/g," ").replace(/\w/g,l=>l.toUpperCase())} {e.description?`— ${e.description}`:""}
                          {e.source&&<span style={{fontSize:8,color:"#555",border:"1px solid #2a2a2a",padding:"1px 5px",borderRadius:3,textTransform:"uppercase",letterSpacing:"0.08em"}}>{e.source==="fuel_log"?"⛽ fuel":e.source==="maintenance"?"🔧 maint":e.source==="payroll"?"💵 payroll":"auto"}</span>}
                        </div>
                        <div style={{fontSize:10,color:"#555"}}>{e.date} {e.vehicle?`· ${e.vehicle}`:""}</div>
                      </div>
                      <div style={{fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#ef4444",flexShrink:0}}>{fmt$(parseFloat(e.amount||0))}</div>
                      {!e.source&&<button onClick={()=>openEdit("expense",e)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace",flexShrink:0}}>Edit</button>}
                      <button onClick={()=>setExpenses(p=>p.filter(x=>x.id!==e.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12,flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subScreen==="import"&&(
              <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:4}}>IMPORT FROM EXCEL / QUICKBOOKS</div>
                <p style={{fontSize:11,color:"#555",marginBottom:16,lineHeight:1.8}}>
                  Export your P&L from QuickBooks Online or Excel as a CSV file, then drop it here. ContractorOS will read it and automatically create your revenue and expense entries.
                </p>

                {/* Template download */}
                <div style={{background:"#0a0f1a",border:`1px solid ${accent}33`,borderRadius:8,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:16}}>
                  <div style={{fontSize:28,flexShrink:0}}>📥</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:3}}>Download the ContractorOS Template</div>
                    <div style={{fontSize:11,color:"#555",lineHeight:1.7}}>Not using QuickBooks? Download our Excel template — it has step-by-step instructions, example data, a category guide, and auto-calculates your P&L summary.</div>
                  </div>
                  <a href="/ContractorOS_PL_Template.xlsx" download="ContractorOS_PL_Template.xlsx" style={{...S.btn,background:accent,color:"#0a0a0a",textDecoration:"none",display:"inline-block",flexShrink:0,padding:"10px 20px",textAlign:"center"}}>
                    Download Template →
                  </a>
                </div>

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

            {/* ── D9: Dead Miles ── */}
            {subScreen==="deadmiles"&&segment==="otr"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8"}}>Dead Miles Tracker</div>
                  <button className="hov" onClick={()=>setShowDeadMilesAdd(p=>!p)} style={S.btn}>+ Add Entry</button>
                </div>
                {showDeadMilesAdd&&<div style={{...S.card,marginBottom:16}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <input type="date" value={deadMilesForm.date} onChange={e=>setDeadMilesForm(p=>({...p,date:e.target.value}))} style={S.input}/>
                    <input placeholder="From Location" value={deadMilesForm.fromLocation} onChange={e=>setDeadMilesForm(p=>({...p,fromLocation:e.target.value}))} style={S.input}/>
                    <input placeholder="To Location" value={deadMilesForm.toLocation} onChange={e=>setDeadMilesForm(p=>({...p,toLocation:e.target.value}))} style={S.input}/>
                    <input placeholder="Empty Miles" type="number" value={deadMilesForm.emptyMiles} onChange={e=>setDeadMilesForm(p=>({...p,emptyMiles:e.target.value}))} style={S.input}/>
                  </div>
                  <select value={deadMilesForm.reason} onChange={e=>setDeadMilesForm(p=>({...p,reason:e.target.value}))} style={{...S.input,marginBottom:8}}>
                    {["Looking for load","Repositioning","Home time","Other"].map(r=><option key={r}>{r}</option>)}
                  </select>
                  <input placeholder="Notes" value={deadMilesForm.notes} onChange={e=>setDeadMilesForm(p=>({...p,notes:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <button className="hov" onClick={()=>{
                    setDeadMilesLog(p=>[{id:Date.now(),...deadMilesForm},...p]);
                    setDeadMilesForm({date:"",fromLocation:"",toLocation:"",emptyMiles:"",reason:"Looking for load",notes:""});
                    setShowDeadMilesAdd(false);
                  }} style={S.btn}>Save Entry</button>
                </div>}
                {(()=>{
                  const monthStr=new Date().toISOString().slice(0,7);
                  const monthDead=deadMilesLog.filter(d=>d.date&&d.date.startsWith(monthStr)).reduce((s,d)=>s+parseFloat(d.emptyMiles||0),0);
                  const estCost=monthDead*parseFloat(settings.cpm||0.18);
                  return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:16}}>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Dead Miles This Month</div><div style={{fontSize:24,fontWeight:700,color:accent}}>{monthDead.toFixed(0)}</div></div>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Est. Cost (CPM)</div><div style={{fontSize:24,fontWeight:700,color:"#ef4444"}}>${estCost.toFixed(0)}</div></div>
                  </div>;
                })()}
                {deadMilesLog.length===0&&<div style={{color:"#555",fontSize:12}}>No dead miles logged yet.</div>}
                {deadMilesLog.map(d=>(
                  <div key={d.id} style={{...S.card,marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:12,color:"#e8e4d8"}}>{d.date} · {d.fromLocation}→{d.toLocation}</div>
                        <div style={{fontSize:11,color:"#888"}}>{d.emptyMiles}mi · {d.reason}</div>
                      </div>
                      <button className="hov" onClick={()=>setDeadMilesLog(p=>p.filter(x=>x.id!==d.id))} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:"1px solid #ef444444",background:"transparent",color:"#ef4444",cursor:"pointer"}}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {screen==="brokers"&&!seg.features.brokerScorecard&&(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:"#e8e4d8",marginBottom:16}}>Client Relationship</div>
            <div style={{...S.card,marginBottom:16}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>
                {segment==="fedex"?"FedEx Ground":segment==="amazon"?"Amazon DSP":segment==="lastmile"?"Lowe's / Home Depot":segment==="usps"?"USPS":"Primary Client"}
              </div>
              <div style={{fontSize:11,color:"#555",marginBottom:12}}>Track your key client relationship details and contract terms.</div>
              {[["Weekly Stop Guarantee","weeklyStops"],["Revenue Per Stop $","revenuePerStop"],["Fuel Surcharge %","fuelSurcharge"],["Contract Expiry","contractExpiry"],["Performance Tier","performanceTier"]].map(([label,field])=>{
                const co=segment==="fedex"?"FedEx Ground":segment==="amazon"?"Amazon DSP":segment==="lastmile"?"Lowe's":"USPS";
                const client=contacts.find(c=>c.type==="Client"&&c.company===co)||{};
                return <div key={field} style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#888",marginBottom:3}}>{label}</div>
                  <input value={client[field]||""} onChange={e=>{
                    const existing=contacts.find(c=>c.type==="Client"&&c.company===co);
                    if(existing){setContacts(p=>p.map(c=>c.id===existing.id?{...c,[field]:e.target.value}:c));}
                    else{setContacts(p=>[{id:Date.now(),type:"Client",company:co,[field]:e.target.value},...p]);}
                  }} style={S.input}/>
                </div>;
              })}
            </div>
          </div>
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
            <SubNav tabs={[["scores","Scoreboard"],["lanes","Lanes"],["add","Add Broker"]]} active={subScreen||"scores"} onSelect={setSubScreen}/>
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
                      <div><label style={S.label}>Phone</label><input value={brokerForm.phone||""} onChange={e=>setBrokerForm(p=>({...p,phone:e.target.value}))} placeholder="(555) 555-0100" style={S.input}/></div>
                      <div><label style={S.label}>Email</label><input type="email" value={brokerForm.email||""} onChange={e=>setBrokerForm(p=>({...p,email:e.target.value}))} placeholder="dispatch@broker.com" style={S.input}/></div>
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
                    <button className="hov" onClick={()=>{ if(!brokerForm.name){showValidation("Broker name is required");return;} setBrokers(p=>[...p,{...brokerForm,id:Date.now()}]); setBrokerForm({name:"",paySpeed:"",rating:3,notes:"",blacklisted:false}); setSubScreen("scores"); }} style={{...S.btn,marginTop:14}}>Save Broker</button>
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

            {/* Alert setup modal */}
            {showAlertSetup&&(
              <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20}} onClick={()=>setShowAlertSetup(false)}>
                <div style={{background:"#141414",border:`1px solid ${accent}44`,borderRadius:10,padding:"28px 32px",maxWidth:440,width:"100%",animation:"fadeUp 0.2s ease"}} onClick={e=>e.stopPropagation()}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#e8e4d8",marginBottom:4}}>Set Up Compliance Alerts</div>
                  <div style={{fontSize:11,color:"#555",marginBottom:20,lineHeight:1.8}}>Enter your contact info to receive compliance deadline reminders. Browser push notifications will also be enabled.</div>
                  <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
                    <div>
                      <label style={S.label}>Phone Number (SMS reminders)</label>
                      <input value={alertPhone} onChange={e=>setAlertPhone(e.target.value)} placeholder="(864) 555-0100" style={S.input} type="tel"/>
                      <div style={{fontSize:9,color:"#444",marginTop:4}}>Saved for your records. Automated SMS requires Twilio integration — can be added in a future update.</div>
                    </div>
                    <div>
                      <label style={S.label}>Email for Alert Summaries</label>
                      <input value={alertEmail} onChange={e=>setAlertEmail(e.target.value)} placeholder="your@email.com" style={S.input} type="email"/>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button className="hov" onClick={confirmAlertSetup} style={S.btn}>Save & Enable →</button>
                    <button onClick={()=>setShowAlertSetup(false)} style={{...S.ghost,fontSize:11}}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            {/* Notifications section */}
            <div style={{...S.card,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:2}}>Push Notifications</div>
                  <div style={{fontSize:11,color:"#555"}}>Get alerts on your phone before compliance items expire</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  {notifPermission!=="granted"&&<button className="hov" onClick={()=>setShowAlertSetup(true)} style={S.btn}>Enable Alerts</button>}
                  {notifPermission==="granted"&&<button onClick={()=>setShowAlertSetup(true)} style={{...S.ghost,fontSize:10}}>Edit Contact</button>}{notifPermission==="granted"&&<button className="hov" onClick={sendTestNotif} style={{...S.btn,background:"#22c55e"}}>Send Test</button>}
                </div>
              </div>
              {notifPermission==="granted"&&(
                  <div>
                    <div style={{fontSize:11,color:"#22c55e",marginBottom:6}}>✓ Push notifications enabled</div>
                    {alertPhone&&<div style={{fontSize:10,color:"#555",marginBottom:3}}>📱 {alertPhone}</div>}
                    {alertEmail&&<div style={{fontSize:10,color:"#555",marginBottom:10}}>✉ {alertEmail}</div>}
                    {alertEmail&&urgentItems.length>0&&(
                      <button onClick={async()=>{
                        try {
                          const res = await fetch("/api/send-reminder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({alertEmail,companyName:settings.companyName||"Your Fleet",urgentItems:urgentItems.slice(0,10).map(i=>({label:i.label,days:i.days}))})});
                          const data = await res.json();
                          if(data.success) alert("✓ Compliance reminder sent to "+alertEmail);
                          else alert("Email failed: "+(data.error||"Unknown error"));
                        } catch(e) { alert("Could not send email — check your internet connection"); }
                      }} style={{...S.btn,fontSize:10,padding:"6px 14px",background:"#22c55e"}}>
                        Send Email Alert Now ({urgentItems.length} items)
                      </button>
                    )}
                    {alertEmail&&urgentItems.length===0&&<div style={{fontSize:10,color:"#22c55e"}}>✓ No urgent items — nothing to alert about right now</div>}
                  </div>
                )}
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
            <p style={{fontSize:11,color:"#555",marginBottom:16,lineHeight:1.8}}>Invite drivers and managers to your company. Each person logs in with their own account and only sees your company's data.</p>

            {/* Clerk org management */}
            {organization&&(
              <div style={{...S.card,marginBottom:20,border:`1px solid ${accent}33`,background:"#0a0f0a"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8"}}>{organization.name}</div>
                    <div style={{fontSize:10,color:"#555"}}>Organization ID: {organization.id?.slice(0,16)}...</div>
                  </div>
                  <div style={{fontSize:9,color:"#22c55e",border:"1px solid #22c55e44",padding:"2px 8px",borderRadius:3}}>ACTIVE ORG</div>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="hov" onClick={()=>{if(organization){setShowOrgProfile(true);}else{alert("You need to be part of an organization to manage members. Create or join one first.");}}} style={{...S.btn,fontSize:11}}>Manage Members & Invites</button>
                  <button onClick={()=>signOut()} style={{...S.ghost,fontSize:10}}>Sign Out</button>
                </div>
              </div>
            )}

            {/* How roles work */}
            <div style={{...S.card,marginBottom:20,background:"#0a0a14",border:"1px solid #1a1a3a"}}>
              <div style={{fontSize:10,color:"#4a4a8a",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>How Roles Work</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[["👑 Owner (org:admin)","Full access — all screens, settings, billing, invite users","#f59e0b"],["👔 Manager (org:member)","Can edit routes, drivers, compliance, finance — cannot change billing or delete the org","#8888cc"],["🚛 Driver (org:member)","Read-only — sees their own dispatch, HOS log, and pay stubs only","#22c55e"]].map(([role,desc,col])=>(
                  <div key={role} style={{display:"flex",gap:12,padding:"8px 0",borderBottom:"1px solid #1a1a2a"}}>
                    <div style={{fontSize:12,color:col,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,width:180,flexShrink:0}}>{role}</div>
                    <div style={{fontSize:11,color:"#555"}}>{desc}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:12,fontSize:10,color:"#3a3a5a",lineHeight:1.7}}>
                💡 To invite someone: click "Manage Members & Invites" → Invite → enter their email. They'll get a link to create an account and join your company automatically.
              </div>
            </div>

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
              <div style={{fontSize:10,color:"#555",marginBottom:10,lineHeight:1.7}}>Contractor type is locked after initial setup to prevent accidental data changes. Contact support to change it.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {Object.values(SEGMENTS).map(s=>(
                  <div key={s.id} style={{background:segment===s.id?s.color+"22":"#0f0f0f",border:`1px solid ${segment===s.id?s.color+"44":"#1e1e1e"}`,borderRadius:6,padding:"10px 14px",textAlign:"left",color:segment===s.id?s.color:"#666",fontSize:11,fontFamily:"'DM Mono',monospace"}}>
                    {s.icon} {s.label}
                  </div>
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


      {/* ══ PAYROLL ════════════════════════════════════════════════════ */}
      {screen==="payroll"&&(()=>{
        const calcRunPay=(driver,form)=>{const rate=parseFloat(driver.payRate||0);let gross=0,breakdown="";switch(driver.payType){case"per_mile":gross=rate*parseFloat(form.miles||0);breakdown=`${form.miles} mi × $${rate}/mi`;break;case"hourly":gross=rate*parseFloat(form.hours||0);breakdown=`${form.hours} hrs × $${rate}/hr`;break;case"percentage":gross=(rate/100)*parseFloat(form.loadRevenue||0);breakdown=`${rate}% of $${form.loadRevenue}`;break;case"salary":gross=rate/52;breakdown=`$${rate}/yr ÷ 52 weeks`;break;case"per_stop":gross=rate*parseFloat(form.stops||0);breakdown=`${form.stops} stops × $${rate}/stop`;break;case"per_day":gross=rate*parseFloat(form.days||0);breakdown=`${form.days} days × $${rate}/day`;break;default:gross=parseFloat(form.manualAmount||0);breakdown="Manual entry";}return{gross:parseFloat(gross.toFixed(2)),breakdown};};
        const totalUnpaid=payroll.filter(r=>r.status==="unpaid").reduce((s,r)=>s+r.gross,0);
        const totalPaid=payroll.filter(r=>r.status==="paid").reduce((s,r)=>s+r.gross,0);
        const PAY_FIELDS={per_mile:[["miles","Miles Driven","number"]],hourly:[["hours","Hours Worked","number"]],percentage:[["loadRevenue","Route/Load Revenue ($)","number"]],salary:[],per_stop:[["stops","Stops Completed","number"]],per_day:[["days","Days Worked","number"]]};
        const selDriver=drivers.find(d=>String(d.id)===String(payrollForm.driverId));
        const extraFields=selDriver?(PAY_FIELDS[selDriver.payType]||[["manualAmount","Pay Amount ($)","number"]]):[];
        return(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[["runs","Pay Runs"],["summary","Driver Summary"],["ytd","YTD Report"]]} active={payrollSub} onSelect={setPayrollSub}/>
          <div style={{flex:1,overflowY:"auto",padding:24}}>
            {payrollSub==="runs"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div><div style={S.section}>PAYROLL</div><div style={{fontSize:11,color:"#555",marginTop:4}}>Log pay runs, generate pay stubs, and track what's owed.</div></div>
                  <button className="hov" onClick={()=>setPayrollShowAdd(!payrollShowAdd)} style={S.btn}>{payrollShowAdd?"Cancel":"+ New Pay Run"}</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                  {[["Unpaid Balance",fmt$(totalUnpaid),"#ef4444"],["Total Paid (All Time)",fmt$(totalPaid),"#22c55e"],["Pay Runs",payroll.length.toString(),accent]].map(([lbl,val,col])=>(
                    <div key={lbl} style={S.card}><div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:col}}>{val}</div><div style={{fontSize:9,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:4}}>{lbl}</div></div>
                  ))}
                </div>
                {payrollShowAdd&&(
                  <div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Driver *</label>
                        <select value={payrollForm.driverId} onChange={e=>{setPayrollForm(p=>({...p,driverId:e.target.value}));setPayrollPreview(null);}} style={S.input}>
                          <option value="">Select driver...</option>
                          {(drivers.filter(d=>d.status==="active").length>0?drivers.filter(d=>d.status==="active"):drivers).map(d=><option key={d.id} value={d.id}>{d.name} — {(d.payType||"manual").replace(/_/g," ")} @ ${d.payRate||0}</option>)}
                        </select>
                      </div>
                      <div><label style={S.label}>Pay Period Start *</label><input type="date" value={payrollForm.periodStart} onChange={e=>setPayrollForm(p=>({...p,periodStart:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Pay Period End</label><input type="date" value={payrollForm.periodEnd} onChange={e=>setPayrollForm(p=>({...p,periodEnd:e.target.value}))} style={S.input}/></div>
                      {extraFields.map(([f,lbl,t])=>(<div key={f}><label style={S.label}>{lbl}</label><input type={t} value={payrollForm[f]||""} onChange={e=>setPayrollForm(p=>({...p,[f]:e.target.value}))} style={S.input}/></div>))}
                      <div><label style={S.label}>Manual Override Amount ($) <span style={{color:"#555",fontSize:8}}>(optional — overrides calculated pay)</span></label><input type="number" value={payrollForm.manualAmount||""} onChange={e=>setPayrollForm(p=>({...p,manualAmount:e.target.value}))} placeholder="Leave blank to use calculated amount" style={S.input}/></div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes (bonus, deduction, etc.)</label><input value={payrollForm.notes} onChange={e=>setPayrollForm(p=>({...p,notes:e.target.value}))} style={S.input}/></div>
                    </div>
                    <div style={{display:"flex",gap:10,marginTop:14}}>
                      <button className="hov" onClick={()=>{if(!payrollForm.driverId){showValidation("Please select a driver");return;}const d=drivers.find(x=>String(x.id)===String(payrollForm.driverId));if(!d){showValidation("Driver not found");return;}const{gross,breakdown}=calcRunPay(d,payrollForm);setPayrollPreview({driver:d,gross,breakdown});}} style={{...S.btn,background:"#6366f1"}}>Preview Pay</button>
                      {payrollPreview&&<button className="hov" onClick={()=>{const d=drivers.find(x=>String(x.id)===String(payrollForm.driverId));if(!d)return;const{gross,breakdown}=calcRunPay(d,payrollForm);const run={id:Date.now(),driverId:d.id,driverName:d.name,periodStart:payrollForm.periodStart,periodEnd:payrollForm.periodEnd,gross,breakdown,notes:payrollForm.notes,date:new Date().toISOString().slice(0,10),payType:d.payType,payRate:d.payRate,status:"unpaid"};setPayroll(p=>[run,...p]);
                      setExpenses(p=>[{id:Date.now()+1,date:run.date,category:"driver_pay",amount:gross,description:`Pay — ${d.name}${payrollForm.periodStart?" ("+payrollForm.periodStart+(payrollForm.periodEnd?" → "+payrollForm.periodEnd:"")+")":" "}`,vehicle:"",source:"payroll"},...p]);
                      setPayrollForm({driverId:"",periodStart:"",periodEnd:"",miles:"",hours:"",stops:"",days:"",loadRevenue:"",manualAmount:"",notes:""});setPayrollPreview(null);setPayrollShowAdd(false);}} style={S.btn}>Save Pay Run</button>}
                      <button onClick={()=>{setPayrollShowAdd(false);setPayrollPreview(null);}} style={S.ghost}>Cancel</button>
                    </div>
                    {payrollPreview&&(<div style={{marginTop:14,background:"#0a1a0a",border:"1px solid #1a3a1a",borderRadius:6,padding:"14px 18px"}}><div style={{fontSize:10,color:"#2d5a2d",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>Pay Preview — {payrollPreview.driver.name}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:11,color:"#888"}}>{payrollPreview.breakdown}</div><div style={{fontSize:24,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:"#22c55e"}}>{fmt$(payrollPreview.gross)}</div></div></div>)}
                  </div>
                )}
                {payroll.length===0&&!payrollShowAdd&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No pay runs yet. Add drivers first, then log pay runs here.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {payroll.map(run=>(
                    <div key={run.id} style={{...S.card,borderLeft:`3px solid ${run.status==="paid"?"#22c55e":"#f59e0b"}`,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8"}}>{run.driverName}</div><div style={{fontSize:10,color:"#555"}}>{run.periodStart}{run.periodEnd?` → ${run.periodEnd}`:""} · {run.breakdown}{run.notes&&` · ${run.notes}`}</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:"#22c55e"}}>{fmt$(run.gross)}</div><div style={{fontSize:9,color:run.status==="paid"?"#22c55e":"#f59e0b",textTransform:"uppercase",letterSpacing:"0.1em"}}>{run.status==="paid"?`✓ Paid ${fmtDate(run.paidDate)}`:"Unpaid"}</div></div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        {run.status==="unpaid"&&<button onClick={()=>setPayroll(p=>p.map(r=>r.id===run.id?{...r,status:"paid",paidDate:new Date().toISOString().slice(0,10)}:r))} style={{...S.btn,background:"#22c55e",fontSize:10,padding:"5px 12px"}}>Mark Paid</button>}
                        <button onClick={()=>setPayStub(run)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"5px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Stub</button>
                        <button onClick={()=>setPayroll(p=>p.filter(r=>r.id!==run.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {payrollSub==="summary"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:20}}>DRIVER PAY SUMMARY</div>
                {drivers.length===0&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No drivers added yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {drivers.map(d=>{const runs=payroll.filter(r=>String(r.driverId)===String(d.id));const ytd=runs.reduce((s,r)=>s+r.gross,0);const unpaid=runs.filter(r=>r.status==="unpaid").reduce((s,r)=>s+r.gross,0);return(
                    <div key={d.id} style={S.card}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                        <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:"#e8e4d8"}}>{d.name}</div><div style={{fontSize:10,color:"#555"}}>{d.payType?.replace(/_/g," ")} · ${d.payRate}</div></div>
                        {unpaid>0&&<div style={{fontSize:11,color:"#f59e0b"}}>⚠ {fmt$(unpaid)} owed</div>}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                        {[["YTD Earnings",fmt$(ytd),"#22c55e"],["Unpaid",fmt$(unpaid),unpaid>0?"#f59e0b":"#555"],["Pay Runs",runs.length.toString(),accent]].map(([lbl,val,col])=>(
                          <div key={lbl} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{lbl}</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:col}}>{val}</div></div>
                        ))}
                      </div>
                    </div>
                  );})}
                </div>
              </div>
            )}
            {payrollSub==="ytd"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:4}}>YTD PAYROLL REPORT</div>
                <div style={{fontSize:11,color:"#555",marginBottom:20}}>Year-to-date totals by driver. Give this to your accountant at tax time.</div>
                <div style={{border:"1px solid #1e1e1e",borderRadius:8,overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",background:"#0d0d0d",borderBottom:"1px solid #1e1e1e"}}>
                    {["Driver","Pay Runs","Total Gross","Status"].map(h=>(<div key={h} style={{padding:"10px 14px",fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>{h}</div>))}
                  </div>
                  {drivers.map(d=>{const runs=payroll.filter(r=>String(r.driverId)===String(d.id));const ytd=runs.reduce((s,r)=>s+r.gross,0);const unpaid=runs.filter(r=>r.status==="unpaid").reduce((s,r)=>s+r.gross,0);return(
                    <div key={d.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",borderBottom:"1px solid #161616"}}>
                      <div style={{padding:"10px 14px"}}><div style={{fontSize:12,color:"#c8c4bc"}}>{d.name}</div><div style={{fontSize:9,color:"#555"}}>{d.payType?.replace(/_/g," ")}</div></div>
                      <div style={{padding:"10px 14px",fontSize:12,color:"#888"}}>{runs.length}</div>
                      <div style={{padding:"10px 14px",fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#22c55e"}}>{fmt$(ytd)}</div>
                      <div style={{padding:"10px 14px",fontSize:11,color:unpaid>0?"#f59e0b":"#22c55e"}}>{unpaid>0?`${fmt$(unpaid)} owed`:"Fully paid"}</div>
                    </div>
                  );})}
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",background:"#0d0d0d",borderTop:"1px solid #2a2a2a"}}>
                    <div style={{padding:"10px 14px",fontSize:10,color:"#555",textTransform:"uppercase"}}>Total</div>
                    <div style={{padding:"10px 14px",fontSize:12,color:"#888"}}>{payroll.length}</div>
                    <div style={{padding:"10px 14px",fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:accent}}>{fmt$(payroll.reduce((s,r)=>s+r.gross,0))}</div>
                    <div style={{padding:"10px 14px",fontSize:11,color:"#ef4444"}}>{fmt$(totalUnpaid)} owed</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Pay Stub Modal */}
          {payStub&&(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}} onClick={()=>setPayStub(null)}><div style={{background:"#141414",border:`1px solid ${accent}44`,borderRadius:10,padding:"28px 32px",maxWidth:480,width:"100%",animation:"fadeUp 0.2s ease"}} onClick={e=>e.stopPropagation()}><div style={{textAlign:"center",marginBottom:20,paddingBottom:16,borderBottom:"1px solid #222"}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:"#e8e4d8"}}>PAY STUB</div><div style={{fontSize:10,color:"#555",marginTop:4}}>ContractorOS · {new Date().toLocaleDateString()}</div></div><div style={{display:"flex",flexDirection:"column",gap:10}}>{[["Driver",payStub.driverName],["Pay Period",`${payStub.periodStart}${payStub.periodEnd?" → "+payStub.periodEnd:""}`],["Pay Type",payStub.payType?.replace(/_/g," ")],["Calculation",payStub.breakdown],["Status",payStub.status==="paid"?`Paid ${fmtDate(payStub.paidDate)}`:"Unpaid"]].map(([lbl,val])=>(<div key={lbl} style={{display:"flex",justifyContent:"space-between",borderBottom:"1px solid #1a1a1a",paddingBottom:8}}><span style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>{lbl}</span><span style={{fontSize:12,color:"#c8c4bc"}}>{val}</span></div>))}<div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:8,borderTop:"2px solid #2a2a2a"}}><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"#e8e4d8"}}>GROSS PAY</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:"#22c55e"}}>{fmt$(payStub.gross)}</span></div>{payStub.notes&&<div style={{fontSize:11,color:"#555",fontStyle:"italic"}}>Note: {payStub.notes}</div>}</div><button onClick={()=>window.print()} style={{...S.btn,width:"100%",marginTop:20}}>Print / Save as PDF</button></div></div>)}
        </div>
      )})()}

      {/* ══ DISPATCH ═══════════════════════════════════════════════════ */}
      {screen==="dispatch"&&(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:900,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div><div style={S.section}>DISPATCH BOARD</div><div style={{fontSize:11,color:"#555",marginTop:4}}>Assign loads and routes to drivers and trucks. Track run status.</div></div>
              <button className="hov" onClick={()=>setDispatchShowAdd(!dispatchShowAdd)} style={S.btn}>{dispatchShowAdd?"Cancel":"+ Assign Run"}</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
              {[["Active",dispatches.filter(d=>d.status==="assigned"||d.status==="in_progress"||d.status==="issue").length.toString(),accent],["Completed",dispatches.filter(d=>d.status==="completed").length.toString(),"#22c55e"],["Issues",dispatches.filter(d=>d.status==="issue").length.toString(),dispatches.filter(d=>d.status==="issue").length>0?"#ef4444":"#555"],["Total",dispatches.length.toString(),"#555"]].map(([lbl,val,col])=>(
                <div key={lbl} style={S.card}><div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:col}}>{val}</div><div style={{fontSize:9,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:4}}>{lbl}</div></div>
              ))}
            </div>
            {dispatchShowAdd&&(
              <div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Driver</label><select value={dispatchForm.driverId} onChange={e=>setDispatchForm(p=>({...p,driverId:e.target.value}))} style={S.input}><option value="">Select driver...</option>{(drivers.filter(d=>d.status==="active").length>0?drivers.filter(d=>d.status==="active"):drivers).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                  <div><label style={S.label}>Truck / Vehicle</label><select value={dispatchForm.vehicleName} onChange={e=>setDispatchForm(p=>({...p,vehicleName:e.target.value}))} style={S.input}><option value="">Select truck...</option>{compliance.trucks.map(v=><option key={v.id} value={v.name}>{v.name}{v.nickname?` "${v.nickname}"`:""}</option>)}</select></div>
                  {routes.length>0&&<div><label style={S.label}>Saved Route</label><select value={dispatchForm.routeName} onChange={e=>setDispatchForm(p=>({...p,routeName:e.target.value}))} style={S.input}><option value="">Custom or select...</option>{routes.map(r=><option key={r.id} value={r.name}>{r.name}</option>)}</select></div>}
                  <div><label style={S.label}>Date</label><input type="date" value={dispatchForm.date} onChange={e=>setDispatchForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                  <div><label style={S.label}>Origin / Pickup</label><input value={dispatchForm.origin} onChange={e=>setDispatchForm(p=>({...p,origin:e.target.value}))} placeholder="City, address, terminal..." style={S.input}/></div>
                  <div><label style={S.label}>Destination / Delivery</label><input value={dispatchForm.destination} onChange={e=>setDispatchForm(p=>({...p,destination:e.target.value}))} placeholder="City, store #, address..." style={S.input}/></div>
                  <div><label style={S.label}>Pickup Time</label><input type="time" value={dispatchForm.pickupTime} onChange={e=>setDispatchForm(p=>({...p,pickupTime:e.target.value}))} style={S.input}/></div>
                  <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes / Special Instructions</label><input value={dispatchForm.notes} onChange={e=>setDispatchForm(p=>({...p,notes:e.target.value}))} placeholder="Load #, delivery contact, access code..." style={S.input}/></div>
                </div>
                <button className="hov" onClick={()=>{const driver=drivers.find(d=>String(d.id)===String(dispatchForm.driverId));setDispatches(p=>[{...dispatchForm,id:Date.now(),driverName:driver?.name||"Unassigned",createdDate:new Date().toISOString().slice(0,10)},...p]);setDispatchForm({driverId:"",vehicleName:"",routeName:"",origin:"",destination:"",date:"",pickupTime:"",notes:"",status:"assigned"});setDispatchShowAdd(false);}} style={{...S.btn,marginTop:14}}>Assign Run</button>
              </div>
            )}
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {[["active","Active"],["history","History"],["all","All"]].map(([k,lbl])=>(
                <button key={k} onClick={()=>setDispatchFilter(k)} style={{background:dispatchFilter===k?accent+"22":"transparent",border:`1px solid ${dispatchFilter===k?accent:"#2a2a2a"}`,color:dispatchFilter===k?accent:"#555",padding:"6px 16px",borderRadius:4,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>{lbl}</button>
              ))}
            </div>
            {(()=>{
              const STATUS_COLORS={assigned:"#f59e0b",in_progress:"#60a5fa",completed:"#22c55e",cancelled:"#555",issue:"#ef4444"};
              const STATUS_LABELS={assigned:"Assigned",in_progress:"In Progress",completed:"Completed",cancelled:"Cancelled",issue:"Issue"};
              const active=dispatches.filter(d=>d.status==="assigned"||d.status==="in_progress"||d.status==="issue");
              const history=dispatches.filter(d=>d.status==="completed"||d.status==="cancelled");
              const shown=dispatchFilter==="active"?active:dispatchFilter==="history"?history:dispatches;
              if(shown.length===0) return <div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>{dispatchFilter==="active"?"No active dispatches.":"No dispatch history yet."}</div>;
              return shown.map(d=>(
                <div key={d.id} style={{...S.card,borderLeft:`3px solid ${STATUS_COLORS[d.status]||"#555"}`,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8"}}>{d.driverName}</div>
                        {d.vehicleName&&<span style={{fontSize:10,color:accent,border:`1px solid ${accent}44`,padding:"1px 7px",borderRadius:3}}>{d.vehicleName}</span>}
                        <span style={{fontSize:9,color:STATUS_COLORS[d.status],border:`1px solid ${STATUS_COLORS[d.status]}44`,padding:"1px 7px",borderRadius:3,textTransform:"uppercase"}}>{STATUS_LABELS[d.status]}</span>
                      </div>
                      <div style={{fontSize:11,color:"#888"}}>{d.routeName&&`${d.routeName} · `}{d.origin&&d.destination?`${d.origin} → ${d.destination}`:d.origin||d.destination||"No route details"}</div>
                      <div style={{fontSize:10,color:"#555",marginTop:3}}>{fmtDate(d.date)}{d.pickupTime?` @ ${d.pickupTime}`:""}{d.notes&&` · ${d.notes}`}</div>
                    </div>
                  </div>
                  {/* ── D14: LastMile dispatch enhancements ── */}
                  {segment==="lastmile"&&(()=>{
                    const drv=drivers.find(x=>x.id===d.driverId);
                    const dailyRate=drv?.payType==="per_day"?parseFloat(drv.payRate||0):null;
                    const gasCost=fuelLog.filter(f=>f.date===d.date&&f.truckName===d.vehicleName).reduce((s,f)=>s+parseFloat(f.totalCost||0),0);
                    const wg=whiteGloveLog.find(w=>w.dispatchId===d.id);
                    const wgItems=wg?.items||{};
                    const wgTotal=Object.keys(wgItems).length;
                    const wgDone=Object.values(wgItems).filter(Boolean).length;
                    const wgStatus=wgTotal===0?"none":wgDone===wgTotal?"complete":"partial";
                    return <>
                      <div style={{display:"flex",gap:12,fontSize:11,color:"#888",marginTop:6}}>
                        {dailyRate!==null&&<span>Daily Rate: <span style={{color:accent}}>${dailyRate.toFixed(0)}/day</span></span>}
                        <span>Gas: {gasCost>0?<span style={{color:accent}}>${gasCost.toFixed(2)}</span>:<span style={{color:"#555"}}>Not logged</span>}</span>
                      </div>
                      <div style={{marginTop:8}}>
                        <button className="hov" onClick={()=>setWhiteGloveOpen(whiteGloveOpen===d.id?null:d.id)} style={{fontSize:10,padding:"3px 10px",borderRadius:3,border:`1px solid ${wgStatus==="complete"?"#22c55e":wgStatus==="partial"?"#f59e0b":"#888"}44`,background:"transparent",color:wgStatus==="complete"?"#22c55e":wgStatus==="partial"?"#f59e0b":"#888",cursor:"pointer"}}>White Glove {wgStatus==="complete"?"✓":wgStatus==="partial"?`(${wgDone}/${wgTotal})`:"—"}</button>
                        {whiteGloveOpen===d.id&&<div style={{...S.card,marginTop:8,background:"#0a0a14"}}>
                          {[["called","Called customer 30 min ahead"],["access","Confirmed access (elevator/doorway)"],["floor","Protective floor covering laid"],["unboxed","Unboxed at customer request"],["placed","Placed in designated room"],["packaging","Packaging removed and hauled away"],["oldItem","Old item removed (if applicable)"],["signed","Customer signed delivery confirmation"],["photo","Photo of placed item taken"]].map(([key,label])=>(
                            <label key={key} style={{display:"flex",alignItems:"center",gap:8,fontSize:11,color:"#e8e4d8",marginBottom:5}}>
                              <input type="checkbox" checked={wgItems[key]||false} onChange={e=>{
                                const existing=whiteGloveLog.find(w=>w.dispatchId===d.id);
                                const newItems={...(existing?.items||{}),[key]:e.target.checked};
                                if(existing){setWhiteGloveLog(p=>p.map(w=>w.dispatchId===d.id?{...w,items:newItems}:w));}
                                else{setWhiteGloveLog(p=>[{id:Date.now(),dispatchId:d.id,items:newItems},...p]);}
                              }}/>
                              {label}
                            </label>
                          ))}
                        </div>}
                      </div>
                    </>;
                  })()}
                  {(d.status==="assigned"||d.status==="in_progress"||d.status==="issue")&&(
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {d.status==="assigned"&&<button onClick={()=>setDispatches(p=>p.map(x=>x.id===d.id?{...x,status:"in_progress"}:x))} style={{...S.btn,background:"#60a5fa",fontSize:10,padding:"5px 12px"}}>Start Run</button>}
                      {d.status==="in_progress"&&<button onClick={()=>setDispatches(p=>p.map(x=>x.id===d.id?{...x,status:"completed"}:x))} style={{...S.btn,background:"#22c55e",fontSize:10,padding:"5px 12px"}}>Complete</button>}
                      <button onClick={()=>setDispatches(p=>p.map(x=>x.id===d.id?{...x,status:"issue"}:x))} style={{background:"transparent",border:"1px solid #ef444444",color:"#ef4444",cursor:"pointer",fontSize:10,padding:"5px 10px",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>Flag Issue</button>
                      <button onClick={()=>setDispatches(p=>p.filter(x=>x.id!==d.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12,marginLeft:"auto"}}>✕</button>
                    </div>
                  )}
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* ══ INVOICES / AR ══════════════════════════════════════════════ */}
      {screen==="invoices"&&(()=>{
        const open=invoices.filter(i=>i.status==="open"||i.status==="partial");
        const paid=invoices.filter(i=>i.status==="paid");
        const overdue=open.filter(i=>i.dueDate&&new Date(i.dueDate)<new Date());
        const totalOpen=open.reduce((s,i)=>s+parseFloat(i.amount||0),0);
        const nextNum=()=>{const nums=invoices.map(i=>parseInt(i.invoiceNum?.replace(/\D/g,"")||0)).filter(Boolean);const max=nums.length>0?Math.max(...nums):1000;return`INV-${max+1}`;};
        const STATUS_COLORS={open:"#f59e0b",partial:"#60a5fa",paid:"#22c55e",void:"#555"};
        const agingLabel=(dueDate)=>{if(!dueDate)return{label:"No due date",color:"#555"};const days=Math.ceil((new Date()-new Date(dueDate))/86400000);if(days<0)return{label:`Due in ${Math.abs(days)}d`,color:"#22c55e"};if(days<=30)return{label:`${days}d overdue`,color:"#f59e0b"};if(days<=60)return{label:`${days}d overdue`,color:"#f87171"};return{label:`${days}d overdue`,color:"#ef4444"};};
        const shown=invoiceSub==="open"?open:invoiceSub==="overdue"?overdue:invoiceSub==="paid"?paid:invoices;
        return(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[[`open`,`Open (${open.length})`],[`overdue`,`Overdue (${overdue.length})`],["paid","Paid"],["all","All"]]} active={invoiceSub} onSelect={setInvoiceSub}/>
          <div style={{flex:1,overflowY:"auto",padding:24}}>
            <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div><div style={S.section}>ACCOUNTS RECEIVABLE</div><div style={{fontSize:11,color:"#555",marginTop:4}}>Track what's owed to you and how old each invoice is.</div></div>
                <button className="hov" onClick={()=>setInvoiceShowAdd(!invoiceShowAdd)} style={S.btn}>{invoiceShowAdd?"Cancel":"+ New Invoice"}</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                {[["Total Open",fmt$(totalOpen),"#f59e0b"],["Overdue",fmt$(overdue.reduce((s,i)=>s+parseFloat(i.amount||0),0)),overdue.length>0?"#ef4444":"#555"],["Collected YTD",fmt$(paid.reduce((s,i)=>s+parseFloat(i.amount||0),0)),"#22c55e"]].map(([lbl,val,col])=>(
                  <div key={lbl} style={S.card}><div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:col}}>{val}</div><div style={{fontSize:9,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:4}}>{lbl}</div></div>
                ))}
              </div>
              {invoiceShowAdd&&(
                <div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div><label style={S.label}>Client / Broker *</label><input value={invoiceForm.clientName} onChange={e=>setInvoiceForm(p=>({...p,clientName:e.target.value}))} placeholder="Hub Group, FedEx Ground..." style={S.input}/></div>
                    <div><label style={S.label}>Invoice # (auto if blank)</label><input value={invoiceForm.invoiceNum} onChange={e=>setInvoiceForm(p=>({...p,invoiceNum:e.target.value}))} placeholder={nextNum()} style={S.input}/></div>
                    <div><label style={S.label}>Amount ($) *</label><input type="number" value={invoiceForm.amount} onChange={e=>setInvoiceForm(p=>({...p,amount:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                    <div><label style={S.label}>Issue Date</label><input type="date" value={invoiceForm.issueDate} onChange={e=>setInvoiceForm(p=>({...p,issueDate:e.target.value}))} style={S.input}/></div>
                    <div><label style={S.label}>Due Date</label><input type="date" value={invoiceForm.dueDate} onChange={e=>setInvoiceForm(p=>({...p,dueDate:e.target.value}))} style={S.input}/></div>
                    <div><label style={S.label}>Description / Load #</label><input value={invoiceForm.description} onChange={e=>setInvoiceForm(p=>({...p,description:e.target.value}))} placeholder="Load ref, route, BOL #..." style={S.input}/></div>
                    <div><label style={S.label}>Notes</label><input value={invoiceForm.notes} onChange={e=>setInvoiceForm(p=>({...p,notes:e.target.value}))} placeholder="Payment terms, PO #..." style={S.input}/></div>
                  </div>
                  <button className="hov" onClick={()=>{if(!invoiceForm.clientName){showValidation("Client name is required");return;}if(!invoiceForm.amount){showValidation("Amount is required");return;}setInvoices(p=>[{...invoiceForm,id:Date.now(),invoiceNum:invoiceForm.invoiceNum||nextNum(),createdDate:new Date().toISOString().slice(0,10)},...p]);setInvoiceForm({invoiceNum:"",clientName:"",amount:"",issueDate:"",dueDate:"",description:"",status:"open",notes:""});setInvoiceShowAdd(false);}} style={{...S.btn,marginTop:14}}>Save Invoice</button>
                </div>
              )}
              {shown.length===0&&!invoiceShowAdd&&<div style={{...S.card,textAlign:"center",color:invoiceSub==="open"?"#22c55e":"#555",fontSize:12,padding:40}}>{invoiceSub==="open"?"✓ No open invoices — all caught up!":"No invoices in this category."}</div>}
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {shown.map(inv=>{const aging=agingLabel(inv.dueDate);return(
                  <div key={inv.id} style={{...S.card,borderLeft:`3px solid ${STATUS_COLORS[inv.status]||"#555"}`}}>
                  {invoiceEditId===inv.id&&(
                    <div style={{marginBottom:12}}>
                      <div style={{fontSize:9,color:accent,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Editing Invoice</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                        <div style={{gridColumn:"1/-1"}}><label style={S.label}>Client Name</label><input value={invoiceEditForm.clientName||""} onChange={e=>setInvoiceEditForm(p=>({...p,clientName:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Amount ($)</label><input type="number" value={invoiceEditForm.amount||""} onChange={e=>setInvoiceEditForm(p=>({...p,amount:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Issue Date</label><input type="date" value={invoiceEditForm.issueDate||""} onChange={e=>setInvoiceEditForm(p=>({...p,issueDate:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Due Date</label><input type="date" value={invoiceEditForm.dueDate||""} onChange={e=>setInvoiceEditForm(p=>({...p,dueDate:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Description</label><input value={invoiceEditForm.description||""} onChange={e=>setInvoiceEditForm(p=>({...p,description:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Notes</label><input value={invoiceEditForm.notes||""} onChange={e=>setInvoiceEditForm(p=>({...p,notes:e.target.value}))} style={S.input}/></div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>{setInvoices(p=>p.map(i=>i.id===inv.id?{...i,...invoiceEditForm}:i));setInvoiceEditId(null);}} style={{...S.btn,fontSize:11,padding:"6px 16px"}}>Save Changes</button>
                        <button onClick={()=>setInvoiceEditId(null)} style={{...S.ghost,fontSize:10,padding:"6px 12px"}}>Cancel</button>
                      </div>
                    </div>
                  )}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8"}}>{inv.clientName}</div>
                          <span style={{fontSize:9,color:"#555",border:"1px solid #2a2a2a",padding:"1px 7px",borderRadius:3}}>{inv.invoiceNum}</span>
                          <span style={{fontSize:9,color:STATUS_COLORS[inv.status],border:`1px solid ${STATUS_COLORS[inv.status]}44`,padding:"1px 7px",borderRadius:3,textTransform:"uppercase"}}>{inv.status}</span>
                        </div>
                        <div style={{fontSize:10,color:"#555"}}>{inv.description&&`${inv.description} · `}Issued: {fmtDate(inv.issueDate||inv.createdDate)}{inv.dueDate&&` · Due: ${fmtDate(inv.dueDate)}`}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0,marginLeft:16}}>
                        <div style={{fontSize:20,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:inv.status==="paid"?"#22c55e":"#e8e4d8"}}>{fmt$(parseFloat(inv.amount||0))}</div>
                        {inv.status!=="paid"&&inv.dueDate&&<div style={{fontSize:10,color:aging.color,fontWeight:700}}>{aging.label}</div>}
                        {inv.status==="paid"&&<div style={{fontSize:10,color:"#22c55e"}}>Paid {fmtDate(inv.paidDate)}</div>}
                      </div>
                    </div>
                    {inv.status!=="paid"&&inv.status!=="void"&&(
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>setInvoices(p=>p.map(i=>i.id===inv.id?{...i,status:"paid",paidDate:new Date().toISOString().slice(0,10)}:i))} style={{...S.btn,background:"#22c55e",fontSize:10,padding:"5px 14px"}}>Mark Paid</button>
                        <button onClick={()=>setInvoices(p=>p.map(i=>i.id===inv.id?{...i,status:"partial"}:i))} style={{background:"transparent",border:"1px solid #60a5fa44",color:"#60a5fa",cursor:"pointer",fontSize:10,padding:"5px 10px",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>Partial</button>
                        <button onClick={()=>{setInvoiceEditId(inv.id);setInvoiceEditForm({clientName:inv.clientName,amount:inv.amount,issueDate:inv.issueDate||"",dueDate:inv.dueDate||"",description:inv.description||"",notes:inv.notes||""});}} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"5px 10px",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                        <button onClick={()=>setInvoices(p=>p.filter(x=>x.id!==inv.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12,marginLeft:"auto"}}>✕</button>
                      </div>
                    )}
                  </div>
                );})}
              </div>
            </div>
          </div>
        </div>
      )})()}

      {/* ══ CONTACTS ═══════════════════════════════════════════════════ */}
      {screen==="contacts"&&(()=>{
        const CONTACT_TYPES=["Client","Broker","Shipper","Receiver","Dispatcher","Vendor","Insurance","Other"];
        const TYPE_COLORS={Client:"#22c55e",Broker:"#f59e0b",Shipper:"#60a5fa",Receiver:"#8888cc",Dispatcher:"#f87171",Vendor:"#555",Insurance:"#ef4444",Other:"#444"};
        const filtered=contacts.filter(c=>{const matchType=contactFilter==="all"||c.type===contactFilter;const matchSearch=!contactSearch||c.name.toLowerCase().includes(contactSearch.toLowerCase())||(c.company||"").toLowerCase().includes(contactSearch.toLowerCase());return matchType&&matchSearch;});
        return(
        <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:24}}>
          <div style={{maxWidth:860,margin:"0 auto",overflowX:"hidden",animation:"fadeUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div><div style={S.section}>CONTACTS</div><div style={{fontSize:11,color:"#555",marginTop:4}}>Clients, brokers, shippers, dispatchers, and vendors in one place.</div></div>
              <button className="hov" onClick={()=>setContactShowAdd(!contactShowAdd)} style={S.btn}>{contactShowAdd?"Cancel":"+ Add Contact"}</button>
            </div>
            {contactShowAdd&&(
              <div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Name *</label><input value={contactForm.name} onChange={e=>setContactForm(p=>({...p,name:e.target.value}))} placeholder="Contact name" style={S.input}/></div>
                  <div><label style={S.label}>Company</label><input value={contactForm.company} onChange={e=>setContactForm(p=>({...p,company:e.target.value}))} placeholder="Company name" style={S.input}/></div>
                  <div><label style={S.label}>Type</label><select value={contactForm.type} onChange={e=>setContactForm(p=>({...p,type:e.target.value}))} style={S.input}>{CONTACT_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                  <div><label style={S.label}>Phone</label><input value={contactForm.phone} onChange={e=>setContactForm(p=>({...p,phone:e.target.value}))} placeholder="(864) 555-0100" style={S.input}/></div>
                  <div><label style={S.label}>Email</label><input type="email" value={contactForm.email} onChange={e=>setContactForm(p=>({...p,email:e.target.value}))} placeholder="contact@company.com" style={S.input}/></div>
                  <div><label style={S.label}>Address / City</label><input value={contactForm.address} onChange={e=>setContactForm(p=>({...p,address:e.target.value}))} placeholder="City, ST" style={S.input}/></div>
                  {(contactForm.type==="Broker"||contactForm.type==="Client")&&<><div><label style={S.label}>Pay Speed (days)</label><input type="number" value={contactForm.paySpeed} onChange={e=>setContactForm(p=>({...p,paySpeed:e.target.value}))} placeholder="30" style={S.input}/></div><div><label style={S.label}>Rating (1–5)</label><input type="number" min={1} max={5} value={contactForm.rating} onChange={e=>setContactForm(p=>({...p,rating:e.target.value}))} placeholder="5" style={S.input}/></div></>}
                  <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><textarea value={contactForm.notes} onChange={e=>setContactForm(p=>({...p,notes:e.target.value}))} placeholder="Payment terms, dock hours, store code..." style={{...S.input,height:70,resize:"vertical"}}/></div>
                </div>
                <button className="hov" onClick={()=>{if(!contactForm.name){showValidation("Contact name is required");return;}setContacts(p=>[{...contactForm,id:Date.now(),createdDate:new Date().toISOString().slice(0,10)},...p]);setContactForm({name:"",company:"",type:"Client",phone:"",email:"",address:"",notes:"",paySpeed:"",rating:""});setContactShowAdd(false);}} style={{...S.btn,marginTop:14}}>Save Contact</button>
              </div>
            )}
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
              <input value={contactSearch} onChange={e=>setContactSearch(e.target.value)} placeholder="Search contacts..." style={{...S.input,maxWidth:260}}/>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["all",...CONTACT_TYPES].map(t=>(
                  <button key={t} onClick={()=>setContactFilter(t)} style={{background:contactFilter===t?accent+"22":"transparent",border:`1px solid ${contactFilter===t?accent:"#2a2a2a"}`,color:contactFilter===t?accent:"#555",padding:"4px 10px",borderRadius:4,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>{t==="all"?`All (${contacts.length})`:t}</button>
                ))}
              </div>
            </div>
            {filtered.length===0&&!contactShowAdd&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>{contacts.length===0?"No contacts yet. Add clients, brokers, and business contacts here.":"No contacts match your filter."}</div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
              {filtered.map(c=>(
                <div key={c.id} style={{...S.card,borderTop:`3px solid ${TYPE_COLORS[c.type]||"#555"}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8"}}>{c.name}</div>{c.company&&<div style={{fontSize:10,color:"#555"}}>{c.company}</div>}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:8,color:TYPE_COLORS[c.type]||"#555",border:`1px solid ${TYPE_COLORS[c.type]||"#555"}44`,padding:"2px 6px",borderRadius:3,textTransform:"uppercase"}}>{c.type}</span><button onClick={()=>setContacts(p=>p.filter(x=>x.id!==c.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button></div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {c.phone&&<div style={{fontSize:11,color:"#888"}}>📞 <a href={`tel:${c.phone}`} style={{color:accent,textDecoration:"none"}}>{c.phone}</a></div>}
                    {c.email&&<div style={{fontSize:11,color:"#888"}}>✉ <a href={`mailto:${c.email}`} style={{color:accent,textDecoration:"none"}}>{c.email}</a></div>}
                    {c.address&&<div style={{fontSize:11,color:"#888"}}>📍 {c.address}</div>}
                    {c.paySpeed&&<div style={{fontSize:10,color:"#555"}}>Pay: {c.paySpeed}d{c.rating?` · ${"★".repeat(parseInt(c.rating||0))}`:""}</div>}
                    {c.notes&&<div style={{fontSize:10,color:"#444",marginTop:4,fontStyle:"italic",lineHeight:1.5}}>{c.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )})()}

      {/* ══ DOCUMENTS ══════════════════════════════════════════════════ */}
      {screen==="documents"&&(()=>{
        const DOC_TYPES=["Rate Confirmation","Bill of Lading (BOL)","Delivery Confirmation","Insurance Certificate","Contract","Invoice","Driver File","Inspection Report","Permit","Other"];
        const TYPE_COLORS={"Rate Confirmation":"#f59e0b","Bill of Lading (BOL)":"#60a5fa","Delivery Confirmation":"#22c55e","Insurance Certificate":"#ef4444","Contract":"#8888cc","Invoice":"#22c55e","Driver File":"#60a5fa","Inspection Report":"#f59e0b","Permit":"#f87171","Other":"#555"};
        const types=["all",...DOC_TYPES];
        const filtered=docFilter==="all"?documents:documents.filter(d=>d.type===docFilter);
        const typeCount={};documents.forEach(d=>{typeCount[d.type]=(typeCount[d.type]||0)+1;});
        const handleFileUpload=(e)=>{const file=e.target.files[0];if(!file)return;if(file.size>2*1024*1024){alert("File too large for localStorage (max 2MB). Use filename/reference only for large files.");return;}const reader=new FileReader();reader.onload=(ev)=>{setDocFileData({name:file.name,dataUrl:ev.target.result,size:file.size});setDocForm(p=>({...p,fileName:file.name}));};reader.readAsDataURL(file);};
        return(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:900,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div><div style={S.section}>DOCUMENT CENTER</div><div style={{fontSize:11,color:"#555",marginTop:4}}>Rate cons, BOLs, insurance certs, and all key documents.</div></div>
              <button className="hov" onClick={()=>setDocShowAdd(!docShowAdd)} style={S.btn}>{docShowAdd?"Cancel":"+ Add Document"}</button>
            </div>
            <div style={{background:"#0a0f1a",border:"1px solid #1a1a3a",borderRadius:8,padding:"12px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
              <div style={{fontSize:20}}>📎</div>
              <div style={{fontSize:10,color:"#4a4a8a",lineHeight:1.7}}>Small files (&lt;2MB) are stored as Base64 in localStorage. For large files, log the filename/reference here and keep the original in Google Drive or Dropbox. Cloud sync coming in next update.</div>
            </div>
            {docShowAdd&&(
              <div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div style={{gridColumn:"1/-1"}}><label style={S.label}>Document Name *</label><input value={docForm.name} onChange={e=>setDocForm(p=>({...p,name:e.target.value}))} placeholder="Rate Con #1234 — Hub Group, BOL Chicago run..." style={S.input}/></div>
                  <div><label style={S.label}>Type</label><select value={docForm.type} onChange={e=>setDocForm(p=>({...p,type:e.target.value}))} style={S.input}>{DOC_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                  <div><label style={S.label}>Date</label><input type="date" value={docForm.date} onChange={e=>setDocForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                  <div><label style={S.label}>Linked To (truck / driver / load)</label><input value={docForm.linkedTo} onChange={e=>setDocForm(p=>({...p,linkedTo:e.target.value}))} placeholder="Unit 1, John Smith, Load #5678..." style={S.input}/></div>
                  <div>
                    <label style={S.label}>File (optional, max 2MB)</label>
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.csv,.xlsx" onChange={async(e)=>{
                      handleFileUpload(e);
                      // OCR: if it's an image/pdf, try to extract key fields using Claude
                      const file = e.target.files?.[0];
                      if(!file||(file.type!=="image/jpeg"&&file.type!=="image/png"&&file.type!=="application/pdf")) return;
                      if(file.size > 2*1024*1024) return;
                      try {
                        const reader = new FileReader();
                        reader.onload = async(ev) => {
                          const base64 = ev.target.result.split(",")[1];
                          const mediaType = file.type === "application/pdf" ? "application/pdf" : file.type;
                          const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
                          if(!apiKey) return;
                          const res = await fetch("https://api.anthropic.com/v1/messages", {
                            method:"POST",
                            headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
                            body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,messages:[{role:"user",content:[{type:mediaType==="application/pdf"?"document":"image",source:{type:"base64",media_type:mediaType,data:base64}},{type:"text",text:"Extract these fields from this document if present. Return ONLY a JSON object with these keys (null if not found): documentName, documentType (Rate Confirmation/BOL/Delivery Confirmation/Invoice/Other), date (YYYY-MM-DD), linkedTo (truck or driver name), referenceNumber, notes (any important info like load#, PO#, rate amount). No other text."}]}]})
                          });
                          const data = await res.json();
                          try {
                            const text = data.content?.[0]?.text || "{}";
                            const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
                            if(parsed.documentName) setDocForm(p=>({...p,name:parsed.documentName||p.name,type:parsed.documentType||p.type,date:parsed.date||p.date,linkedTo:parsed.linkedTo||p.linkedTo,fileName:file.name,notes:parsed.notes||p.notes}));
                          } catch{}
                        };
                        reader.readAsDataURL(file);
                      } catch{}
                    }} style={{...S.input,padding:"7px 14px"}}/>
                    <div style={{fontSize:9,color:"#444",marginTop:4}}>💡 Images and PDFs are automatically scanned to fill in document details</div>
                  </div>
                  <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={docForm.notes} onChange={e=>setDocForm(p=>({...p,notes:e.target.value}))} placeholder="Confirmation #, broker contact, expiry..." style={S.input}/></div>
                </div>
                {docFileData&&<div style={{marginTop:8,fontSize:10,color:"#22c55e"}}>✓ {docFileData.name} ({(docFileData.size/1024).toFixed(0)}KB) — will be stored in browser</div>}
                <button className="hov" onClick={()=>{if(!docForm.name){showValidation("Document name is required");return;}const doc={...docForm,id:Date.now(),createdDate:new Date().toISOString().slice(0,10),fileData:docFileData?.dataUrl||null,fileSize:docFileData?.size||null};setDocuments(p=>[doc,...p]);setDocForm({name:"",type:"Rate Confirmation",date:"",linkedTo:"",notes:"",fileName:""});setDocFileData(null);setDocShowAdd(false);}} style={{...S.btn,marginTop:14}}>Save Document</button>
              </div>
            )}
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
              {types.map(t=>(<button key={t} onClick={()=>setDocFilter(t)} style={{background:docFilter===t?accent+"22":"transparent",border:`1px solid ${docFilter===t?accent:"#2a2a2a"}`,color:docFilter===t?accent:"#555",padding:"4px 12px",borderRadius:4,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>{t==="all"?`All (${documents.length})`:`${t} (${typeCount[t]||0})`}</button>))}
            </div>
            {filtered.length===0&&!docShowAdd&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>{docFilter==="all"?"No documents tracked yet.":`No ${docFilter} documents yet.`}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filtered.map(doc=>(
                <div key={doc.id} style={{...S.card,borderLeft:`3px solid ${TYPE_COLORS[doc.type]||"#555"}`}}>
                  {docEditId===doc.id?(
                    <div>
                      <div style={{fontSize:9,color:accent,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Editing Document</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                        <div style={{gridColumn:"1/-1"}}><label style={S.label}>Name</label><input value={docEditForm.name||""} onChange={e=>setDocEditForm(p=>({...p,name:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Type</label><select value={docEditForm.type||""} onChange={e=>setDocEditForm(p=>({...p,type:e.target.value}))} style={S.input}>{DOC_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                        <div><label style={S.label}>Date</label><input type="date" value={docEditForm.date||""} onChange={e=>setDocEditForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Linked To</label><input value={docEditForm.linkedTo||""} onChange={e=>setDocEditForm(p=>({...p,linkedTo:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>File Name / Reference</label><input value={docEditForm.fileName||""} onChange={e=>setDocEditForm(p=>({...p,fileName:e.target.value}))} style={S.input}/></div>
                        <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={docEditForm.notes||""} onChange={e=>setDocEditForm(p=>({...p,notes:e.target.value}))} style={S.input}/></div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>{setDocuments(p=>p.map(d=>d.id===doc.id?{...d,...docEditForm}:d));setDocEditId(null);}} style={{...S.btn,fontSize:11,padding:"6px 16px"}}>Save</button>
                        <button onClick={()=>setDocEditId(null)} style={{...S.ghost,fontSize:10,padding:"6px 12px"}}>Cancel</button>
                      </div>
                    </div>
                  ):(
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                          <div style={{fontSize:12,color:"#c8c4bc"}}>{doc.name}</div>
                          <span style={{fontSize:9,color:TYPE_COLORS[doc.type]||"#555",border:`1px solid ${TYPE_COLORS[doc.type]||"#555"}33`,padding:"1px 7px",borderRadius:3}}>{doc.type}</span>
                        </div>
                        <div style={{fontSize:10,color:"#555"}}>{fmtDate(doc.date||doc.createdDate)}{doc.linkedTo&&` · ${doc.linkedTo}`}{doc.fileName&&` · ${doc.fileName}`}{doc.notes&&` · ${doc.notes}`}</div>
                      </div>
                      <div style={{display:"flex",gap:8,flexShrink:0,alignItems:"center"}}>
                        {doc.fileData&&<a href={doc.fileData} download={doc.fileName||doc.name} style={{...S.btn,background:"#22c55e",fontSize:10,padding:"5px 12px",textDecoration:"none",display:"inline-block"}}>↓ Download</a>}
                        <div style={{fontSize:9,color:"#333",border:"1px solid #222",padding:"2px 8px",borderRadius:3}}>{doc.fileData?"📎 File":"📋 Ref"}</div>
                        <button onClick={()=>{setDocEditId(doc.id);setDocEditForm({name:doc.name,type:doc.type,date:doc.date||"",linkedTo:doc.linkedTo||"",fileName:doc.fileName||"",notes:doc.notes||""});}} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"4px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                        <button onClick={()=>setDocuments(p=>p.filter(x=>x.id!==doc.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )})()}

      {/* ══ DATA & BACKUP ══════════════════════════════════════════════ */}
      {screen==="data"&&(()=>{
        const currentYear=new Date().getFullYear();const lastYear=currentYear-1;
        const yearTotals=(yr)=>{const rev=revenue.filter(r=>r.date?.startsWith(yr.toString())).reduce((s,r)=>s+parseFloat(r.amount||0),0);const exp=expenses.filter(e=>e.date?.startsWith(yr.toString())).reduce((s,e)=>s+parseFloat(e.amount||0),0);return{rev,exp,net:rev-exp};};
        const cy=yearTotals(currentYear);const ly=yearTotals(lastYear);
        const revChange=ly.rev>0?(((cy.rev-ly.rev)/ly.rev)*100).toFixed(1):null;
        const netChange=ly.net!==0?(((cy.net-ly.net)/Math.abs(ly.net))*100).toFixed(1):null;
        const downloadJSON=()=>{const allData={exportDate:new Date().toISOString(),version:"ContractorOS-v10",revenue,expenses,drivers,vehicles,maintenance,compliance,contracts,incidents,brokers,loads,dispatches,payroll,fuelLog,invoices,odometer,tires,documents:documents.map(d=>({...d,fileData:undefined})),contacts};const blob=new Blob([JSON.stringify(allData,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`ContractorOS_Backup_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);};
        const downloadCSV=(data,filename,cols)=>{if(!data.length)return;const header=cols.join(",");const rows=data.map(r=>cols.map(c=>`"${(r[c]||"").toString().replace(/"/g,'""')}"`).join(","));const blob=new Blob([[header,...rows].join("\n")],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);};
        return(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
            <div style={{...S.section,marginBottom:4}}>DATA & BACKUP</div>
            <p style={{fontSize:11,color:"#555",marginBottom:24,lineHeight:1.8}}>Export your data for backup, accounting, or migration. ContractorOS stores everything in your browser — export regularly so you don't lose anything if you clear your cache.</p>
            {/* Year-over-year */}
            <div style={{...S.card,marginBottom:24,background:"#0d0d14",border:"1px solid #1a1a2a"}}>
              <div style={{fontSize:10,color:"#3a3a6a",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>Year-Over-Year Comparison</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                {[["Revenue",fmt$(ly.rev),fmt$(cy.rev),revChange],["Expenses",fmt$(ly.exp),fmt$(cy.exp),null],["Net Profit",fmt$(ly.net),fmt$(cy.net),netChange]].map(([lbl,prev,curr,chg])=>{const isPos=lbl==="Expenses"?false:parseFloat(chg)>0;return(
                  <div key={lbl} style={{background:"#0f0f1a",border:"1px solid #1a1a2a",borderRadius:6,padding:14}}>
                    <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>{lbl}</div>
                    <div style={{marginBottom:6}}><div style={{fontSize:10,color:"#444"}}>{lastYear}</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#666"}}>{prev}</div></div>
                    <div><div style={{fontSize:10,color:"#666"}}>{currentYear}</div><div style={{fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:lbl==="Expenses"?"#ef4444":"#22c55e"}}>{curr}</div></div>
                    {chg!==null&&<div style={{marginTop:8,fontSize:11,color:isPos?"#22c55e":"#ef4444",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{parseFloat(chg)>0?"▲":"▼"} {Math.abs(parseFloat(chg))}% vs last year</div>}
                  </div>
                );})}
              </div>
            </div>
            {/* Restore from backup */}
            <div style={{...S.card,marginBottom:20,background:"#0a0f1a",border:"1px solid #1a1a3a"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8"}}>Restore from Backup</div>
                  <div style={{fontSize:11,color:"#555",marginTop:4}}>Upload a previously exported JSON backup to restore all your data.</div>
                </div>
              </div>
              <input type="file" accept=".json" onChange={async(e)=>{
                const file = e.target.files[0];
                if(!file) return;
                try {
                  const text = await file.text();
                  const data = JSON.parse(text);
                  if(!data.version?.includes("ContractorOS")) { alert("This doesn't look like a ContractorOS backup file."); return; }
                  if(!window.confirm("Restore this backup? This will replace ALL current data. Make sure to export a backup of your current data first.")) return;
                  // Restore each data slice
                  const restoreMap = {revenue:setRevenue,expenses:setExpenses,drivers:setDrivers,vehicles:setVehicles,maintenance:setMaintenance,compliance:setCompliance,contracts:setContracts,incidents:setIncidents,brokers:setBrokers,loads:setLoads,routes:setRoutes,payroll:setPayroll,fuelLog:setFuelLog,invoices:setInvoices,odometer:setOdometer,tires:setTires,contacts:setContacts,dispatches:setDispatches,hosLog:setHosLog};
                  Object.entries(restoreMap).forEach(([key,setter])=>{ if(data[key]) setter(data[key]); });
                  if(data.settings) setSettings(data.settings);
                  if(data.segment) setSegment(data.segment);
                  alert("✓ Backup restored successfully! Your data has been updated.");
                } catch(err) { alert("Failed to read backup file. Make sure it's a valid ContractorOS JSON export."); }
                e.target.value = "";
              }} style={{...S.input,padding:"8px 14px",cursor:"pointer"}}/>
              <div style={{marginTop:8,fontSize:10,color:"#3a3a6a",lineHeight:1.7}}>⚠ Restoring a backup replaces all current data. Always export a fresh backup before restoring.</div>
            </div>

            {/* Full backup */}
            <div style={{...S.card,marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8"}}>Full Data Backup (JSON)</div><div style={{fontSize:11,color:"#555",marginTop:4}}>Exports all data — drivers, vehicles, compliance, finance, payroll, everything. Note: uploaded files are excluded to keep backup small.</div></div>
                <button className="hov" onClick={downloadJSON} style={S.btn}>Download →</button>
              </div>
              <div style={{padding:"10px 14px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,fontSize:10,color:"#444",lineHeight:1.7}}>💡 <strong style={{color:"#666"}}>Tip:</strong> Save to Google Drive or Dropbox. If you clear browser cache, this is your only recovery option until cloud sync is added.</div>
            </div>
            {/* CSV exports */}
            <div style={{...S.card,marginBottom:20}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:4}}>Spreadsheet Exports (CSV)</div>
              <div style={{fontSize:11,color:"#555",marginBottom:16}}>Individual tables as CSV — open in Excel, Google Sheets, or send to your accountant.</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                {[[revenue,"Revenue","revenue.csv",["date","description","amount","vehicle"]],[expenses,"Expenses","expenses.csv",["date","category","amount","description","vehicle"]],[drivers,"Drivers","drivers.csv",["name","phone","hireDate","payType","payRate","status"]],[maintenance,"Maintenance","maintenance.csv",["truckName","type","date","mileage","cost","notes"]],[payroll,"Payroll","payroll.csv",["driverName","periodStart","periodEnd","gross","status","paidDate"]],[fuelLog,"Fuel Log","fuel.csv",["date","truckName","gallons","pricePerGallon","totalCost","state"]]].map(([data,label,file,cols])=>(
                  <button key={file} className="hov" onClick={()=>downloadCSV(data,file,cols)} style={{...S.card,textAlign:"left",cursor:"pointer",display:"block",border:`1px solid ${accent}33`}}>
                    <div style={{fontSize:13,color:accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{label}</div>
                    <div style={{fontSize:10,color:"#555",marginTop:3}}>{data.length} records · .csv</div>
                  </button>
                ))}
              </div>
            </div>
            {/* Danger zone */}
            <div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:4}}>⚠ Danger Zone</div>
              <div style={{fontSize:11,color:"#7a4040",marginBottom:14,lineHeight:1.7}}>Permanently deletes data from your browser. <strong>Download a backup first.</strong> Cannot be undone.</div>
              <button onClick={()=>{if(window.confirm("Delete ALL ContractorOS data? This cannot be undone. Have you downloaded a backup?")){db.clearAll().then(()=>window.location.reload());}}} style={{...S.danger,fontSize:11,padding:"8px 16px"}}>Clear All Data</button>
            </div>
          </div>
        </div>
      )})()}

      {/* ── D11: Stop Profit Screen ── */}
      {screen==="stopprofit"&&(segment==="fedex"||segment==="lastmile")&&(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:"#e8e4d8",marginBottom:16}}>📍 Stop Profit</div>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              {[["entry","Daily Entry"],["trend","Weekly Trend"]].map(([t,l])=>(
                <button key={t} className="hov" onClick={()=>setStopProfitTab(t)} style={{...S.btn,background:stopProfitTab===t?accent:"#1e1e1e",color:stopProfitTab===t?"#000":"#888"}}>{l}</button>
              ))}
            </div>
            {stopProfitTab==="entry"&&(()=>{
              const totalRev=(parseFloat(stopProfitForm.stops||0)*parseFloat(stopProfitForm.revenuePerStop||0));
              const totalCost=(parseFloat(stopProfitForm.driverPay||0)+parseFloat(stopProfitForm.fuelCost||0)+parseFloat(stopProfitForm.vehicleCost||0)+parseFloat(stopProfitForm.otherCosts||0));
              const grossProfit=totalRev-totalCost;
              const netPerStop=parseFloat(stopProfitForm.stops||0)>0?grossProfit/parseFloat(stopProfitForm.stops):0;
              const margin=totalRev>0?(grossProfit/totalRev*100):0;
              const marginColor=margin>=20?"#22c55e":margin>=10?"#f59e0b":"#ef4444";
              return <div>
                <div style={{...S.card,marginBottom:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>New Entry</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <input type="date" value={stopProfitForm.date} onChange={e=>setStopProfitForm(p=>({...p,date:e.target.value}))} style={S.input}/>
                    <input placeholder="Stops Completed" type="number" value={stopProfitForm.stops} onChange={e=>setStopProfitForm(p=>({...p,stops:e.target.value}))} style={S.input}/>
                    <input placeholder="Revenue Per Stop $" type="number" value={stopProfitForm.revenuePerStop} onChange={e=>setStopProfitForm(p=>({...p,revenuePerStop:e.target.value}))} style={S.input}/>
                    <input placeholder="Driver Pay $" type="number" value={stopProfitForm.driverPay} onChange={e=>setStopProfitForm(p=>({...p,driverPay:e.target.value}))} style={S.input}/>
                    <input placeholder="Fuel Cost $" type="number" value={stopProfitForm.fuelCost} onChange={e=>setStopProfitForm(p=>({...p,fuelCost:e.target.value}))} style={S.input}/>
                    <input placeholder="Vehicle Cost $" type="number" value={stopProfitForm.vehicleCost} onChange={e=>setStopProfitForm(p=>({...p,vehicleCost:e.target.value}))} style={S.input}/>
                    <input placeholder="Other Costs $" type="number" value={stopProfitForm.otherCosts} onChange={e=>setStopProfitForm(p=>({...p,otherCosts:e.target.value}))} style={S.input}/>
                  </div>
                  {(totalRev>0||totalCost>0)&&<div style={{...S.card,background:"#0a0a14",marginBottom:10}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8}}>
                      <div><div style={{fontSize:10,color:"#888"}}>Total Revenue</div><div style={{fontSize:16,fontWeight:700,color:accent}}>${totalRev.toFixed(2)}</div></div>
                      <div><div style={{fontSize:10,color:"#888"}}>Total Cost</div><div style={{fontSize:16,fontWeight:700,color:"#e8e4d8"}}>${totalCost.toFixed(2)}</div></div>
                      <div><div style={{fontSize:10,color:"#888"}}>Gross Profit</div><div style={{fontSize:16,fontWeight:700,color:grossProfit>=0?"#22c55e":"#ef4444"}}>${grossProfit.toFixed(2)}</div></div>
                      <div><div style={{fontSize:10,color:"#888"}}>Net/Stop</div><div style={{fontSize:16,fontWeight:700,color:marginColor}}>${netPerStop.toFixed(2)}</div></div>
                      <div><div style={{fontSize:10,color:"#888"}}>Margin</div><div style={{fontSize:16,fontWeight:700,color:marginColor}}>{margin.toFixed(1)}%</div></div>
                    </div>
                  </div>}
                  <button className="hov" onClick={()=>{
                    if(!stopProfitForm.stops||!stopProfitForm.date)return;
                    const rev=parseFloat(stopProfitForm.stops)*parseFloat(stopProfitForm.revenuePerStop||0);
                    const cost=parseFloat(stopProfitForm.driverPay||0)+parseFloat(stopProfitForm.fuelCost||0)+parseFloat(stopProfitForm.vehicleCost||0)+parseFloat(stopProfitForm.otherCosts||0);
                    const gp=rev-cost;const np=parseFloat(stopProfitForm.stops)>0?gp/parseFloat(stopProfitForm.stops):0;const mg=rev>0?gp/rev*100:0;
                    setStopProfitLog(prev=>[{id:Date.now(),...stopProfitForm,totalRevenue:rev,totalCost:cost,grossProfit:gp,netPerStop:np,margin:mg},...prev]);
                    setStopProfitForm({date:"",stops:"",revenuePerStop:"",driverPay:"",fuelCost:"",vehicleCost:"",otherCosts:""});
                  }} style={S.btn}>Save Entry</button>
                </div>
                {stopProfitLog.length===0&&<div style={{color:"#555",fontSize:12}}>No entries yet.</div>}
                {stopProfitLog.slice(0,10).map(e=>{
                  const mc=parseFloat(e.margin||0)>=20?"#22c55e":parseFloat(e.margin||0)>=10?"#f59e0b":"#ef4444";
                  return <div key={e.id} style={{...S.card,marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:12,color:"#e8e4d8"}}>{e.date} · {e.stops} stops</div>
                        <div style={{fontSize:11,color:"#888"}}>Rev: ${parseFloat(e.totalRevenue||0).toFixed(0)} · Cost: ${parseFloat(e.totalCost||0).toFixed(0)}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:16,fontWeight:700,color:mc}}>${parseFloat(e.netPerStop||0).toFixed(2)}/stop</div>
                        <div style={{fontSize:10,color:mc}}>{parseFloat(e.margin||0).toFixed(1)}% margin</div>
                      </div>
                    </div>
                  </div>;
                })}
              </div>;
            })()}
            {stopProfitTab==="trend"&&(()=>{
              const last14=stopProfitLog.slice(0,14).reverse();
              const maxNet=Math.max(...last14.map(e=>Math.abs(parseFloat(e.netPerStop||0))),1);
              const weekEntries=stopProfitLog.filter(e=>{const d=new Date(e.date);const now=new Date();const diff=(now-d)/(1000*60*60*24);return diff<7;});
              const avgMargin=weekEntries.length?weekEntries.reduce((s,e)=>s+parseFloat(e.margin||0),0)/weekEntries.length:0;
              const totalProfit=weekEntries.reduce((s,e)=>s+parseFloat(e.grossProfit||0),0);
              return <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12,marginBottom:16}}>
                  <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Avg Margin This Week</div><div style={{fontSize:24,fontWeight:700,color:avgMargin>=20?"#22c55e":avgMargin>=10?"#f59e0b":"#ef4444"}}>{avgMargin.toFixed(1)}%</div></div>
                  <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Total Profit This Week</div><div style={{fontSize:24,fontWeight:700,color:accent}}>${totalProfit.toFixed(0)}</div></div>
                </div>
                {last14.length===0&&<div style={{color:"#555",fontSize:12}}>No entries to chart yet.</div>}
              </div>;
            })()}
          </div>
        </div>
      )}

      {/* ── D12: Settlement Screen ── */}
      {screen==="settlement"&&(segment==="fedex"||segment==="amazon")&&(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:"#e8e4d8",marginBottom:16}}>💳 Settlement</div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {[["entry","Weekly Entry"],["history","History"]].map(([t,l])=>(
                <button key={t} className="hov" onClick={()=>setSettlementTab(t)} style={{...S.btn,background:settlementTab===t?accent:"#1e1e1e",color:settlementTab===t?"#000":"#888"}}>{l}</button>
              ))}
            </div>
            {settlementTab==="entry"&&(()=>{
              const expectedTotal=(parseFloat(settlementForm.stops||0)*parseFloat(settlementForm.ratePerStop||0))+parseFloat(settlementForm.stopBonuses||0)+parseFloat(settlementForm.fuelSurcharge||0);
              const actual=parseFloat(settlementForm.amountDeposited||0);
              const variance=actual-expectedTotal;
              return <div>
                <div style={{...S.card,marginBottom:16}}>
                  <input type="date" placeholder="Week Ending" value={settlementForm.weekEnding} onChange={e=>setSettlementForm(p=>({...p,weekEnding:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <input placeholder="Stops" type="number" value={settlementForm.stops} onChange={e=>setSettlementForm(p=>({...p,stops:e.target.value}))} style={S.input}/>
                    <input placeholder="Rate Per Stop $" type="number" value={settlementForm.ratePerStop} onChange={e=>setSettlementForm(p=>({...p,ratePerStop:e.target.value}))} style={S.input}/>
                    <input placeholder="Stop Bonuses $" type="number" value={settlementForm.stopBonuses} onChange={e=>setSettlementForm(p=>({...p,stopBonuses:e.target.value}))} style={S.input}/>
                    <input placeholder="Fuel Surcharge $" type="number" value={settlementForm.fuelSurcharge} onChange={e=>setSettlementForm(p=>({...p,fuelSurcharge:e.target.value}))} style={S.input}/>
                  </div>
                  {expectedTotal>0&&<div style={{...S.card,background:"#0a0a14",marginBottom:8}}>Expected: <span style={{color:accent,fontWeight:700}}>${expectedTotal.toFixed(2)}</span></div>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <input placeholder="Amount Deposited $" type="number" value={settlementForm.amountDeposited} onChange={e=>setSettlementForm(p=>({...p,amountDeposited:e.target.value}))} style={S.input}/>
                    <input type="date" placeholder="Deposit Date" value={settlementForm.depositDate} onChange={e=>setSettlementForm(p=>({...p,depositDate:e.target.value}))} style={S.input}/>
                  </div>
                  {actual>0&&expectedTotal>0&&<div style={{...S.card,background:variance<0?"#1a0808":"#081a08",border:`1px solid ${variance<0?"#ef444455":"#22c55e55"}`,marginBottom:10}}>
                    <div style={{fontSize:14,fontWeight:700,color:variance<0?"#ef4444":"#22c55e"}}>
                      {variance<0?`⚠ Underpaid by $${Math.abs(variance).toFixed(2)}`:`✓ Payment matches (+$${variance.toFixed(2)})`}
                    </div>
                  </div>}
                  <textarea placeholder="Notes" value={settlementForm.notes} onChange={e=>setSettlementForm(p=>({...p,notes:e.target.value}))} style={{...S.input,marginBottom:8,minHeight:60}}/>
                  <button className="hov" onClick={()=>{
                    if(!settlementForm.weekEnding)return;
                    const exp=(parseFloat(settlementForm.stops||0)*parseFloat(settlementForm.ratePerStop||0))+parseFloat(settlementForm.stopBonuses||0)+parseFloat(settlementForm.fuelSurcharge||0);
                    const act=parseFloat(settlementForm.amountDeposited||0);
                    setSettlementLog(prev=>[{id:Date.now(),...settlementForm,expectedTotal:exp,variance:act-exp},...prev]);
                    setSettlementForm({weekEnding:"",stops:"",ratePerStop:"",stopBonuses:"",fuelSurcharge:"",amountDeposited:"",depositDate:"",notes:""});
                  }} style={S.btn}>Save Week</button>
                </div>
              </div>;
            })()}
            {settlementTab==="history"&&<div>
              {settlementLog.length===0&&<div style={{color:"#555",fontSize:12}}>No settlement records yet.</div>}
              {settlementLog.map(l=>(
                <div key={l.id} style={{...S.card,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:13,color:"#e8e4d8"}}>Week ending {l.weekEnding}</div>
                      <div style={{fontSize:11,color:"#888"}}>Expected: ${parseFloat(l.expectedTotal||0).toFixed(2)} · Actual: ${parseFloat(l.amountDeposited||0).toFixed(2)}</div>
                    </div>
                    <span style={{fontSize:13,fontWeight:700,color:parseFloat(l.variance||0)>=0?"#22c55e":"#ef4444"}}>{parseFloat(l.variance||0)>=0?"+":""}{parseFloat(l.variance||0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>}
          </div>
        </div>
      )}

      {/* ── D13: Driver Schedule Screen ── */}
      {screen==="driverschedule"&&(segment==="fedex"||segment==="amazon")&&(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:900,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:"#e8e4d8",marginBottom:16}}>📅 Driver Schedule</div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {[["weekly","Weekly Schedule"],["availability","Availability"]].map(([t,l])=>(
                <button key={t} className="hov" onClick={()=>setScheduleTab(t)} style={{...S.btn,background:scheduleTab===t?accent:"#1e1e1e",color:scheduleTab===t?"#000":"#888"}}>{l}</button>
              ))}
            </div>
            {scheduleTab==="weekly"&&(()=>{
              const baseDate=new Date();baseDate.setDate(baseDate.getDate()-baseDate.getDay()+(scheduleWeekOffset*7));
              const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((name,i)=>{const d=new Date(baseDate);d.setDate(d.getDate()+i);return {name,date:d.toISOString().slice(0,10)};});
              const weekKey=days[0].date;
              const weekAssignments=scheduleData[weekKey]||{};
              return <div>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <button className="hov" onClick={()=>setScheduleWeekOffset(p=>p-1)} style={{...S.btn,padding:"4px 12px"}}>← Prev</button>
                  <div style={{fontSize:14,color:"#e8e4d8"}}>{days[0].date} — {days[6].date}</div>
                  <button className="hov" onClick={()=>setScheduleWeekOffset(p=>p+1)} style={{...S.btn,padding:"4px 12px"}}>Next →</button>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <span style={{fontSize:11,color:"#888"}}>Min Drivers/Day:</span>
                  <input type="number" value={minDrivers} onChange={e=>setMinDrivers(parseInt(e.target.value)||0)} style={{...S.input,width:60,padding:"4px 8px"}}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
                  {days.map((day,di)=>{
                    const dayAssign=weekAssignments[di]||[];
                    const underMin=dayAssign.length<minDrivers;
                    return <div key={di} style={{...S.card,border:underMin?`1px solid #ef444455`:"",minHeight:120}}>
                      <div style={{fontSize:11,fontWeight:700,color:underMin?"#ef4444":accent}}>{day.name}</div>
                      <div style={{fontSize:9,color:"#555",marginBottom:6}}>{day.date.slice(5)}</div>
                      {dayAssign.map((a,ai)=>(
                        <div key={ai} style={{fontSize:10,color:"#e8e4d8",marginBottom:3,display:"flex",justifyContent:"space-between"}}>
                          <span>{a.driverName}</span>
                          <button onClick={()=>{
                            const newW={...scheduleData};if(!newW[weekKey])newW[weekKey]={};
                            newW[weekKey][di]=(newW[weekKey][di]||[]).filter((_,j)=>j!==ai);
                            setScheduleData(newW);
                          }} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:9,padding:0}}>×</button>
                        </div>
                      ))}
                      <select onChange={e=>{
                        if(!e.target.value)return;
                        const drv=drivers.find(d=>d.id===e.target.value);
                        if(!drv)return;
                        const newW={...scheduleData};if(!newW[weekKey])newW[weekKey]={};
                        newW[weekKey][di]=[...(newW[weekKey][di]||[]),{driverId:drv.id,driverName:drv.name,route:""}];
                        setScheduleData(newW);e.target.value="";
                      }} style={{...S.input,fontSize:9,padding:"2px 4px",marginTop:4}} defaultValue="">
                        <option value="">+ Assign</option>
                        {drivers.filter(d=>d.status==="active").map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>;
                  })}
                </div>
              </div>;
            })()}
            {scheduleTab==="availability"&&<div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>Driver Availability</div>
              {drivers.filter(d=>d.status==="active").length===0&&<div style={{color:"#555",fontSize:12}}>No active drivers.</div>}
              {drivers.filter(d=>d.status==="active").map(drv=>{
                const avail=scheduleData?.availability?.[drv.id]||{};
                return <div key={drv.id} style={{...S.card,marginBottom:8}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#e8e4d8",marginBottom:8}}>{drv.name}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day,di)=>{
                      const status=avail[di]||"Available";
                      const color=status==="Available"?"#22c55e":status==="Unavailable"?"#ef4444":status==="On Leave"?"#f59e0b":"#888";
                      return <div key={di} style={{textAlign:"center"}}>
                        <div style={{fontSize:9,color:"#555",marginBottom:2}}>{day}</div>
                        <select value={status} onChange={e=>{
                          const newAvail={...(scheduleData?.availability||{})};
                          if(!newAvail[drv.id])newAvail[drv.id]={};
                          newAvail[drv.id][di]=e.target.value;
                          setScheduleData(prev=>({...prev,availability:newAvail}));
                        }} style={{fontSize:9,padding:"2px",background:"#0f0f0f",border:`1px solid ${color}44`,borderRadius:3,color,width:80}}>
                          <option>Available</option><option>Unavailable</option><option>On Leave</option><option>Injury</option>
                        </select>
                      </div>;
                    })}
                  </div>
                </div>;
              })}
            </div>}
          </div>
        </div>
      )}

    </div>
  );
}
