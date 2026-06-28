// Drivers screen
export default function Drivers(p) {
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
          <SubNav tabs={[["list","All Drivers"],["scorecards","Scorecards"],["incidents","Incidents"],["onboarding","Onboarding"],["hos","HOS Log"],...((segment==="fedex")?[["coaching","Coaching Log"],["appearance","Appearance"]]:[])]  } active={subScreen||"list"} onSelect={setSubScreen}/>
          <div style={{flex:1,overflowY:"auto",padding:24}}>
            {(!subScreen||subScreen==="list")&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={S.section}>DRIVER MANAGEMENT</div>
                  <button className="hov" onClick={()=>setShowAddDriver(!showAddDriver)} style={{...S.btn,background:"#60a5fa"}}>{showAddDriver?"Cancel":"+ Add Driver"}</button>
                </div>
                {showAddDriver&&(
                  <div style={{...S.card,marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {[["name","Full Name *","text",""],["phone","Phone","text",""],["hireDate","Hire Date","date",""],["route","Assigned Route","text","Route A"]].map(([f,lbl,t,ph])=>(
                        <div key={f}><label style={S.label}>{lbl}</label><input type={t} value={driverForm[f]} onChange={e=>setDriverForm(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input}/></div>
                      ))}
                      <div><label style={S.label}>Pay Type</label>
                        <select value={driverForm.payType} onChange={e=>setDriverForm(p=>({...p,payType:e.target.value}))} style={S.input}>
                          <option value="per_mile">Per Mile</option><option value="per_stop">Per Stop</option><option value="per_day">Per Day</option><option value="percentage">% of Route</option><option value="hourly">Hourly</option><option value="salary">Salary</option>
                        </select>
                      </div>
                      <div><label style={S.label}>Pay Rate</label><input value={driverForm.payRate} onChange={e=>setDriverForm(p=>({...p,payRate:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                      <div><label style={S.label}>YTD Earnings ($)</label><input type="number" value={driverForm.ytdPay} onChange={e=>setDriverForm(p=>({...p,ytdPay:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                      <div><label style={S.label}>Status</label>
                        <select value={driverForm.status} onChange={e=>setDriverForm(p=>({...p,status:e.target.value}))} style={S.input}>
                          <option value="active">Active</option><option value="on_leave">On Leave</option><option value="terminated">Terminated</option>
                        </select>
                      </div>
                    </div>
                    <button className="hov" onClick={()=>{ if(!driverForm.name){showValidation("Driver name is required");return;} if(!driverForm.payRate){showValidation("Pay rate is required");return;} setDrivers(p=>[...p,{...driverForm,id:Date.now(),incidents:[],scores:[]}]); setDriverForm({name:"",route:"",payType:"per_mile",payRate:"",ytdPay:"",phone:"",hireDate:"",status:"active"}); setShowAddDriver(false); }} style={{...S.btn,background:"#60a5fa",marginTop:14}}>Save Driver</button>
                  </div>
                )}
                {drivers.length===0&&!showAddDriver&&<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>No drivers added yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {drivers.map(d=>(
                    <div key={d.id} style={{...S.card,display:"flex",alignItems:"center",gap:16}}>
                      <div style={{width:36,height:36,background:d.status==="active"?"#22c55e22":"#ef444422",border:`1px solid ${d.status==="active"?"#22c55e44":"#ef444444"}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:d.status==="active"?"#22c55e":"#ef4444",flexShrink:0}}>{d.name.charAt(0)}</div>
                      <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8"}}>{d.name}</div><div style={{fontSize:10,color:"#999"}}>{d.route||"No route"} · {d.payType==="per_mile"?`$${d.payRate}/mi`:d.payType==="per_stop"?`$${d.payRate}/stop`:d.payType==="per_day"?`$${d.payRate}/day`:d.payType==="percentage"?`${d.payRate}% of route`:d.payType==="hourly"?`$${d.payRate}/hr`:`$${d.payRate}/yr`}</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em"}}>YTD Pay</div><div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#22c55e"}}>{fmt$(parseFloat(d.ytdPay||0))}</div></div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em"}}>Incidents</div><div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:(d.incidents||[]).length>0?"#ef4444":"#22c55e"}}>{(d.incidents||[]).length}</div></div>
                      <button onClick={()=>openEdit("driver",d)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                      <button onClick={()=>setDrivers(p=>p.filter(x=>x.id!==d.id))} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12}}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {subScreen==="scorecards"&&(
              <div style={{maxWidth:760,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:20}}>DRIVER SCORECARDS</div>
                {drivers.length===0?<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>No drivers added yet.</div>:
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {drivers.map(d=>(
                    <div key={d.id} style={S.card}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:14}}>{d.name} — {d.route||"Unassigned"}</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:12}}>
                        {[["On-Time %","—"],["Package Care","—"],["Customer Rating","—"],["Incidents",(d.incidents||[]).length.toString()],["Tenure",d.hireDate?`${Math.floor((new Date()-new Date(d.hireDate))/86400000/30)}mo`:"—"]].map(([lbl,val])=>(
                          <div key={lbl} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px",textAlign:"center"}}><div style={{fontSize:9,color:"#999",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>{lbl}</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:val==="0"?"#22c55e":lbl==="Incidents"&&val!=="0"?"#ef4444":accent}}>{val}</div></div>
                        ))}
                      </div>
                      <div style={{fontSize:10,color:"#888",fontStyle:"italic"}}>Connect telematics data (e.g. Amazon Mentor, FedEx GPS) to populate real-time scores.</div>
                    </div>
                  ))}
                </div>}
              </div>
            )}
            {subScreen==="incidents"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={S.section}>INCIDENT LOG</div>
                  <button className="hov" onClick={()=>{setShowAddIncident(showAddIncident?"hide":"show");setEditIncidentId(null);}} style={S.danger}>{showAddIncident&&showAddIncident!=="hide"?"Cancel":"+ Log Incident"}</button>
                </div>

                {/* Add form */}
                {showAddIncident&&showAddIncident!=="hide"&&(
                  <div style={{...S.card,marginBottom:18,border:"1px solid #ef444433"}}>
                    <div style={{fontSize:10,color:"#ef4444",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:14}}>New Incident</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Driver *</label>
                        <select value={incidentForm.driverId} onChange={e=>setIncidentForm(p=>({...p,driverId:e.target.value}))} style={S.input}>
                          <option value="">Select driver...</option>
                          {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </div>
                      <div><label style={S.label}>Date</label><input type="date" value={incidentForm.date} onChange={e=>setIncidentForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Type</label>
                        <select value={incidentForm.type} onChange={e=>setIncidentForm(p=>({...p,type:e.target.value}))} style={S.input}>
                          <option value="delivery">Delivery Issue</option><option value="vehicle">Vehicle Damage</option><option value="accident">Accident</option><option value="customer">Customer Complaint</option><option value="safety">Safety Violation</option><option value="other">Other</option>
                        </select>
                      </div>
                      <div><label style={S.label}>Severity</label>
                        <select value={incidentForm.severity} onChange={e=>setIncidentForm(p=>({...p,severity:e.target.value}))} style={S.input}>
                          <option value="minor">Minor</option><option value="moderate">Moderate</option><option value="major">Major</option><option value="critical">Critical</option>
                        </select>
                      </div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Description *</label><input value={incidentForm.description} onChange={e=>setIncidentForm(p=>({...p,description:e.target.value}))} placeholder="What happened? Include location, vehicle, outcome." style={S.input}/></div>
                    </div>
                    <button className="hov" onClick={()=>{
                      if(!incidentForm.description) return;
                      const driver = drivers.find(d=>String(d.id)===String(incidentForm.driverId));
                      const inc = {...incidentForm, id:Date.now(), driverName:driver?.name||"Unknown", driverId:driver?.id||incidentForm.driverId};
                      setIncidents(p=>[inc,...p]);
                      if(driver) setDrivers(p=>p.map(d=>String(d.id)===String(incidentForm.driverId)?{...d,incidents:[...(d.incidents||[]),inc]}:d));
                      setIncidentForm({driverId:"",date:"",type:"delivery",description:"",severity:"minor"});
                      setShowAddIncident(null);
                    }} style={{...S.danger,marginTop:14}}>Save Incident</button>
                  </div>
                )}

                {/* Driver incident summary strip */}
                {drivers.length>0&&(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8,marginBottom:20}}>
                    {drivers.map(d=>{
                      const driverIncs = incidents.filter(i=>String(i.driverId)===String(d.id)||i.driverName===d.name);
                      const count = driverIncs.length;
                      const critical = driverIncs.filter(i=>i.severity==="critical"||i.severity==="major").length;
                      return (
                        <div key={d.id} style={{background:count===0?"#0a0f0a":critical>0?"#1a0808":"#120e00",border:`1px solid ${count===0?"#1a2a1a":critical>0?"#3a1010":"#2a1e00"}`,borderRadius:6,padding:"12px 14px",cursor:"pointer"}}
                          onClick={()=>{/* filter to this driver */}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</div>
                          <div style={{display:"flex",gap:10,alignItems:"center"}}>
                            <div style={{textAlign:"center"}}>
                              <div style={{fontSize:20,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:count===0?"#22c55e":critical>0?"#ef4444":"#f59e0b"}}>{count}</div>
                              <div style={{fontSize:8,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em"}}>Total</div>
                            </div>
                            {critical>0&&<div style={{textAlign:"center"}}>
                              <div style={{fontSize:20,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:"#ef4444"}}>{critical}</div>
                              <div style={{fontSize:8,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em"}}>Major+</div>
                            </div>}
                            {count===0&&<div style={{fontSize:10,color:"#2d4a2d"}}>Clean record</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Incident list */}
                {incidents.length===0&&!showAddIncident&&<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>No incidents logged yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {incidents.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0)).map(inc=>{
                    const sc={minor:"#555",moderate:"#f59e0b",major:"#f87171",critical:"#ef4444"}[inc.severity]||"#555";
                    const isEditing = editIncidentId===inc.id;
                    return (
                      <div key={inc.id} style={{...S.card,borderLeft:`3px solid ${sc}`,background:isEditing?"#1a1a0a":"#141414"}}>
                        {isEditing?(
                          <div>
                            <div style={{fontSize:10,color:"#f59e0b",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Editing Incident</div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                              <div><label style={S.label}>Driver</label>
                                <select value={editIncidentForm.driverId||""} onChange={e=>setEditIncidentForm(p=>({...p,driverId:e.target.value,driverName:drivers.find(d=>d.id===e.target.value)?.name||p.driverName}))} style={S.input}>
                                  <option value="">Unknown</option>
                                  {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                              </div>
                              <div><label style={S.label}>Date</label><input type="date" value={editIncidentForm.date||""} onChange={e=>setEditIncidentForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                              <div><label style={S.label}>Type</label>
                                <select value={editIncidentForm.type||"delivery"} onChange={e=>setEditIncidentForm(p=>({...p,type:e.target.value}))} style={S.input}>
                                  <option value="delivery">Delivery Issue</option><option value="vehicle">Vehicle Damage</option><option value="accident">Accident</option><option value="customer">Customer Complaint</option><option value="safety">Safety Violation</option><option value="other">Other</option>
                                </select>
                              </div>
                              <div><label style={S.label}>Severity</label>
                                <select value={editIncidentForm.severity||"minor"} onChange={e=>setEditIncidentForm(p=>({...p,severity:e.target.value}))} style={S.input}>
                                  <option value="minor">Minor</option><option value="moderate">Moderate</option><option value="major">Major</option><option value="critical">Critical</option>
                                </select>
                              </div>
                              <div style={{gridColumn:"1/-1"}}><label style={S.label}>Description</label><input value={editIncidentForm.description||""} onChange={e=>setEditIncidentForm(p=>({...p,description:e.target.value}))} style={S.input}/></div>
                            </div>
                            <div style={{display:"flex",gap:8}}>
                              <button onClick={()=>{
                                const updatedDriver = drivers.find(d=>String(d.id)===String(editIncidentForm.driverId));
                                const updated = {...inc,...editIncidentForm, driverName:updatedDriver?.name||editIncidentForm.driverName||inc.driverName};
                                // Update in global incidents
                                setIncidents(p=>p.map(i=>i.id===inc.id?updated:i));
                                // Update in all driver incident arrays
                                setDrivers(p=>p.map(d=>({...d,incidents:(d.incidents||[]).map(i=>i.id===inc.id?updated:i)})));
                                // If driver changed, add to new driver's array if not already there
                                if(updatedDriver && String(updatedDriver.id)!==String(inc.driverId)) {
                                  setDrivers(p=>p.map(d=>String(d.id)===String(updatedDriver.id)?{...d,incidents:[...(d.incidents||[]).filter(i=>i.id!==updated.id),updated]}:d));
                                }
                                setEditIncidentId(null);
                              }} style={S.btn}>Save Changes</button>
                              <button onClick={()=>setEditIncidentId(null)} style={S.ghost}>Cancel</button>
                            </div>
                          </div>
                        ):(
                          <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                            <div style={{flex:1,minWidth:0}}>
                              {/* Driver name badge */}
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                                <div style={{background:sc+"22",border:`1px solid ${sc}44`,borderRadius:3,padding:"2px 8px",fontSize:10,color:sc,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>{inc.severity}</div>
                                <div style={{fontSize:10,color:"#f59e0b",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{inc.driverName||"Unknown Driver"}</div>
                                <div style={{fontSize:10,color:"#888"}}>· {inc.type?.replace(/_/g," ")} · {inc.date||"No date"}</div>
                              </div>
                              <div style={{fontSize:12,color:"#c8c4bc",lineHeight:1.6}}>{inc.description}</div>
                            </div>
                            <div style={{display:"flex",gap:6,flexShrink:0}}>
                              <button onClick={()=>{setEditIncidentId(inc.id);setEditIncidentForm({...inc});}} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                              <button onClick={()=>{
                                setIncidents(p=>p.filter(i=>i.id!==inc.id));
                                setDrivers(p=>p.map(d=>({...d,incidents:(d.incidents||[]).filter(i=>i.id!==inc.id)})));
                              }} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12}}>✕</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {(subScreen==="onboarding"||subScreen==="hos")&&(()=>{
              const ONBOARDING_STEPS=[{id:"application",label:"Employment Application",req:true},{id:"background",label:"Background Check Ordered",req:true},{id:"background_clear",label:"Background Check — Cleared",req:true},{id:"pre_drug_test",label:"Pre-Employment Drug Test",req:true},{id:"drug_clear",label:"Drug Test — Negative Result",req:true},{id:"clearinghouse_query",label:"FMCSA Drug Clearinghouse Query",req:true},{id:"cdl_copy",label:"CDL Copy on File",req:true},{id:"medical_card",label:"Medical Card Copy on File",req:true},{id:"mvr",label:"MVR (Motor Vehicle Record) Pulled",req:true},{id:"driving_history_3yr",label:"3-Year Driving/Employment History Verified",req:true},{id:"orientation",label:"Orientation / Safety Training Completed",req:true},{id:"orientation_signed",label:"Orientation Sign-off Form Signed",req:true},{id:"i9",label:"I-9 Employment Eligibility",req:true},{id:"direct_deposit",label:"Direct Deposit / Pay Setup",req:false},{id:"uniform",label:"Uniform / Equipment Issued",req:false},{id:"eld_training",label:"ELD / HOS Training",req:false},{id:"handbook",label:"Company Handbook Acknowledged",req:false}];
              const toggleStep=(driverId,stepId)=>setDrivers(prev=>prev.map(d=>{if(String(d.id)!==String(driverId))return d;const checklist=d.onboarding||{};return{...d,onboarding:{...checklist,[stepId]:checklist[stepId]?null:new Date().toISOString().slice(0,10)}};}));
              const weeklyHOS=(driverId)=>{const now=new Date();const weekAgo=new Date(now-7*86400000);return hosLog.filter(h=>String(h.driverId)===String(driverId)&&new Date(h.date)>=weekAgo).reduce((s,h)=>({driving:s.driving+parseFloat(h.hoursDriving||0),onDuty:s.onDuty+parseFloat(h.hoursOnDuty||0)}),{driving:0,onDuty:0});};
              const selDriver=drivers.find(d=>String(d.id)===String(selectedOnboardDriver));
              return(
              <div style={{maxWidth:800,margin:"0 auto",padding:24,animation:"fadeUp 0.3s ease"}}>
                {subScreen==="onboarding"&&(
                  <>
                    <div style={{...S.section,marginBottom:4}}>DRIVER ONBOARDING</div>
                    <p style={{fontSize:11,color:"#999",marginBottom:20,lineHeight:1.8}}>Track every required step when hiring a new driver. DOT requires most of these before the first day behind the wheel.</p>
                    <div style={{marginBottom:16}}><label style={S.label}>Select Driver</label><select value={selectedOnboardDriver} onChange={e=>setSelectedOnboardDriver(e.target.value)} style={{...S.input,maxWidth:320}}><option value="">Choose a driver...</option>{drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                    {selDriver&&(()=>{
                      const checklist=selDriver.onboarding||{};
                      const required=ONBOARDING_STEPS.filter(s=>s.req);
                      const completed=ONBOARDING_STEPS.filter(s=>checklist[s.id]).length;
                      const pct=Math.round((completed/ONBOARDING_STEPS.length)*100);
                      const readyToDrive=required.every(s=>checklist[s.id]);
                      const OnboardDetail = () => (
                        <>
                        <div style={{...S.card,marginBottom:16,display:"flex",alignItems:"center",gap:16}}>
                          <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#e8e4d8"}}>{selDriver.name}</div><div style={{fontSize:11,color:"#999"}}>Hired: {fmtDate(selDriver.hireDate)||"Not set"}</div></div>
                          <div style={{textAlign:"center"}}><div style={{fontSize:32,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,color:pct===100?"#22c55e":pct>60?"#f59e0b":"#ef4444"}}>{pct}%</div><div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em"}}>Complete</div></div>
                          <div style={{background:readyToDrive?"#051a05":"#1a0808",border:`1px solid ${readyToDrive?"#22c55e44":"#ef444444"}`,borderRadius:6,padding:"8px 16px",textAlign:"center"}}><div style={{fontSize:12,color:readyToDrive?"#22c55e":"#ef4444",fontWeight:700}}>{readyToDrive?"✓ DOT Ready":"⚠ Not Ready"}</div><div style={{fontSize:9,color:"#999"}}>Required items</div></div>
                        </div>
                        <div style={{fontSize:10,color:"#ef4444",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Required (DOT)</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
                          {required.map(step=>(
                            <div key={step.id} onClick={()=>toggleStep(selDriver.id,step.id)} style={{...S.card,display:"flex",alignItems:"center",gap:12,cursor:"pointer",borderLeft:`3px solid ${checklist[step.id]?"#22c55e":"#ef4444"}`,background:checklist[step.id]?"#0a150a":"#141414"}}>
                              <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${checklist[step.id]?"#22c55e":"#444"}`,background:checklist[step.id]?"#22c55e22":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,color:"#22c55e"}}>{checklist[step.id]?"✓":""}</div>
                              <div style={{flex:1,fontSize:12,color:checklist[step.id]?"#888":"#c8c4bc"}}>{step.label}</div>
                              {checklist[step.id]&&<div style={{fontSize:10,color:"#22c55e55"}}>{checklist[step.id]}</div>}
                            </div>
                          ))}
                        </div>
                        <div style={{fontSize:10,color:"#999",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Optional / Company Policy</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          {ONBOARDING_STEPS.filter(s=>!s.req).map(step=>(
                            <div key={step.id} onClick={()=>toggleStep(selDriver.id,step.id)} style={{...S.card,display:"flex",alignItems:"center",gap:12,cursor:"pointer",borderLeft:`3px solid ${checklist[step.id]?"#22c55e":"#333"}`,opacity:checklist[step.id]?0.7:1}}>
                              <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${checklist[step.id]?"#22c55e":"#333"}`,background:checklist[step.id]?"#22c55e22":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,color:"#22c55e"}}>{checklist[step.id]?"✓":""}</div>
                              <div style={{flex:1,fontSize:12,color:"#888"}}>{step.label}</div>
                            </div>
                          ))}
                        </div>
                        </>
                      );
                      return <OnboardDetail/>;
                    })()}
                    {!selDriver&&selectedOnboardDriver&&<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>Driver not found.</div>}
                    {drivers.length===0&&<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>Add drivers in the All Drivers tab first.</div>}
                  </>
                )}
                {subScreen==="hos"&&(
                  <>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                      <div><div style={S.section}>HOURS OF SERVICE</div><div style={{fontSize:11,color:"#999",marginTop:4}}>Federal limit: 11 hrs driving, 14 hrs on-duty per day. Keep 6 months minimum.</div></div>
                      <button className="hov" onClick={()=>setHosShowAdd(!hosShowAdd)} style={S.btn}>{hosShowAdd?"Cancel":"+ Log Hours"}</button>
                    </div>
                    {drivers.filter(d=>d.status==="active").length>0&&(
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:20}}>
                        {drivers.filter(d=>d.status==="active").map(d=>{const week=weeklyHOS(d.id);const over=week.driving>60;return(
                          <div key={d.id} style={{...S.card,borderTop:`3px solid ${over?"#ef4444":week.driving>50?"#f59e0b":"#22c55e"}`}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8",marginBottom:8}}>{d.name}</div>
                            <div style={{fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:over?"#ef4444":"#e8e4d8"}}>{week.driving.toFixed(1)} hrs</div>
                            <div style={{fontSize:9,color:"#999"}}>driving · {week.onDuty.toFixed(1)} on-duty this week</div>
                            <div style={{marginTop:8,height:4,background:"#1e1e1e",borderRadius:2}}><div style={{height:"100%",width:`${Math.min((week.driving/60)*100,100)}%`,background:over?"#ef4444":week.driving>50?"#f59e0b":"#22c55e",borderRadius:2}}/></div>
                            <div style={{fontSize:9,color:"#999",marginTop:3}}>{Math.max(0,60-week.driving).toFixed(1)} hrs remaining (60hr limit)</div>
                          </div>
                        );})}
                      </div>
                    )}
                    {hosShowAdd&&(<div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                        <div><label style={S.label}>Driver *</label><select value={hosForm.driverId} onChange={e=>setHosForm(p=>({...p,driverId:e.target.value}))} style={S.input}><option value="">Select driver...</option>{drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                        <div><label style={S.label}>Date *</label><input type="date" value={hosForm.date} onChange={e=>setHosForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Hours Driving (max 11)</label><input type="number" step="0.5" max="11" value={hosForm.hoursDriving} onChange={e=>setHosForm(p=>({...p,hoursDriving:e.target.value}))} placeholder="11" style={S.input}/></div>
                        <div><label style={S.label}>Hours On-Duty (max 14)</label><input type="number" step="0.5" max="14" value={hosForm.hoursOnDuty} onChange={e=>setHosForm(p=>({...p,hoursOnDuty:e.target.value}))} placeholder="14" style={S.input}/></div>
                        <div><label style={S.label}>Hours Off-Duty</label><input type="number" step="0.5" value={hosForm.hoursOffDuty} onChange={e=>setHosForm(p=>({...p,hoursOffDuty:e.target.value}))} placeholder="10 min required" style={S.input}/></div>
                        <div><label style={S.label}>Miles Driven</label><input type="number" value={hosForm.miles} onChange={e=>setHosForm(p=>({...p,miles:e.target.value}))} placeholder="0" style={S.input}/></div>
                        <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={hosForm.notes} onChange={e=>setHosForm(p=>({...p,notes:e.target.value}))} placeholder="Breakdown, delay, inspection..." style={S.input}/></div>
                      </div>
                      <button className="hov" onClick={()=>{if(!hosForm.driverId||!hosForm.date)return;const drv=drivers.find(d=>String(d.id)===String(hosForm.driverId));setHosLog(p=>[{...hosForm,id:Date.now(),driverName:drv?.name||"Unknown"},...p]);setHosForm(prev=>({...prev,date:"",hoursOnDuty:"",hoursDriving:"",hoursOffDuty:"",miles:"",notes:""}));setHosShowAdd(false);}} style={{...S.btn,marginTop:14}}>Save HOS Log</button>
                    </div>)}
                    {hosLog.length===0&&!hosShowAdd&&<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>No HOS records yet. Log driver hours daily to stay DOT compliant (6-month retention required).</div>}
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {[...hosLog].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(h=>{const dOver=parseFloat(h.hoursDriving||0)>11;const oOver=parseFloat(h.hoursOnDuty||0)>14;const viol=dOver||oOver;return(
                        <div key={h.id} style={{...S.card,display:"flex",alignItems:"center",gap:14,borderLeft:`3px solid ${viol?"#ef4444":"#22c55e"}`}}>
                          <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{h.driverName} — {h.date}</div><div style={{fontSize:10,color:"#999"}}>Driving: <span style={{color:dOver?"#ef4444":"#888"}}>{h.hoursDriving||0}h</span> · On-duty: <span style={{color:oOver?"#ef4444":"#888"}}>{h.hoursOnDuty||0}h</span> · Off: {h.hoursOffDuty||0}h{h.miles?` · ${h.miles} mi`:""}{h.notes?` · ${h.notes}`:""}</div>{viol&&<div style={{fontSize:10,color:"#ef4444",marginTop:3}}>⚠ HOS Violation: {dOver?"Driving >11hr":"On-duty >14hr"}</div>}</div>
                          <button onClick={()=>setHosLog(p=>p.filter(x=>x.id!==h.id))} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      );})}
                    </div>
                  </>
                )}
              </div>
              );
            })()}

            {/* ── D3: HOS warning banner ── */}
            {subScreen==="hos"&&(segment==="fedex"||segment==="amazon")&&false&&null}

            {/* ── D1: Coaching Log ── */}
            {subScreen==="coaching"&&segment==="fedex"&&(
              <div style={{maxWidth:800,margin:"0 auto",padding:24,animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8"}}>Driver Coaching Log</div>
                  <button className="hov" onClick={()=>setShowCoachingAdd(p=>!p)} style={S.btn}>+ Add Entry</button>
                </div>
                {showCoachingAdd&&<div style={{...S.card,marginBottom:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>New Coaching Entry</div>
                  <input type="date" value={coachingForm.date} onChange={e=>setCoachingForm(p=>({...p,date:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <select value={coachingForm.driverId} onChange={e=>setCoachingForm(p=>({...p,driverId:e.target.value}))} style={{...S.input,marginBottom:8}}>
                    <option value="">Select Driver</option>
                    {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <select value={coachingForm.issueType} onChange={e=>setCoachingForm(p=>({...p,issueType:e.target.value}))} style={{...S.input,marginBottom:8}}>
                    {["Harsh Braking","Speeding","Seatbelt","Missed Stop","Late Scan","Appearance","Other"].map(t=><option key={t}>{t}</option>)}
                  </select>
                  <textarea placeholder="Description" value={coachingForm.description} onChange={e=>setCoachingForm(p=>({...p,description:e.target.value}))} style={{...S.input,marginBottom:8,minHeight:60}}/>
                  <textarea placeholder="Action Taken" value={coachingForm.actionTaken} onChange={e=>setCoachingForm(p=>({...p,actionTaken:e.target.value}))} style={{...S.input,marginBottom:8,minHeight:60}}/>
                  <input type="date" placeholder="Follow-up Date" value={coachingForm.followUpDate} onChange={e=>setCoachingForm(p=>({...p,followUpDate:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <input placeholder="Outcome" value={coachingForm.outcome} onChange={e=>setCoachingForm(p=>({...p,outcome:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <label style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#888",marginBottom:10}}>
                    <input type="checkbox" checked={coachingForm.followUpComplete} onChange={e=>setCoachingForm(p=>({...p,followUpComplete:e.target.checked}))}/> Follow-up Complete
                  </label>
                  <button className="hov" onClick={()=>{
                    const drv=drivers.find(d=>d.id===coachingForm.driverId);
                    setCoachingLog(p=>[{id:Date.now(),driverName:drv?.name||"",...coachingForm},...p]);
                    setCoachingForm({date:"",driverId:"",issueType:"Harsh Braking",description:"",actionTaken:"",followUpDate:"",followUpComplete:false,outcome:""});
                    setShowCoachingAdd(false);
                  }} style={S.btn}>Save Entry</button>
                </div>}
                <div style={{fontSize:12,fontWeight:700,color:accent,marginBottom:8}}>Open ({coachingLog.filter(c=>!c.followUpComplete).length})</div>
                {coachingLog.filter(c=>!c.followUpComplete).length===0&&<div style={{color:"#999",fontSize:12,marginBottom:16}}>No open coaching entries.</div>}
                {coachingLog.filter(c=>!c.followUpComplete).map(c=>{
                  const overdue=c.followUpDate&&new Date(c.followUpDate)<new Date();
                  return <div key={c.id} style={{...S.card,marginBottom:8,border:overdue?"1px solid #ef444455":""}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:"#e8e4d8"}}>{c.driverName} — {c.issueType}</div>
                        <div style={{fontSize:11,color:"#888"}}>{c.date} · Follow-up: {c.followUpDate||"—"}{overdue&&<span style={{color:"#ef4444",marginLeft:4}}>⚠ OVERDUE</span>}</div>
                        <div style={{fontSize:11,color:"#888",marginTop:4}}>{c.description}</div>
                      </div>
                      <button className="hov" onClick={()=>setCoachingLog(p=>p.map(x=>x.id===c.id?{...x,followUpComplete:true}:x))} style={{fontSize:10,padding:"3px 10px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer"}}>Complete</button>
                    </div>
                  </div>;
                })}
                {coachingLog.filter(c=>c.followUpComplete).length>0&&<>
                  <div style={{fontSize:12,fontWeight:700,color:"#999",marginBottom:8,marginTop:16}}>Completed ({coachingLog.filter(c=>c.followUpComplete).length})</div>
                  {coachingLog.filter(c=>c.followUpComplete).map(c=>(
                    <div key={c.id} style={{...S.card,marginBottom:6,opacity:0.7}}>
                      <div style={{fontSize:12,color:"#e8e4d8"}}>{c.driverName} — {c.issueType} <span style={{fontSize:10,color:"#22c55e"}}>✓ Complete</span></div>
                      <div style={{fontSize:11,color:"#888"}}>{c.date} · {c.outcome||"No outcome noted"}</div>
                    </div>
                  ))}
                </>}
              </div>
            )}

            {/* ── D2: Appearance Tracker ── */}
            {subScreen==="appearance"&&segment==="fedex"&&(
              <div style={{maxWidth:800,margin:"0 auto",padding:24,animation:"fadeUp 0.3s ease"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>Vehicle Appearance Tracker</div>
                <div style={{...S.card,marginBottom:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>Weekly Inspection</div>
                  <select value={appearVehicle} onChange={e=>setAppearVehicle(e.target.value)} style={{...S.input,marginBottom:8}}>
                    <option value="">Select Truck</option>
                    {(compliance.trucks||[]).map((t,i)=><option key={i} value={t.name||t.truckName}>{t.name||t.truckName||"Truck "+(i+1)}</option>)}
                  </select>
                  <input type="date" value={appearDate} onChange={e=>setAppearDate(e.target.value)} style={{...S.input,marginBottom:8}}/>
                  {[["decals","FedEx decals intact and clean"],["noStickers","No unauthorized stickers/markings"],["exterior","Exterior clean"],["cab","Cab interior clean"],["uniform","Driver uniform compliance"],["noUnreportedDamage","No unreported visible damage"],["cargo","Cargo area clean"]].map(([key,label])=>(
                    <label key={key} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#e8e4d8",marginBottom:6}}>
                      <input type="checkbox" checked={appearItems[key]||false} onChange={e=>setAppearItems(p=>({...p,[key]:e.target.checked}))}/>
                      {label}
                    </label>
                  ))}
                  <button className="hov" style={{...S.btn,marginTop:8}} onClick={()=>{
                    if(!appearVehicle||!appearDate)return;
                    const passCount=Object.values(appearItems).filter(Boolean).length;
                    setAppearanceLog(p=>[{id:Date.now(),vehicle:appearVehicle,date:appearDate,items:{...appearItems},passCount,totalItems:7},...p]);
                    setAppearItems({decals:false,noStickers:false,exterior:false,cab:false,uniform:false,noUnreportedDamage:false,cargo:false});
                  }}>Save Inspection</button>
                </div>
                {(compliance.trucks||[]).filter(t=>{
                  const name=t.name||t.truckName;
                  const recent=appearanceLog.filter(a=>a.vehicle===name).sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
                  return !recent||((Date.now()-new Date(recent.date).getTime())>7*24*3600*1000);
                }).map((t,i)=><div key={i} style={{...S.card,marginBottom:8,background:"#1a1005",border:"1px solid #f59e0b44",color:"#f59e0b",fontSize:11}}>⚠ {t.name||t.truckName} — no appearance check in 7+ days</div>)}
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:8,marginTop:8}}>Inspection History</div>
                {appearanceLog.length===0&&<div style={{color:"#999",fontSize:12}}>No inspections logged yet.</div>}
                {appearanceLog.slice(0,20).map(a=>(
                  <div key={a.id} style={{...S.card,marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:13,color:"#e8e4d8"}}>{a.vehicle} · {a.date}</div>
                        <div style={{fontSize:11,color:"#888"}}>{a.passCount}/{a.totalItems} items passed</div>
                      </div>
                      <span style={{fontSize:11,padding:"2px 8px",borderRadius:3,background:a.passCount===a.totalItems?"#22c55e33":"#ef444433",color:a.passCount===a.totalItems?"#22c55e":"#ef4444"}}>{a.passCount===a.totalItems?"PASS":"FAIL"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
  );
}
