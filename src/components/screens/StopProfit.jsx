// StopProfit screen
export default function StopProfit(p) {
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

  );
}
