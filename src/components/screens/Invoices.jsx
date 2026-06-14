// Invoices screen
export default function Invoices(p) {
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
      )})();
}
