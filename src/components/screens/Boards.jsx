// Boards screen
export default function Boards(p) {
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
          <div style={{maxWidth:860,margin:"0 auto"}}>
            <div style={{...S.section,marginBottom:4}}>LOAD BOARD HUB</div>
            <p style={{fontSize:11,color:"#555",marginBottom:24,lineHeight:1.8}}>Open any board, find a load, copy the details, then come back and <span style={{color:accent,cursor:"pointer"}} onClick={()=>setScreen("analyze")}>paste into Analyze Load</span>.</p>
            <div style={{background:"#0c120c",border:"1px solid #1a2a1a",borderRadius:8,padding:"18px 22px",marginBottom:28}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#4ade80",marginBottom:12}}>📋 WHAT TO COPY</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                {[["✓ Origin & destination","City, ST"],["✓ Total miles","Loaded miles"],["✓ Offered rate","Flat or per mile"],["✓ Deadhead miles","Distance to pickup"],["✓ Commodity & weight","What you're hauling"],["✓ Broker name & ref #","For counter-offer script"]].map(([f,h],i)=>(
                  <div key={i} style={{padding:"6px 10px",borderTop:i>=2?"1px solid #0f1f0f":"none",display:"flex",gap:10}}><span style={{fontSize:11,color:"#4ade80"}}>{f}</span><span style={{fontSize:10,color:"#2d4a2d"}}>{h}</span></div>
                ))}
              </div>
            </div>
            {[
              {label:"Major Boards",items:[{name:"DAT One",url:"https://dat.com",desc:"Largest North American load board.",tag:"Most Popular",color:"#f59e0b"},{name:"Truckstop.com",url:"https://truckstop.com",desc:"Strong broker network, rate tools.",tag:"High Volume",color:"#60a5fa"},{name:"123Loadboard",url:"https://www.123loadboard.com",desc:"Budget-friendly alternative.",tag:"Budget",color:"#4ade80"}]},
              {label:"Box Truck Friendly",items:[{name:"Amazon Relay",url:"https://relay.amazon.com",desc:"Direct from Amazon. No broker fees.",tag:"Box Truck ✓",color:"#f59e0b",free:true},{name:"Uber Freight",url:"https://www.uberfreight.com",desc:"Instant rates, transparent pricing.",tag:"Instant Book",color:"#a78bfa",free:true},{name:"GoShip",url:"https://www.goship.com",desc:"Shipper-direct LTL and FTL.",tag:"Shipper Direct",color:"#60a5fa",free:true}]},
            ].map(cat=>(
              <div key={cat.label} style={{marginBottom:24}}>
                <div style={{fontSize:10,color:"#444",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:10}}>{cat.label}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
                  {cat.items.map(b=>(
                    <div key={b.name} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:8,padding:"16px 18px",display:"flex",flexDirection:"column",gap:8}} className="cardhov">
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8"}}>{b.name}</div>
                        <div style={{display:"flex",gap:4}}>{b.free&&<span style={{fontSize:8,padding:"2px 5px",background:"#052e16",color:"#4ade80",border:"1px solid #166534",borderRadius:2}}>FREE</span>}<span style={{fontSize:8,padding:"2px 5px",background:b.color+"18",color:b.color,border:`1px solid ${b.color}33`,borderRadius:2}}>{b.tag}</span></div>
                      </div>
                      <div style={{fontSize:11,color:"#555",flex:1}}>{b.desc}</div>
                      <a href={b.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",justifyContent:"space-between",background:"#0a0a0a",border:"1px solid #1e1e1e",borderRadius:4,padding:"7px 12px",fontSize:11,color:accent,textDecoration:"none",fontFamily:"'DM Mono',monospace"}}><span>Open →</span><span style={{fontSize:9,color:"#333"}}>new tab</span></a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

  );
}
