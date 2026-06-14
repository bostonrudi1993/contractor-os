// Claims screen
export default function Claims(p) {
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
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:"#e8e4d8",marginBottom:16}}>📋 Damage Claims</div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {[["open","Open Claims"],["history","History"]].map(([t,l])=>(
              <button key={t} className="hov" onClick={()=>setClaimsTab(t)} style={{...S.btn,background:claimsTab===t?accent:"#1e1e1e",color:claimsTab===t?"#000":"#888"}}>{l}</button>
            ))}
            <button className="hov" onClick={()=>setShowAddClaim(p=>!p)} style={S.btn}>+ Add Claim</button>
          </div>
          {showAddClaim&&<div style={{...S.card,marginBottom:16}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>New Damage Claim</div>
            <input type="date" value={claimForm.date} onChange={e=>setClaimForm(p=>({...p,date:e.target.value}))} style={{...S.input,marginBottom:8}}/>
            <select value={claimForm.driverId} onChange={e=>setClaimForm(p=>({...p,driverId:e.target.value}))} style={{...S.input,marginBottom:8}}>
              <option value="">Select Driver</option>
              {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input placeholder="Customer Address" value={claimForm.customerAddress} onChange={e=>setClaimForm(p=>({...p,customerAddress:e.target.value}))} style={{...S.input,marginBottom:8}}/>
            <select value={claimForm.deliveryType} onChange={e=>setClaimForm(p=>({...p,deliveryType:e.target.value}))} style={{...S.input,marginBottom:8}}>
              {["Appliance","Furniture","Building Materials","Other"].map(t=><option key={t}>{t}</option>)}
            </select>
            <input placeholder="Item Description" value={claimForm.itemDescription} onChange={e=>setClaimForm(p=>({...p,itemDescription:e.target.value}))} style={{...S.input,marginBottom:8}}/>
            <input placeholder="Damage Description" value={claimForm.damageDescription} onChange={e=>setClaimForm(p=>({...p,damageDescription:e.target.value}))} style={{...S.input,marginBottom:8}}/>
            <input placeholder="Estimated Value ($)" type="number" value={claimForm.estimatedValue} onChange={e=>setClaimForm(p=>({...p,estimatedValue:e.target.value}))} style={{...S.input,marginBottom:8}}/>
            <input placeholder="Notes" value={claimForm.notes} onChange={e=>setClaimForm(p=>({...p,notes:e.target.value}))} style={{...S.input,marginBottom:8}}/>
            <button className="hov" onClick={()=>{
              const drv=drivers.find(d=>d.id===claimForm.driverId);
              setDamageClaims(p=>[{id:Date.now(),driverName:drv?.name||"",claimStatus:"Open",...claimForm},...p]);
              setClaimForm({date:new Date().toISOString().slice(0,10),driverId:"",customerAddress:"",deliveryType:"Appliance",itemDescription:"",damageDescription:"",estimatedValue:"",claimStatus:"Open",claimAmount:"",resolution:"",notes:""});
              setShowAddClaim(false);
            }} style={S.btn}>Save Claim</button>
          </div>}
          {claimsTab==="open"&&<>
            <div style={{...S.card,marginBottom:12}}>
              <div style={{fontSize:11,color:"#888"}}>Total Open Claim Value</div>
              <div style={{fontSize:28,fontWeight:700,color:"#ef4444"}}>${damageClaims.filter(c=>c.claimStatus==="Open").reduce((s,c)=>s+parseFloat(c.estimatedValue||0),0).toFixed(0)}</div>
            </div>
            {damageClaims.filter(c=>c.claimStatus==="Open").length===0&&<div style={{color:"#555",fontSize:12}}>No open claims.</div>}
            {damageClaims.filter(c=>c.claimStatus==="Open").map(c=>{
              const daysOpen=Math.floor((Date.now()-new Date(c.date).getTime())/(1000*60*60*24));
              return <div key={c.id} style={{...S.card,marginBottom:8,border:daysOpen>=14?"1px solid #f59e0b55":""}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"#e8e4d8"}}>{c.itemDescription||"Unnamed Item"}</div>
                    <div style={{fontSize:11,color:"#888"}}>{c.driverName} · {c.deliveryType} · {c.customerAddress}</div>
                    <div style={{fontSize:11,color:"#888"}}>{c.damageDescription}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:18,fontWeight:700,color:"#ef4444"}}>${parseFloat(c.estimatedValue||0).toFixed(0)}</div>
                    <div style={{fontSize:10,color:daysOpen>=14?"#f59e0b":"#555"}}>{daysOpen}d open{daysOpen>=14?" ⚠":""}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  {["Submitted","Resolved","Denied"].map(s=><button key={s} className="hov" onClick={()=>setDamageClaims(p=>p.map(x=>x.id===c.id?{...x,claimStatus:s}:x))} style={{fontSize:10,padding:"3px 8px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer"}}>{s}</button>)}
                  <button className="hov" onClick={()=>setDamageClaims(p=>p.filter(x=>x.id!==c.id))} style={{fontSize:10,padding:"3px 8px",borderRadius:3,border:"1px solid #ef444444",background:"transparent",color:"#ef4444",cursor:"pointer"}}>Delete</button>
                </div>
              </div>;
            })}
          </>}
          {claimsTab==="history"&&<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:16}}>
              <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Total Claims YTD</div><div style={{fontSize:24,fontWeight:700,color:accent}}>{damageClaims.length}</div></div>
              <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Resolved</div><div style={{fontSize:24,fontWeight:700,color:"#22c55e"}}>{damageClaims.filter(c=>c.claimStatus==="Resolved").length}</div></div>
              <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Denied</div><div style={{fontSize:24,fontWeight:700,color:"#ef4444"}}>{damageClaims.filter(c=>c.claimStatus==="Denied").length}</div></div>
            </div>
            {damageClaims.filter(c=>c.claimStatus!=="Open").map(c=>(
              <div key={c.id} style={{...S.card,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div><div style={{fontSize:13,color:"#e8e4d8"}}>{c.itemDescription}</div><div style={{fontSize:11,color:"#888"}}>{c.driverName} · {c.date}</div></div>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:3,background:c.claimStatus==="Resolved"?"#22c55e33":"#ef444433",color:c.claimStatus==="Resolved"?"#22c55e":"#ef4444"}}>{c.claimStatus}</span>
                </div>
              </div>
            ))}
          </>}
        </div>
      </div>
  );
}
