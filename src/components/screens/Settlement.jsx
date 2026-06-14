// Settlement screen
export default function Settlement(p) {
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
  return (
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

  );
}
