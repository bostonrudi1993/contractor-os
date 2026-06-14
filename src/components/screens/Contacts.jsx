// Contacts screen
export default function Contacts(p) {
  const {
    seg, accent, S, segment, screen,
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
    openEdit, saveEdit, closeModal, generatePDF, generateNotifications, canEdit, isOwner,
    analyzeLoad, parseLoad, analyzeRoute, askDot, lookupDOT, applyToSettings,
    importExcelPL, confirmExcelImport, showValidation,
    urgentItems, SubNav, Stat, ExpiryBadge, Loader, fmt$, fmtDate, daysUntil,
    statusColor, statusLabel, gradeColor, MODAL_CONFIGS,
  } = p;
  return (()=>{
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
      )})();
}
