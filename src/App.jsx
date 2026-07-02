import { useState, useEffect, useRef } from "react";
import React from "react";
import { makeDb } from "./supabase.js";
import {
  useUser, useOrganization, useOrganizationList, useClerk,
  SignIn, SignUp, OrganizationProfile, CreateOrganization,
} from "@clerk/clerk-react";

// Config
import { KEYS, stor, DEFAULT_FILINGS } from "./config/keys.js";
import { SEGMENTS } from "./config/segments.js";
import { mkStyles } from "./config/styles.js";

// Hooks
import { useDataLoader, useDataSaver } from "./hooks/useSupabase.js";
import { useOnboarding } from "./hooks/useOnboarding.js";

// Shared components
import EditModal from "./components/shared/EditModal.jsx";
import Nav, { NAV_LABELS as navLabels } from "./components/shared/Nav.jsx";
import TopBar from "./components/shared/TopBar.jsx";
import SegmentSelector from "./components/shared/SegmentSelector.jsx";
import OnboardingBanner from "./components/shared/OnboardingBanner.jsx";
import StatCard from "./components/shared/StatCard.jsx";
import ExpiryBadge from "./components/shared/ExpiryBadge.jsx";

// Screen components
import Dashboard from "./components/screens/Dashboard.jsx";
import Analyze from "./components/screens/Analyze.jsx";
import Boards from "./components/screens/Boards.jsx";
import Routes from "./components/screens/Routes.jsx";
import Compliance from "./components/screens/Compliance.jsx";
import Drivers from "./components/screens/Drivers.jsx";
import Fleet from "./components/screens/Fleet.jsx";
import Contracts from "./components/screens/Contracts.jsx";
import Finance from "./components/screens/Finance.jsx";
import Brokers from "./components/screens/Brokers.jsx";
import Reports from "./components/screens/Reports.jsx";
import Trends from "./components/screens/Trends.jsx";
import Users from "./components/screens/Users.jsx";
import Settings from "./components/screens/Settings.jsx";
import Payroll from "./components/screens/Payroll.jsx";
import Dispatch from "./components/screens/Dispatch.jsx";
import Invoices from "./components/screens/Invoices.jsx";
import Contacts from "./components/screens/Contacts.jsx";
import Documents from "./components/screens/Documents.jsx";
import DataBackup from "./components/screens/DataBackup.jsx";
import DeadMiles from "./components/screens/DeadMiles.jsx";
import StopProfit from "./components/screens/StopProfit.jsx";
import Settlement from "./components/screens/Settlement.jsx";
import DriverSchedule from "./components/screens/DriverSchedule.jsx";
import Scorecard from "./components/screens/Scorecard.jsx";
import FmcsaLookup from "./components/screens/FmcsaLookup.jsx";
import Claims from "./components/screens/Claims.jsx";
import LenderReport from "./components/screens/LenderReport.jsx";

// ─── TIER CONFIG ──────────────────────────────────────────────────────────────
const TIERS = {
  solo: {
    label: "Solo",
    price: "$39/mo",
    color: "#888",
    desc: "1 truck · owner only",
    screens: [
      "dashboard","compliance","fleet","finance","documents","fmcsa","settings","data"
    ],
  },
  fleet: {
    label: "Fleet",
    price: "$89/mo",
    color: "#f59e0b",
    desc: "5 trucks · 5 users",
    screens: [
      "dashboard","compliance","fleet","finance","documents","fmcsa","settings","data",
      "drivers","payroll","dispatch","invoices","contacts","routes","contracts",
      "scorecard","stopprofit","settlement","driverschedule","claims","reports","brokers"
    ],
  },
  enterprise: {
    label: "Enterprise",
    price: "$179/mo",
    color: "#8888cc",
    desc: "Unlimited trucks · Unlimited users",
    screens: [
      "dashboard","compliance","fleet","finance","documents","fmcsa","settings","data",
      "drivers","payroll","dispatch","invoices","contacts","routes","contracts",
      "scorecard","stopprofit","settlement","driverschedule","claims","reports","brokers",
      "lender","users","analyze","deadmiles","boards"
    ],
  },
};

// ─── SUB-PAGES CONFIG ─────────────────────────────────────────────────────────
const SUB_PAGES = {
  fleet:[{id:"log",label:"Maintenance Log"},{id:"fuel",label:"Fuel Log"},{id:"odometer",label:"Odometer"},{id:"tires",label:"Tires"},{id:"fuelcard",label:"Fuel Card",segment:["otr"]},{id:"appearance",label:"Appearance Check",segment:["fedex"]},{id:"vaninspect",label:"Van Inspection",segment:["amazon"]}],
  drivers:[{id:"list",label:"All Drivers"},{id:"onboarding",label:"DOT Onboarding"},{id:"hos",label:"HOS Log"},{id:"incidents",label:"Incidents"},{id:"scorecards",label:"Scorecards"},{id:"coaching",label:"Coaching Log",segment:["fedex"]},{id:"callouts",label:"Callout Tracker",segment:["amazon"]},{id:"substitutes",label:"Substitutes",segment:["usps"]}],
  finance:[{id:"pl",label:"P&L Dashboard"},{id:"expenses",label:"Expenses"},{id:"revenue",label:"Revenue"},{id:"deadmiles",label:"Dead Miles",segment:["otr"]}],
  compliance:[{id:"overview",label:"Overview"},{id:"vehicles",label:"Trucks"},{id:"drivers_comp",label:"Driver Docs"},{id:"docs",label:"Doc Guide"}],
  routes:[{id:"list",label:"Route List"},{id:"analyze",label:"Analyze Route"},{id:"dnr",label:"DNR Cases",segment:["amazon"]},{id:"tripsheets",label:"Trip Sheets",segment:["usps"]}],
  contracts:[{id:"list",label:"Contracts"},{id:"bidtracker",label:"Bid Tracker",segment:["usps"]}],
  stopprofit:[{id:"entry",label:"Daily Entry"},{id:"trend",label:"Weekly Trend"}],
  settlement:[{id:"entry",label:"Weekly Entry"},{id:"history",label:"History"}],
  lender:[{id:"report",label:"Business Report"},{id:"balance",label:"Balance Sheet"},{id:"debt",label:"Debt Schedule"},{id:"aging",label:"AR/AP Aging"},{id:"assets",label:"Assets"},{id:"docs",label:"Document Checklist"}],
  reports:[{id:"overview",label:"Overview"},{id:"notifications",label:"Alerts"}],
  data:[{id:"backup",label:"Backup & Restore"},{id:"cleanup",label:"Data Cleanup"},{id:"storage",label:"Storage Usage"}],
  dispatch:[{id:"active",label:"Active"},{id:"history",label:"History"}],
  driverschedule:[{id:"weekly",label:"Weekly Schedule"},{id:"availability",label:"Availability"}],
};

// ─── AI PROMPTS ───────────────────────────────────────────────────────────────
const ANALYZE_PROMPT = `You are a freight rate analyst for OTR owner-operators. Respond ONLY with this JSON (no markdown):
{"grossRate":0,"grossRPM":0,"fuelCost":0,"deadheadCost":0,"truckCost":0,"netRevenue":0,"netRPM":0,"grade":"A","verdict":"TAKE IT","verdictColor":"green","summary":"...","strengths":["..."],"concerns":["..."],"marketContext":"...","counterOffer":{"suggestedRate":0,"script":"..."}}`;

const PARSE_PROMPT = `Extract load details from pasted text. Respond ONLY with JSON (no markdown):
{"origin":"City, ST","destination":"City, ST","miles":null,"offeredRate":null,"commodity":"Unknown","pickupDate":"Unknown","brokerName":"Unknown","deadheadMiles":null}`;

const COMPLIANCE_PROMPT = `You are a DOT/FMCSA compliance expert for contract carriers. Answer practically — specific regulation, what's needed, where to file, deadline, penalty. Plain English a fleet owner can act on today.`;

const ROUTE_AI_PROMPT = `You are a route profitability analyst for contract delivery operations. Given route data, analyze profitability and give actionable recommendations. Respond ONLY with JSON (no markdown):
{"profitabilityScore":"A|B|C|D","verdict":"PROFITABLE|MARGINAL|LOSING","netPerStop":0,"netPerMile":0,"summary":"...","strengths":["..."],"concerns":["..."],"recommendations":["..."]}`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt$ = n => `$${(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const daysUntil = d => { if(!d) return null; return Math.ceil((new Date(d)-new Date())/86400000); };
const statusColor = d => { if(d===null) return "#444"; if(d<0) return "#ef4444"; if(d<=30) return "#ef4444"; if(d<=60) return "#f59e0b"; if(d<=90) return "#facc15"; return "#22c55e"; };
const statusLabel = d => { if(d===null) return "Not set"; if(d<0) return `OVERDUE ${Math.abs(d)}d`; if(d===0) return "TODAY"; if(d<=30) return `${d}d URGENT`; if(d<=90) return `${d}d Soon`; return `${d}d`; };
const gradeColor = g => ({A:"#22c55e",B:"#84cc16",C:"#f59e0b",D:"#ef4444"}[g]||"#555");
const fmtDate = d => { if(!d) return "—"; const parts = d.split("-"); if(parts.length===3) return `${parseInt(parts[1])}/${parseInt(parts[2])}/${parts[0]}`; return new Date(d).toLocaleDateString(); };

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
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

const LoaderComp = ({msg,accent}) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 0",gap:16}}>
    <div style={{width:36,height:36,border:`2px solid #1e1e1e`,borderTop:`2px solid ${accent}`,borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
    <div style={{fontSize:11,color:"#999"}}>{msg||"Processing..."}</div>
  </div>
);

// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
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
          <div style={{fontSize:12,color:"#999",textAlign:"center",maxWidth:400,lineHeight:1.8}}>
            ContractorOS hit an unexpected error. Your data is safe — it's saved in the cloud.<br/>Refresh the page to continue.
          </div>
          <div style={{fontSize:10,color:"#333",background:"#141414",border:"1px solid #2a2a2a",borderRadius:6,padding:"10px 16px",maxWidth:500,wordBreak:"break-all"}}>
            {this.state.error?.message}
          </div>
          <button onClick={()=>window.location.reload()} style={{background:"#f59e0b",color:"#0a0a0a",border:"none",padding:"12px 28px",borderRadius:6,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,cursor:"pointer",letterSpacing:"0.05em"}}>
            Refresh Page →
          </button>
          <button onClick={()=>this.setState({hasError:false,error:null})} style={{background:"transparent",border:"1px solid #2a2a2a",color:"#999",padding:"8px 20px",borderRadius:6,fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer"}}>
            Try Without Refreshing
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── AUTH GATE ────────────────────────────────────────────────────────────────
function AuthGate() {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { userMemberships, isLoaded: listLoaded } = useOrganizationList({ userMemberships: true });
  const [authView, setAuthView] = useState(()=>{
    try { return new URLSearchParams(window.location.search).get("view")==="signup"?"signup":"signin"; } catch { return "signin"; }
  });

  if (!userLoaded) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0a0a",flexDirection:"column",gap:16}}>
      <div style={{width:48,height:48,border:"3px solid #1e1e1e",borderTop:"3px solid #f59e0b",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!isSignedIn) return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{marginBottom:24,textAlign:"center"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:"#e8e4d8",letterSpacing:"0.05em"}}>
          CONTRACTOR<span style={{color:"#f59e0b"}}>OS</span>
        </div>
        <div style={{fontSize:11,color:"#999",marginTop:4,letterSpacing:"0.15em",textTransform:"uppercase"}}>Fleet Operating System</div>
      </div>
      {authView === "signin"
        ? <SignIn routing="virtual" afterSignInUrl="/app" appearance={{elements:{rootBox:{width:"100%",maxWidth:400}}}}/>
        : <SignUp routing="virtual" afterSignUpUrl="/app" appearance={{elements:{rootBox:{width:"100%",maxWidth:400}}}}/>
      }
      <button onClick={()=>setAuthView(authView==="signin"?"signup":"signin")}
        style={{marginTop:16,background:"transparent",border:"none",color:"#999",fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>
        {authView==="signin"?"Don't have an account? Sign up →":"Already have an account? Sign in →"}
      </button>
    </div>
  );

  if (orgLoaded && !organization) {
    const hasMemberships = listLoaded && userMemberships?.data?.length > 0;
    return (
      <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{marginBottom:24,textAlign:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:"#e8e4d8"}}>
            CONTRACTOR<span style={{color:"#f59e0b"}}>OS</span>
          </div>
          <div style={{fontSize:11,color:"#999",marginTop:4}}>Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}</div>
        </div>
        <div style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:10,padding:"28px 32px",maxWidth:420,width:"100%",textAlign:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#e8e4d8",marginBottom:8}}>Set Up Your Company</div>
          <div style={{fontSize:11,color:"#999",marginBottom:24,lineHeight:1.8}}>
            ContractorOS organizes data by company. Create your company to get started, or ask your owner to invite you.
          </div>
          {hasMemberships ? (
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Your Companies</div>
              {userMemberships.data.map(m=>(
                <button key={m.organization.id}
                  onClick={()=>m.organization.setActive()}
                  style={{display:"block",width:"100%",background:"#0f0f0f",border:"1px solid #2a2a2a",borderRadius:6,padding:"12px 16px",color:"#e8e4d8",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,marginBottom:8,textAlign:"left"}}>
                  {m.organization.name}
                  <span style={{fontSize:10,color:"#999",fontFamily:"'DM Mono',monospace",fontWeight:400,marginLeft:10}}>{m.role}</span>
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

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function ContractorOS() {
  const { organization, membership } = useOrganization();
  const { user } = useUser();
  const { signOut } = useClerk();
  const db = makeDb(organization?.id);

  // ── State (compliance & drivers MUST come before Day3/7 email effect) ──
  const [compliance, setCompliance] = useState({trucks:[],drivers:[]});
  const [drivers, setDrivers] = useState([]);

  // ── Onboarding hooks ──
  useOnboarding(user, organization, compliance, drivers);

  const [segment, setSegment] = useState(() => { try { return localStorage.getItem("cos_segment_locked") || null; } catch { return null; } });
  const [onboardStep, setOnboardStep] = useState(0);
  const [onboardDismissed, setOnboardDismissed] = useState(() => { try { return localStorage.getItem("cos_onboard_done") === "1"; } catch { return false; } });

  const [screen, setScreen] = useState("dashboard");
  const [prevScreen, setPrevScreen] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [settings, setSettings] = useState(()=>{
    const defaults = {mpg:8,dieselPrice:3.85,cpm:0.18,homeBase:"",companyName:"",monthlyInsurance:"",weeklyTruckPayment:"",clientDailyRate:"",mileStipendRate:"",businessStartDate:"",businessLegalName:"",ownerName:"",ein:"",bankName:"",existingLoanBalance:"",existingLoanMonthlyPayment:"",monthlyDepreciation:"",monthlyLoanInterest:"",monthlyTaxEstimate:"",cashReserve:"",subscriptionTier:"fleet",devMode:false};
    const saved = stor.get(KEYS.settings, null);
    return saved ? {...defaults, ...saved} : defaults;
  });
  const [navExpanded, setNavExpanded] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loads, setLoads] = useState([]);
  const [subScreen, setSubScreen] = useState(null);
  const [modal, setModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
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
  const [notifications, setNotifications] = useState([]);
  const [notifPermission, setNotifPermission] = useState("default");
  const [showAlertSetup, setShowAlertSetup] = useState(false);
  const [alertPhone, setAlertPhone] = useState(()=>{try{return localStorage.getItem("cos_alert_phone")||"";}catch{return "";}});
  const [alertEmail, setAlertEmail] = useState(()=>{try{return localStorage.getItem("cos_alert_email")||"";}catch{return "";}});
  const [filings, setFilings] = useState(DEFAULT_FILINGS);
  const [editFilingId, setEditFilingId] = useState(null);
  const [editFilingForm, setEditFilingForm] = useState({});
  const [showAddFiling, setShowAddFiling] = useState(false);
  const [newFilingForm, setNewFilingForm] = useState({name:"",dueDate:"",frequency:"Annual",notes:"",filedDate:"",confirmationNum:"",filedNotes:""});
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({id:"owner",name:"Owner",role:"owner",pin:""});
  const [showAddUser, setShowAddUser] = useState(false);
  const [userForm, setUserForm] = useState({name:"",role:"driver",pin:"",driverId:""});
  const [pinEntry, setPinEntry] = useState(null);
  const [switchingUser, setSwitchingUser] = useState(false);
  const [trendsView, setTrendsView] = useState("monthly");
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
  const [payroll, setPayroll] = useState([]);
  const [fuelLog, setFuelLog] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [odometer, setOdometer] = useState([]);
  const [tires, setTires] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [hosLog, setHosLog] = useState([]);
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTargetScreen, setUpgradeTargetScreen] = useState("");
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [upgradeSent, setUpgradeSent] = useState(false);
  const [upgradeEmail, setUpgradeEmail] = useState(()=>{
    try { return user?.emailAddresses?.[0]?.emailAddress || ""; } catch { return ""; }
  });
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");
  const [scorecardWeek, setScorecardWeek] = useState(() => new Date().toISOString().slice(0,10));
  const [scorecardData, setScorecardData] = useState(() => { try { return JSON.parse(localStorage.getItem("cos_scorecard")||"[]"); } catch { return []; } });
  const [bugForm, setBugForm] = useState({subject:"",description:"",email:""});
  const [incidentFollowUpId, setIncidentFollowUpId] = useState(null);
  const [validationMsg, setValidationMsg] = useState("");
  const showValidation = (msg) => { setValidationMsg(msg); setTimeout(()=>setValidationMsg(""), 3000); };
  const compressImage = (file, maxW=1200, quality=0.75) => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
  const [showOrgProfile, setShowOrgProfile] = useState(false);
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
  const [calloutLog, setCalloutLog] = useState([]);
  const [damageClaims, setDamageClaims] = useState([]);
  const [fuelCardImports, setFuelCardImports] = useState([]);
  const [assetsList, setAssetsList] = useState([]);
  const [debtList, setDebtList] = useState([]);
  const [payablesList, setPayablesList] = useState([]);
  const [healthScoreHistory, setHealthScoreHistory] = useState([]);
  const [lenderTab, setLenderTab] = useState("report");
  const [lenderAssetForm, setLenderAssetForm] = useState({assetName:"",assetType:"Vehicle",purchaseDate:"",purchasePrice:"",currentValue:"",lienBalance:"",monthlyPayment:"",lenderName:"",notes:""});
  const [lenderDebtForm, setLenderDebtForm] = useState({creditorName:"",debtType:"Truck Loan",originalAmount:"",currentBalance:"",monthlyPayment:"",interestRate:"",loanStartDate:"",collateral:"",notes:""});
  const [lenderPayableForm, setLenderPayableForm] = useState({vendorName:"",description:"",amountOwed:"",dueDate:"",status:"Current"});
  const [subTab_drivers, setSubTab_drivers] = useState("list");
  const [routesSubTab, setRoutesSubTab] = useState("list");
  const [fleetSubTab, setFleetSubTab] = useState("log");
  const [financeSubTab, setFinanceSubTab] = useState("pl");
  const [contractsSubTab, setContractsSubTab] = useState("contracts");
  const [analyzeSubTab, setAnalyzeSubTab] = useState("analyze");
  const [stopProfitTab, setStopProfitTab] = useState("entry");
  const [stopProfitForm, setStopProfitForm] = useState({date:"",stops:"",revenuePerStop:"",driverPay:"",fuelCost:"",vehicleCost:"",otherCosts:""});
  const [weekOffset, setWeekOffset] = useState(0);
  const [settlementTab, setSettlementTab] = useState("entry");
  const [settlementForm, setSettlementForm] = useState({weekEnding:"",stops:"",ratePerStop:"",stopBonuses:"",fuelSurcharge:"",amountDeposited:"",depositDate:"",notes:""});
  const [scheduleTab, setScheduleTab] = useState("weekly");
  const [scheduleWeekOffset, setScheduleWeekOffset] = useState(0);
  const [minDrivers, setMinDrivers] = useState(3);
  const [coachingForm, setCoachingForm] = useState({date:"",driverId:"",issueType:"Harsh Braking",description:"",actionTaken:"",followUpDate:"",followUpComplete:false,outcome:""});
  const [showCoachingAdd, setShowCoachingAdd] = useState(false);
  const [appearVehicle, setAppearVehicle] = useState("");
  const [appearDate, setAppearDate] = useState("");
  const [appearItems, setAppearItems] = useState({decals:false,noStickers:false,exterior:false,cab:false,uniform:false,noUnreportedDamage:false,cargo:false});
  const [dnrForm, setDnrForm] = useState({date:"",driverId:"",address:"",packageId:"",description:"",responseSubmittedToAmazon:false,responseDate:"",resolution:"Pending",notes:""});
  const [showDnrAdd, setShowDnrAdd] = useState(false);
  const [tripSheetForm, setTripSheetForm] = useState({date:"",driverId:"",routeId:"",origin:"",destination:"",scheduledDeparture:"",actualDeparture:"",scheduledArrival:"",actualArrival:"",miles:"",vehicleId:"",fuelAdded:"",incidents:"",supervisorNotes:"",mailClasses:[]});
  const [showTripSheetAdd, setShowTripSheetAdd] = useState(false);
  const [bidForm, setBidForm] = useState({routeId:"",routeDescription:"",bidSubmittedDate:"",bidAmount:"",estimatedMilesPerYear:"",estimatedFuelCost:"",estimatedLaborCost:"",estimatedVehicleCost:"",estimatedTotalCost:"",estimatedNetAnnual:"",awardStatus:"Pending",awardDate:"",actualCostAfter30Days:"",actualCostAfter60Days:"",lessonLearned:"",notes:""});
  const [showBidAdd, setShowBidAdd] = useState(false);
  const [bidsTab, setBidsTab] = useState("active");
  const [vanInspectVehicle, setVanInspectVehicle] = useState("");
  const [vanInspectDate, setVanInspectDate] = useState("");
  const [vanInspectItems, setVanInspectItems] = useState({exterior:false,tires:"Good",lights:false,cargo:false,device:false,seatbelt:false,noWarnings:false,driverAck:false});
  const [fuelCardPasteText, setFuelCardPasteText] = useState("");
  const [fuelCardParsed, setFuelCardParsed] = useState([]);
  const [deadMilesForm, setDeadMilesForm] = useState({date:"",fromLocation:"",toLocation:"",emptyMiles:"",reason:"Looking for load",notes:""});
  const [showDeadMilesAdd, setShowDeadMilesAdd] = useState(false);
  const [loadHistoryUpdateId, setLoadHistoryUpdateId] = useState(null);
  const [loadHistoryUpdateForm, setLoadHistoryUpdateForm] = useState({actualNet:"",notes:""});
  const [whiteGloveOpen, setWhiteGloveOpen] = useState(null);
  const [scorecardImporting, setScorecardImporting] = useState(false);
  const [scorecardImportResult, setScorecardImportResult] = useState(null);
  const [scorecardImportError, setScorecardImportError] = useState("");
  const [claimsTab, setClaimsTab] = useState("open");
  const [showAddClaim, setShowAddClaim] = useState(false);
  const [claimForm, setClaimForm] = useState({date:"",driverId:"",customerAddress:"",deliveryType:"Appliance",itemDescription:"",damageDescription:"",estimatedValue:"",claimStatus:"Open",claimAmount:"",resolution:"",notes:""});
  const [showCalloutAdd, setShowCalloutAdd] = useState(false);
  const [calloutFormMain, setCalloutFormMain] = useState({date:"",driverId:"",calloutTime:"",reason:"Sick",routeAffected:"",wasRescued:false,rescuedBy:"",overtimeCost:"",notes:""});

  // ── Idle session timeout ──
  const [idleWarning, setIdleWarning] = useState(false);
  const [idleCountdown, setIdleCountdown] = useState(180);
  const idleTimerRef = useRef(null);
  const warnTimerRef = useRef(null);
  const countdownRef = useRef(null);

  // ── Persist segment & settings locally ──
  useEffect(()=>{if(segment)stor.set(KEYS.segment,segment);},[segment]);
  useEffect(()=>{stor.set(KEYS.settings,settings);},[settings]);
  useEffect(()=>{try{localStorage.setItem("cos_scorecard",JSON.stringify(scorecardData));}catch{}},[scorecardData]);

  // ── Health Score History (once per day) ──
  useEffect(()=>{
    if(!dbLoaded) return;
    const key="cos_health_last_saved";
    const todayStr=new Date().toISOString().slice(0,10);
    if(localStorage.getItem(key)===todayStr) return;
    localStorage.setItem(key,todayStr);
    setHealthScoreHistory(prev=>[
      {date:todayStr,total:totalHealthScore,compliance:compScore,financial:finScore,drivers:drvScore,fleet:fltScore},
      ...prev.slice(0,55)
    ]);
  },[dbLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Idle session timeout (2 hours, 3-min warning) ──
  useEffect(()=>{
    const IDLE_LIMIT = 2 * 60 * 60 * 1000; // 2 hours
    const WARN_BEFORE = 3 * 60 * 1000;      // warn 3 min before
    const resetIdle = () => {
      if(idleWarning) return;
      clearTimeout(idleTimerRef.current);
      clearTimeout(warnTimerRef.current);
      warnTimerRef.current = setTimeout(()=>{
        setIdleCountdown(180);
        setIdleWarning(true);
        countdownRef.current = setInterval(()=>{
          setIdleCountdown(c=>{
            if(c<=1){
              clearInterval(countdownRef.current);
              signOut({redirectUrl:"/"});
              return 0;
            }
            return c-1;
          });
        },1000);
      }, IDLE_LIMIT - WARN_BEFORE);
    };
    const EVENTS = ["mousemove","mousedown","keydown","touchstart","scroll"];
    EVENTS.forEach(e=>window.addEventListener(e,resetIdle,{passive:true}));
    resetIdle();
    return ()=>{
      EVENTS.forEach(e=>window.removeEventListener(e,resetIdle));
      clearTimeout(idleTimerRef.current);
      clearTimeout(warnTimerRef.current);
      clearInterval(countdownRef.current);
    };
  },[idleWarning]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stripe success return ──
  useEffect(()=>{
    try {
      const params = new URLSearchParams(window.location.search);
      const upgradeSuccess = params.get("upgrade");
      const urlTier = params.get("tier");
      // Also check localStorage backup (covers session-loss during checkout)
      const pendingTier = localStorage.getItem("cos_pending_tier");
      const newTier = (upgradeSuccess==="success" && urlTier && TIERS[urlTier]) ? urlTier
                    : (pendingTier && TIERS[pendingTier]) ? pendingTier
                    : null;
      if(newTier){
        localStorage.removeItem("cos_pending_tier");
        window.history.replaceState({},"","/app");
        // Apply tier immediately and persist to Supabase (don't wait for webhook)
        setSettings(prev=>{
          const updated = {...prev, subscriptionTier: newTier};
          db.set(KEYS.settings, updated);
          return updated;
        });
        showValidation("✓ Upgraded to "+(TIERS[newTier]?.label||newTier)+"! Your new features are unlocked.");
      }
    } catch(err){
      console.error("Upgrade redirect error:",err);
    }
  // eslint-disable-next-line
  },[]);

  // ── Load tier from Supabase on init (picks up webhook-updated tiers across devices) ──
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const isUpgradeRedirect = params.get("upgrade")==="success" || !!localStorage.getItem("cos_pending_tier");
    if(isUpgradeRedirect) return; // Stripe success effect owns this path
    db.get(KEYS.settings, null).then(saved=>{
      if(saved?.subscriptionTier && TIERS[saved.subscriptionTier]){
        setSettings(prev=>({...prev, subscriptionTier: saved.subscriptionTier}));
      }
    });
  // eslint-disable-next-line
  },[]);

  // ── Load & save cloud data via hooks ──
  useDataLoader(db, {
    setCompliance, setVehicles, setDrivers, setMaintenance, setExpenses, setRevenue,
    setRoutes, setContracts, setIncidents, setBrokers, setLoads, setUsers, setCurrentUser,
    setNotifications, setFilings, setPayroll, setFuelLog, setInvoices, setOdometer,
    setTires, setDocuments, setDispatches, setContacts, setHosLog,
    setStopProfitLog, setSettlementLog, setScheduleData, setCoachingLog, setAppearanceLog,
    setDnrLog, setTripSheets, setVanInspectionLog, setBidTracker, setDeadMilesLog, setLoadHistory,
    setWhiteGloveLog, setCalloutLog, setDamageClaims, setFuelCardImports,
    setAssetsList, setDebtList, setPayablesList, setHealthScoreHistory, setDbLoaded,
  });

  useDataSaver(db, dbLoaded, {
    compliance, vehicles, drivers, maintenance, expenses, revenue, routes, contracts,
    incidents, brokers, loads, users, currentUser, notifications, filings, payroll,
    fuelLog, invoices, odometer, tires, documents, dispatches, contacts, hosLog,
    stopProfitLog, settlementLog, scheduleData, coachingLog, appearanceLog, dnrLog,
    tripSheets, vanInspectionLog, bidTracker, deadMilesLog, loadHistory, whiteGloveLog,
    calloutLog, damageClaims, fuelCardImports,
    assetsList, debtList, payablesList, healthScoreHistory,
  });

  const seg = segment ? SEGMENTS[segment] : null;
  const S = seg ? mkStyles(seg.color) : mkStyles("#f59e0b");
  const accent = seg?.color || "#f59e0b";

  // ── AI — throws on error so callers get the actual Anthropic error message ──
  const callAI = async (system, content, json=true) => {
    const r = await fetch("/api/claude", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({system, prompt:content, max_tokens:1000}),
    });
    const d = await r.json();
    if(!r.ok || d.error) {
      const msg = d.error?.message || (typeof d.error==="string"?d.error:null) || d.type || `API error ${r.status}`;
      throw new Error(msg);
    }
    const text = d.content?.[0]?.text||"";
    if(!json) return text;
    const trimmed = text.replace(/```json\n?|```/g,"").trim();
    try { return JSON.parse(trimmed); } catch { return null; }
  };

  const analyzeLoad = async () => {
    if(!loadForm.origin||!loadForm.destination||!loadForm.offeredRate) return;
    setAiLoading(true); setAiResult(null); setAiError("");
    const miles=parseFloat(loadForm.miles)||0, dead=parseFloat(loadForm.deadheadMiles)||0;
    const fuelEst=((miles+dead)/settings.mpg)*settings.dieselPrice;
    try {
      const result = await callAI(ANALYZE_PROMPT, `Origin:${loadForm.origin} Dest:${loadForm.destination} Miles:${miles} Dead:${dead} Rate:$${loadForm.offeredRate} Commodity:${loadForm.commodity||"?"} Broker:${loadForm.brokerName||"?"} MPG:${settings.mpg} Diesel:$${settings.dieselPrice} FuelEst:$${fuelEst.toFixed(2)} TruckCPM:$${settings.cpm}`);
      if(result) {
        setAiResult(result);
        setLoads(p=>[{id:Date.now(),date:new Date().toLocaleDateString(),load:{...loadForm},result},...p].slice(0,100));
        setAnalyzeStep("result");
      } else {
        setAiError("Analysis failed — AI returned an empty response. Try again.");
      }
    } catch(err) {
      setAiError(err.message || "Analysis failed. Check ANTHROPIC_API_KEY is set in Vercel → Settings → Environment Variables.");
    }
    setAiLoading(false);
  };

  const parseLoad = async () => {
    if(!pasteText.trim()) return;
    setAiLoading(true); setAiError("");
    try {
      const parsed = await callAI(PARSE_PROMPT, pasteText);
      if(parsed) {
        setLoadForm({origin:parsed.origin||"",destination:parsed.destination||"",miles:parsed.miles||"",offeredRate:parsed.offeredRate||"",deadheadMiles:parsed.deadheadMiles||"",commodity:parsed.commodity||"",pickupDate:parsed.pickupDate||"",brokerName:parsed.brokerName||""});
        setAnalyzeStep("confirm");
      } else {
        setAiError("Could not parse load details. Try pasting more complete load text.");
      }
    } catch(err) {
      setAiError(err.message || "Parse failed. Check ANTHROPIC_API_KEY in Vercel.");
    }
    setAiLoading(false);
  };

  const analyzeRoute = async (route) => {
    setAiLoading(true);
    try {
      const result = await callAI(ROUTE_AI_PROMPT, `Route:${route.name} Stops:${route.stops} Miles:${route.miles} ContractedRate:$${route.rate} FuelCost:$${((route.miles/settings.mpg)*settings.dieselPrice).toFixed(2)} TruckCPM:$${settings.cpm} DriverPay:$${route.driverPay||0} OtherCosts:$${route.otherCosts||0}`);
      if(result) { setRoutes(p=>p.map(r=>r.id===route.id?{...r,analysis:result}:r)); }
    } catch(err) { /* route analysis is silent — no UI for errors */ }
    setAiLoading(false);
  };

  const askDot = async () => {
    if(!dotQ.trim()) return;
    setAiLoading(true); setDotAnswer(""); setAiError("");
    try {
      const res = await fetch("/api/claude",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({prompt:`You are a DOT/FMCSA compliance expert for US commercial trucking. Answer this question clearly and practically for an owner-operator or fleet manager. Be specific, cite relevant regulations where applicable, and flag any time-sensitive deadlines. Question: ${dotQ}`, max_tokens:800})
      });
      if(!res.ok) { const err = await res.json(); throw new Error(err.error||`API error ${res.status}`); }
      const data = await res.json();
      const answer = data.content?.[0]?.text;
      if(!answer) throw new Error("No response from AI");
      setDotAnswer(answer);
    } catch(err) {
      setAiError(`DOT AI error: ${err.message}. Try again.`);
    }
    setAiLoading(false);
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
      if(result) { setExcelResult(result); }
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

  // ── Notifications ──
  const generateNotifications = () => {
    const notifs = [];
    const now = Date.now();
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

  // ── Owner bypass (Clerk email) ──
  const OWNER_EMAILS = ["bostonrudi1993@gmail.com"];
  const isOwner = OWNER_EMAILS.includes(user?.emailAddresses?.[0]?.emailAddress || "");

  // ── Clerk-derived role ──
  const userRole = (() => {
    if(!user || !organization) return "owner";
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if(OWNER_EMAILS.includes(email)) return "owner";
    const clerkRole = membership?.role;
    if(clerkRole === "org:admin") return "owner";
    const meta = membership?.publicMetadata?.role;
    if(meta === "driver") return "driver";
    return "manager";
  })();

  // ── Roles ──
  const canEdit = () => userRole === "owner" || userRole === "manager";
  const isRoleOwner = () => userRole === "owner";
  const isDriverOnly = () => userRole === "driver";
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

  // ── PDF Generation ──
  const generatePDF = (type) => {
    const win = window.open("","_blank");
    const styles = `<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#1a1a1a;background:white;padding:40px}.header{border-bottom:3px solid #f59e0b;padding-bottom:20px;margin-bottom:30px;display:flex;justify-content:space-between;align-items:flex-end}.logo{font-size:28px;font-weight:900}.logo span{color:#f59e0b}.meta{font-size:12px;color:#666;text-align:right}h2{font-size:20px;font-weight:700;margin:24px 0 12px;color:#1a1a1a;border-left:4px solid #f59e0b;padding-left:12px}table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:12px}th{background:#f5f5f5;padding:8px 12px;text-align:left;font-weight:700;border-bottom:2px solid #ddd;font-size:10px;text-transform:uppercase;letter-spacing:.05em}td{padding:8px 12px;border-bottom:1px solid #eee}.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}.stat-card{border:1px solid #e5e7eb;border-radius:8px;padding:16px}.stat-value{font-size:28px;font-weight:800;color:#f59e0b}.stat-label{font-size:10px;color:#666;text-transform:uppercase}.footer{margin-top:40px;padding-top:16px;border-top:1px solid #eee;font-size:10px;color:#999;display:flex;justify-content:space-between}.urgent{color:#dc2626;font-weight:700}.warning{color:#d97706;font-weight:700}.ok{color:#16a34a}</style>`;
    const now = new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
    const company = settings.companyName || "My Fleet";
    let body = "";
    if(type==="compliance") {
      const urgent = generateNotifications().filter(n=>n.severity==="urgent");
      const warning = generateNotifications().filter(n=>n.severity==="warning");
      body = `<div class="header"><div><div class="logo">CONTRACTOR<span>OS</span></div><div style="font-size:14px;color:#666;margin-top:4px;">Compliance Report</div></div><div class="meta"><strong>${company}</strong><br/>${now}</div></div><div class="stat-grid"><div class="stat-card"><div class="stat-value">${compliance.trucks.length}</div><div class="stat-label">Vehicles</div></div><div class="stat-card"><div class="stat-value">${compliance.drivers.length}</div><div class="stat-label">Drivers</div></div><div class="stat-card"><div class="stat-value" style="color:${urgent.length>0?"#dc2626":"#16a34a"}">${urgent.length}</div><div class="stat-label">Urgent Items</div></div></div>${urgent.length>0?`<h2>Urgent — Action Required</h2><table><thead><tr><th>Item</th><th>Status</th><th>Date</th></tr></thead><tbody>${urgent.map(n=>`<tr><td>${n.body}</td><td class="urgent">${n.days}d</td><td>${n.date||""}</td></tr>`).join("")}</tbody></table>`:""}<h2>Vehicle Files</h2><table><thead><tr><th>Unit</th><th>DOT Inspection</th><th>Registration</th><th>IFTA</th><th>IRP</th></tr></thead><tbody>${compliance.trucks.map(t=>`<tr><td><strong>${t.name}</strong></td><td>${t.dotInspection||"—"}</td><td>${t.registration||"—"}</td><td>${t.ifta||"—"}</td><td>${t.irp||"—"}</td></tr>`).join("")}</tbody></table><h2>Driver Files</h2><table><thead><tr><th>Driver</th><th>CDL</th><th>Med Card</th><th>MVR</th><th>Drug Test</th></tr></thead><tbody>${compliance.drivers.map(d=>`<tr><td><strong>${d.name}</strong></td><td>${d.cdlExpiry||"—"}</td><td>${d.medCardExpiry||"—"}</td><td>${d.mvrDue||"—"}</td><td>${d.drugTest||"—"}</td></tr>`).join("")}</tbody></table>`;
    }
    if(type==="drivers") {
      body = `<div class="header"><div><div class="logo">CONTRACTOR<span>OS</span></div><div style="font-size:14px;color:#666;margin-top:4px;">Driver File Summary</div></div><div class="meta"><strong>${company}</strong><br/>${now}</div></div><div class="stat-grid"><div class="stat-card"><div class="stat-value">${drivers.length}</div><div class="stat-label">Total Drivers</div></div><div class="stat-card"><div class="stat-value">${drivers.filter(d=>d.status==="active").length}</div><div class="stat-label">Active</div></div><div class="stat-card"><div class="stat-value" style="color:${incidents.length>0?"#dc2626":"#16a34a"}">${incidents.length}</div><div class="stat-label">Incidents</div></div></div><h2>Drivers</h2><table><thead><tr><th>Name</th><th>Status</th><th>Route</th><th>Pay</th><th>Incidents</th></tr></thead><tbody>${drivers.map(d=>`<tr><td>${d.name}</td><td>${d.status}</td><td>${d.route||"—"}</td><td>${d.payType} $${d.payRate}</td><td>${(d.incidents||[]).length}</td></tr>`).join("")}</tbody></table>`;
    }
    if(type==="pl") {
      const totalRev = revenue.reduce((s,r)=>s+parseFloat(r.amount||0),0);
      const totalExp = expenses.reduce((s,e)=>s+parseFloat(e.amount||0),0);
      const net = totalRev-totalExp;
      body = `<div class="header"><div><div class="logo">CONTRACTOR<span>OS</span></div><div style="font-size:14px;color:#666;margin-top:4px;">Profit & Loss Report</div></div><div class="meta"><strong>${company}</strong><br/>${now}</div></div><div class="stat-grid"><div class="stat-card"><div class="stat-value" style="color:#16a34a">${fmt$(totalRev)}</div><div class="stat-label">Total Revenue</div></div><div class="stat-card"><div class="stat-value" style="color:#dc2626">${fmt$(totalExp)}</div><div class="stat-label">Total Expenses</div></div><div class="stat-card"><div class="stat-value" style="color:${net>=0?"#16a34a":"#dc2626"}">${fmt$(net)}</div><div class="stat-label">Net Profit</div></div></div><h2>Revenue</h2><table><thead><tr><th>Date</th><th>Description</th><th style="text-align:right">Amount</th></tr></thead><tbody>${revenue.map(r=>`<tr><td>${r.date||"—"}</td><td>${r.description||"Revenue"}</td><td style="text-align:right;color:#16a34a">${fmt$(parseFloat(r.amount||0))}</td></tr>`).join("")}</tbody></table><h2>Expenses</h2><table><thead><tr><th>Date</th><th>Category</th><th>Description</th><th style="text-align:right">Amount</th></tr></thead><tbody>${expenses.map(e=>`<tr><td>${e.date||"—"}</td><td>${(e.category||"").replace(/_/g," ")}</td><td>${e.description||"—"}</td><td style="text-align:right;color:#dc2626">${fmt$(parseFloat(e.amount||0))}</td></tr>`).join("")}</tbody></table>`;
    }
    win.document.write(`<!DOCTYPE html><html><head><title>${company} — ContractorOS Report</title>${styles}</head><body>${body}<div class="footer"><span>ContractorOS — ${company}</span><span>Generated ${now}</span><span>Confidential</span></div></body></html>`);
    win.document.close();
    setTimeout(()=>win.print(),500);
  };

  // ── Edit Modal ──
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

  const MODAL_CONFIGS = {
    vehicle: { title:"Edit Vehicle", fields:[["name","Unit Name / #","text"],["nickname","Nickname (optional)","text"],["vin","VIN or Last 6 Digits","text"],["year","Year","text"],["make","Make & Model","text"],["plate","Plate #","text"],["dotInspection","DOT Inspection Expiry","date"],["registration","Registration Expiry","date"],["ifta","IFTA Renewal","date"],["irp","IRP Plate Renewal","date"],["insuranceExpiry","Liability Insurance Expiry","date"]] },
    compdriver: { title:"Edit Driver File", fields:[["name","Driver Name","text"],["cdlExpiry","CDL Expiry","date"],["medCardExpiry","Medical Card Expiry","date"],["mvrDue","MVR Pull Due","date"],["drugTest","Drug Test Due","date"],["annualReview","Annual Review Due","date"]] },
    route: { title:"Edit Route", fields:[["name","Route Name","text"],["stops","Number of Stops","text"],["miles","Miles per Run","text"],["rate","Flat Contracted Rate ($)","text"],["stopRate","Rate Per Stop ($)","text"],["ratePerMile","Rate Per Mile ($)","text"],["driverPay","Driver Pay ($)","text"],["otherCosts","Other Costs ($)","text"],["frequency","Frequency","text"],["notes","Notes","textarea"]] },
    contract: { title:"Edit Contract", fields:[["name","Contract Name","text"],["company","Company / Client","text"],["startDate","Start Date","date"],["renewalDate","Renewal / Expiry Date","date"],["value","Annual Value ($)","text"],["status","Status","select:active|up_for_renewal|in_negotiation|expired"],["notes","Notes / Performance Requirements","textarea"]] },
    driver: { title:"Edit Driver", fields:[["name","Full Name","text"],["phone","Phone","text"],["hireDate","Hire Date","date"],["route","Assigned Route","text"],["payType","Pay Type","select:per_mile|per_stop|per_day|percentage|hourly|salary"],["payRate","Pay Rate","text"],["ytdPay","YTD Earnings ($)","text"],["status","Status","select:active|on_leave|terminated"]] },
    maintenance: { title:"Edit Service Record", fields:[["truckName","Vehicle","text"],["type","Service Type","text"],["date","Date","date"],["mileage","Mileage","text"],["cost","Cost ($)","text"],["nextDueMiles","Next Due (miles)","text"],["notes","Notes","text"]] },
    revenue: { title:"Edit Revenue Entry", fields:[["date","Date","date"],["description","Description","text"],["amount","Amount ($)","text"],["vehicle","Vehicle","text"]] },
    expense: { title:"Edit Expense", fields:[["date","Date","date"],["category","Category","select:fuel|maintenance|insurance|tires|repairs|driver_pay|tolls|permits|registration|ifta|ucr|eld|uniforms|equipment|phone|other"],["amount","Amount ($)","text"],["description","Description","text"],["vehicle","Vehicle","text"]] },
    broker: { title:"Edit Broker", fields:[["name","Broker Name","text"],["paySpeed","Pay Speed","select:|Quick Pay (1-3d)|Net 7|Net 14|Net 21|Net 30|Net 45+|Slow / Problems"],["rating","Rating (1-5)","select:5|4|3|2|1"],["notes","Notes","textarea"]] },
  };

  // ── FMCSA ──
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
              legalName: c.legalName||c.name||"—", dbaName: c.dbaName||null,
              address: [c.phyStreet,c.phyCity,c.phyState,c.phyZipcode].filter(Boolean).join(", ")||null,
              phone: c.telephone||null, mcNum: c.mcNumber?`MC-${c.mcNumber}`:null,
              safetyRating: c.safetyRating||"Not Rated", powerUnits: c.totalPowerUnits?.toString()||null,
              drivers: c.totalDrivers?.toString()||null,
              opStatus: c.statusCode==="A"?"Authorized":c.statusCode==="I"?"Inactive":c.statusCode||null,
              usdotStatus: c.statusCode==="A"?"ACTIVE":c.statusCode==="I"?"INACTIVE":(c.statusCode||"ACTIVE"),
              entityType: c.carrierOperation?.carrierOperationDesc||null, dotNum: dot,
              mcs150Date: c.mcs150Date||c.mcs150FormDate||null,
              vehicleOosPercent: null, driverOosPercent: null,
              totalCrashes: null, totalInspections: null,
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
          const re = new RegExp(`${label}[\\s\\S]{0,30}?<td[^>]*>([^<]{1,80})`,"i");
          const m = html.match(re);
          return m?m[1].replace(/&amp;/g,"&").replace(/&nbsp;/g," ").trim():null;
        };
        const getNum = (label) => {
          const re = new RegExp(`${label}[\\s\\S]{0,60}?<td[^>]*>\\s*([\\d.]+)`,"i");
          const m = html.match(re);
          return m?m[1]:null;
        };
        const legalName=getVal("Legal Name");
        const opStatus=getVal("Operating Status")||getVal("Operating Authority Status");
        if(html.length>200&&(legalName||opStatus)){
          result={
            legalName:legalName||"Unknown", dbaName:getVal("DBA Name"),
            address:getVal("Physical Address"), phone:getVal("Phone"),
            mcNum:getVal("Docket Number"), safetyRating:getVal("Safety Rating"),
            powerUnits:getVal("Power Units"), drivers:getVal("Drivers"),
            opStatus, usdotStatus:getVal("USDOT Status")||"ACTIVE",
            entityType:getVal("Entity Type"), dotNum:dot,
            mcs150Date:getVal("MCS-150 Form Date"),
            vehicleOosPercent:getNum("Vehicle Out of Service")||getNum("Veh OOS")||null,
            driverOosPercent:getNum("Driver Out of Service")||getNum("Drv OOS")||null,
            totalCrashes:getVal("Total Crashes")||getVal("Crashes")||null,
            totalInspections:getVal("Total Inspections")||getVal("Inspections")||null,
          };
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

  const handleNav = (id) => { setPrevScreen(screen); setScreen(id); setSubScreen(null); setAiResult(null); setAnalyzeStep("paste"); setNavOpen(false); };
  const handleBack = () => { if(prevScreen) { setScreen(prevScreen); setPrevScreen(null); setSubScreen(null); } };
  const handleSubNav = (screenId, subId) => {
    setSubScreen(subId);
    if(screenId === "finance") setFinanceSubTab(subId);
    if(screenId === "lender") setLenderTab(subId);
    if(screenId === "fleet") setFleetSubTab(subId);
    if(screenId === "drivers") setSubTab_drivers(subId);
    if(screenId === "stopprofit") setStopProfitTab(subId);
    if(screenId === "settlement") setSettlementTab(subId);
  };

  // ── Tier & Nav helpers ──
  const currentTier = settings.subscriptionTier || "fleet";
  const tierScreens = TIERS[currentTier]?.screens || TIERS.fleet.screens;
  const canAccessScreen = (screenId) => {
    if(isOwner) return true;
    return tierScreens.includes(screenId);
  };
  const DRIVER_SCREENS = ["dispatch","drivers","payroll","driverschedule"];
  const canAccessScreenForRole = (screenId) => {
    if(isOwner) return true;
    if(!canAccessScreen(screenId)) return false;
    if(userRole === "driver") return DRIVER_SCREENS.includes(screenId);
    if(userRole === "manager") return !["users","lender"].includes(screenId);
    return true;
  };
  const getScreenTier = (screenId) => {
    if(TIERS.solo.screens.includes(screenId)) return "solo";
    if(TIERS.fleet.screens.includes(screenId)) return "fleet";
    return "enterprise";
  };
  const toggleNavExpand = (id, e) => { e.stopPropagation(); setNavExpanded(prev=>({...prev,[id]:!prev[id]})); };

  // Auto-expand active screen in nav
  useEffect(()=>{
    if(SUB_PAGES[screen]) setNavExpanded(prev=>({...prev,[screen]:true}));
  },[screen]);

  // ── Computed ──
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

  // ── Business Health Score Calculations ──
  const _hsToday = new Date();
  const _hsThisMonth = _hsToday.toISOString().slice(0,7);
  const _hsLastMonth = new Date(_hsToday.getFullYear(),_hsToday.getMonth()-1,1).toISOString().slice(0,7);

  const overdueItems = urgentItems.filter(i=>i.days<0);
  const soonItems = urgentItems.filter(i=>i.days>=0&&i.days<=30);
  const compScore = overdueItems.length>0?0:soonItems.length===0?25:soonItems.length<=2?15:5;
  const compWhy = overdueItems.length>0?`${overdueItems.length} compliance item(s) are overdue — immediate action required`:soonItems.length===0?"All compliance items current":`${soonItems.length} item(s) expiring within 30 days — ${soonItems[0]?.label}`;
  const compAction = "compliance";
  const compActionLabel = "Fix Compliance →";

  const _thisMonthRev = revenue.filter(r=>r.date?.startsWith(_hsThisMonth)).reduce((s,r)=>s+parseFloat(r.amount||0),0);
  const _lastMonthRev = revenue.filter(r=>r.date?.startsWith(_hsLastMonth)).reduce((s,r)=>s+parseFloat(r.amount||0),0);
  const _revChange = _lastMonthRev>0?((_thisMonthRev-_lastMonthRev)/_lastMonthRev)*100:0;
  const finScore = _thisMonthRev===0?0:_revChange>=0?25:_revChange>=-10?15:5;
  const finWhy = _thisMonthRev===0?"No revenue logged this month":_revChange>0?`Revenue up ${_revChange.toFixed(0)}% vs last month`:_revChange===0?"Revenue flat vs last month":`Revenue down ${Math.abs(_revChange).toFixed(0)}% vs last month`;
  const finAction = "finance";
  const finActionLabel = "View Finance →";

  const REQUIRED_ONBOARDING_STEPS = ["application","background","background_clear","pre_drug_test","drug_clear","clearinghouse_query","cdl_copy","medical_card","mvr","driving_history_3yr","orientation","orientation_signed","i9"];
  const incompleteDrivers = drivers.filter(d=>{const c=d.onboarding||{};return REQUIRED_ONBOARDING_STEPS.some(s=>!c[s]);});
  const openCoachingCount = segment==="fedex"?(coachingLog||[]).filter(c=>!c.followUpComplete).length:0;
  const drvScore = Math.max(0,25-(incompleteDrivers.length*5)-(openCoachingCount*3));
  const drvWhy = incompleteDrivers.length===0&&openCoachingCount===0?"All drivers fully onboarded and compliant":incompleteDrivers.length>0?`${incompleteDrivers.length} driver(s) have incomplete DOT onboarding`:`${openCoachingCount} open coaching item(s) need follow-up`;
  const drvAction = "drivers";
  const drvActionLabel = "View Drivers →";

  const _thirtyDaysAgo = new Date(_hsToday-30*24*60*60*1000).toISOString().slice(0,10);
  const trucksNeedingMaint = (compliance.trucks||[]).filter(truck=>{
    const lastMaint = maintenance.filter(m=>m.truckName===truck.name).sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
    return !lastMaint||lastMaint.date<_thirtyDaysAgo;
  });
  const fltScore = Math.max(0,25-(trucksNeedingMaint.length*8));
  const fltWhy = trucksNeedingMaint.length===0?"All vehicles have recent maintenance logged":`${trucksNeedingMaint.length} vehicle(s) need maintenance attention`;
  const fltAction = "fleet";
  const fltActionLabel = "Log Maintenance →";

  const totalHealthScore = compScore+finScore+drvScore+fltScore;
  const healthLabel = totalHealthScore>=90?"Excellent":totalHealthScore>=75?"Good":totalHealthScore>=60?"Fair":totalHealthScore>=40?"Needs Attention":"Critical";
  const healthInsight = totalHealthScore>=90?"Your operation is running well. Focus on growth.":totalHealthScore>=75?"Solid operation with minor gaps to address.":totalHealthScore>=60?"Some vulnerabilities — address red items soon.":totalHealthScore>=40?"Multiple issues need attention to protect your contracts.":"Critical issues require immediate action.";

  const monthsOfData = (()=>{
    if(!revenue.length) return 0;
    const dates=revenue.map(r=>new Date(r.date)).filter(d=>!isNaN(d));
    if(!dates.length) return 0;
    const oldest=new Date(Math.min(...dates));
    return Math.floor((_hsToday-oldest)/(30*24*60*60*1000));
  })();
  const monthlyNetIncome = (()=>{
    const last3=[0,1,2].map(i=>{
      const d=new Date(_hsToday.getFullYear(),_hsToday.getMonth()-i,1).toISOString().slice(0,7);
      const rev=revenue.filter(r=>r.date?.startsWith(d)).reduce((s,r)=>s+parseFloat(r.amount||0),0);
      const exp=expenses.filter(e=>e.date?.startsWith(d)).reduce((s,e)=>s+parseFloat(e.amount||0),0);
      return rev-exp;
    });
    return last3.reduce((a,b)=>a+b,0)/3;
  })();
  const monthlyFixed=(parseFloat(settings.weeklyTruckPayment||0)*52/12)+parseFloat(settings.monthlyInsurance||0)+parseFloat(settings.existingLoanMonthlyPayment||0);
  const dscr=monthlyFixed>0?monthlyNetIncome/monthlyFixed:0;
  const hasActiveContract=contracts.some(c=>c.status==="active"||!c.endDate||new Date(c.endDate)>_hsToday);
  const lenderScore=(monthsOfData>=12?25:monthsOfData>=6?15:monthsOfData>=3?8:0)+(dscr>=1.25?25:dscr>=1.0?15:0)+(hasActiveContract?25:0)+((compliance.trucks||[]).length>0?25:0);

  // ── Loading screen ──
  if(!dbLoaded) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0a0a",flexDirection:"column",gap:16}}>
      <div style={{width:48,height:48,border:"3px solid #1e1e1e",borderTop:`3px solid ${segment?SEGMENTS[segment]?.color||"#f59e0b":"#f59e0b"}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,color:"#999",letterSpacing:"0.1em"}}>LOADING YOUR DATA...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Segment selector ──
  if(!segment) {
    return (
      <SegmentSelector onSelect={(id) => {
        setSegment(id);
        localStorage.setItem("cos_segment_locked", id);
        if(!onboardDismissed) setOnboardStep(1);
        setScreen("dashboard");
      }}/>
    );
  }

  // ── Build shared props for all screens ──
  const SubNav = ({tabs,active,onSelect}) => <SubNavComp tabs={tabs} active={active} accent={accent} onSelect={onSelect}/>;
  const Stat = ({label,value,color,sub}) => <StatCard label={label} value={value} color={color||accent} sub={sub} card={S.card}/>;
  const ExpiryBadgeW = ({label,days}) => <ExpiryBadge label={label} days={days}/>;
  const Loader = ({msg}) => <LoaderComp msg={msg} accent={accent}/>;
  function UpgradeModal() {
    if(!showUpgradeModal) return null;
    const targetTierKey = getScreenTier(upgradeTargetScreen);
    const targetTier = TIERS[targetTierKey];
    const currentTierData = TIERS[currentTier];
    const newFeatures = targetTier.screens.filter(s=>!tierScreens.includes(s)).map(s=>navLabels[s]||s).slice(0,8);

    const handleSendRequest = async () => {
      setUpgradeError("");
      setUpgradeLoading(true);
      const PRICE_IDS = {
        solo: import.meta.env.VITE_STRIPE_PRICE_SOLO,
        fleet: import.meta.env.VITE_STRIPE_PRICE_FLEET,
        enterprise: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE,
      };
      const priceId = PRICE_IDS[targetTierKey];
      if (!priceId) {
        setUpgradeError("Checkout is not configured yet. Please contact support to upgrade.");
        setUpgradeLoading(false);
        return;
      }
      const orgId = organization?.id || db.scopeId;
      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId, orgId, userEmail: upgradeEmail, tierName: targetTierKey }),
        });
        const data = await response.json();
        if (data.url) {
          // Store pending tier so upgrade applies even if Clerk session expires during checkout
          localStorage.setItem("cos_pending_tier", targetTierKey);
          window.location.href = data.url;
        } else {
          throw new Error(data.error || "Failed to create checkout session");
        }
      } catch (err) {
        console.error("Checkout error:", err);
        setUpgradeError("Unable to start checkout. Please try again or contact support.");
        setUpgradeLoading(false);
      }
    };

    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:700,padding:20}} onClick={()=>{setShowUpgradeModal(false);setUpgradeSent(false);setUpgradeError("");}}>
        <div style={{background:"#141414",border:`1px solid ${targetTier.color}44`,borderRadius:12,padding:"32px 28px",maxWidth:480,width:"100%",animation:"fadeUp 0.2s ease"}} onClick={e=>e.stopPropagation()}>
          {upgradeSent ? (
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:40,marginBottom:16}}>✅</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:800,color:"#e8e4d8",marginBottom:8}}>Redirecting to Checkout...</div>
              <div style={{fontSize:12,color:"#aaa",lineHeight:1.8,marginBottom:24}}>
                You will be redirected to Stripe to complete your upgrade to{" "}
                <span style={{color:targetTier.color,fontWeight:700}}>{targetTier.label}</span>.
              </div>
              <button onClick={()=>{setShowUpgradeModal(false);setUpgradeSent(false);setUpgradeError("");}} style={{...S.btn,width:"100%"}}>Done</button>
            </div>
          ) : (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                <div>
                  <div style={{fontSize:10,color:targetTier.color,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:6}}>Upgrade to {targetTier.label}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:800,color:"#e8e4d8",lineHeight:1}}>Unlock {navLabels[upgradeTargetScreen]||upgradeTargetScreen}</div>
                </div>
                <button onClick={()=>{setShowUpgradeModal(false);setUpgradeSent(false);setUpgradeError("");}} style={{background:"transparent",border:"none",color:"#999",fontSize:20,cursor:"pointer",padding:"4px 8px",lineHeight:1}}>✕</button>
              </div>
              <div style={{background:`${targetTier.color}11`,border:`1px solid ${targetTier.color}33`,borderRadius:8,padding:"14px 18px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:900,color:targetTier.color,lineHeight:1}}>{targetTier.price}</div>
                  <div style={{fontSize:10,color:"#999",marginTop:4}}>Upgrade from {currentTierData.label} {currentTierData.price}</div>
                </div>
                <div style={{fontSize:10,color:"#999",textAlign:"right"}}>Cancel anytime<br/>No long-term contract</div>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:10,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>What you unlock:</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {newFeatures.map(f=>(
                    <div key={f} style={{fontSize:11,color:"#888",display:"flex",alignItems:"center",gap:6}}>
                      <span style={{color:targetTier.color,fontWeight:700}}>✓</span>{f}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                <div>
                  <label style={S.label}>Your Email</label>
                  <input value={upgradeEmail} onChange={e=>setUpgradeEmail(e.target.value)} placeholder="your@email.com" type="email" style={S.input}/>
                </div>
                <div>
                  <label style={S.label}>Message (optional)</label>
                  <textarea value={upgradeMessage} onChange={e=>setUpgradeMessage(e.target.value)} placeholder="Any questions or special requirements..." style={{...S.input,height:70,resize:"vertical"}}/>
                </div>
              </div>
              {upgradeError&&<div style={{background:"#1a0808",border:"1px solid #ef444433",borderRadius:6,padding:"10px 14px",marginBottom:12,fontSize:11,color:"#ef4444",lineHeight:1.5}}>{upgradeError}</div>}
              <div style={{display:"flex",gap:10}}>
                <button onClick={handleSendRequest} disabled={upgradeLoading} style={{...S.btn,flex:1,background:targetTier.color,color:"#0a0a0a",fontSize:13,padding:"13px 20px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:"0.05em",opacity:upgradeLoading?0.7:1,cursor:upgradeLoading?"not-allowed":"pointer"}}>
                {upgradeLoading?"Redirecting to checkout...":`Upgrade to ${targetTier.label} →`}
              </button>
                <button onClick={()=>{setShowUpgradeModal(false);setUpgradeSent(false);setUpgradeError("");}} style={{...S.ghost,fontSize:11,padding:"13px 16px"}}>Cancel</button>
              </div>
              <div style={{fontSize:9,color:"#888",textAlign:"center",marginTop:12,lineHeight:1.7}}>
                Secure checkout via Stripe. Questions?{" "}
                <a href="mailto:support@contractoroshub.com" style={{color:"#aaa"}} onClick={e=>e.stopPropagation()}>Contact Support</a>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  function UpgradePrompt({screenId}) {
    const requiredTier = getScreenTier(screenId);
    const tier = TIERS[requiredTier];
    return (
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
        <div style={{...S.card,maxWidth:440,textAlign:"center",border:`1px solid ${tier.color}44`,padding:32}}>
          <div style={{fontSize:36,marginBottom:16}}>🔒</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#e8e4d8",marginBottom:8}}>
            {navLabels[screenId]} is a <span style={{color:tier.color}}>{tier.label}</span> feature
          </div>
          <div style={{fontSize:12,color:"#999",lineHeight:1.8,marginBottom:4}}>
            Upgrade to {tier.label} ({tier.price}) to unlock {navLabels[screenId]} and {tier.screens.length} other features.
          </div>
          <div style={{fontSize:11,color:"#aaa",marginBottom:24}}>{tier.desc}</div>
          <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:6,padding:"12px 16px",marginBottom:20,textAlign:"left"}}>
            <div style={{fontSize:10,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>{tier.label} includes:</div>
            {tier.screens.filter(s=>!tierScreens.includes(s)).slice(0,5).map(s=>(
              <div key={s} style={{fontSize:11,color:"#888",padding:"3px 0"}}>✓ {navLabels[s]||s}</div>
            ))}
          </div>
          <button
            onClick={()=>{
              setUpgradeTargetScreen(screenId);
              setUpgradeEmail(user?.emailAddresses?.[0]?.emailAddress||"");
              setUpgradeSent(false);
              setShowUpgradeModal(true);
            }}
            style={{...S.btn,width:"100%",background:tier.color,color:"#0a0a0a",fontSize:14,padding:"13px 24px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:"0.05em"}}>
            Upgrade to {tier.label} →
          </button>
        </div>
      </div>
    );
  }

  const screenProps = {
    seg, accent, S, segment, screen, setScreen, organization, signOut,
    compliance, drivers, vehicles, maintenance, expenses, revenue, routes, contracts,
    incidents, brokers, loads, users, currentUser, notifications, filings, payroll,
    fuelLog, invoices, odometer, tires, documents, dispatches, contacts, hosLog,
    stopProfitLog, settlementLog, scheduleData, coachingLog, appearanceLog, dnrLog,
    tripSheets, vanInspectionLog, bidTracker, deadMilesLog, loadHistory, whiteGloveLog,
    calloutLog, damageClaims, fuelCardImports, settings,
    setCompliance, setDrivers, setVehicles, setMaintenance, setExpenses, setRevenue,
    setRoutes, setContracts, setIncidents, setBrokers, setLoads, setUsers, setCurrentUser,
    setNotifications, setFilings, setPayroll, setFuelLog, setInvoices, setOdometer, setTires,
    setDocuments, setDispatches, setContacts, setHosLog, setStopProfitLog, setSettlementLog,
    setScheduleData, setCoachingLog, setAppearanceLog, setDnrLog, setTripSheets,
    setVanInspectionLog, setBidTracker, setDeadMilesLog, setLoadHistory, setWhiteGloveLog,
    setCalloutLog, setDamageClaims, setFuelCardImports, setSettings,
    subScreen, setSubScreen, modal, setModal, editForm, setEditForm,
    aiLoading, setAiLoading, aiResult, setAiResult, aiError, setAiError,
    showAddDriver, setShowAddDriver, driverForm, setDriverForm,
    showAddIncident, setShowAddIncident, incidentForm, setIncidentForm,
    editIncidentId, setEditIncidentId, editIncidentForm, setEditIncidentForm,
    showAddMaint, setShowAddMaint, maintForm, setMaintForm, maintCustomVehicle, setMaintCustomVehicle,
    showAddContract, setShowAddContract, contractForm, setContractForm,
    showAddRevenue, setShowAddRevenue, revenueForm, setRevenueForm,
    showAddExpense, setShowAddExpense, expenseForm, setExpenseForm,
    excelImporting, setExcelImporting, excelResult, setExcelResult,
    editFilingId, setEditFilingId, editFilingForm, setEditFilingForm,
    showAddFiling, setShowAddFiling, newFilingForm, setNewFilingForm,
    showAddUser, setShowAddUser, userForm, setUserForm,
    trendsView, setTrendsView, selectedRoute, setSelectedRoute,
    routeForm, setRouteForm, brokerForm, setBrokerForm,
    showAddVehicle, setShowAddVehicle, vehicleForm, setVehicleForm,
    showAddCompDriver, setShowAddCompDriver, compDriverForm, setCompDriverForm,
    dotAnswer, setDotAnswer, dotQ, setDotQ,
    pasteText, setPasteText, parsedLoad, setParsedLoad, loadForm, setLoadForm,
    analyzeStep, setAnalyzeStep, analyzeSubTab, setAnalyzeSubTab,
    payrollSub, setPayrollSub, payrollShowAdd, setPayrollShowAdd,
    payrollForm, setPayrollForm, payrollPreview, setPayrollPreview, payStub, setPayStub,
    fuelSub, setFuelSub, fuelShowAdd, setFuelShowAdd, fuelForm, setFuelForm,
    invoiceSub, setInvoiceSub, invoiceEditId, setInvoiceEditId, invoiceEditForm, setInvoiceEditForm,
    invoiceShowAdd, setInvoiceShowAdd, invoiceForm, setInvoiceForm,
    odomSub, setOdomSub, odomShowAdd, setOdomShowAdd, odomForm, setOdomForm,
    tireShowAdd, setTireShowAdd, tireForm, setTireForm,
    docFilter, setDocFilter, docShowAdd, setDocShowAdd, docForm, setDocForm,
    docFileData, setDocFileData, docEditId, setDocEditId, docEditForm, setDocEditForm,
    dispatchShowAdd, setDispatchShowAdd, dispatchFilter, setDispatchFilter, dispatchForm, setDispatchForm,
    contactShowAdd, setContactShowAdd, contactSearch, setContactSearch,
    contactFilter, setContactFilter, contactForm, setContactForm,
    hosShowAdd, setHosShowAdd, hosForm, setHosForm,
    selectedOnboardDriver, setSelectedOnboardDriver,
    dataSub, setDataSub, fmcsaDot, setFmcsaDot, fmcsaResult, setFmcsaResult,
    fmcsaLoading, setFmcsaLoading, fmcsaError, setFmcsaError,
    scorecardWeek, setScorecardWeek, scorecardData, setScorecardData,
    scorecardImporting, setScorecardImporting, scorecardImportResult, setScorecardImportResult,
    scorecardImportError, setScorecardImportError,
    showOrgProfile, setShowOrgProfile,
    subTab_drivers, setSubTab_drivers, routesSubTab, setRoutesSubTab,
    fleetSubTab, setFleetSubTab, financeSubTab, setFinanceSubTab,
    contractsSubTab, setContractsSubTab,
    stopProfitTab, setStopProfitTab, stopProfitForm, setStopProfitForm, weekOffset, setWeekOffset,
    settlementTab, setSettlementTab, settlementForm, setSettlementForm,
    scheduleTab, setScheduleTab, scheduleWeekOffset, setScheduleWeekOffset, minDrivers, setMinDrivers,
    coachingForm, setCoachingForm, showCoachingAdd, setShowCoachingAdd,
    appearVehicle, setAppearVehicle, appearDate, setAppearDate, appearItems, setAppearItems,
    dnrForm, setDnrForm, showDnrAdd, setShowDnrAdd,
    tripSheetForm, setTripSheetForm, showTripSheetAdd, setShowTripSheetAdd,
    bidForm, setBidForm, showBidAdd, setShowBidAdd, bidsTab, setBidsTab,
    vanInspectVehicle, setVanInspectVehicle, vanInspectDate, setVanInspectDate,
    vanInspectItems, setVanInspectItems,
    fuelCardPasteText, setFuelCardPasteText, fuelCardParsed, setFuelCardParsed,
    deadMilesForm, setDeadMilesForm, showDeadMilesAdd, setShowDeadMilesAdd,
    loadHistoryUpdateId, setLoadHistoryUpdateId, loadHistoryUpdateForm, setLoadHistoryUpdateForm,
    whiteGloveOpen, setWhiteGloveOpen,
    claimsTab, setClaimsTab, showAddClaim, setShowAddClaim, claimForm, setClaimForm,
    showCalloutAdd, setShowCalloutAdd, calloutFormMain, setCalloutFormMain,
    showAlertSetup, setShowAlertSetup, alertPhone, setAlertPhone, alertEmail, setAlertEmail,
    // handlers
    openEdit, saveEdit, closeModal, generatePDF, generateNotifications,
    canEdit, isOwner, isRoleOwner, isDriverOnly, userRole, getDriverForUser, switchUser, switchingUser, setSwitchingUser, confirmPin, requestPushPermission,
    confirmAlertSetup, sendTestNotif, notifPermission,
    analyzeLoad, parseLoad, analyzeRoute, askDot, lookupDOT, applyToSettings,
    importExcelPL, confirmExcelImport, showValidation, compressImage, handleNav,
    // computed
    urgentItems, totalRevenue, totalExpenses, netProfit,
    totalHealthScore, healthLabel, healthInsight,
    compScore, compWhy, compAction, compActionLabel,
    finScore, finWhy, finAction, finActionLabel,
    drvScore, drvWhy, drvAction, drvActionLabel,
    fltScore, fltWhy, fltAction, fltActionLabel,
    lenderScore, monthsOfData, monthlyNetIncome, dscr, hasActiveContract,
    healthScoreHistory, setHealthScoreHistory,
    assetsList, setAssetsList, debtList, setDebtList, payablesList, setPayablesList,
    lenderTab, setLenderTab,
    lenderAssetForm, setLenderAssetForm, lenderDebtForm, setLenderDebtForm,
    lenderPayableForm, setLenderPayableForm,
    currentTier, TIERS,
    SubNav, Stat, ExpiryBadge: ExpiryBadgeW, Loader,
    fmt$, fmtDate, daysUntil, statusColor, statusLabel, gradeColor, MODAL_CONFIGS,
  };

  const userEmail = user?.emailAddresses?.[0]?.emailAddress;

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",fontFamily:"'DM Mono','Courier New',monospace",color:"#d4d0c8",display:"flex",flexDirection:"column"}}>
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
        @keyframes drawerIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
      `}</style>

      <EditModal modal={modal} editForm={editForm} setEditForm={setEditForm} saveEdit={saveEdit} closeModal={closeModal} accent={accent} S={S} MODAL_CONFIGS={MODAL_CONFIGS}/>

      <OnboardingBanner
        onboardStep={onboardStep} setOnboardStep={setOnboardStep}
        onboardDismissed={onboardDismissed} setOnboardDismissed={setOnboardDismissed}
        accent={accent} S={S} onNav={handleNav} setNavOpen={setNavOpen}
      />

      {/* PIN Entry Modal */}
      {pinEntry&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:20}}>
          <div style={{background:"#141414",border:`1px solid ${accent}44`,borderRadius:10,padding:"32px 28px",maxWidth:320,width:"100%",textAlign:"center"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#e8e4d8",marginBottom:4}}>Switch User</div>
            <div style={{fontSize:12,color:"#999",marginBottom:20}}>Signing in as <span style={{color:accent}}>{pinEntry.user.name}</span></div>
            <div style={{fontSize:11,color:"#999",marginBottom:10}}>Enter PIN</div>
            <input type="password" maxLength={6} value={pinEntry.enteredPin} onChange={e=>setPinEntry(p=>({...p,enteredPin:e.target.value,error:false}))} onKeyDown={e=>e.key==="Enter"&&confirmPin()} placeholder="••••" style={{...S.input,textAlign:"center",fontSize:24,letterSpacing:"0.3em",marginBottom:8}} autoFocus/>
            {pinEntry.error&&<div style={{fontSize:11,color:"#ef4444",marginBottom:8}}>Incorrect PIN — try again</div>}
            <div style={{display:"flex",gap:10,marginTop:12}}>
              <button className="hov" onClick={confirmPin} style={S.btn}>Confirm</button>
              <button onClick={()=>setPinEntry(null)} style={S.ghost}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* User role bar */}
      {currentUser.role!=="owner"&&(
        <div style={{background:currentUser.role==="manager"?"#0d0d1a":"#0a100a",borderBottom:`1px solid ${currentUser.role==="manager"?"#2a2a5a":"#1a3a1a"}`,padding:"6px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{fontSize:10,color:currentUser.role==="manager"?"#8888cc":"#4ade80",letterSpacing:"0.15em",textTransform:"uppercase"}}>
            {currentUser.role==="manager"?"👔 Manager View":"🚗 Driver View"} — {currentUser.name}
            {currentUser.role==="driver"&&<span style={{color:"#999",marginLeft:8}}>Read only</span>}
          </div>
          <button onClick={()=>setSwitchingUser(true)} style={{background:"transparent",border:"1px solid #2a2a2a",color:"#999",padding:"3px 10px",fontSize:9,cursor:"pointer",borderRadius:3,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>Switch User</button>
        </div>
      )}

      {/* Clerk role driver banner */}
      {isDriverOnly()&&(
        <div style={{background:"#0a0f1a",borderBottom:"1px solid #1a1a3a",color:"#6666aa",fontSize:10,padding:"8px 18px",letterSpacing:"0.08em",flexShrink:0}}>
          🚛 Driver view — you can see your dispatch, HOS log, and pay stubs
        </div>
      )}

      <Nav navOpen={navOpen} setNavOpen={setNavOpen} seg={seg} screen={screen} accent={accent} urgentItems={urgentItems} onNav={handleNav}
        navExpanded={navExpanded} toggleNavExpand={toggleNavExpand} canAccessScreen={canAccessScreenForRole}
        SUB_PAGES={SUB_PAGES} currentTier={currentTier} TIERS={TIERS} subScreen={subScreen} setSubScreen={setSubScreen}
        onSubNav={handleSubNav} currentUser={currentUser} userRole={userRole} signOut={signOut}
        onLockedClick={(id)=>{
          setUpgradeTargetScreen(id);
          setUpgradeEmail(user?.emailAddresses?.[0]?.emailAddress||"");
          setUpgradeSent(false);
          setShowUpgradeModal(true);
        }}/>

      <TopBar
        setNavOpen={setNavOpen} seg={seg} accent={accent} screen={screen}
        urgentItems={urgentItems} userEmail={userEmail}
        onNav={handleNav} prevScreen={prevScreen} onBack={handleBack}
        onSwitchType={()=>{setSegment(null);setScreen("dashboard");localStorage.removeItem("cos_segment_locked");}}
        signOut={signOut}
      />

      {/* Screen routing with tier and role gating */}
      {canAccessScreenForRole(screen) ? <>
        {screen==="dashboard" && <Dashboard {...screenProps}/>}
        {screen==="analyze" && seg.features.loadAnalysis && <Analyze {...screenProps}/>}
        {screen==="boards" && <Boards {...screenProps}/>}
        {screen==="routes" && <Routes {...screenProps}/>}
        {screen==="compliance" && <Compliance {...screenProps}/>}
        {screen==="drivers" && <Drivers {...screenProps}/>}
        {screen==="fleet" && <Fleet {...screenProps}/>}
        {screen==="contracts" && <Contracts {...screenProps}/>}
        {screen==="finance" && <Finance {...screenProps}/>}
        {screen==="brokers" && <Brokers {...screenProps}/>}
        {screen==="reports" && <Reports {...screenProps}/>}
        {screen==="trends" && <Trends {...screenProps}/>}
        {screen==="users" && <Users {...screenProps}/>}
        {screen==="settings" && <Settings seg={seg} accent={accent} S={S} settings={settings} setSettings={setSettings} segment={segment} organization={organization} currentTier={currentTier} TIERS={TIERS} onUpgrade={(tierKey)=>{const tier=TIERS[tierKey||"enterprise"];const screenId=tier?.screens?.[0]||"lender";setUpgradeTargetScreen(screenId);setUpgradeEmail(user?.emailAddresses?.[0]?.emailAddress||"");setUpgradeSent(false);setShowUpgradeModal(true);}}/>}
        {screen==="payroll" && <Payroll {...screenProps}/>}
        {screen==="dispatch" && <Dispatch {...screenProps}/>}
        {screen==="invoices" && <Invoices {...screenProps}/>}
        {screen==="contacts" && <Contacts {...screenProps}/>}
        {screen==="documents" && <Documents {...screenProps}/>}
        {screen==="data" && <DataBackup {...screenProps}/>}
        {screen==="deadmiles" && segment==="otr" && <DeadMiles {...screenProps}/>}
        {screen==="stopprofit" && (segment==="fedex"||segment==="lastmile"||segment==="amazon") && <StopProfit {...screenProps}/>}
        {screen==="settlement" && (segment==="fedex"||segment==="amazon") && <Settlement {...screenProps}/>}
        {screen==="driverschedule" && (segment==="fedex"||segment==="amazon") && <DriverSchedule {...screenProps}/>}
        {screen==="scorecard" && (segment==="fedex"||segment==="amazon"||segment==="lastmile"||segment==="usps") && <Scorecard {...screenProps}/>}
        {screen==="fmcsa" && <FmcsaLookup {...screenProps}/>}
        {screen==="claims" && segment==="lastmile" && <Claims {...screenProps}/>}
        {screen==="lender" && <LenderReport {...screenProps}/>}
      </> : <UpgradePrompt screenId={screen}/>}

      {/* Bug Report Modal */}
      {showBugReport&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20}} onClick={()=>setShowBugReport(false)}>
          <div style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:10,padding:"28px 32px",maxWidth:480,width:"100%"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#e8e4d8",marginBottom:4}}>Report a Bug / Contact</div>
            <div style={{fontSize:11,color:"#999",marginBottom:16}}>Found something broken? Have a feature idea? Reach out directly.</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
              <div><label style={S.label}>Your Email (optional)</label><input value={bugForm.email} onChange={e=>setBugForm(p=>({...p,email:e.target.value}))} placeholder="so we can follow up" style={S.input}/></div>
              <div><label style={S.label}>Subject</label><input value={bugForm.subject} onChange={e=>setBugForm(p=>({...p,subject:e.target.value}))} placeholder="Bug: ..., Feature request: ..." style={S.input}/></div>
              <div><label style={S.label}>Description *</label><textarea value={bugForm.description} onChange={e=>setBugForm(p=>({...p,description:e.target.value}))} placeholder="Describe what happened..." style={{...S.input,height:90,resize:"vertical"}}/></div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <a href={`mailto:bostonrudi1993@gmail.com?subject=${encodeURIComponent(bugForm.subject||"ContractorOS Feedback")}&body=${encodeURIComponent((bugForm.email?"From: "+bugForm.email+"\n\n":"")+bugForm.description)}`} style={{...S.btn,textDecoration:"none",display:"inline-block",fontSize:12}} onClick={()=>setShowBugReport(false)}>Send Email →</a>
              <button onClick={()=>setShowBugReport(false)} style={{...S.ghost,fontSize:11}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Org Profile Modal */}
      {showOrgProfile&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,padding:20}} onClick={()=>setShowOrgProfile(false)}>
          <div style={{maxWidth:860,width:"100%",maxHeight:"90vh",overflow:"auto",borderRadius:10}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8"}}>Manage Team</div>
              <button onClick={()=>setShowOrgProfile(false)} style={{background:"transparent",border:"none",color:"#999",fontSize:22,cursor:"pointer"}}>✕</button>
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

      <UpgradeModal />

      {/* Idle session timeout warning */}
      {idleWarning&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3000,padding:20}}>
          <div style={{background:"#141414",border:"1px solid #ef444455",borderRadius:10,padding:"36px 32px",maxWidth:380,width:"100%",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>⏱</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#e8e4d8",marginBottom:6}}>Still there?</div>
            <div style={{fontSize:12,color:"#999",marginBottom:20,lineHeight:1.5}}>You've been inactive for a while.<br/>You'll be signed out in:</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:52,fontWeight:900,color:"#ef4444",lineHeight:1,marginBottom:24}}>
              {Math.floor(idleCountdown/60)}:{String(idleCountdown%60).padStart(2,"0")}
            </div>
            <button
              onClick={()=>{
                clearInterval(countdownRef.current);
                clearTimeout(warnTimerRef.current);
                setIdleWarning(false);
                setIdleCountdown(180);
              }}
              style={{background:"#f59e0b",border:"none",color:"#0a0a0a",padding:"12px 32px",borderRadius:6,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",width:"100%",marginBottom:10}}
            >
              KEEP ME SIGNED IN
            </button>
            <button
              onClick={()=>signOut({redirectUrl:"/"})}
              style={{background:"transparent",border:"1px solid #333",color:"#888",padding:"8px 20px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em",width:"100%"}}
            >
              Sign out now
            </button>
          </div>
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
          <div style={{marginLeft:"auto",fontSize:9,color:"#999"}}>contractoroshub.com</div>
        </div>
      </div>
    </div>
  );
}
