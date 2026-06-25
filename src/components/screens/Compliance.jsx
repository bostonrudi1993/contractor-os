// Compliance screen
export default function Compliance(p) {
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
    currentTier, TIERS,
  } = p;
  const TRUCK_LIMITS = { solo: 1, fleet: 5, enterprise: Infinity };
  const truckLimit = isOwner ? Infinity : (TRUCK_LIMITS[currentTier] ?? Infinity);
  return (
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[["overview","Overview"],["vehicles","Vehicles"],["drivers_comp","Drivers"],["docs","Doc Guide"],["ask","Ask DOT AI"]]} active={subScreen||"overview"} onSelect={setSubScreen}/>
          <div style={{flex:1,overflowY:"auto",padding:24}}>
            {(!subScreen||subScreen==="overview")&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:4}}>COMPLIANCE CENTER</div>
                <p style={{fontSize:11,color:"#555",marginBottom:22,lineHeight:1.8}}>
                  {seg.id==="amazon"?"One compliance failure can end your DSP contract. Track everything here.":seg.id==="fedex"?"Protect your ISP route investment with proactive compliance tracking.":"One DOT audit with missing files = up to $16,000 in fines."}
                </p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
                  <Stat label="Vehicles" value={compliance.trucks.length} />
                  <Stat label="Drivers" value={compliance.drivers.length} color="#60a5fa"/>
                  <Stat label="Urgent ≤30d" value={urgentItems.length} color={urgentItems.length>0?"#ef4444":"#22c55e"}/>
                  <Stat label="Contracts" value={contracts.length} color="#8888cc"/>
                </div>
                {urgentItems.length>0&&(
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:10,color:"#ef4444",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8}}>🔴 Urgent Action Required</div>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>{urgentItems.map((item,i)=><ExpiryBadge key={i} {...item}/>)}</div>
                  </div>
                )}
                {/* Federal Filings Tracker */}
                <div style={{background:"#0c0c14",border:"1px solid #1a1a2a",borderRadius:8,padding:"18px 22px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div>
                      <div style={{fontSize:10,color:"#3a3a6a",letterSpacing:"0.2em",textTransform:"uppercase"}}>Federal Recurring Filings</div>
                      <div style={{fontSize:10,color:"#2a2a4a",marginTop:3}}>Track completion dates, confirmation numbers, and notes for each filing</div>
                    </div>
                    {canEdit()&&<button className="hov" onClick={()=>setShowAddFiling(!showAddFiling)} style={{background:"transparent",border:"1px solid #2a2a5a",color:"#8888cc",padding:"5px 12px",fontSize:10,cursor:"pointer",borderRadius:4,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>{showAddFiling?"Cancel":"+ Custom Deadline"}</button>}
                  </div>

                  {/* Add custom filing form */}
                  {showAddFiling&&canEdit()&&(
                    <div style={{background:"#0f0f1a",border:"1px solid #2a2a4a",borderRadius:6,padding:"14px 16px",marginBottom:16}}>
                      <div style={{fontSize:9,color:"#4a4a8a",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>New Custom Deadline</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                        <div><label style={S.label}>Filing / Deadline Name *</label><input value={newFilingForm.name} onChange={e=>setNewFilingForm(p=>({...p,name:e.target.value}))} placeholder="e.g. State Fuel Tax, Business License" style={S.input}/></div>
                        <div><label style={S.label}>Due Date</label><input value={newFilingForm.dueDate} onChange={e=>setNewFilingForm(p=>({...p,dueDate:e.target.value}))} placeholder="e.g. Mar 15, Quarterly, Annual" style={S.input}/></div>
                        <div><label style={S.label}>Frequency</label>
                          <select value={newFilingForm.frequency} onChange={e=>setNewFilingForm(p=>({...p,frequency:e.target.value}))} style={S.input}>
                            {["Annual","Quarterly","Monthly","Biennial","Ongoing","One-time"].map(o=><option key={o}>{o}</option>)}
                          </select>
                        </div>
                        <div><label style={S.label}>Notes</label><input value={newFilingForm.notes} onChange={e=>setNewFilingForm(p=>({...p,notes:e.target.value}))} placeholder="What is this filing for?" style={S.input}/></div>
                      </div>
                      <button className="hov" onClick={()=>{
                        if(!newFilingForm.name) return;
                        setFilings(p=>[...p,{...newFilingForm,id:`custom-${Date.now()}`,federal:false,filedDate:"",confirmationNum:"",filedNotes:""}]);
                        setNewFilingForm({name:"",dueDate:"",frequency:"Annual",notes:"",filedDate:"",confirmationNum:"",filedNotes:""});
                        setShowAddFiling(false);
                      }} style={{...S.btn,background:"#6366f1",fontSize:11,padding:"7px 16px"}}>Add Deadline</button>
                    </div>
                  )}

                  {/* Filings list */}
                  <div style={{display:"flex",flexDirection:"column",gap:0}}>
                    {filings.map((filing,i)=>{
                      const isEditing = editFilingId===filing.id;
                      const isFiled = !!filing.filedDate;
                      const statusColor = isFiled?"#22c55e":"#f59e0b";
                      const statusLabel = isFiled?"Filed":"Pending";
                      return (
                        <div key={filing.id} style={{borderTop:i>0?"1px solid #14141e":"none",padding:"12px 0"}}>
                          {isEditing&&canEdit()?(
                            /* Edit form */
                            <div style={{background:"#0f0f1a",border:`1px solid ${accent}33`,borderRadius:6,padding:"14px 16px"}}>
                              <div style={{fontSize:9,color:"#4a4a8a",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Editing: {filing.name}</div>
                              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                                {!filing.federal&&<div><label style={S.label}>Filing Name</label><input value={editFilingForm.name||""} onChange={e=>setEditFilingForm(p=>({...p,name:e.target.value}))} style={S.input}/></div>}
                                {!filing.federal&&<div><label style={S.label}>Due Date</label><input value={editFilingForm.dueDate||""} onChange={e=>setEditFilingForm(p=>({...p,dueDate:e.target.value}))} style={S.input}/></div>}
                                <div><label style={S.label}>Last Filed Date</label><input type="date" value={editFilingForm.filedDate||""} onChange={e=>setEditFilingForm(p=>({...p,filedDate:e.target.value}))} style={S.input}/></div>
                                <div><label style={S.label}>Confirmation # / Reference</label><input value={editFilingForm.confirmationNum||""} onChange={e=>setEditFilingForm(p=>({...p,confirmationNum:e.target.value}))} placeholder="Confirmation or reference number" style={S.input}/></div>
                                <div style={{gridColumn:"1/-1"}}><label style={S.label}>Filing Notes</label><input value={editFilingForm.filedNotes||""} onChange={e=>setEditFilingForm(p=>({...p,filedNotes:e.target.value}))} placeholder="Who filed it, any issues, follow-up needed..." style={S.input}/></div>
                              </div>
                              <div style={{display:"flex",gap:8}}>
                                <button className="hov" onClick={()=>{
                                  setFilings(p=>p.map(f=>f.id===filing.id?{...f,...editFilingForm}:f));
                                  setEditFilingId(null);
                                }} style={{...S.btn,fontSize:11,padding:"7px 16px"}}>Save</button>
                                <button onClick={()=>setEditFilingId(null)} style={{...S.ghost,fontSize:10,padding:"7px 14px"}}>Cancel</button>
                                {!filing.federal&&<button onClick={()=>{setFilings(p=>p.filter(f=>f.id!==filing.id));setEditFilingId(null);}} style={{background:"transparent",border:"1px solid #3a1010",color:"#7a4040",padding:"7px 12px",fontSize:10,cursor:"pointer",borderRadius:4,fontFamily:"'DM Mono',monospace",marginLeft:"auto"}}>Delete</button>}
                              </div>
                            </div>
                          ):(
                            /* Display row */
                            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"start"}}>
                              <div style={{minWidth:0}}>
                                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                                  <div style={{fontSize:12,color:"#8888cc",fontWeight:600}}>{filing.name}</div>
                                  {!filing.federal&&<span style={{fontSize:8,color:"#6366f1",border:"1px solid #6366f133",padding:"1px 6px",borderRadius:2,letterSpacing:"0.1em"}}>CUSTOM</span>}
                                  <span style={{fontSize:9,color:statusColor,border:`1px solid ${statusColor}44`,padding:"1px 6px",borderRadius:2,letterSpacing:"0.08em",textTransform:"uppercase"}}>{statusLabel}</span>
                                </div>
                                <div style={{fontSize:10,color:"#3a3a5a",marginBottom:isFiled?4:0}}>{filing.notes}</div>
                                {isFiled&&(
                                  <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                                    <span style={{fontSize:10,color:"#22c55e"}}>✓ Filed: {new Date(filing.filedDate).toLocaleDateString()}</span>
                                    {filing.confirmationNum&&<span style={{fontSize:10,color:"#555"}}>Ref: {filing.confirmationNum}</span>}
                                    {filing.filedNotes&&<span style={{fontSize:10,color:"#555",fontStyle:"italic"}}>"{filing.filedNotes}"</span>}
                                  </div>
                                )}
                              </div>
                              <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                                <div style={{textAlign:"right"}}>
                                  <div style={{fontSize:13,color:"#6060aa",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,whiteSpace:"nowrap"}}>{filing.dueDate}</div>
                                  <div style={{fontSize:9,color:"#3a3a5a"}}>{filing.frequency}</div>
                                </div>
                                {canEdit()&&(
                                  <button onClick={()=>{setEditFilingId(filing.id);setEditFilingForm({...filing});}} style={{background:"transparent",border:`1px solid ${accent}33`,color:accent,cursor:"pointer",fontSize:9,padding:"3px 8px",borderRadius:3,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>
                                    {isFiled?"Update":"Mark Filed"}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!canEdit()&&(
                    <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #14141e",fontSize:10,color:"#2a2a4a",fontStyle:"italic"}}>Read only — Owner or Manager access required to edit filings</div>
                  )}
                </div>
              </div>
            )}

            {subScreen==="vehicles"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={S.section}>VEHICLE FILES</div>
                  {compliance.trucks.length >= truckLimit
                    ? <div style={{fontSize:10,color:"#ef4444",border:"1px solid #ef444433",padding:"6px 12px",borderRadius:4,background:"#1a0808"}}>
                        Truck limit reached ({truckLimit} max on {TIERS[currentTier]?.label||currentTier} plan) — upgrade to add more
                      </div>
                    : <button className="hov" onClick={()=>setShowAddVehicle(!showAddVehicle)} style={S.btn}>{showAddVehicle?"Cancel":"+ Add Vehicle"}</button>
                  }
                </div>
                {showAddVehicle&&compliance.trucks.length<truckLimit&&(
                  <div style={{...S.card,marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {[
                        ["name","Unit Name / # *","Unit 1, Truck 1"],
                        ["nickname","Nickname (optional)","Blue Box, Big Red"],
                        ["vin","VIN or Last 6 Digits","3ALACWDT..."],
                        ["year","Year","2019"],
                        ["make","Make & Model","International 4300"],
                        ["plate","Plate #",""],
                        ["dotInspection","DOT Inspection Expiry","date"],
                        ["registration","Registration Expiry","date"],
                        ["ifta","IFTA Renewal","date"],
                        ["irp","IRP Plate Renewal","date"],
        ["insuranceExpiry","Liability Insurance Expiry","date"],
                      ].map(([f,lbl,ph])=>(
                        <div key={f}><label style={S.label}>{lbl}</label><input type={ph==="date"?"date":"text"} value={vehicleForm[f]||""} onChange={e=>setVehicleForm(p=>({...p,[f]:e.target.value}))} placeholder={ph!=="date"?ph:""} style={S.input}/></div>
                      ))}
                    </div>
                    <button className="hov" onClick={()=>{
                      if(!vehicleForm.name){showValidation("Truck name is required");return;}
                      if(compliance.trucks.length >= truckLimit){showValidation(`Truck limit reached. Upgrade to add more than ${truckLimit} truck${truckLimit===1?"":"s"}.`);return;}
                      setCompliance(p=>({...p,trucks:[...p.trucks,{...vehicleForm,id:Date.now()}]}));
                      setVehicleForm({name:"",nickname:"",vin:"",year:"",make:"",plate:"",dotInspection:"",ifta:"",irp:"",registration:"",insuranceExpiry:""});
                      setShowAddVehicle(false);
                    }} style={{...S.btn,marginTop:14}}>Save Vehicle</button>
                  </div>
                )}
                {compliance.trucks.length===0&&!showAddVehicle&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:32}}>No vehicles added yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {compliance.trucks.map(t=>(
                    <div key={t.id} style={S.card}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:"#e8e4d8"}}>{t.name}{t.nickname&&<span style={{color:accent,marginLeft:8,fontSize:14}}>"{t.nickname}"</span>}</div>
                          <div style={{fontSize:10,color:"#555"}}>{t.year} {t.make} {t.plate&&`· ${t.plate}`}{t.vin&&<span style={{color:"#444",marginLeft:6}}>· VIN: {t.vin}</span>}</div>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>openEdit("vehicle",t)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                          <button onClick={()=>setCompliance(p=>({...p,trucks:p.trucks.filter(x=>x.id!==t.id)}))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {[["DOT Inspection",t.dotInspection],["Registration",t.registration],["IFTA",t.ifta],["IRP Plates",t.irp],["Insurance",t.insuranceExpiry]].map(([lbl,date])=>{
                          const d=daysUntil(date),c=statusColor(d);
                          return <div key={lbl} style={{background:"#0f0f0f",border:`1px solid ${c}22`,borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{lbl}</div><div style={{fontSize:12,color:c,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{date?new Date(date).toLocaleDateString():"—"}</div>{d!==null&&<div style={{fontSize:9,color:c,marginTop:2}}>{statusLabel(d)}</div>}</div>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subScreen==="drivers_comp"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={S.section}>DRIVER FILES</div>
                  <button className="hov" onClick={()=>setShowAddCompDriver(!showAddCompDriver)} style={{...S.btn,background:"#60a5fa"}}>{showAddCompDriver?"Cancel":"+ Add Driver"}</button>
                </div>
                {showAddCompDriver&&(
                  <div style={{...S.card,marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      {[["name","Driver Name *","text"],["cdlExpiry","CDL Expiry","date"],["medCardExpiry","Medical Card Expiry","date"],["mvrDue","MVR Pull Due","date"],["drugTest","Drug Test Due","date"],["annualReview","Annual Review Due","date"]].map(([f,lbl,t])=>(
                        <div key={f}><label style={S.label}>{lbl}</label><input type={t} value={compDriverForm[f]} onChange={e=>setCompDriverForm(p=>({...p,[f]:e.target.value}))} style={S.input}/></div>
                      ))}
                    </div>
                    <button className="hov" onClick={()=>{ if(!compDriverForm.name)return; setCompliance(p=>({...p,drivers:[...p.drivers,{...compDriverForm,id:Date.now()}]})); setCompDriverForm({name:"",cdlExpiry:"",medCardExpiry:"",mvrDue:"",drugTest:"",annualReview:""}); setShowAddCompDriver(false); }} style={{...S.btn,background:"#60a5fa",marginTop:14}}>Save Driver</button>
                  </div>
                )}
                {compliance.drivers.length===0&&!showAddCompDriver&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:32}}>No drivers added yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {compliance.drivers.map(d=>(
                    <div key={d.id} style={S.card}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:"#e8e4d8"}}>{d.name}</div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>openEdit("compdriver",d)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                          <button onClick={()=>setCompliance(p=>({...p,drivers:p.drivers.filter(x=>x.id!==d.id)}))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                        {[["CDL",d.cdlExpiry],["Med Card",d.medCardExpiry],["MVR Due",d.mvrDue],["Drug Test",d.drugTest],["Annual Review",d.annualReview]].map(([lbl,date])=>{
                          const dy=daysUntil(date),c=statusColor(dy);
                          return <div key={lbl} style={{background:"#0f0f0f",border:`1px solid ${c}22`,borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{lbl}</div><div style={{fontSize:12,color:c,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{date?new Date(date).toLocaleDateString():"—"}</div>{dy!==null&&<div style={{fontSize:9,color:c,marginTop:2}}>{statusLabel(dy)}</div>}</div>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subScreen==="docs"&&(
              <div style={{maxWidth:820,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:4}}>DOCUMENT GUIDE</div>
                <p style={{fontSize:11,color:"#555",marginBottom:22,lineHeight:1.8}}>Every document, where it lives, and how long to keep it.</p>
                {[
                  {cat:"In Every Vehicle",color:"#ef4444",docs:[["Insurance Certificate","Current primary liability cert","Glove box / door pocket","Current always"],["Vehicle Registration","State registration","Glove box","Current always"],["IFTA License","Fuel tax license","Cab","Renew Jan 1"],["Annual DOT Inspection","Post-inspection certificate","In vehicle","12 months"],["Driver CDL","Driver's commercial license","Driver carries","Per CDL expiry"],["Medical Card","DOT physical certificate","Driver carries + office copy","1–2 years"]]},
                  {cat:"Driver Qualification File",color:"#60a5fa",docs:[["Driver Application","3-year employment history","DQ file","3 yrs post-separation"],["CDL Copy","Copy of current CDL","DQ file","Update on renewal"],["Annual MVR","State DMV record pull","DQ file","Pull annually, keep 3 yrs"],["Pre-Employment Drug Test","Negative result required","DQ file","5 years"],["Annual Driving Review","Signed MVR review","DQ file","3 years"],["Clearinghouse Query","FMCSA annual D&A check","DQ file","3 years"]]},
                  {cat:"Company Authority Files",color:"#22c55e",docs:[["MC/DOT Authority","FMCSA operating authority","Office + posted","Permanent"],["BOC-3 Filing","Process agent designation","Office file","Refile if agent changes"],["UCR Confirmation","Annual carrier registration","Office file","Renew Dec 31"],["MCS-150 Update","FMCSA biennial update","Office file","Every 2 years"],["Drug Program Records","Pool enrollment & results","Locked secure file","5 years min"],["Accident Register","All accident details","Office file","3 years"]]},
                ].map(sec=>(
                  <div key={sec.cat} style={{marginBottom:20}}>
                    <div style={{fontSize:10,color:sec.color,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8,display:"flex",alignItems:"center",gap:8}}><div style={{width:3,height:14,background:sec.color,borderRadius:2}}/>{sec.cat}</div>
                    <div style={{border:"1px solid #1e1e1e",borderRadius:6,overflow:"hidden"}}>
                      {sec.docs.map(([name,desc,loc,ret],i)=>(
                        <div key={name} style={{display:"grid",gridTemplateColumns:"2fr 2fr 1.5fr",borderTop:i>0?"1px solid #161616":"none",background:"#0f0f0f"}}>
                          <div style={{padding:"9px 13px",borderRight:"1px solid #161616"}}><div style={{fontSize:11,color:"#c8c4bc"}}>{name}</div><div style={{fontSize:9,color:"#555",marginTop:2}}>{desc}</div></div>
                          <div style={{padding:"9px 13px",borderRight:"1px solid #161616"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Where</div><div style={{fontSize:11,color:"#888"}}>{loc}</div></div>
                          <div style={{padding:"9px 13px"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Keep</div><div style={{fontSize:11,color:"#888"}}>{ret}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {subScreen==="ask"&&(
              <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:4}}>ASK DOT AI</div>
                <p style={{fontSize:11,color:"#555",marginBottom:18,lineHeight:1.8}}>Plain-English answers to any compliance question.</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
                  {["What goes in a driver qualification file?","When do I pull an MVR?","What is UCR and when to renew?","What triggers a DOT audit?","How to register with Drug Clearinghouse?","What is MCS-150?","How long keep HOS logs?","Documents required in vehicle?"].map(q=>(
                    <button key={q} onClick={()=>setDotQ(q)} style={{background:"#111",border:"1px solid #222",color:"#666",padding:"5px 10px",fontSize:10,borderRadius:4,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>{q}</button>
                  ))}
                </div>
                <div style={{display:"flex",gap:10,marginBottom:18}}>
                  <input value={dotQ} onChange={e=>setDotQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askDot()} placeholder="Ask any DOT/FMCSA compliance question..." style={{...S.input,flex:1}}/>
                  <button className="hov" onClick={askDot} disabled={!dotQ.trim()||aiLoading} style={{...S.danger,opacity:dotQ.trim()&&!aiLoading?1:0.4}}>{aiLoading?"...":"Ask →"}</button>
                </div>
                {aiLoading&&<Loader msg="Consulting FMCSA regulations..."/>}
                {aiError&&!aiLoading&&screen==="compliance"&&<div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010",color:"#f87171",fontSize:11,marginBottom:12}}>{aiError}</div>}
                {dotAnswer&&!aiLoading&&<div style={{background:"#110f00",border:"1px solid #2a2000",borderRadius:8,padding:"18px 22px",animation:"fadeUp 0.3s ease"}}><div style={{fontSize:9,color:"#5a4a00",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>DOT AI Answer</div><div style={{fontSize:12,color:"#c8c4a0",lineHeight:1.9,whiteSpace:"pre-wrap"}}>{dotAnswer}</div><div style={{marginTop:14,fontSize:10,color:"#3a3000",borderTop:"1px solid #2a1800",paddingTop:10}}>⚠ Informational only. Verify with your state DOT and a compliance professional.</div></div>}
              </div>
            )}
          </div>
        </div>

  );
}
