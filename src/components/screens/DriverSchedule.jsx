// DriverSchedule screen
export default function DriverSchedule(p) {
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

  );
}
