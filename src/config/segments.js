// ─── SEGMENT CONFIG ────────────────────────────────────────────────────────────
export const SEGMENTS = {
  otr: {
    id: "otr", label: "OTR / Owner Operator", icon: "🚛",
    tagline: "Load board hauling with your own authority",
    color: "#f59e0b", darkColor: "#92400e",
    nav: ["dashboard","analyze","boards","compliance","brokers","fleet","finance","payroll","invoices","dispatch","contacts","documents","reports","trends","users","settings","fmcsa","data","deadmiles","lender"],
    features: { loadAnalysis:true, brokerScorecard:true, loadBoards:true, routeProfit:false, contractTracker:false, dspMetrics:false, stopMetrics:false },
  },
  fedex: {
    id: "fedex", label: "FedEx Ground / HD Contractor", icon: "📦",
    tagline: "ISP route management & compliance",
    color: "#6366f1", darkColor: "#3730a3",
    nav: ["dashboard","routes","compliance","drivers","dispatch","fleet","finance","payroll","invoices","contacts","documents","contracts","stopprofit","settlement","driverschedule","reports","trends","users","settings","fmcsa","data","lender"],
    features: { loadAnalysis:false, brokerScorecard:false, loadBoards:false, routeProfit:true, contractTracker:true, dspMetrics:false, stopMetrics:true },
  },
  amazon: {
    id: "amazon", label: "Amazon DSP", icon: "📬",
    tagline: "Delivery Service Partner operations",
    color: "#f97316", darkColor: "#9a3412",
    nav: ["dashboard","routes","compliance","drivers","dispatch","fleet","finance","payroll","invoices","contacts","documents","contracts","stopprofit","settlement","driverschedule","scorecard","reports","trends","users","settings","fmcsa","data","lender"],
    features: { loadAnalysis:false, brokerScorecard:false, loadBoards:false, routeProfit:true, contractTracker:true, dspMetrics:true, stopMetrics:true },
  },
  lastmile: {
    id: "lastmile", label: "Last Mile (Lowe's / Home Depot)", icon: "🏠",
    tagline: "Home delivery contractor management",
    color: "#22c55e", darkColor: "#14532d",
    nav: ["dashboard","routes","compliance","drivers","dispatch","fleet","finance","payroll","invoices","contacts","documents","contracts","claims","stopprofit","reports","trends","users","settings","fmcsa","data","lender"],
    features: { loadAnalysis:false, brokerScorecard:false, loadBoards:false, routeProfit:true, contractTracker:true, dspMetrics:false, stopMetrics:true },
  },
  usps: {
    id: "usps", label: "USPS HCR Contractor", icon: "📮",
    tagline: "Highway Contract Route operations",
    color: "#3b82f6", darkColor: "#1e3a8a",
    nav: ["dashboard","routes","compliance","drivers","dispatch","fleet","finance","payroll","invoices","contacts","documents","contracts","reports","trends","users","settings","fmcsa","data","lender"],
    features: { loadAnalysis:false, brokerScorecard:false, loadBoards:false, routeProfit:true, contractTracker:true, dspMetrics:false, stopMetrics:false },
  },
};
