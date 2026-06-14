// DeadMiles screen
export default function DeadMiles(p) {
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
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:"#e8e4d8"}}>🛣 Dead Miles Tracker</div>
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
            const totalOdom=odometer.filter(o=>o.date&&o.date.startsWith(monthStr)).reduce((s,o)=>s+parseFloat(o.reading||0),0);
            const deadPct=totalOdom>0?(monthDead/(monthDead+totalOdom)*100):0;
            const estCost=monthDead*parseFloat(settings.cpm||0.18);
            return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:16}}>
              <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Dead Miles This Month</div><div style={{fontSize:24,fontWeight:700,color:accent}}>{monthDead.toFixed(0)}</div></div>
              <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Dead Miles %</div><div style={{fontSize:24,fontWeight:700,color:deadPct>15?"#ef4444":"#22c55e"}}>{deadPct.toFixed(1)}%</div></div>
              <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Est. Cost (CPM)</div><div style={{fontSize:24,fontWeight:700,color:"#ef4444"}}>${estCost.toFixed(0)}</div></div>
            </div>;
          })()}
          {(()=>{
            const weeks=[];
            for(let i=7;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i*7);const wStart=new Date(d);wStart.setDate(wStart.getDate()-wStart.getDay());const wEnd=new Date(wStart);wEnd.setDate(wEnd.getDate()+6);const wStr=wStart.toISOString().slice(0,10);const wEndStr=wEnd.toISOString().slice(0,10);const miles=deadMilesLog.filter(e=>e.date>=wStr&&e.date<=wEndStr).reduce((s,e)=>s+parseFloat(e.emptyMiles||0),0);weeks.push({label:wStr.slice(5),miles});}
            const maxMiles=Math.max(...weeks.map(w=>w.miles),1);
            return <div style={{...S.card,marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:"#e8e4d8",marginBottom:8}}>Dead Miles — Last 8 Weeks</div>
              <svg width="100%" height="100" viewBox={`0 0 ${weeks.length*50} 100`}>
                {weeks.map((w,i)=>{const barH=Math.max(2,(w.miles/maxMiles)*70);return <g key={i}><rect x={i*50+5} y={75-barH} width={40} height={barH} fill={accent} opacity={0.7} rx={2}/><text x={i*50+25} y={90} textAnchor="middle" fill="#555" fontSize="8">{w.label}</text>{w.miles>0&&<text x={i*50+25} y={70-barH} textAnchor="middle" fill="#e8e4d8" fontSize="8">{w.miles.toFixed(0)}</text>}</g>;})}
              </svg>
            </div>;
          })()}
          {deadMilesLog.length===0&&<div style={{color:"#555",fontSize:12}}>No dead miles logged yet.</div>}
          {deadMilesLog.map(d=>(
            <div key={d.id} style={{...S.card,marginBottom:6}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div><div style={{fontSize:12,color:"#e8e4d8"}}>{d.date} · {d.fromLocation}→{d.toLocation}</div><div style={{fontSize:11,color:"#888"}}>{d.emptyMiles}mi · {d.reason}</div></div>
                <button className="hov" onClick={()=>setDeadMilesLog(p=>p.filter(x=>x.id!==d.id))} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:"1px solid #ef444444",background:"transparent",color:"#ef4444",cursor:"pointer"}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
