// FmcsaLookup screen
export default function FmcsaLookup(p) {
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
          <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
            <div style={{...S.section,marginBottom:4}}>FMCSA CARRIER LOOKUP</div>
            <p style={{fontSize:11,color:"#555",marginBottom:20,lineHeight:1.8}}>Enter your USDOT number to pull your carrier profile from the FMCSA SAFER database. Verify your authority status, safety rating, and auto-fill your company name.</p>
            <div style={{...S.card,marginBottom:20,border:`1px solid ${accent}33`}}>
              <label style={S.label}>USDOT Number</label>
              <div style={{display:"flex",gap:10,marginBottom:8}}>
                <input value={fmcsaDot} onChange={e=>setFmcsaDot(e.target.value.replace(/\D/g,""))} onKeyDown={e=>e.key==="Enter"&&lookupDOT()} placeholder="Enter your DOT number (numbers only)" style={{...S.input,flex:1}} maxLength={10}/>
                <button className="hov" onClick={lookupDOT} style={{...S.btn,flexShrink:0}}>{fmcsaLoading?"Looking up...":"Lookup →"}</button>
              </div>
              <div style={{fontSize:10,color:"#444"}}>Your USDOT number is on your operating authority certificate and cab card. Find it at <a href="https://safer.fmcsa.dot.gov" target="_blank" rel="noreferrer" style={{color:accent}}>safer.fmcsa.dot.gov</a></div>
            </div>
            {fmcsaError&&<div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010",color:"#f87171",fontSize:12,marginBottom:16}}>{fmcsaError}</div>}
            {fmcsaLoading&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:32,animation:"fadeUp 0.3s ease"}}>
              <div style={{width:32,height:32,border:"3px solid #1e1e1e",borderTop:`3px solid ${accent}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px"}}/>
              Querying FMCSA SAFER database...
              <div style={{fontSize:10,color:"#444",marginTop:8}}>This may take 5–10 seconds. FMCSA's servers can be slow.</div>
            </div>}
            {!fmcsaLoading&&!fmcsaResult&&!fmcsaError&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>Enter your USDOT number above and click Lookup → to pull your carrier profile from the FMCSA SAFER database.</div>}
            {fmcsaResult&&(
              <div style={{...S.card,border:`1px solid ${accent}33`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#e8e4d8"}}>{fmcsaResult.legalName||"Unknown"}</div>
                    {fmcsaResult.dbaName&&<div style={{fontSize:11,color:"#666"}}>DBA: {fmcsaResult.dbaName}</div>}
                  </div>
                  <div style={{background:fmcsaResult.opStatus?.toLowerCase().includes("authorized")?"#051a05":"#1a0808",border:`1px solid ${fmcsaResult.opStatus?.toLowerCase().includes("authorized")?"#22c55e44":"#ef444444"}`,borderRadius:6,padding:"6px 14px",textAlign:"center",flexShrink:0}}>
                    <div style={{fontSize:11,color:fmcsaResult.opStatus?.toLowerCase().includes("authorized")?"#22c55e":"#ef4444",fontWeight:700}}>{fmcsaResult.opStatus||"Unknown"}</div>
                    <div style={{fontSize:9,color:"#555"}}>Operating Status</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10,marginBottom:16}}>
                  {[["USDOT #",fmcsaResult.dotNum],["MC/Docket #",fmcsaResult.mcNum||"—"],["Safety Rating",fmcsaResult.safetyRating||"Not Rated"],["Power Units",fmcsaResult.powerUnits||"—"],["Drivers",fmcsaResult.drivers||"—"],["Phone",fmcsaResult.phone||"—"]].map(([lbl,val])=>val&&(
                    <div key={lbl} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}>
                      <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{lbl}</div>
                      <div style={{fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#c8c4bc"}}>{val}</div>
                    </div>
                  ))}
                </div>
                {fmcsaResult.address&&<div style={{fontSize:11,color:"#666",marginBottom:16}}>📍 {fmcsaResult.address}</div>}
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="hov" onClick={applyToSettings} style={{...S.btn,fontSize:11}}>Apply Company Name to Settings</button>
                  <a href={`https://safer.fmcsa.dot.gov/query.asp?query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${fmcsaResult.dotNum}`} target="_blank" rel="noreferrer" style={{...S.ghost,textDecoration:"none",fontSize:11,padding:"10px 18px",display:"inline-block"}}>View Full FMCSA Profile ↗</a>
                </div>
              </div>
            )}
            <div style={{...S.card,marginTop:20,background:"#0a0f1a",border:"1px solid #1a1a3a"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>FMCSA Forms Renewal Calendar</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[["MCS-150","Every 2 years from USDOT issuance date","Register/update at fmcsa.dot.gov/registration"],["UCR","Annual — renew by Dec 31 each year","Register at ucr.gov"],["IFTA","Quarterly filings + annual license renewal","File with your base state"],["IRP","Annual renewal","File with your base state DMV"],["Drug Clearinghouse","Annual query per driver","Login at clearinghouse.fmcsa.dot.gov"],["BOC-3","One-time, refile if agent changes","Use a registered process agent"],["Insurance (BMC-91)","Keep current — no lapse","Filed by your insurer to FMCSA"]].map(([form,freq,notes])=>(
                  <div key={form} style={{display:"flex",gap:14,padding:"8px 0",borderBottom:"1px solid #1a1a2a"}}>
                    <div style={{width:120,flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:accent}}>{form}</div>
                    <div style={{flex:1}}><div style={{fontSize:11,color:"#c8c4bc"}}>{freq}</div><div style={{fontSize:10,color:"#444"}}>{notes}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
  );
}
