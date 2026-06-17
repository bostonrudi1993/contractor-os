// Reports screen
export default function Reports(p) {
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
    showAlertSetup, setShowAlertSetup, alertPhone, setAlertPhone, alertEmail, setAlertEmail,
    confirmAlertSetup, sendTestNotif, notifPermission,
    openEdit, saveEdit, closeModal, generatePDF, generateNotifications, canEdit, isOwner,
    analyzeLoad, parseLoad, analyzeRoute, askDot, lookupDOT, applyToSettings,
    importExcelPL, confirmExcelImport, showValidation,
    urgentItems, SubNav, Stat, ExpiryBadge, Loader, fmt$, fmtDate, daysUntil,
    statusColor, statusLabel, gradeColor, MODAL_CONFIGS,
  } = p;
  return (
        <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <div style={{...S.section,marginBottom:4}}>REPORTS</div>
            <p style={{fontSize:11,color:"#555",marginBottom:28,lineHeight:1.8}}>Generate professional PDF reports. Opens in a new tab — use your browser's print dialog to save as PDF or print.</p>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16,marginBottom:28}}>
              {[
                {
                  icon:"🛡️",title:"Compliance Report",desc:"Full compliance status — vehicle files, driver files, upcoming expirations, federal deadlines. Perfect for DOT audit prep.",color:"#ef4444",
                  stats:`${compliance.trucks.length} vehicles · ${compliance.drivers.length} drivers · ${generateNotifications().filter(n=>n.severity==="urgent").length} urgent items`,
                  action:()=>generatePDF("compliance")
                },
                {
                  icon:"👥",title:"Driver File Summary",desc:"Complete driver roster with compliance status, pay info, incident history, and tenure. Useful for HR audits and insurance reviews.",color:"#60a5fa",
                  stats:`${drivers.length} drivers · ${incidents.length} total incidents`,
                  action:()=>generatePDF("drivers")
                },
                {
                  icon:"💰",title:"Profit & Loss Report",desc:"Full P&L with revenue detail, expenses by category, and net profit. Ready to hand to your accountant or lender.",color:"#22c55e",
                  stats:`${fmt$(revenue.reduce((s,r)=>s+parseFloat(r.amount||0),0))} revenue · ${fmt$(expenses.reduce((s,e)=>s+parseFloat(e.amount||0),0))} expenses`,
                  action:()=>generatePDF("pl")
                },
              ].map(r=>(
                <div key={r.title} style={{...S.card,display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{fontSize:32}}>{r.icon}</div>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:4}}>{r.title}</div>
                    <div style={{fontSize:11,color:"#555",lineHeight:1.7,marginBottom:8}}>{r.desc}</div>
                    <div style={{fontSize:10,color:r.color,marginBottom:12}}>{r.stats}</div>
                  </div>
                  <button className="hov" onClick={r.action} style={{...S.btn,background:r.color,marginTop:"auto"}}>Generate PDF →</button>
                </div>
              ))}
            </div>

            {/* Alert setup modal */}
            {showAlertSetup&&(
              <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20}} onClick={()=>setShowAlertSetup(false)}>
                <div style={{background:"#141414",border:`1px solid ${accent}44`,borderRadius:10,padding:"28px 32px",maxWidth:440,width:"100%",animation:"fadeUp 0.2s ease"}} onClick={e=>e.stopPropagation()}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#e8e4d8",marginBottom:4}}>Set Up Compliance Alerts</div>
                  <div style={{fontSize:11,color:"#555",marginBottom:20,lineHeight:1.8}}>Enter your contact info to receive compliance deadline reminders. Browser push notifications will also be enabled.</div>
                  <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
                    <div>
                      <label style={S.label}>Phone Number (SMS reminders)</label>
                      <input value={alertPhone} onChange={e=>setAlertPhone(e.target.value)} placeholder="(864) 555-0100" style={S.input} type="tel"/>
                      <div style={{fontSize:9,color:"#444",marginTop:4}}>Saved for your records. Automated SMS requires Twilio integration — can be added in a future update.</div>
                    </div>
                    <div>
                      <label style={S.label}>Email for Alert Summaries</label>
                      <input value={alertEmail} onChange={e=>setAlertEmail(e.target.value)} placeholder="your@email.com" style={S.input} type="email"/>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button className="hov" onClick={confirmAlertSetup} style={S.btn}>Save & Enable →</button>
                    <button onClick={()=>setShowAlertSetup(false)} style={{...S.ghost,fontSize:11}}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            {/* Notifications section */}
            <div style={{...S.card,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:2}}>Push Notifications</div>
                  <div style={{fontSize:11,color:"#555"}}>Get alerts on your phone before compliance items expire</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  {notifPermission!=="granted"&&<button className="hov" onClick={()=>setShowAlertSetup(true)} style={S.btn}>Enable Alerts</button>}
                  {notifPermission==="granted"&&<button onClick={()=>setShowAlertSetup(true)} style={{...S.ghost,fontSize:10}}>Edit Contact</button>}{notifPermission==="granted"&&<button className="hov" onClick={sendTestNotif} style={{...S.btn,background:"#22c55e"}}>Send Test</button>}
                </div>
              </div>
              {notifPermission==="granted"&&(
                  <div>
                    <div style={{fontSize:11,color:"#22c55e",marginBottom:6}}>✓ Push notifications enabled</div>
                    {alertPhone&&<div style={{fontSize:10,color:"#555",marginBottom:3}}>📱 {alertPhone}</div>}
                    {alertEmail&&<div style={{fontSize:10,color:"#555",marginBottom:10}}>✉ {alertEmail}</div>}
                    {alertEmail&&urgentItems.length>0&&(
                      <button onClick={async()=>{
                        try {
                          const res = await fetch("/api/send-reminder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({alertEmail,companyName:settings.companyName||"Your Fleet",urgentItems:urgentItems.slice(0,10).map(i=>({label:i.label,days:i.days}))})});
                          const data = await res.json();
                          if(data.success) alert("✓ Compliance reminder sent to "+alertEmail);
                          else alert("Email failed: "+(data.error||"Unknown error"));
                        } catch(e) { alert("Could not send email — check your internet connection"); }
                      }} style={{...S.btn,fontSize:10,padding:"6px 14px",background:"#22c55e"}}>
                        Send Email Alert Now ({urgentItems.length} items)
                      </button>
                    )}
                    {alertEmail&&urgentItems.length===0&&<div style={{fontSize:10,color:"#22c55e"}}>✓ No urgent items — nothing to alert about right now</div>}
                  </div>
                )}
              {notifPermission==="denied"&&<div style={{fontSize:11,color:"#ef4444"}}>Notifications blocked. Go to browser settings → Site Settings → Notifications to re-enable.</div>}
              {notifPermission==="default"&&<div style={{fontSize:11,color:"#555"}}>Click "Enable Alerts" to receive push notifications for compliance deadlines, incidents, and contract renewals.</div>}
            </div>

            {/* Active alerts */}
            {(()=>{
              const notifs = generateNotifications();
              return notifs.length>0?(
                <div>
                  <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:10}}>Current Alerts ({notifs.length})</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {notifs.slice(0,10).map(n=>(
                      <div key={n.id} style={{...S.card,display:"flex",alignItems:"center",gap:14,borderLeft:`3px solid ${n.severity==="urgent"?"#ef4444":"#f59e0b"}`,background:n.severity==="urgent"?"#1a0808":"#120e00"}}>
                        <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{n.title}</div><div style={{fontSize:10,color:"#555"}}>{n.body}</div></div>
                        <div style={{fontSize:11,color:n.severity==="urgent"?"#ef4444":"#f59e0b",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,flexShrink:0}}>{n.severity==="urgent"?"🔴 URGENT":"🟡 SOON"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ):(<div style={{...S.card,textAlign:"center",color:"#22c55e",fontSize:12,padding:24}}>✓ No active compliance alerts — everything looks good!</div>);
            })()}
          </div>
        </div>

  );
}
