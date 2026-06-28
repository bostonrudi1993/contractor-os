// Payroll screen
export default function Payroll(p) {
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
                  <div><div style={S.section}>PAYROLL</div><div style={{fontSize:11,color:"#999",marginTop:4}}>Log pay runs, generate pay stubs, and track what's owed.</div></div>
                  <button className="hov" onClick={()=>setPayrollShowAdd(!payrollShowAdd)} style={S.btn}>{payrollShowAdd?"Cancel":"+ New Pay Run"}</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                  {[["Unpaid Balance",fmt$(totalUnpaid),"#ef4444"],["Total Paid (All Time)",fmt$(totalPaid),"#22c55e"],["Pay Runs",payroll.length.toString(),accent]].map(([lbl,val,col])=>(
                    <div key={lbl} style={S.card}><div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:col}}>{val}</div><div style={{fontSize:9,color:"#999",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:4}}>{lbl}</div></div>
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
                      <div><label style={S.label}>Manual Override Amount ($) <span style={{color:"#999",fontSize:8}}>(optional — overrides calculated pay)</span></label><input type="number" value={payrollForm.manualAmount||""} onChange={e=>setPayrollForm(p=>({...p,manualAmount:e.target.value}))} placeholder="Leave blank to use calculated amount" style={S.input}/></div>
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
                {payroll.length===0&&!payrollShowAdd&&<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>No pay runs yet. Add drivers first, then log pay runs here.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {payroll.map(run=>(
                    <div key={run.id} style={{...S.card,borderLeft:`3px solid ${run.status==="paid"?"#22c55e":"#f59e0b"}`,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8"}}>{run.driverName}</div><div style={{fontSize:10,color:"#999"}}>{run.periodStart}{run.periodEnd?` → ${run.periodEnd}`:""} · {run.breakdown}{run.notes&&` · ${run.notes}`}</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:"#22c55e"}}>{fmt$(run.gross)}</div><div style={{fontSize:9,color:run.status==="paid"?"#22c55e":"#f59e0b",textTransform:"uppercase",letterSpacing:"0.1em"}}>{run.status==="paid"?`✓ Paid ${fmtDate(run.paidDate)}`:"Unpaid"}</div></div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        {run.status==="unpaid"&&<button onClick={()=>setPayroll(p=>p.map(r=>r.id===run.id?{...r,status:"paid",paidDate:new Date().toISOString().slice(0,10)}:r))} style={{...S.btn,background:"#22c55e",fontSize:10,padding:"5px 12px"}}>Mark Paid</button>}
                        <button onClick={()=>setPayStub(run)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"5px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Stub</button>
                        <button onClick={()=>setPayroll(p=>p.filter(r=>r.id!==run.id))} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12}}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {payrollSub==="summary"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:20}}>DRIVER PAY SUMMARY</div>
                {drivers.length===0&&<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>No drivers added yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {drivers.map(d=>{const runs=payroll.filter(r=>String(r.driverId)===String(d.id));const ytd=runs.reduce((s,r)=>s+r.gross,0);const unpaid=runs.filter(r=>r.status==="unpaid").reduce((s,r)=>s+r.gross,0);return(
                    <div key={d.id} style={S.card}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                        <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:"#e8e4d8"}}>{d.name}</div><div style={{fontSize:10,color:"#999"}}>{d.payType?.replace(/_/g," ")} · ${d.payRate}</div></div>
                        {unpaid>0&&<div style={{fontSize:11,color:"#f59e0b"}}>⚠ {fmt$(unpaid)} owed</div>}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                        {[["YTD Earnings",fmt$(ytd),"#22c55e"],["Unpaid",fmt$(unpaid),unpaid>0?"#f59e0b":"#555"],["Pay Runs",runs.length.toString(),accent]].map(([lbl,val,col])=>(
                          <div key={lbl} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{lbl}</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:col}}>{val}</div></div>
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
                <div style={{fontSize:11,color:"#999",marginBottom:20}}>Year-to-date totals by driver. Give this to your accountant at tax time.</div>
                <div style={{border:"1px solid #1e1e1e",borderRadius:8,overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",background:"#0d0d0d",borderBottom:"1px solid #1e1e1e"}}>
                    {["Driver","Pay Runs","Total Gross","Status"].map(h=>(<div key={h} style={{padding:"10px 14px",fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em"}}>{h}</div>))}
                  </div>
                  {drivers.map(d=>{const runs=payroll.filter(r=>String(r.driverId)===String(d.id));const ytd=runs.reduce((s,r)=>s+r.gross,0);const unpaid=runs.filter(r=>r.status==="unpaid").reduce((s,r)=>s+r.gross,0);return(
                    <div key={d.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",borderBottom:"1px solid #161616"}}>
                      <div style={{padding:"10px 14px"}}><div style={{fontSize:12,color:"#c8c4bc"}}>{d.name}</div><div style={{fontSize:9,color:"#999"}}>{d.payType?.replace(/_/g," ")}</div></div>
                      <div style={{padding:"10px 14px",fontSize:12,color:"#888"}}>{runs.length}</div>
                      <div style={{padding:"10px 14px",fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#22c55e"}}>{fmt$(ytd)}</div>
                      <div style={{padding:"10px 14px",fontSize:11,color:unpaid>0?"#f59e0b":"#22c55e"}}>{unpaid>0?`${fmt$(unpaid)} owed`:"Fully paid"}</div>
                    </div>
                  );})}
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",background:"#0d0d0d",borderTop:"1px solid #2a2a2a"}}>
                    <div style={{padding:"10px 14px",fontSize:10,color:"#999",textTransform:"uppercase"}}>Total</div>
                    <div style={{padding:"10px 14px",fontSize:12,color:"#888"}}>{payroll.length}</div>
                    <div style={{padding:"10px 14px",fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:accent}}>{fmt$(payroll.reduce((s,r)=>s+r.gross,0))}</div>
                    <div style={{padding:"10px 14px",fontSize:11,color:"#ef4444"}}>{fmt$(totalUnpaid)} owed</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Pay Stub Modal */}
          {payStub&&(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}} onClick={()=>setPayStub(null)}><div style={{background:"#141414",border:`1px solid ${accent}44`,borderRadius:10,padding:"28px 32px",maxWidth:480,width:"100%",animation:"fadeUp 0.2s ease"}} onClick={e=>e.stopPropagation()}><div style={{textAlign:"center",marginBottom:20,paddingBottom:16,borderBottom:"1px solid #222"}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:"#e8e4d8"}}>PAY STUB</div><div style={{fontSize:10,color:"#999",marginTop:4}}>ContractorOS · {new Date().toLocaleDateString()}</div></div><div style={{display:"flex",flexDirection:"column",gap:10}}>{[["Driver",payStub.driverName],["Pay Period",`${payStub.periodStart}${payStub.periodEnd?" → "+payStub.periodEnd:""}`],["Pay Type",payStub.payType?.replace(/_/g," ")],["Calculation",payStub.breakdown],["Status",payStub.status==="paid"?`Paid ${fmtDate(payStub.paidDate)}`:"Unpaid"]].map(([lbl,val])=>(<div key={lbl} style={{display:"flex",justifyContent:"space-between",borderBottom:"1px solid #1a1a1a",paddingBottom:8}}><span style={{fontSize:10,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em"}}>{lbl}</span><span style={{fontSize:12,color:"#c8c4bc"}}>{val}</span></div>))}<div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:8,borderTop:"2px solid #2a2a2a"}}><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"#e8e4d8"}}>GROSS PAY</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:"#22c55e"}}>{fmt$(payStub.gross)}</span></div>{payStub.notes&&<div style={{fontSize:11,color:"#999",fontStyle:"italic"}}>Note: {payStub.notes}</div>}</div><button onClick={()=>window.print()} style={{...S.btn,width:"100%",marginTop:20}}>Print / Save as PDF</button></div></div>)}
        </div>
      )})();
}
