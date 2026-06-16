// ─── STORAGE KEYS ─────────────────────────────────────────────────────────────
export const KEYS = {
  segment: "cos_segment", settings: "cos_settings", compliance: "cos_compliance",
  drivers: "cos_drivers", vehicles: "cos_vehicles", maintenance: "cos_maintenance",
  expenses: "cos_expenses", revenue: "cos_revenue", routes: "cos_routes",
  contracts: "cos_contracts", incidents: "cos_incidents", brokers: "cos_brokers",
  loads: "cos_loads", users: "cos_users", currentUser: "cos_current_user",
  notifications: "cos_notifications", filings: "cos_filings",
  payroll: "cos_payroll", fuelLog: "cos_fuel_log", invoices: "cos_invoices",
  odometer: "cos_odometer", tires: "cos_tires", documents: "cos_documents",
  dispatches: "cos_dispatches", contacts: "cos_contacts", hosLog: "cos_hos_log",
  stopProfitLog: "cos_stop_profit", settlementLog: "cos_settlement_log", scheduleData: "cos_schedule_data",
  coachingLog: "cos_coaching_log", appearanceLog: "cos_appearance_log", dnrLog: "cos_dnr_log",
  tripSheets: "cos_trip_sheets", vanInspectionLog: "cos_van_inspection_log", bidTracker: "cos_bid_tracker",
  deadMilesLog: "cos_dead_miles_log", loadHistory: "cos_load_history", whiteGloveLog: "cos_white_glove_log",
  calloutLog: "cos_callout_log", damageClaims: "cos_damage_claims", fuelCardImports: "cos_fuel_card_imports",
  assetsList: "cos_assets_list", debtList: "cos_debt_list", payablesList: "cos_payables_list",
  healthScoreHistory: "cos_health_history",
};

export const stor = {
  get: (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

export const DEFAULT_FILINGS = [
  {id:"ifta-q1", name:"IFTA Q1 Return", dueDate:"Jan 31", frequency:"Annual", notes:"Fuel tax for Oct–Dec quarter", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"ifta-q2", name:"IFTA Q2 Return", dueDate:"Apr 30", frequency:"Annual", notes:"Fuel tax for Jan–Mar quarter", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"ifta-q3", name:"IFTA Q3 Return", dueDate:"Jul 31", frequency:"Annual", notes:"Fuel tax for Apr–Jun quarter", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"ifta-q4", name:"IFTA Q4 Return", dueDate:"Oct 31", frequency:"Annual", notes:"Fuel tax for Jul–Sep quarter", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"ucr",     name:"UCR Registration", dueDate:"Dec 31", frequency:"Annual", notes:"Opens Oct 1 — don't miss it", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"mcs150",  name:"MCS-150 Update", dueDate:"Every 2 years", frequency:"Biennial", notes:"Based on USDOT# issuance date — check FMCSA portal", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"clearinghouse", name:"Drug Clearinghouse Query", dueDate:"Annual per driver", frequency:"Annual", notes:"Required employer query — once per driver per year", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
  {id:"eld",     name:"ELD Log Retention", dueDate:"Ongoing — 6 months", frequency:"Ongoing", notes:"Keep all HOS logs minimum 6 months", federal:true, filedDate:"", confirmationNum:"", filedNotes:""},
];
