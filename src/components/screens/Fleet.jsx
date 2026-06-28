// Fleet screen
export default function Fleet(p) {
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
          <SubNav tabs={[["log","Maintenance Log"],["schedule","Upcoming Service"],["fuel","Fuel Log"],["odometer","Odometer / Miles"],["tires","Tires"],...(segment==="amazon"?[["vaninspect","Van Inspection"]]:segment==="otr"?[["fuelcard","Fuel Card"]]:[])]  } active={subScreen||"log"} onSelect={setSubScreen}/>
          <div style={{flex:1,overflowY:"auto",padding:24}}>
            {(!subScreen||subScreen==="log")&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={S.section}>MAINTENANCE LOG</div>
                  <button className="hov" onClick={()=>setShowAddMaint(!showAddMaint)} style={S.btn}>{showAddMaint?"Cancel":"+ Log Service"}</button>
                </div>
                {showAddMaint&&(
                  <div style={{...S.card,marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Vehicle *</label>
                        <select value={maintForm.truckName} onChange={e=>{setMaintForm(p=>({...p,truckName:e.target.value}));if(e.target.value!=="__other__")setMaintCustomVehicle("");}} style={S.input}>
                          <option value="">Select vehicle...</option>
                          {compliance.trucks.map(t=>(
                            <option key={t.id} value={t.name}>
                              {t.name}{t.nickname?` "${t.nickname}"`:""}
                              {t.vin?` · VIN:${t.vin.slice(-6)}`:""}
                              {t.year?` · ${t.year}`:""}
                              {t.make?` ${t.make}`:""}
                            </option>
                          ))}
                          <option value="__other__">+ Enter custom vehicle name / VIN</option>
                        </select>
                        {maintForm.truckName==="__other__"&&(
                          <input
                            value={maintCustomVehicle}
                            onChange={e=>setMaintCustomVehicle(e.target.value)}
                            placeholder="Type vehicle name, nickname, or VIN..."
                            style={{...S.input,marginTop:6}}
                            autoFocus
                          />
                        )}
                        {compliance.trucks.length===0&&(
                          <div style={{fontSize:9,color:"#999",marginTop:5}}>No vehicles in Compliance yet — you can enter a custom name above, or <span style={{color:accent,cursor:"pointer"}} onClick={()=>{setScreen("compliance");setSubScreen("vehicles");}}>add vehicles to Compliance first</span>.</div>
                        )}
                      </div>
                      <div><label style={S.label}>Service Type *</label>
                        <select value={maintForm.type} onChange={e=>setMaintForm(p=>({...p,type:e.target.value}))} style={S.input}>
                          <option value="">Select...</option>
                          {["Oil Change","Tire Rotation","Tire Replacement","Brake Service","Brake Replacement","Air Filter","Transmission Service","Battery","Alternator","Suspension","Annual DOT Inspection","PM Service","Roadside Repair","Body Repair","Other"].map(t=><option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div><label style={S.label}>Date</label><input type="date" value={maintForm.date} onChange={e=>setMaintForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Mileage</label><input type="number" value={maintForm.mileage} onChange={e=>setMaintForm(p=>({...p,mileage:e.target.value}))} placeholder="142500" style={S.input}/></div>
                      <div><label style={S.label}>Cost ($)</label><input type="number" value={maintForm.cost} onChange={e=>setMaintForm(p=>({...p,cost:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                      <div><label style={S.label}>Next Due (miles)</label><input type="number" value={maintForm.nextDueMiles} onChange={e=>setMaintForm(p=>({...p,nextDueMiles:e.target.value}))} placeholder="147500" style={S.input}/></div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={maintForm.notes} onChange={e=>setMaintForm(p=>({...p,notes:e.target.value}))} placeholder="Shop name, parts, etc." style={S.input}/></div>
                    </div>
                    <button className="hov" onClick={()=>{
                      const vehicleName = maintForm.truckName==="__other__" ? maintCustomVehicle.trim() : maintForm.truckName;
                      if(!vehicleName||!maintForm.type) return;
                      const mEntry={...maintForm,truckName:vehicleName,id:Date.now()};
                      setMaintenance(p=>[mEntry,...p]);
                      if(parseFloat(mEntry.cost||0)>0){setExpenses(p=>[{id:Date.now()+1,date:mEntry.date,category:"maintenance",amount:mEntry.cost,description:`Maintenance — ${vehicleName||mEntry.truckName||""}${mEntry.type?" · "+mEntry.type:""}`,vehicle:vehicleName||mEntry.truckName,source:"maintenance_log"},...p]);}
                      setMaintForm({truckName:"",type:"",date:"",mileage:"",cost:"",notes:"",nextDueMiles:""});
                      setMaintCustomVehicle("");
                      setShowAddMaint(false);
                    }} style={{...S.btn,marginTop:14}}>Save Record</button>
                  </div>
                )}
                {maintenance.length===0&&!showAddMaint&&<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>No maintenance records yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {maintenance.map(m=>(
                    <div key={m.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{m.truckName} — {m.type}</div><div style={{fontSize:10,color:"#999"}}>{m.date} {m.mileage?`· ${parseInt(m.mileage).toLocaleString()} mi`:""} {m.notes?`· ${m.notes}`:""}</div></div>
                      {m.cost&&<div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#ef4444",flexShrink:0}}>{fmt$(parseFloat(m.cost))}</div>}
                      {m.nextDueMiles&&<div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:9,color:"#999"}}>Next</div><div style={{fontSize:12,color:"#f59e0b"}}>{parseInt(m.nextDueMiles).toLocaleString()} mi</div></div>}
                      <button onClick={()=>openEdit("maintenance",m)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace",flexShrink:0}}>Edit</button>
                      <button onClick={()=>setMaintenance(p=>p.filter(x=>x.id!==m.id))} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12,flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {subScreen==="schedule"&&(
              <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:20}}>UPCOMING SERVICE</div>
                {maintenance.filter(m=>m.nextDueMiles).length===0?<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>No upcoming service items set.</div>:
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {maintenance.filter(m=>m.nextDueMiles).sort((a,b)=>parseInt(a.nextDueMiles)-parseInt(b.nextDueMiles)).map(m=>(
                    <div key={m.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{m.type} — {m.truckName}</div><div style={{fontSize:10,color:"#999"}}>Last: {m.date||"Unknown"} {m.mileage?`at ${parseInt(m.mileage).toLocaleString()} mi`:""}</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#999"}}>Next Due</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#f59e0b"}}>{parseInt(m.nextDueMiles).toLocaleString()} mi</div></div>
                    </div>
                  ))}
                </div>}
              </div>
            )}
            {subScreen==="fuel"&&(
              <div style={{flex:1,overflowY:"auto",padding:24}}>
                <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                    <div><div style={S.section}>FUEL LOG</div><div style={{fontSize:11,color:"#999",marginTop:4}}>Track every fill-up per truck. IFTA-ready state breakdown.</div></div>
                    <button className="hov" onClick={()=>setFuelShowAdd(!fuelShowAdd)} style={S.btn}>{fuelShowAdd?"Cancel":"+ Log Fuel"}</button>
                  </div>
                  {(()=>{const totalGal=fuelLog.reduce((s,r)=>s+parseFloat(r.gallons||0),0);const totalCost=fuelLog.reduce((s,r)=>s+parseFloat(r.totalCost||0),0);return(
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                      {[["Total Gallons",totalGal.toFixed(0)+" gal","#60a5fa"],["Total Fuel Cost",fmt$(totalCost),"#ef4444"],["Avg $/Gal",totalGal>0?fmt$(totalCost/totalGal):"$0.00",accent]].map(([lbl,val,col])=>(
                        <div key={lbl} style={S.card}><div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:col}}>{val}</div><div style={{fontSize:9,color:"#999",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:4}}>{lbl}</div></div>
                      ))}
                    </div>
                  );})()}
                  {fuelShowAdd&&(
                    <div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                        <div><label style={S.label}>Truck *</label><select value={fuelForm.truckName} onChange={e=>setFuelForm(p=>({...p,truckName:e.target.value}))} style={S.input}><option value="">Select...</option>{compliance.trucks.map(v=><option key={v.id} value={v.name}>{v.name}{v.nickname?` "${v.nickname}"`:""}  </option>)}<option value="__other__">+ Enter manually</option></select>{fuelForm.truckName==="__other__"&&<input value={fuelForm._customTruck||""} onChange={e=>setFuelForm(p=>({...p,_customTruck:e.target.value}))} placeholder="Truck name/unit #" style={{...S.input,marginTop:6}}/>}</div>
                        <div><label style={S.label}>Date *</label><input type="date" value={fuelForm.date} onChange={e=>setFuelForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Gallons *</label><input type="number" value={fuelForm.gallons} onChange={e=>{const g=e.target.value;const total=(parseFloat(g||0)*parseFloat(fuelForm.pricePerGallon||0)).toFixed(2);setFuelForm(p=>({...p,gallons:g,totalCost:total>0?total:p.totalCost}));}} placeholder="100" style={S.input}/></div>
                        <div><label style={S.label}>Price / Gallon ($)</label><input type="number" step="0.001" value={fuelForm.pricePerGallon} onChange={e=>{const p2=e.target.value;const total=(parseFloat(fuelForm.gallons||0)*parseFloat(p2||0)).toFixed(2);setFuelForm(p=>({...p,pricePerGallon:p2,totalCost:total>0?total:p.totalCost}));}} placeholder="3.85" style={S.input}/></div>
                        <div><label style={S.label}>Total Cost ($)</label><input type="number" value={fuelForm.totalCost} onChange={e=>setFuelForm(p=>({...p,totalCost:e.target.value}))} placeholder="385.00" style={S.input}/></div>
                        <div><label style={S.label}>Odometer (miles)</label><input type="number" value={fuelForm.odometer} onChange={e=>setFuelForm(p=>({...p,odometer:e.target.value}))} placeholder="142500" style={S.input}/></div>
                        <div><label style={S.label}>State (IFTA)</label><input value={fuelForm.state} onChange={e=>setFuelForm(p=>({...p,state:e.target.value.toUpperCase()}))} placeholder="SC" maxLength={2} style={S.input}/></div>
                        <div><label style={S.label}>Card Type</label><select value={fuelForm.cardType} onChange={e=>setFuelForm(p=>({...p,cardType:e.target.value}))} style={S.input}>{["company","EFS / Comcheck","Comdata","Relay","Cash","Other"].map(t=><option key={t} value={t.toLowerCase().replace(/ /g,"_")}>{t}</option>)}</select></div>
                        <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes (truck stop, DEF added, etc.)</label><input value={fuelForm.notes} onChange={e=>setFuelForm(p=>({...p,notes:e.target.value}))} style={S.input}/></div>
                      </div>
                      <button className="hov" onClick={()=>{const name=fuelForm.truckName==="__other__"?(fuelForm._customTruck||""):fuelForm.truckName;if(!name||!fuelForm.gallons||!fuelForm.date)return;const fuelEntry={...fuelForm,truckName:name,id:Date.now()};
                    setFuelLog(p=>[fuelEntry,...p]);
                    // Auto-sync to expenses
                    if(fuelEntry.totalCost){setExpenses(p=>[{id:Date.now()+1,date:fuelEntry.date,category:"fuel",amount:fuelEntry.totalCost,description:`Fuel — ${name}${fuelEntry.gallons?` (${fuelEntry.gallons} gal)`:""}${fuelEntry.state?` · ${fuelEntry.state}`:""}`,vehicle:name,source:"fuel_log"},...p]);}
                    setFuelForm({truckName:"",date:"",gallons:"",pricePerGallon:"",totalCost:"",odometer:"",state:"",cardType:"company",notes:""});setFuelShowAdd(false);}} style={{...S.btn,marginTop:14}}>Save Fuel Entry</button>
                    </div>
                  )}
                  {fuelLog.length===0&&!fuelShowAdd&&<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>No fuel entries yet.</div>}
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {fuelLog.map(r=>(<div key={r.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{r.truckName} — {r.gallons} gal{r.state?` · ${r.state}`:""}</div><div style={{fontSize:10,color:"#999"}}>{fmtDate(r.date)} · {r.cardType}{r.odometer?` · ${parseInt(r.odometer).toLocaleString()} mi`:""}{r.notes?` · ${r.notes}`:""}</div></div>
                      <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#ef4444"}}>{fmt$(parseFloat(r.totalCost||0))}</div>{r.pricePerGallon&&<div style={{fontSize:9,color:"#999"}}>${parseFloat(r.pricePerGallon).toFixed(3)}/gal</div>}</div>
                      <button onClick={()=>setFuelLog(p=>p.filter(x=>x.id!==r.id))} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12}}>✕</button>
                    </div>))}
                  </div>
                </div>
              </div>
            )}
            {subScreen==="odometer"&&(
              <div style={{flex:1,overflowY:"auto",padding:24}}>
                <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                    <div><div style={S.section}>ODOMETER LOG</div><div style={{fontSize:11,color:"#999",marginTop:4}}>Log readings to track real miles per truck. Pairs with fuel log for IFTA.</div></div>
                    <button className="hov" onClick={()=>setOdomShowAdd(!odomShowAdd)} style={S.btn}>{odomShowAdd?"Cancel":"+ Log Reading"}</button>
                  </div>
                  {odomShowAdd&&(<div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Truck *</label><select value={odomForm.truckName} onChange={e=>setOdomForm(p=>({...p,truckName:e.target.value}))} style={S.input}><option value="">Select...</option>{compliance.trucks.map(v=><option key={v.id} value={v.name}>{v.name}{v.nickname?` "${v.nickname}"`:""}</option>)}</select></div>
                      <div><label style={S.label}>Date *</label><input type="date" value={odomForm.date} onChange={e=>setOdomForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Odometer Reading (miles) *</label><input type="number" value={odomForm.reading} onChange={e=>setOdomForm(p=>({...p,reading:e.target.value}))} placeholder="142500" style={S.input}/></div>
                      <div><label style={S.label}>State (IFTA miles)</label><input value={odomForm.state} onChange={e=>setOdomForm(p=>({...p,state:e.target.value.toUpperCase()}))} placeholder="SC" maxLength={2} style={S.input}/></div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={odomForm.notes} onChange={e=>setOdomForm(p=>({...p,notes:e.target.value}))} placeholder="Start of week, end of week, etc." style={S.input}/></div>
                    </div>
                    <button className="hov" onClick={()=>{if(!odomForm.truckName||!odomForm.reading)return;setOdometer(p=>[{...odomForm,id:Date.now()},...p]);setOdomForm(prev=>({...prev,date:"",reading:"",state:"",notes:""}));setOdomShowAdd(false);}} style={{...S.btn,marginTop:14}}>Save Reading</button>
                  </div>)}
                  {(()=>{
                    const byTruck={};
                    odometer.forEach(r=>{if(!byTruck[r.truckName])byTruck[r.truckName]=[];byTruck[r.truckName].push(r);});
                    Object.values(byTruck).forEach(arr=>{arr.sort((a,b)=>new Date(a.date)-new Date(b.date));});
                    if(Object.keys(byTruck).length>0) return(
                      <div style={{marginBottom:20}}>
                        <div style={{fontSize:10,color:"#999",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:12}}>Mileage Summary</div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                          {Object.entries(byTruck).map(([truck,arr])=>{const total=arr.length>=2?parseInt(arr[arr.length-1].reading||0)-parseInt(arr[0].reading||0):0;return(
                            <div key={truck} style={S.card}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8",marginBottom:6}}>{truck}</div><div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:accent}}>{total.toLocaleString()} mi</div><div style={{fontSize:9,color:"#999",marginTop:3}}>Latest: {parseInt(arr[arr.length-1]?.reading||0).toLocaleString()}</div></div>
                          );})}
                        </div>
                      </div>
                    );
                  })()}
                  {odometer.length===0&&!odomShowAdd&&<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>No odometer readings yet. Log start and end of week to track mileage.</div>}
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {[...odometer].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(r=>(<div key={r.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{r.truckName}{r.state?` — ${r.state}`:""}</div><div style={{fontSize:10,color:"#999"}}>{fmtDate(r.date)}{r.notes?` · ${r.notes}`:""}</div></div>
                      <div style={{fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:accent,flexShrink:0}}>{parseInt(r.reading||0).toLocaleString()} mi</div>
                      <button onClick={()=>setOdometer(p=>p.filter(x=>x.id!==r.id))} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12}}>✕</button>
                    </div>))}
                  </div>
                </div>
              </div>
            )}
            {subScreen==="tires"&&(
              <div style={{flex:1,overflowY:"auto",padding:24}}>
                <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                    <div><div style={S.section}>TIRE MANAGEMENT</div><div style={{fontSize:11,color:"#999",marginTop:4}}>Track tires by position, tread depth, and replacement cost.</div></div>
                    <button className="hov" onClick={()=>setTireShowAdd(!tireShowAdd)} style={S.btn}>{tireShowAdd?"Cancel":"+ Add Tire Record"}</button>
                  </div>
                  {(()=>{const totalSpent=tires.reduce((s,t)=>s+parseFloat(t.cost||0),0);const active=tires.filter(t=>t.status==="active").length;return(
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                      {[["Active Tires",active.toString(),accent],["Total Records",tires.length.toString(),"#888"],["Total Invested",fmt$(totalSpent),"#ef4444"]].map(([lbl,val,col])=>(
                        <div key={lbl} style={S.card}><div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:col}}>{val}</div><div style={{fontSize:9,color:"#999",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:4}}>{lbl}</div></div>
                      ))}
                    </div>
                  );})()}
                  {tireShowAdd&&(<div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Truck *</label><select value={tireForm.truckName} onChange={e=>setTireForm(p=>({...p,truckName:e.target.value}))} style={S.input}><option value="">Select...</option>{compliance.trucks.map(v=><option key={v.id} value={v.name}>{v.name}</option>)}<option value="__other__">+ Enter manually</option></select>{tireForm.truckName==="__other__"&&<input value={tireForm._customTruck||""} onChange={e=>setTireForm(p=>({...p,_customTruck:e.target.value}))} placeholder="Truck name/unit #" style={{...S.input,marginTop:6}}/>}</div>
                      <div><label style={S.label}>Position *</label><select value={tireForm.position} onChange={e=>setTireForm(p=>({...p,position:e.target.value}))} style={S.input}><option value="">Select position...</option><option value="All Positions">All Positions (Full Set)</option>{["Front Left (Steer)","Front Right (Steer)","Rear Left Inner (Drive)","Rear Left Outer (Drive)","Rear Right Inner (Drive)","Rear Right Outer (Drive)","Spare","Trailer Left Front","Trailer Right Front","Trailer Left Rear","Trailer Right Rear"].map(pos=><option key={pos} value={pos}>{pos}</option>)}</select></div>
                      <div><label style={S.label}>Date Installed</label><input type="date" value={tireForm.date} onChange={e=>setTireForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Brand / Model</label><input value={tireForm.brand} onChange={e=>setTireForm(p=>({...p,brand:e.target.value}))} placeholder="Michelin XDN2, Bridgestone..." style={S.input}/></div>
                      <div><label style={S.label}>Size</label><input value={tireForm.size} onChange={e=>setTireForm(p=>({...p,size:e.target.value}))} placeholder="11R22.5" style={S.input}/></div>
                      <div><label style={S.label}>Tread Depth (32nds)</label><input type="number" value={tireForm.treadDepth} onChange={e=>setTireForm(p=>({...p,treadDepth:e.target.value}))} placeholder="New=32, Min=4" style={S.input}/></div>
                      <div><label style={S.label}>Cost ($)</label><input type="number" value={tireForm.cost} onChange={e=>setTireForm(p=>({...p,cost:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                      <div><label style={S.label}>Mileage at Install</label><input type="number" value={tireForm.mileageInstalled} onChange={e=>setTireForm(p=>({...p,mileageInstalled:e.target.value}))} placeholder="142500" style={S.input}/></div>
                      <div><label style={S.label}>Status</label><select value={tireForm.status} onChange={e=>setTireForm(p=>({...p,status:e.target.value}))} style={S.input}><option value="active">Active / Installed</option><option value="replaced">Replaced</option><option value="scrap">Scrap</option></select></div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={tireForm.notes} onChange={e=>setTireForm(p=>({...p,notes:e.target.value}))} placeholder="Vendor, warranty info..." style={S.input}/></div>
                    </div>
                    <button className="hov" onClick={()=>{const name=tireForm.truckName==="__other__"?(tireForm._customTruck||""):tireForm.truckName;if(!name||!tireForm.position)return;setTires(p=>[{...tireForm,truckName:name,id:Date.now()},...p]);setTireForm({truckName:"",date:"",position:"",brand:"",size:"",treadDepth:"",cost:"",mileageInstalled:"",status:"active",notes:""});setTireShowAdd(false);}} style={{...S.btn,marginTop:14}}>Save Tire Record</button>
                  </div>)}
                  {tires.length===0&&!tireShowAdd&&<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>No tire records yet.</div>}
                  {(()=>{const byTruck={};tires.filter(t=>t.status==="active").forEach(t=>{if(!byTruck[t.truckName])byTruck[t.truckName]=[];byTruck[t.truckName].push(t);});if(!Object.keys(byTruck).length)return null;return Object.entries(byTruck).map(([truck,ts])=>(
                    <div key={truck} style={{...S.card,marginBottom:12}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>{truck}</div>
                      {ts.map(t=>{const tread=parseInt(t.treadDepth||0);const tc=tread===0?"#555":tread<=4?"#ef4444":tread<=8?"#f59e0b":"#22c55e";return(
                        <div key={t.id} style={{display:"flex",alignItems:"center",gap:14,padding:"8px 0",borderBottom:"1px solid #1a1a1a"}}>
                          <div style={{flex:1}}><div style={{fontSize:11,color:"#c8c4bc"}}>{t.position}</div><div style={{fontSize:10,color:"#999"}}>{t.brand||"—"} {t.size||""}{t.date?` · ${fmtDate(t.date)}`:""}</div></div>
                          {t.treadDepth&&<div style={{textAlign:"center"}}><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:tc}}>{t.treadDepth}/32</div><div style={{fontSize:8,color:"#999",textTransform:"uppercase"}}>Tread</div></div>}
                          {t.cost&&<div style={{fontSize:13,color:"#ef4444",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,flexShrink:0}}>{fmt$(parseFloat(t.cost))}</div>}
                          <button onClick={()=>setTires(p=>p.filter(x=>x.id!==t.id))} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      );})}
                    </div>
                  ));})}
                </div>
              </div>
            )}

            {/* ── D6: Van Inspection ── */}
            {subScreen==="vaninspect"&&segment==="amazon"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>Van Pre-Trip Inspection</div>
                <div style={{...S.card,marginBottom:16}}>
                  <div style={{fontSize:12,fontWeight:700,color:accent,marginBottom:8}}>Today's Status</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                    {(compliance.trucks||[]).map((t,i)=>{
                      const name=t.name||t.truckName||"Truck "+(i+1);
                      const today=new Date().toISOString().slice(0,10);
                      const done=vanInspectionLog.some(v=>v.vehicle===name&&v.date===today);
                      return <div key={i} style={{...S.card,border:`1px solid ${done?"#22c55e44":"#ef444444"}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div><div style={{fontSize:12,color:"#e8e4d8"}}>{name}</div><div style={{fontSize:10,color:done?"#22c55e":"#ef4444"}}>{done?"✓ Inspected":"✗ Not Inspected"}</div></div>
                        {!done&&<button className="hov" onClick={()=>{setVanInspectVehicle(name);setVanInspectDate(today);}} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer"}}>Inspect</button>}
                      </div>;
                    })}
                  </div>
                </div>
                <div style={{...S.card,marginBottom:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>New Inspection</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <select value={vanInspectVehicle} onChange={e=>setVanInspectVehicle(e.target.value)} style={S.input}>
                      <option value="">Select Vehicle</option>
                      {(compliance.trucks||[]).map((t,i)=><option key={i} value={t.name||t.truckName}>{t.name||t.truckName||"Truck "+(i+1)}</option>)}
                    </select>
                    <input type="date" value={vanInspectDate} onChange={e=>setVanInspectDate(e.target.value)} style={S.input}/>
                  </div>
                  {[["exterior","Exterior damage check"],["lights","Lights and signals working"],["cargo","Cargo area clean and organized"],["device","Delivery device charged"],["seatbelt","Seatbelt functional"],["noWarnings","No dashboard warning lights"],["driverAck","Driver acknowledgment"]].map(([key,label])=>(
                    <label key={key} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#e8e4d8",marginBottom:6}}>
                      <input type="checkbox" checked={vanInspectItems[key]||false} onChange={e=>setVanInspectItems(p=>({...p,[key]:e.target.checked}))}/>
                      {label}
                    </label>
                  ))}
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:12,color:"#888",display:"block",marginBottom:4}}>Tire Condition:</label>
                    <select value={vanInspectItems.tires||"Good"} onChange={e=>setVanInspectItems(p=>({...p,tires:e.target.value}))} style={{...S.input,width:"auto"}}>
                      <option>Good</option><option>Monitor</option><option>Replace</option>
                    </select>
                  </div>
                  <button className="hov" onClick={()=>{
                    if(!vanInspectVehicle||!vanInspectDate)return;
                    setVanInspectionLog(p=>[{id:Date.now(),vehicle:vanInspectVehicle,date:vanInspectDate,items:{...vanInspectItems},time:new Date().toLocaleTimeString()},...p]);
                    setVanInspectItems({exterior:false,tires:"Good",lights:false,cargo:false,device:false,seatbelt:false,noWarnings:false,driverAck:false});
                    setVanInspectVehicle(""); setVanInspectDate("");
                  }} style={S.btn}>Save Inspection</button>
                </div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:8}}>Recent Inspections</div>
                {vanInspectionLog.length===0&&<div style={{color:"#999",fontSize:12}}>No inspections logged yet.</div>}
                {vanInspectionLog.slice(0,20).map(v=>(
                  <div key={v.id} style={{...S.card,marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div><div style={{fontSize:12,color:"#e8e4d8"}}>{v.vehicle} · {v.date} {v.time&&`@ ${v.time}`}</div>
                      <div style={{fontSize:11,color:"#888"}}>Tires: {v.items?.tires||"Good"}</div></div>
                      <span style={{fontSize:10,color:v.items?.tires==="Replace"?"#ef4444":"#22c55e"}}>{v.items?.tires==="Replace"?"⚠ Replace Tires":"✓ OK"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── D7: Fuel Card ── */}
            {subScreen==="fuelcard"&&segment==="otr"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8",marginBottom:8}}>Fuel Card Reconciliation</div>
                <div style={{...S.card,marginBottom:16,background:"#0f0f1a",border:"1px solid #1e1e3e"}}>
                  <div style={{fontSize:11,color:"#888",lineHeight:1.8}}>
                    Paste your fuel card transactions below, one per line.<br/>
                    Format: <code style={{color:accent}}>DATE, LOCATION, GALLONS, AMOUNT</code>
                  </div>
                </div>
                <textarea value={fuelCardPasteText} onChange={e=>setFuelCardPasteText(e.target.value)} placeholder="Paste transactions here..." style={{...S.input,minHeight:160,marginBottom:8,fontFamily:"'DM Mono',monospace",fontSize:11}}/>
                <button className="hov" style={{...S.btn,marginBottom:16}} onClick={()=>{
                  const lines=fuelCardPasteText.split("\n").filter(l=>l.trim());
                  const parsed=lines.map(line=>{
                    const parts=line.split(",").map(s=>s.trim());
                    const date=parts[0]||"";const location=parts[1]||"";const gallons=parseFloat(parts[2])||0;const amount=parseFloat(parts[3])||0;
                    const match=fuelLog.find(f=>f.date===date&&Math.abs(parseFloat(f.totalCost||0)-amount)<5);
                    const dup=fuelLog.filter(f=>f.date===date&&Math.abs(parseFloat(f.totalCost||0)-amount)<5).length>1;
                    return {date,location,gallons,amount,status:dup?"Duplicate":match?"Matched":"Unmatched",matchId:match?.id};
                  });
                  setFuelCardParsed(parsed);
                }}>Parse Transactions</button>
                {fuelCardParsed.length>0&&<>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12,marginBottom:16}}>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Transactions</div><div style={{fontSize:24,fontWeight:700,color:accent}}>{fuelCardParsed.length}</div></div>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Total Amount</div><div style={{fontSize:24,fontWeight:700,color:accent}}>${fuelCardParsed.reduce((s,t)=>s+t.amount,0).toFixed(2)}</div></div>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Matched</div><div style={{fontSize:24,fontWeight:700,color:"#22c55e"}}>{fuelCardParsed.filter(t=>t.status==="Matched").length}</div></div>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Unmatched</div><div style={{fontSize:24,fontWeight:700,color:"#f59e0b"}}>{fuelCardParsed.filter(t=>t.status==="Unmatched").length}</div></div>
                  </div>
                  <button className="hov" style={{...S.btn,marginBottom:12}} onClick={()=>{
                    const unmatched=fuelCardParsed.filter(t=>t.status==="Unmatched");
                    unmatched.forEach(t=>setFuelLog(p=>[...p,{id:Date.now()+Math.random(),date:t.date,truckName:"",gallons:String(t.gallons),totalCost:String(t.amount),state:"",cardType:"fuel_card_import",notes:t.location,source:"fuel_card_import"}]));
                    setFuelCardParsed(prev=>prev.map(t=>t.status==="Unmatched"?{...t,status:"Matched"}:t));
                  }}>Import All Unmatched ({fuelCardParsed.filter(t=>t.status==="Unmatched").length})</button>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                      <thead><tr>{["Date","Location","Gallons","Amount","Status","Action"].map(h=><th key={h} style={{textAlign:"left",color:"#999",padding:"6px 8px",borderBottom:"1px solid #1e1e1e"}}>{h}</th>)}</tr></thead>
                      <tbody>
                        {fuelCardParsed.map((t,i)=>(
                          <tr key={i} style={{background:t.status==="Unmatched"?"#1a1505":"transparent"}}>
                            <td style={{padding:"6px 8px",color:"#e8e4d8"}}>{t.date}</td>
                            <td style={{padding:"6px 8px",color:"#888"}}>{t.location}</td>
                            <td style={{padding:"6px 8px",color:"#e8e4d8"}}>{t.gallons}</td>
                            <td style={{padding:"6px 8px",color:"#e8e4d8"}}>${t.amount.toFixed(2)}</td>
                            <td style={{padding:"6px 8px"}}><span style={{fontSize:10,padding:"2px 6px",borderRadius:3,background:t.status==="Matched"?"#22c55e33":t.status==="Duplicate"?"#88888833":"#f59e0b33",color:t.status==="Matched"?"#22c55e":t.status==="Duplicate"?"#888":"#f59e0b"}}>{t.status}</span></td>
                            <td style={{padding:"6px 8px"}}>{t.status==="Unmatched"&&<button className="hov" onClick={()=>{
                              setFuelLog(p=>[...p,{id:Date.now(),date:t.date,truckName:"",gallons:String(t.gallons),totalCost:String(t.amount),state:"",cardType:"fuel_card_import",notes:t.location,source:"fuel_card_import"}]);
                              setFuelCardParsed(prev=>prev.map((x,j)=>j===i?{...x,status:"Matched"}:x));
                            }} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer"}}>Add</button>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>}
              </div>
            )}
          </div>
        </div>
  );
}
