// Routes screen
export default function Routes(p) {
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
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[["list","My Routes"],["add","Add Route"],["performance","Performance"],...(segment==="amazon"?[["dnr","DNR Cases"]]:segment==="usps"?[["tripsheets","Trip Sheets"]]:[])]  } active={subScreen||"list"} onSelect={setSubScreen}/>
          <div style={{flex:1,overflowY:"auto",padding:24}}>
            {(!subScreen||subScreen==="list")&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={S.section}>ROUTE PROFITABILITY</div>
                  <button className="hov" onClick={()=>setSubScreen("add")} style={S.btn}>+ Add Route</button>
                </div>
                {routes.length===0&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No routes added yet. Click "+ Add Route" to get started.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {routes.map(r=>(
                    <div key={r.id} style={S.card}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8"}}>{r.name}</div>
                          <div style={{fontSize:10,color:"#555"}}>{r.stops} stops · {r.miles} mi · {r.frequency||"Daily"}</div>
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          {r.analysis&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:gradeColor(r.analysis.profitabilityScore)}}>{r.analysis.verdict}</div>}
                          <button onClick={()=>openEdit("route",r)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                          <button className="hov" onClick={()=>analyzeRoute(r)} style={{...S.btn,padding:"6px 14px",fontSize:11}}>Analyze</button>
                          <button onClick={()=>setRoutes(p=>p.filter(x=>x.id!==r.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                        {[
                          ["Flat Rate",fmt$(parseFloat(r.rate||0)),"#22c55e"],
                          ["Per Stop",r.stopRate?fmt$(parseFloat(r.stopRate)):"—","#4ade80"],
                          ["Per Mile",r.ratePerMile?`$${parseFloat(r.ratePerMile).toFixed(2)}/mi`:"—","#86efac"],
                          ["Fuel Est",fmt$((parseFloat(r.miles||0)/settings.mpg)*settings.dieselPrice),"#ef4444"],
                          ["Driver Pay",fmt$(parseFloat(r.driverPay||0)),"#f59e0b"],
                          ["Net Est",fmt$(parseFloat(r.rate||0)-((parseFloat(r.miles||0)/settings.mpg)*settings.dieselPrice)-parseFloat(r.driverPay||0)-parseFloat(r.otherCosts||0)),parseFloat(r.rate||0)-((parseFloat(r.miles||0)/settings.mpg)*settings.dieselPrice)-parseFloat(r.driverPay||0)>0?"#22c55e":"#ef4444"],
                          ["Stops",r.stops||"—","#c8c4bc"],
                          ["Miles",r.miles||"—","#c8c4bc"],
                        ].map(([lbl,val,col])=>(
                          <div key={lbl} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{lbl}</div><div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:col}}>{val}</div></div>
                        ))}
                      </div>
                      {r.analysis&&(
                        <div style={{marginTop:12,padding:"10px 14px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5}}>
                          <div style={{fontSize:11,color:"#888",lineHeight:1.7,marginBottom:8}}>{r.analysis.summary}</div>
                          {r.analysis.recommendations?.length>0&&r.analysis.recommendations.map((rec,i)=>(
                            <div key={i} style={{fontSize:11,color:accent,padding:"3px 0"}}>→ {rec}</div>
                          ))}
                        </div>
                      )}
                      {aiLoading&&<Loader msg="Analyzing route..."/>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subScreen==="add"&&(
              <div style={{maxWidth:600,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:20}}>ADD ROUTE</div>
                <div style={S.card}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {[["name","Route Name *","Route A / Zone 3"],["stops",seg.features.stopMetrics?"Number of Stops":"Deliveries","42"],["miles","Miles per Run","87"],["rate","Flat Contracted Rate ($)","485"],["stopRate","Rate Per Stop ($)","11.50"],["ratePerMile","Rate Per Mile ($)","2.10"],["driverPay","Driver Pay ($)","120"],["otherCosts","Other Costs ($)","25"]].map(([f,lbl,ph])=>(
                      <div key={f}><label style={S.label}>{lbl}</label><input value={routeForm[f]||""} onChange={e=>setRouteForm(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input}/></div>
                    ))}
                    <div><label style={S.label}>Frequency</label>
                      <select value={routeForm.frequency} onChange={e=>setRouteForm(p=>({...p,frequency:e.target.value}))} style={S.input}>
                        {["Daily","Mon-Fri","Mon-Sat","Alternate Days","Weekly"].map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div><label style={S.label}>Assigned Vehicle</label>
                      <select value={routeForm.vehicle} onChange={e=>setRouteForm(p=>({...p,vehicle:e.target.value}))} style={S.input}>
                        <option value="">Select...</option>
                        {compliance.trucks.map(t=><option key={t.id} value={t.name}>{t.name}{t.nickname?` "${t.nickname}"`:""}{ t.vin?` · ${t.vin.slice(-6)}`:""}</option>)}
                        <option value="Unassigned">Unassigned</option>
                      </select>
                    </div>
                    <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={routeForm.notes} onChange={e=>setRouteForm(p=>({...p,notes:e.target.value}))} placeholder="Special instructions, access notes, etc." style={S.input}/></div>
                  </div>
                  <div style={{display:"flex",gap:12,marginTop:16}}>
                    <button className="hov" onClick={()=>{ if(!routeForm.name)return; setRoutes(p=>[...p,{...routeForm,id:Date.now()}]); setRouteForm({name:"",stops:"",miles:"",rate:"",stopRate:"",ratePerMile:"",driverPay:"",otherCosts:"",frequency:"Daily",vehicle:"",notes:""}); setSubScreen("list"); }} style={S.btn}>Save Route</button>
                    <button onClick={()=>setSubScreen("list")} style={S.ghost}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── D4: DNR Cases ── */}
            {subScreen==="dnr"&&segment==="amazon"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8"}}>DNR Case Log</div>
                  <button className="hov" onClick={()=>setShowDnrAdd(p=>!p)} style={S.btn}>+ Add Case</button>
                </div>
                {(()=>{
                  const weekStart=new Date();weekStart.setDate(weekStart.getDate()-weekStart.getDay());
                  const weekDisp=dispatches.filter(d=>d.date>=weekStart.toISOString().slice(0,10)).length;
                  const weekDnr=dnrLog.filter(d=>d.date>=weekStart.toISOString().slice(0,10)).length;
                  const rate=weekDisp>0?(weekDnr/weekDisp*100):0;
                  return rate>0.5?<div style={{...S.card,background:"#1a0808",border:"1px solid #ef444455",color:"#ef4444",fontSize:12,marginBottom:12}}>🚨 DNR rate above threshold ({rate.toFixed(2)}%) — review with Amazon portal</div>:null;
                })()}
                {showDnrAdd&&<div style={{...S.card,marginBottom:16}}>
                  <input type="date" value={dnrForm.date} onChange={e=>setDnrForm(p=>({...p,date:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <select value={dnrForm.driverId} onChange={e=>setDnrForm(p=>({...p,driverId:e.target.value}))} style={{...S.input,marginBottom:8}}>
                    <option value="">Select Driver</option>
                    {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <input placeholder="Customer Address" value={dnrForm.address} onChange={e=>setDnrForm(p=>({...p,address:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <input placeholder="Package ID (optional)" value={dnrForm.packageId} onChange={e=>setDnrForm(p=>({...p,packageId:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <textarea placeholder="Description" value={dnrForm.description} onChange={e=>setDnrForm(p=>({...p,description:e.target.value}))} style={{...S.input,marginBottom:8,minHeight:60}}/>
                  <select value={dnrForm.resolution} onChange={e=>setDnrForm(p=>({...p,resolution:e.target.value}))} style={{...S.input,marginBottom:8}}>
                    {["Pending","Cleared","Penalized"].map(r=><option key={r}>{r}</option>)}
                  </select>
                  <label style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#888",marginBottom:8}}>
                    <input type="checkbox" checked={dnrForm.responseSubmittedToAmazon} onChange={e=>setDnrForm(p=>({...p,responseSubmittedToAmazon:e.target.checked}))}/> Response Submitted to Amazon
                  </label>
                  <input placeholder="Notes" value={dnrForm.notes} onChange={e=>setDnrForm(p=>({...p,notes:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <button className="hov" onClick={()=>{
                    const drv=drivers.find(d=>d.id===dnrForm.driverId);
                    setDnrLog(p=>[{id:Date.now(),driverName:drv?.name||"",...dnrForm},...p]);
                    setDnrForm({date:"",driverId:"",address:"",packageId:"",description:"",responseSubmittedToAmazon:false,responseDate:"",resolution:"Pending",notes:""});
                    setShowDnrAdd(false);
                  }} style={S.btn}>Save Case</button>
                </div>}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12,marginBottom:16}}>
                  <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Open Cases</div><div style={{fontSize:24,fontWeight:700,color:"#ef4444"}}>{dnrLog.filter(d=>d.resolution==="Pending").length}</div></div>
                  <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Cleared</div><div style={{fontSize:24,fontWeight:700,color:"#22c55e"}}>{dnrLog.filter(d=>d.resolution==="Cleared").length}</div></div>
                  <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Penalized</div><div style={{fontSize:24,fontWeight:700,color:"#ef4444"}}>{dnrLog.filter(d=>d.resolution==="Penalized").length}</div></div>
                </div>
                {dnrLog.length===0&&<div style={{color:"#555",fontSize:12}}>No DNR cases logged.</div>}
                {dnrLog.map(d=>(
                  <div key={d.id} style={{...S.card,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:13,color:"#e8e4d8"}}>{d.driverName} · {d.address}</div>
                        <div style={{fontSize:11,color:"#888"}}>{d.date} · {d.description}</div>
                        {d.responseSubmittedToAmazon&&<div style={{fontSize:10,color:"#22c55e",marginTop:2}}>✓ Response submitted</div>}
                      </div>
                      <span style={{fontSize:11,padding:"2px 8px",borderRadius:3,background:d.resolution==="Cleared"?"#22c55e33":d.resolution==="Penalized"?"#ef444433":"#f59e0b33",color:d.resolution==="Cleared"?"#22c55e":d.resolution==="Penalized"?"#ef4444":"#f59e0b"}}>{d.resolution}</span>
                    </div>
                    <div style={{display:"flex",gap:6,marginTop:8}}>
                      {["Cleared","Penalized"].map(r=><button key={r} className="hov" onClick={()=>setDnrLog(p=>p.map(x=>x.id===d.id?{...x,resolution:r}:x))} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer"}}>{r}</button>)}
                      <button className="hov" onClick={()=>setDnrLog(p=>p.filter(x=>x.id!==d.id))} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:"1px solid #ef444444",background:"transparent",color:"#ef4444",cursor:"pointer"}}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── D5: Trip Sheets ── */}
            {subScreen==="tripsheets"&&segment==="usps"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8"}}>Trip Sheets</div>
                  <button className="hov" onClick={()=>setShowTripSheetAdd(p=>!p)} style={S.btn}>+ Add Trip Sheet</button>
                </div>
                {showTripSheetAdd&&<div style={{...S.card,marginBottom:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>New Trip Sheet</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <input type="date" value={tripSheetForm.date} onChange={e=>setTripSheetForm(p=>({...p,date:e.target.value}))} style={S.input}/>
                    <select value={tripSheetForm.driverId} onChange={e=>setTripSheetForm(p=>({...p,driverId:e.target.value}))} style={S.input}>
                      <option value="">Select Driver</option>
                      {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <input placeholder="Origin" value={tripSheetForm.origin} onChange={e=>setTripSheetForm(p=>({...p,origin:e.target.value}))} style={S.input}/>
                    <input placeholder="Destination" value={tripSheetForm.destination} onChange={e=>setTripSheetForm(p=>({...p,destination:e.target.value}))} style={S.input}/>
                    <input type="time" placeholder="Sched. Departure" value={tripSheetForm.scheduledDeparture} onChange={e=>setTripSheetForm(p=>({...p,scheduledDeparture:e.target.value}))} style={S.input}/>
                    <input type="time" placeholder="Actual Departure" value={tripSheetForm.actualDeparture} onChange={e=>setTripSheetForm(p=>({...p,actualDeparture:e.target.value}))} style={S.input}/>
                    <input placeholder="Miles" type="number" value={tripSheetForm.miles} onChange={e=>setTripSheetForm(p=>({...p,miles:e.target.value}))} style={S.input}/>
                    <input placeholder="Fuel Added (gal)" type="number" value={tripSheetForm.fuelAdded} onChange={e=>setTripSheetForm(p=>({...p,fuelAdded:e.target.value}))} style={S.input}/>
                  </div>
                  <div style={{marginBottom:8}}>
                    <div style={{fontSize:11,color:"#888",marginBottom:4}}>Mail Classes:</div>
                    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                      {["First Class","Priority","Package","Periodicals","Other"].map(mc=>(
                        <label key={mc} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#e8e4d8"}}>
                          <input type="checkbox" checked={(tripSheetForm.mailClasses||[]).includes(mc)} onChange={e=>setTripSheetForm(p=>({...p,mailClasses:e.target.checked?[...(p.mailClasses||[]),mc]:(p.mailClasses||[]).filter(x=>x!==mc)}))}/>
                          {mc}
                        </label>
                      ))}
                    </div>
                  </div>
                  <textarea placeholder="Incidents" value={tripSheetForm.incidents} onChange={e=>setTripSheetForm(p=>({...p,incidents:e.target.value}))} style={{...S.input,marginBottom:8,minHeight:50}}/>
                  <button className="hov" onClick={()=>{
                    const drv=drivers.find(d=>d.id===tripSheetForm.driverId);
                    setTripSheets(p=>[{id:Date.now(),driverName:drv?.name||"",...tripSheetForm},...p]);
                    setTripSheetForm({date:"",driverId:"",routeId:"",origin:"",destination:"",scheduledDeparture:"",actualDeparture:"",scheduledArrival:"",actualArrival:"",miles:"",vehicleId:"",fuelAdded:"",incidents:"",supervisorNotes:"",mailClasses:[]});
                    setShowTripSheetAdd(false);
                  }} style={S.btn}>Save Trip Sheet</button>
                </div>}
                <button className="hov" onClick={()=>{
                  const rows=[["Date","Driver","Origin","Destination","Miles","Sched Dep","Actual Dep","Fuel Added","Mail Classes"],...tripSheets.map(t=>[t.date,t.driverName,t.origin,t.destination,t.miles,t.scheduledDeparture,t.actualDeparture,t.fuelAdded,(t.mailClasses||[]).join("|")])];
                  const csv=rows.map(r=>r.join(",")).join("\n");
                  const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="trip_sheets.csv";a.click();
                }} style={{...S.btn,marginBottom:16}}>Export CSV</button>
                {tripSheets.length===0&&<div style={{color:"#555",fontSize:12}}>No trip sheets logged yet.</div>}
                {tripSheets.map(t=>(
                  <div key={t.id} style={{...S.card,marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div><div style={{fontSize:12,color:"#e8e4d8"}}>{t.date} · {t.driverName}</div><div style={{fontSize:11,color:"#888"}}>{t.origin}→{t.destination} · {t.miles}mi</div></div>
                      <button className="hov" onClick={()=>setTripSheets(p=>p.filter(x=>x.id!==t.id))} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:"1px solid #ef444444",background:"transparent",color:"#ef4444",cursor:"pointer"}}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {subScreen==="performance"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:20}}>ROUTE PERFORMANCE</div>
                {routes.filter(r=>r.analysis).length===0?<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No routes analyzed yet. Go to My Routes and click Analyze on each route.</div>:
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {routes.filter(r=>r.analysis).sort((a,b)=>parseFloat(b.rate||0)-parseFloat(a.rate||0)).map((r,i)=>(
                    <div key={r.id} style={{...S.card,display:"flex",alignItems:"center",gap:16}}>
                      <div style={{width:28,fontSize:12,color:"#555",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>#{i+1}</div>
                      <div style={{flex:1}}><div style={{fontSize:13,color:"#e8e4d8"}}>{r.name}</div><div style={{fontSize:10,color:"#555"}}>{r.stops} stops · {r.miles} mi</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Net/Stop</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:accent}}>{fmt$(r.analysis.netPerStop)}</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Net/Mile</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#22c55e"}}>{fmt$(r.analysis.netPerMile)}</div></div>
                      <div style={{width:32,height:32,background:gradeColor(r.analysis.profitabilityScore)+"22",border:`1px solid ${gradeColor(r.analysis.profitabilityScore)}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:gradeColor(r.analysis.profitabilityScore),borderRadius:4}}>{r.analysis.profitabilityScore}</div>
                    </div>
                  ))}
                </div>}
              </div>
            )}
          </div>
        </div>

  );
}
