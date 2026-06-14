// Dispatch screen
export default function Dispatch(p) {
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
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div><div style={S.section}>DISPATCH BOARD</div><div style={{fontSize:11,color:"#555",marginTop:4}}>Assign loads and routes to drivers and trucks. Track run status.</div></div>
              <button className="hov" onClick={()=>setDispatchShowAdd(!dispatchShowAdd)} style={S.btn}>{dispatchShowAdd?"Cancel":"+ Assign Run"}</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
              {[["Active",dispatches.filter(d=>d.status==="assigned"||d.status==="in_progress"||d.status==="issue").length.toString(),accent],["Completed",dispatches.filter(d=>d.status==="completed").length.toString(),"#22c55e"],["Issues",dispatches.filter(d=>d.status==="issue").length.toString(),dispatches.filter(d=>d.status==="issue").length>0?"#ef4444":"#555"],["Total",dispatches.length.toString(),"#555"]].map(([lbl,val,col])=>(
                <div key={lbl} style={S.card}><div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:col}}>{val}</div><div style={{fontSize:9,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:4}}>{lbl}</div></div>
              ))}
            </div>
            {dispatchShowAdd&&(
              <div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Driver</label><select value={dispatchForm.driverId} onChange={e=>setDispatchForm(p=>({...p,driverId:e.target.value}))} style={S.input}><option value="">Select driver...</option>{(drivers.filter(d=>d.status==="active").length>0?drivers.filter(d=>d.status==="active"):drivers).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                  <div><label style={S.label}>Truck / Vehicle</label><select value={dispatchForm.vehicleName} onChange={e=>setDispatchForm(p=>({...p,vehicleName:e.target.value}))} style={S.input}><option value="">Select truck...</option>{compliance.trucks.map(v=><option key={v.id} value={v.name}>{v.name}{v.nickname?` "${v.nickname}"`:""}</option>)}</select></div>
                  {routes.length>0&&<div><label style={S.label}>Saved Route</label><select value={dispatchForm.routeName} onChange={e=>setDispatchForm(p=>({...p,routeName:e.target.value}))} style={S.input}><option value="">Custom or select...</option>{routes.map(r=><option key={r.id} value={r.name}>{r.name}</option>)}</select></div>}
                  <div><label style={S.label}>Date</label><input type="date" value={dispatchForm.date} onChange={e=>setDispatchForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                  <div><label style={S.label}>Origin / Pickup</label><input value={dispatchForm.origin} onChange={e=>setDispatchForm(p=>({...p,origin:e.target.value}))} placeholder="City, address, terminal..." style={S.input}/></div>
                  <div><label style={S.label}>Destination / Delivery</label><input value={dispatchForm.destination} onChange={e=>setDispatchForm(p=>({...p,destination:e.target.value}))} placeholder="City, store #, address..." style={S.input}/></div>
                  <div><label style={S.label}>Pickup Time</label><input type="time" value={dispatchForm.pickupTime} onChange={e=>setDispatchForm(p=>({...p,pickupTime:e.target.value}))} style={S.input}/></div>
                  <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes / Special Instructions</label><input value={dispatchForm.notes} onChange={e=>setDispatchForm(p=>({...p,notes:e.target.value}))} placeholder="Load #, delivery contact, access code..." style={S.input}/></div>
                </div>
                <button className="hov" onClick={()=>{const driver=drivers.find(d=>String(d.id)===String(dispatchForm.driverId));setDispatches(p=>[{...dispatchForm,id:Date.now(),driverName:driver?.name||"Unassigned",createdDate:new Date().toISOString().slice(0,10)},...p]);setDispatchForm({driverId:"",vehicleName:"",routeName:"",origin:"",destination:"",date:"",pickupTime:"",notes:"",status:"assigned"});setDispatchShowAdd(false);}} style={{...S.btn,marginTop:14}}>Assign Run</button>
              </div>
            )}
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {[["active","Active"],["history","History"],["all","All"]].map(([k,lbl])=>(
                <button key={k} onClick={()=>setDispatchFilter(k)} style={{background:dispatchFilter===k?accent+"22":"transparent",border:`1px solid ${dispatchFilter===k?accent:"#2a2a2a"}`,color:dispatchFilter===k?accent:"#555",padding:"6px 16px",borderRadius:4,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>{lbl}</button>
              ))}
            </div>
            {(()=>{
              const STATUS_COLORS={assigned:"#f59e0b",in_progress:"#60a5fa",completed:"#22c55e",cancelled:"#555",issue:"#ef4444"};
              const STATUS_LABELS={assigned:"Assigned",in_progress:"In Progress",completed:"Completed",cancelled:"Cancelled",issue:"Issue"};
              const active=dispatches.filter(d=>d.status==="assigned"||d.status==="in_progress"||d.status==="issue");
              const history=dispatches.filter(d=>d.status==="completed"||d.status==="cancelled");
              const shown=dispatchFilter==="active"?active:dispatchFilter==="history"?history:dispatches;
              if(shown.length===0) return <div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>{dispatchFilter==="active"?"No active dispatches.":"No dispatch history yet."}</div>;
              return shown.map(d=>(
                <div key={d.id} style={{...S.card,borderLeft:`3px solid ${STATUS_COLORS[d.status]||"#555"}`,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8"}}>{d.driverName}</div>
                        {d.vehicleName&&<span style={{fontSize:10,color:accent,border:`1px solid ${accent}44`,padding:"1px 7px",borderRadius:3}}>{d.vehicleName}</span>}
                        <span style={{fontSize:9,color:STATUS_COLORS[d.status],border:`1px solid ${STATUS_COLORS[d.status]}44`,padding:"1px 7px",borderRadius:3,textTransform:"uppercase"}}>{STATUS_LABELS[d.status]}</span>
                      </div>
                      <div style={{fontSize:11,color:"#888"}}>{d.routeName&&`${d.routeName} · `}{d.origin&&d.destination?`${d.origin} → ${d.destination}`:d.origin||d.destination||"No route details"}</div>
                      <div style={{fontSize:10,color:"#555",marginTop:3}}>{fmtDate(d.date)}{d.pickupTime?` @ ${d.pickupTime}`:""}{d.notes&&` · ${d.notes}`}</div>
                    </div>
                  </div>
                  {/* ── D14: LastMile dispatch enhancements ── */}
                  {segment==="lastmile"&&(()=>{
                    const drv=drivers.find(x=>x.id===d.driverId);
                    const dailyRate=drv?.payType==="per_day"?parseFloat(drv.payRate||0):null;
                    const gasCost=fuelLog.filter(f=>f.date===d.date&&f.truckName===d.vehicleName).reduce((s,f)=>s+parseFloat(f.totalCost||0),0);
                    const wg=whiteGloveLog.find(w=>w.dispatchId===d.id);
                    const wgItems=wg?.items||{};
                    const wgTotal=Object.keys(wgItems).length;
                    const wgDone=Object.values(wgItems).filter(Boolean).length;
                    const wgStatus=wgTotal===0?"none":wgDone===wgTotal?"complete":"partial";
                    return <>
                      <div style={{display:"flex",gap:12,fontSize:11,color:"#888",marginTop:6}}>
                        {dailyRate!==null&&<span>Daily Rate: <span style={{color:accent}}>${dailyRate.toFixed(0)}/day</span></span>}
                        <span>Gas: {gasCost>0?<span style={{color:accent}}>${gasCost.toFixed(2)}</span>:<span style={{color:"#555"}}>Not logged</span>}</span>
                      </div>
                      <div style={{marginTop:8}}>
                        <button className="hov" onClick={()=>setWhiteGloveOpen(whiteGloveOpen===d.id?null:d.id)} style={{fontSize:10,padding:"3px 10px",borderRadius:3,border:`1px solid ${wgStatus==="complete"?"#22c55e":wgStatus==="partial"?"#f59e0b":"#888"}44`,background:"transparent",color:wgStatus==="complete"?"#22c55e":wgStatus==="partial"?"#f59e0b":"#888",cursor:"pointer"}}>White Glove {wgStatus==="complete"?"✓":wgStatus==="partial"?`(${wgDone}/${wgTotal})`:"—"}</button>
                        {whiteGloveOpen===d.id&&<div style={{...S.card,marginTop:8,background:"#0a0a14"}}>
                          {[["called","Called customer 30 min ahead"],["access","Confirmed access (elevator/doorway)"],["floor","Protective floor covering laid"],["unboxed","Unboxed at customer request"],["placed","Placed in designated room"],["packaging","Packaging removed and hauled away"],["oldItem","Old item removed (if applicable)"],["signed","Customer signed delivery confirmation"],["photo","Photo of placed item taken"]].map(([key,label])=>(
                            <label key={key} style={{display:"flex",alignItems:"center",gap:8,fontSize:11,color:"#e8e4d8",marginBottom:5}}>
                              <input type="checkbox" checked={wgItems[key]||false} onChange={e=>{
                                const existing=whiteGloveLog.find(w=>w.dispatchId===d.id);
                                const newItems={...(existing?.items||{}),[key]:e.target.checked};
                                if(existing){setWhiteGloveLog(p=>p.map(w=>w.dispatchId===d.id?{...w,items:newItems}:w));}
                                else{setWhiteGloveLog(p=>[{id:Date.now(),dispatchId:d.id,items:newItems},...p]);}
                              }}/>
                              {label}
                            </label>
                          ))}
                        </div>}
                      </div>
                    </>;
                  })()}
                  {(d.status==="assigned"||d.status==="in_progress"||d.status==="issue")&&(
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {d.status==="assigned"&&<button onClick={()=>setDispatches(p=>p.map(x=>x.id===d.id?{...x,status:"in_progress"}:x))} style={{...S.btn,background:"#60a5fa",fontSize:10,padding:"5px 12px"}}>Start Run</button>}
                      {d.status==="in_progress"&&<button onClick={()=>setDispatches(p=>p.map(x=>x.id===d.id?{...x,status:"completed"}:x))} style={{...S.btn,background:"#22c55e",fontSize:10,padding:"5px 12px"}}>Complete</button>}
                      <button onClick={()=>setDispatches(p=>p.map(x=>x.id===d.id?{...x,status:"issue"}:x))} style={{background:"transparent",border:"1px solid #ef444444",color:"#ef4444",cursor:"pointer",fontSize:10,padding:"5px 10px",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>Flag Issue</button>
                      <button onClick={()=>setDispatches(p=>p.filter(x=>x.id!==d.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12,marginLeft:"auto"}}>✕</button>
                    </div>
                  )}
                </div>
              ));
            })()}
          </div>
        </div>

  );
}
