// Users screen
export default function Users(p) {
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
        <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <div style={{...S.section,marginBottom:4}}>USERS & ROLES</div>
            <p style={{fontSize:11,color:"#555",marginBottom:16,lineHeight:1.8}}>Invite drivers and managers to your company. Each person logs in with their own account and only sees your company's data.</p>

            {/* Clerk org management */}
            {organization&&(
              <div style={{...S.card,marginBottom:20,border:`1px solid ${accent}33`,background:"#0a0f0a"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8"}}>{organization.name}</div>
                    <div style={{fontSize:10,color:"#555"}}>Organization ID: {organization.id?.slice(0,16)}...</div>
                  </div>
                  <div style={{fontSize:9,color:"#22c55e",border:"1px solid #22c55e44",padding:"2px 8px",borderRadius:3}}>ACTIVE ORG</div>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="hov" onClick={()=>{if(organization){setShowOrgProfile(true);}else{alert("You need to be part of an organization to manage members. Create or join one first.");}}} style={{...S.btn,fontSize:11}}>Manage Members & Invites</button>
                  <button onClick={()=>signOut()} style={{...S.ghost,fontSize:10}}>Sign Out</button>
                </div>
              </div>
            )}

            {/* How roles work */}
            <div style={{...S.card,marginBottom:20,background:"#0a0a14",border:"1px solid #1a1a3a"}}>
              <div style={{fontSize:10,color:"#4a4a8a",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>How Roles Work</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[["👑 Owner (org:admin)","Full access — all screens, settings, billing, invite users","#f59e0b"],["👔 Manager (org:member)","Can edit routes, drivers, compliance, finance — cannot change billing or delete the org","#8888cc"],["🚛 Driver (org:member)","Read-only — sees their own dispatch, HOS log, and pay stubs only","#22c55e"]].map(([role,desc,col])=>(
                  <div key={role} style={{display:"flex",gap:12,padding:"8px 0",borderBottom:"1px solid #1a1a2a"}}>
                    <div style={{fontSize:12,color:col,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,width:180,flexShrink:0}}>{role}</div>
                    <div style={{fontSize:11,color:"#555"}}>{desc}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:12,fontSize:10,color:"#3a3a5a",lineHeight:1.7}}>
                💡 To invite someone: click "Manage Members & Invites" → Invite → enter their email. They'll get a link to create an account and join your company automatically.
              </div>
            </div>

            {/* Current user */}
            <div style={{...S.card,marginBottom:20,border:`1px solid ${accent}44`,background:"#0f0f0a"}}>
              <div style={{fontSize:10,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Currently Signed In</div>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:44,height:44,background:accent+"22",border:`1px solid ${accent}44`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:accent}}>{currentUser.name.charAt(0)}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8"}}>{currentUser.name}</div>
                  <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>{currentUser.role}</div>
                </div>
                {users.length>0&&<button onClick={()=>setSwitchingUser(true)} style={{...S.ghost,fontSize:10}}>Switch User</button>}
              </div>
            </div>

            {/* Switch user panel */}
            {switchingUser&&(
              <div style={{...S.card,marginBottom:20,border:"1px solid #2a2a4a"}}>
                <div style={{fontSize:10,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Switch To</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {/* Owner always available */}
                  <div className="cardhov" onClick={()=>{setCurrentUser({id:"owner",name:"Owner",role:"owner",pin:""});setSwitchingUser(false);}} style={{...S.card,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:32,height:32,background:accent+"22",border:`1px solid ${accent}44`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:accent}}>O</div>
                    <div style={{flex:1}}><div style={{fontSize:12,color:"#e8e4d8"}}>Owner</div><div style={{fontSize:10,color:"#555"}}>Full access</div></div>
                    <div style={{fontSize:9,color:"#22c55e",border:"1px solid #22c55e44",padding:"2px 7px",borderRadius:3}}>OWNER</div>
                  </div>
                  {users.map(u=>(
                    <div key={u.id} className="cardhov" onClick={()=>switchUser(u)} style={{...S.card,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:32,height:32,background:"#2a2a2a",border:"1px solid #3a3a3a",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#888"}}>{u.name.charAt(0)}</div>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#e8e4d8"}}>{u.name}</div><div style={{fontSize:10,color:"#555"}}>{u.driverId?`Driver: ${drivers.find(d=>d.id===u.driverId)?.name||"Unknown"}`:"No driver linked"}</div></div>
                      <div style={{fontSize:9,color:u.role==="manager"?"#8888cc":"#4ade80",border:`1px solid ${u.role==="manager"?"#8888cc44":"#4ade8044"}`,padding:"2px 7px",borderRadius:3,textTransform:"uppercase"}}>{u.role}</div>
                      {u.pin&&<div style={{fontSize:9,color:"#555"}}>🔒 PIN</div>}
                    </div>
                  ))}
                </div>
                <button onClick={()=>setSwitchingUser(false)} style={{...S.ghost,marginTop:12,fontSize:10}}>Cancel</button>
              </div>
            )}

            {/* Add user */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase"}}>Team Members ({users.length})</div>
              <button className="hov" onClick={()=>setShowAddUser(!showAddUser)} style={S.btn}>{showAddUser?"Cancel":"+ Add User"}</button>
            </div>

            {showAddUser&&(
              <div style={{...S.card,marginBottom:18,border:`1px solid ${accent}22`}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Name *</label><input value={userForm.name} onChange={e=>setUserForm(p=>({...p,name:e.target.value}))} placeholder="Full name" style={S.input}/></div>
                  <div><label style={S.label}>Role</label>
                    <select value={userForm.role} onChange={e=>setUserForm(p=>({...p,role:e.target.value}))} style={S.input}>
                      <option value="manager">Manager — can edit everything</option>
                      <option value="driver">Driver — read-only, own info only</option>
                    </select>
                  </div>
                  <div><label style={S.label}>PIN (optional)</label><input type="password" maxLength={6} value={userForm.pin} onChange={e=>setUserForm(p=>({...p,pin:e.target.value}))} placeholder="4-6 digits" style={S.input}/></div>
                  {userForm.role==="driver"&&<div><label style={S.label}>Link to Driver</label>
                    <select value={userForm.driverId} onChange={e=>setUserForm(p=>({...p,driverId:e.target.value}))} style={S.input}>
                      <option value="">Select driver...</option>
                      {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>}
                </div>
                <div style={{marginTop:10,padding:"10px 12px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:4,fontSize:10,color:"#555",lineHeight:1.7}}>
                  <strong style={{color:"#888"}}>Manager:</strong> Can view and edit all data — routes, compliance, drivers, finance.<br/>
                  <strong style={{color:"#888"}}>Driver:</strong> Read-only access. If linked, they can see their own route, compliance dates, and incident history.
                </div>
                <button className="hov" onClick={()=>{
                  if(!userForm.name) return;
                  setUsers(p=>[...p,{...userForm,id:Date.now()}]);
                  setUserForm({name:"",role:"driver",pin:"",driverId:""});
                  setShowAddUser(false);
                }} style={{...S.btn,marginTop:14}}>Save User</button>
              </div>
            )}

            {users.length===0&&!showAddUser&&(
              <div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:32}}>
                No team members added yet. Add managers or drivers to give them controlled access.
              </div>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {users.map(u=>(
                <div key={u.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:36,height:36,background:u.role==="manager"?"#1a1a2a":"#0a120a",border:`1px solid ${u.role==="manager"?"#2a2a5a":"#1a3a1a"}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:u.role==="manager"?"#8888cc":"#4ade80",flexShrink:0}}>{u.name.charAt(0)}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8"}}>{u.name}</div>
                    <div style={{fontSize:10,color:"#555"}}>{u.role==="manager"?"Manager — full edit access":"Driver — read only"}{u.driverId&&` · ${drivers.find(d=>d.id===u.driverId)?.name||"Driver linked"}`}{u.pin&&" · PIN protected"}</div>
                  </div>
                  <div style={{fontSize:9,color:u.role==="manager"?"#8888cc":"#4ade80",border:`1px solid ${u.role==="manager"?"#8888cc44":"#4ade8044"}`,padding:"2px 8px",borderRadius:3,textTransform:"uppercase",flexShrink:0}}>{u.role}</div>
                  <button onClick={()=>setUsers(p=>p.filter(x=>x.id!==u.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12,flexShrink:0}}>✕</button>
                </div>
              ))}
            </div>

            {/* Role guide */}
            <div style={{marginTop:24,background:"#0c0c14",border:"1px solid #1a1a2a",borderRadius:8,padding:"16px 20px"}}>
              <div style={{fontSize:10,color:"#3a3a6a",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:12}}>Role Permissions</div>
              <table style={{width:"100%",fontSize:11,borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"1px solid #1a1a2a"}}>{["Feature","Owner","Manager","Driver"].map(h=><th key={h} style={{padding:"6px 10px",textAlign:"left",fontSize:9,color:"#555",letterSpacing:"0.1em",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
                <tbody>
                  {[["View all data","✓","✓","Own only"],["Add/Edit records","✓","✓","✗"],["Delete records","✓","✓","✗"],["View P&L / Finance","✓","✓","✗"],["Generate PDF reports","✓","✓","✗"],["Manage users","✓","✗","✗"],["Switch contractor type","✓","✗","✗"]].map(([feat,...perms])=>(
                    <tr key={feat} style={{borderBottom:"1px solid #14141e"}}>
                      <td style={{padding:"7px 10px",color:"#888"}}>{feat}</td>
                      {perms.map((p,i)=><td key={i} style={{padding:"7px 10px",color:p==="✓"?"#22c55e":p==="✗"?"#ef4444":"#f59e0b",fontWeight:700}}>{p}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

  );
}
