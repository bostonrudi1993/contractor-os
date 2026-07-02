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

  // ── Renewal date calculations ──
  const now = new Date();
  const nowMonth = now.getMonth();
  const nowYear = now.getFullYear();

  const mcs150Raw = fmcsaResult?.mcs150Date || null;
  const mcs150DueDate = mcs150Raw ? (() => {
    const d = new Date(mcs150Raw);
    if(isNaN(d.getTime())) return null;
    d.setFullYear(d.getFullYear() + 2);
    return d;
  })() : null;
  const mcs150DueLabel = mcs150DueDate ? mcs150DueDate.toLocaleDateString("en-US",{month:"short",year:"numeric"}) : null;
  const mcs150DueISO  = mcs150DueDate ? mcs150DueDate.toISOString().split("T")[0] : null;

  const ucrYear   = nowMonth >= 9 ? nowYear + 1 : nowYear;
  const ucrDue    = `Dec 31, ${ucrYear}`;
  const ucrDueISO = `${ucrYear}-12-31`;

  let iftaDue, iftaDueISO;
  if(nowMonth <= 2)      { iftaDue = `Apr 30, ${nowYear}`;    iftaDueISO = `${nowYear}-04-30`; }
  else if(nowMonth <= 5) { iftaDue = `Jul 31, ${nowYear}`;    iftaDueISO = `${nowYear}-07-31`; }
  else if(nowMonth <= 8) { iftaDue = `Oct 31, ${nowYear}`;    iftaDueISO = `${nowYear}-10-31`; }
  else                   { iftaDue = `Jan 31, ${nowYear+1}`;  iftaDueISO = `${nowYear+1}-01-31`; }

  // Badge helper — takes ISO date string
  const badge = (isoDate) => {
    if(!isoDate) return {label:"Check Manually", color:"#555", bg:"#111", border:"#222"};
    const days = Math.ceil((new Date(isoDate) - now) / 86400000);
    if(days < 0)   return {label:"Overdue",    color:"#ef4444", bg:"#1a0808", border:"#3a1010"};
    if(days <= 30) return {label:"Urgent",     color:"#ef4444", bg:"#1a0808", border:"#3a1010"};
    if(days <= 90) return {label:"Due Soon",   color:"#f59e0b", bg:"#140f00", border:"#3a2a00"};
    return              {label:"Current",    color:"#22c55e", bg:"#051a05", border:"#1a3a1a"};
  };

  const mcs150Badge = badge(mcs150DueISO);
  const ucrBadge    = badge(ucrDueISO);
  const iftaBadge   = badge(iftaDueISO);

  // Add to compliance tracker
  const addToCompliance = (name, isoDate) => {
    if(!isoDate) return;
    const entry = {
      id: `fmcsa_${name.replace(/[^a-z0-9]/gi,"_")}_${Date.now()}`,
      name: `${name} Renewal`,
      dueDate: isoDate,
      frequency: name === "MCS-150" ? "Biennial" : "Annual",
      notes: `Added from FMCSA lookup — DOT# ${fmcsaResult?.dotNum}`,
      filedDate: "", confirmationNum: "", filedNotes: "",
    };
    setFilings(prev => {
      const idx = prev.findIndex(f => f.name === entry.name);
      if(idx >= 0) return prev.map((f,i) => i === idx ? {...f, dueDate: entry.dueDate} : f);
      return [...prev, entry];
    });
    alert(`${name} added to your Compliance Tracker.`);
  };

  // Safety thresholds
  const NATL_VEH_OOS = 22.26;
  const NATL_DRV_OOS = 6.67;
  const vehOOS = fmcsaResult?.vehicleOosPercent != null ? parseFloat(fmcsaResult.vehicleOosPercent) : NaN;
  const drvOOS = fmcsaResult?.driverOosPercent  != null ? parseFloat(fmcsaResult.driverOosPercent)  : NaN;
  const totalCrashes     = fmcsaResult?.totalCrashes     != null ? parseInt(fmcsaResult.totalCrashes)     : NaN;
  const totalInspections = fmcsaResult?.totalInspections != null ? parseInt(fmcsaResult.totalInspections) : NaN;

  const hasOosData    = !isNaN(vehOOS) || !isNaN(drvOOS);
  const hasCrashData  = !isNaN(totalCrashes);
  const opAuthOk = fmcsaResult?.opStatus?.toLowerCase().includes("authorized") &&
                   !fmcsaResult?.opStatus?.toLowerCase().includes("not authorized");

  // Static calendar rows (used when no fmcsaResult)
  const staticRows = [
    ["MCS-150","Every 2 years from USDOT issuance date","Register/update at fmcsa.dot.gov/registration"],
    ["UCR","Annual — renew by Dec 31 each year","Register at ucr.gov"],
    ["IFTA","Quarterly filings + annual license renewal","File with your base state"],
    ["IRP","Annual renewal","File with your base state DMV"],
    ["Drug Clearinghouse","Annual query per driver","Login at clearinghouse.fmcsa.dot.gov"],
    ["BOC-3","One-time, refile if agent changes","Use a registered process agent"],
    ["Insurance (BMC-91)","Keep current — no lapse","Filed by your insurer to FMCSA"],
  ];

  const badgePill = (b) => (
    <div style={{background:b.bg,border:`1px solid ${b.border}`,borderRadius:3,padding:"2px 8px",fontSize:9,color:b.color,fontWeight:700,whiteSpace:"nowrap"}}>{b.label}</div>
  );
  const trackerBtn = (name, isoDate) => isoDate ? (
    <button onClick={()=>addToCompliance(name,isoDate)} style={{background:"transparent",border:`1px solid ${accent}33`,color:accent,fontSize:8,padding:"2px 8px",borderRadius:3,cursor:"pointer",fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em",whiteSpace:"nowrap",marginTop:4}}>+ Tracker</button>
  ) : null;

  return (
    <div style={{flex:1,overflowY:"auto",padding:24}}>
      <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>

        {/* ── Search box ── */}
        <div style={{...S.section,marginBottom:4}}>FMCSA CARRIER LOOKUP</div>
        <p style={{fontSize:11,color:"#999",marginBottom:20,lineHeight:1.8}}>Enter your USDOT number to pull your carrier profile from the FMCSA SAFER database. Verify your authority status, safety rating, and auto-fill your company name.</p>
        <div style={{...S.card,marginBottom:20,border:`1px solid ${accent}33`}}>
          <label style={S.label}>USDOT Number</label>
          <div style={{display:"flex",gap:10,marginBottom:8}}>
            <input value={fmcsaDot} onChange={e=>setFmcsaDot(e.target.value.replace(/\D/g,""))} onKeyDown={e=>e.key==="Enter"&&lookupDOT()} placeholder="Enter your DOT number (numbers only)" style={{...S.input,flex:1}} maxLength={10}/>
            <button className="hov" onClick={lookupDOT} style={{...S.btn,flexShrink:0}}>{fmcsaLoading?"Looking up...":"Lookup →"}</button>
          </div>
          <div style={{fontSize:10,color:"#888"}}>Your USDOT number is on your operating authority certificate and cab card. Find it at <a href="https://safer.fmcsa.dot.gov" target="_blank" rel="noreferrer" style={{color:accent}}>safer.fmcsa.dot.gov</a></div>
        </div>

        {fmcsaError&&<div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010",color:"#f87171",fontSize:12,marginBottom:16}}>{fmcsaError}</div>}

        {fmcsaLoading&&(
          <div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:32,animation:"fadeUp 0.3s ease"}}>
            <div style={{width:32,height:32,border:"3px solid #1e1e1e",borderTop:`3px solid ${accent}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px"}}/>
            Querying FMCSA SAFER database...
            <div style={{fontSize:10,color:"#888",marginTop:8}}>This may take 5–10 seconds. FMCSA's servers can be slow.</div>
          </div>
        )}

        {!fmcsaLoading&&!fmcsaResult&&!fmcsaError&&(
          <div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>Enter your USDOT number above and click Lookup → to pull your carrier profile from the FMCSA SAFER database.</div>
        )}

        {fmcsaResult&&(
          <>
            {/* ── Carrier header card ── */}
            <div style={{...S.card,border:`1px solid ${accent}33`,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:16}}>
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#e8e4d8"}}>{fmcsaResult.legalName||"Unknown"}</div>
                  {fmcsaResult.dbaName&&<div style={{fontSize:11,color:"#aaa"}}>DBA: {fmcsaResult.dbaName}</div>}
                  {fmcsaResult.dotNum&&<div style={{fontSize:10,color:"#555",marginTop:2}}>USDOT# {fmcsaResult.dotNum}{fmcsaResult.mcNum?` · ${fmcsaResult.mcNum}`:""}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end",flexShrink:0}}>
                  {/* USDOT status */}
                  <div style={{background:(fmcsaResult.usdotStatus||"ACTIVE")==="ACTIVE"?"#051a05":"#1a0808",border:`1px solid ${(fmcsaResult.usdotStatus||"ACTIVE")==="ACTIVE"?"#22c55e44":"#ef444444"}`,borderRadius:5,padding:"5px 12px",textAlign:"center"}}>
                    <div style={{fontSize:11,color:(fmcsaResult.usdotStatus||"ACTIVE")==="ACTIVE"?"#22c55e":"#ef4444",fontWeight:700}}>{fmcsaResult.usdotStatus||"ACTIVE"}</div>
                    <div style={{fontSize:9,color:"#555"}}>USDOT Status</div>
                  </div>
                  {/* Operating authority */}
                  <div style={{background:opAuthOk?"#051a05":"#0f0f0f",border:`1px solid ${opAuthOk?"#22c55e33":"#2a2a2a"}`,borderRadius:5,padding:"5px 12px",textAlign:"center",maxWidth:200}}>
                    <div style={{fontSize:10,color:opAuthOk?"#22c55e":"#888",fontWeight:700,lineHeight:1.2}}>{fmcsaResult.opStatus||"—"}</div>
                    <div style={{fontSize:9,color:"#555"}}>Operating Authority</div>
                    {!opAuthOk&&fmcsaResult.opStatus?.toLowerCase().includes("not authorized")&&(
                      <div style={{fontSize:8,color:"#555",marginTop:2}}>Does not apply to private/intrastate ops</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Key stats */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8,marginBottom:16}}>
                {[
                  ["Power Units",    fmcsaResult.powerUnits],
                  ["Drivers",        fmcsaResult.drivers],
                  ["Safety Rating",  fmcsaResult.safetyRating||"Not Rated"],
                  ["Entity Type",    fmcsaResult.entityType],
                  ["Phone",          fmcsaResult.phone],
                  !isNaN(totalInspections) ? ["Total Inspections", `${totalInspections} (24 mo)`] : null,
                ].filter(row=>row&&row[1]).map(([lbl,val])=>(
                  <div key={lbl} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}>
                    <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{lbl}</div>
                    <div style={{fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#c8c4bc"}}>{val}</div>
                  </div>
                ))}
              </div>

              {fmcsaResult.address&&<div style={{fontSize:11,color:"#aaa",marginBottom:16}}>📍 {fmcsaResult.address}</div>}

              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button className="hov" onClick={applyToSettings} style={{...S.btn,fontSize:11}}>Apply Company Name to Settings</button>
                <a href={`https://safer.fmcsa.dot.gov/query.asp?query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${fmcsaResult.dotNum}`} target="_blank" rel="noreferrer" style={{...S.ghost,textDecoration:"none",fontSize:11,padding:"10px 18px",display:"inline-block"}}>View Full FMCSA Profile ↗</a>
              </div>
            </div>

            {/* ── Safety Snapshot card ── */}
            <div style={{...S.card,marginBottom:16,background:"#0a0f1a",border:"1px solid #1a1a3a"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8",marginBottom:4}}>Safety Snapshot — Last 24 Months</div>
              <div style={{fontSize:10,color:"#555",marginBottom:12}}>OOS % above the national average is a flag for potential audits and interventions.</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10}}>

                {/* Vehicle OOS */}
                <div style={{background:"#0f0f0f",border:`1px solid ${hasOosData&&!isNaN(vehOOS)&&vehOOS>NATL_VEH_OOS?"#ef444433":"#1e1e1e"}`,borderRadius:5,padding:"10px 12px"}}>
                  <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Vehicle OOS %</div>
                  <div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,color:!isNaN(vehOOS)?(vehOOS>NATL_VEH_OOS?"#ef4444":"#22c55e"):"#444"}}>{!isNaN(vehOOS)?`${vehOOS}%`:"—"}</div>
                  <div style={{fontSize:9,color:"#555",marginTop:3}}>
                    Natl avg: {NATL_VEH_OOS}%
                    {!isNaN(vehOOS)&&<span style={{color:vehOOS>NATL_VEH_OOS?"#ef4444":"#22c55e",marginLeft:5}}>{vehOOS>NATL_VEH_OOS?"▲ Above avg":"▼ Below avg"}</span>}
                  </div>
                </div>

                {/* Driver OOS */}
                <div style={{background:"#0f0f0f",border:`1px solid ${hasOosData&&!isNaN(drvOOS)&&drvOOS>NATL_DRV_OOS?"#ef444433":"#1e1e1e"}`,borderRadius:5,padding:"10px 12px"}}>
                  <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Driver OOS %</div>
                  <div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,color:!isNaN(drvOOS)?(drvOOS>NATL_DRV_OOS?"#ef4444":"#22c55e"):"#444"}}>{!isNaN(drvOOS)?`${drvOOS}%`:"—"}</div>
                  <div style={{fontSize:9,color:"#555",marginTop:3}}>
                    Natl avg: {NATL_DRV_OOS}%
                    {!isNaN(drvOOS)&&<span style={{color:drvOOS>NATL_DRV_OOS?"#ef4444":"#22c55e",marginLeft:5}}>{drvOOS>NATL_DRV_OOS?"▲ Above avg":"▼ Below avg"}</span>}
                  </div>
                </div>

                {/* Total crashes */}
                <div style={{background:"#0f0f0f",border:`1px solid ${hasCrashData&&totalCrashes>0?"#ef444433":"#1e1e1e"}`,borderRadius:5,padding:"10px 12px"}}>
                  <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Total Crashes</div>
                  <div style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,color:!isNaN(totalCrashes)?(totalCrashes>0?"#ef4444":"#22c55e"):"#444"}}>{!isNaN(totalCrashes)?totalCrashes:"—"}</div>
                  <div style={{fontSize:9,color:"#555",marginTop:3}}>Last 24 months</div>
                </div>

                {/* Safety rating */}
                <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"10px 12px"}}>
                  <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Safety Rating</div>
                  <div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,lineHeight:1.2,color:
                    fmcsaResult.safetyRating?.toLowerCase().includes("satisfactory")&&!fmcsaResult.safetyRating?.toLowerCase().includes("un")?"#22c55e":
                    fmcsaResult.safetyRating?.toLowerCase().includes("unsatisfactory")?"#ef4444":
                    fmcsaResult.safetyRating?.toLowerCase().includes("conditional")?"#f59e0b":"#888"
                  }}>{fmcsaResult.safetyRating||"Not Rated"}</div>
                  <div style={{fontSize:9,color:"#555",marginTop:3}}>FMCSA assigned</div>
                </div>

              </div>
              {!hasOosData&&!hasCrashData&&(
                <div style={{fontSize:10,color:"#333",marginTop:10,paddingTop:8,borderTop:"1px solid #1a1a2a"}}>OOS % and crash data are available when the FMCSA API key is configured or may not appear in the public SAFER snapshot for this carrier.</div>
              )}
            </div>

            {/* ── Renewal Calendar (with calculated dates) ── */}
            <div style={{...S.card,background:"#0a0f1a",border:"1px solid #1a1a3a"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8",marginBottom:4}}>FMCSA Forms Renewal Calendar</div>
              <div style={{fontSize:10,color:"#555",marginBottom:14}}>Dates calculated from your carrier data. Use "+ Tracker" to add items to Compliance for expiry alerts.</div>
              <div style={{display:"flex",flexDirection:"column"}}>

                {/* MCS-150 */}
                <div style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid #1a1a2a",alignItems:"flex-start"}}>
                  <div style={{width:120,flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:accent,paddingTop:1}}>MCS-150</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:"#c8c4bc"}}>{mcs150DueLabel?`Due: ${mcs150DueLabel}`:"Every 2 years from issuance"}</div>
                    {mcs150Raw&&<div style={{fontSize:9,color:"#555",marginTop:1}}>Last filed: {mcs150Raw}</div>}
                    <div style={{fontSize:9,color:"#888",marginTop:1}}>Register/update at fmcsa.dot.gov/registration</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",flexShrink:0,gap:4}}>
                    {badgePill(mcs150Badge)}
                    {trackerBtn("MCS-150", mcs150DueISO)}
                  </div>
                </div>

                {/* UCR */}
                <div style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid #1a1a2a",alignItems:"flex-start"}}>
                  <div style={{width:120,flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:accent,paddingTop:1}}>UCR</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:"#c8c4bc"}}>Due: {ucrDue}</div>
                    <div style={{fontSize:9,color:"#888",marginTop:1}}>Register at ucr.gov · Annual</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",flexShrink:0,gap:4}}>
                    {badgePill(ucrBadge)}
                    {trackerBtn("UCR", ucrDueISO)}
                  </div>
                </div>

                {/* IFTA */}
                <div style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid #1a1a2a",alignItems:"flex-start"}}>
                  <div style={{width:120,flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:accent,paddingTop:1}}>IFTA</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:"#c8c4bc"}}>Next filing due: {iftaDue}</div>
                    <div style={{fontSize:9,color:"#888",marginTop:1}}>Quarterly filings + annual license · File with your base state</div>
                  </div>
                  <div style={{flexShrink:0}}>{badgePill(iftaBadge)}</div>
                </div>

                {/* IRP */}
                <div style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid #1a1a2a",alignItems:"flex-start"}}>
                  <div style={{width:120,flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:accent,paddingTop:1}}>IRP</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:"#c8c4bc"}}>Annual — check your base state DMV for your renewal month</div>
                    <div style={{fontSize:9,color:"#888",marginTop:1}}>Cannot be determined from FMCSA data</div>
                  </div>
                  <div style={{flexShrink:0}}>{badgePill(badge(null))}</div>
                </div>

                {/* Drug Clearinghouse */}
                <div style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid #1a1a2a",alignItems:"flex-start"}}>
                  <div style={{width:120,flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:accent,lineHeight:1.2,paddingTop:1}}>Drug Clearinghouse</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:"#c8c4bc"}}>
                      {fmcsaResult.drivers&&parseInt(fmcsaResult.drivers)>0
                        ?`Annual query required for each of your ${fmcsaResult.drivers} drivers`
                        :"Annual query per driver"}
                    </div>
                    <div style={{fontSize:9,color:"#888",marginTop:1}}>Login at clearinghouse.fmcsa.dot.gov</div>
                  </div>
                  <div style={{flexShrink:0}}>{badgePill(badge(null))}</div>
                </div>

                {/* BOC-3 */}
                <div style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid #1a1a2a",alignItems:"flex-start"}}>
                  <div style={{width:120,flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:accent,paddingTop:1}}>BOC-3</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:"#c8c4bc"}}>One-time filing — refile only if process agent changes</div>
                    <div style={{fontSize:9,color:"#888",marginTop:1}}>Use a registered process agent</div>
                  </div>
                  <div style={{flexShrink:0}}>{badgePill(badge(null))}</div>
                </div>

                {/* Insurance BMC-91 */}
                <div style={{display:"flex",gap:12,padding:"10px 0",alignItems:"flex-start"}}>
                  <div style={{width:120,flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:accent,lineHeight:1.2,paddingTop:1}}>Insurance (BMC-91)</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:"#c8c4bc"}}>Keep current — no lapse allowed</div>
                    <div style={{fontSize:9,color:"#888",marginTop:1}}>Filed by your insurer directly to FMCSA</div>
                  </div>
                  <div style={{flexShrink:0}}>{badgePill(badge(null))}</div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* Static calendar shown before any lookup */}
        {!fmcsaResult&&!fmcsaLoading&&(
          <div style={{...S.card,marginTop:20,background:"#0a0f1a",border:"1px solid #1a1a3a"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>FMCSA Forms Renewal Calendar</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {staticRows.map(([form,freq,notes])=>(
                <div key={form} style={{display:"flex",gap:14,padding:"8px 0",borderBottom:"1px solid #1a1a2a"}}>
                  <div style={{width:120,flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:accent}}>{form}</div>
                  <div style={{flex:1}}><div style={{fontSize:11,color:"#c8c4bc"}}>{freq}</div><div style={{fontSize:10,color:"#888"}}>{notes}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
