// Contracts screen
export default function Contracts(p) {
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
          {segment==="usps"&&<SubNav tabs={[["contracts","Contracts"],["bidtracker","Bid Tracker"]]} active={contractsSubTab} onSelect={setContractsSubTab}/>}
          <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
          {/* ── D8: Bid Tracker ── */}
          {contractsSubTab==="bidtracker"&&segment==="usps"&&(
            <div style={{maxWidth:800,margin:"0 auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8"}}>HCR Bid Tracker</div>
                <button className="hov" onClick={()=>setBidsTab(bidsTab==="active"?"history":"active")} style={{...S.btn,fontSize:11}}>{bidsTab==="active"?"View History":"Active Bids"}</button>
              </div>
              <button className="hov" onClick={()=>setShowBidAdd(p=>!p)} style={{...S.btn,marginBottom:12}}>+ Add Bid</button>
              {showBidAdd&&<div style={{...S.card,marginBottom:16}}>
                <input placeholder="Route Description" value={bidForm.routeDescription} onChange={e=>setBidForm(p=>({...p,routeDescription:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <input type="date" placeholder="Submitted Date" value={bidForm.bidSubmittedDate} onChange={e=>setBidForm(p=>({...p,bidSubmittedDate:e.target.value}))} style={S.input}/>
                  <input placeholder="Bid Amount $" type="number" value={bidForm.bidAmount} onChange={e=>setBidForm(p=>({...p,bidAmount:e.target.value}))} style={S.input}/>
                  <input placeholder="Est. Miles/Year" type="number" value={bidForm.estimatedMilesPerYear} onChange={e=>setBidForm(p=>({...p,estimatedMilesPerYear:e.target.value}))} style={S.input}/>
                  <input placeholder="Est. Fuel Cost $" type="number" value={bidForm.estimatedFuelCost} onChange={e=>setBidForm(p=>({...p,estimatedFuelCost:e.target.value}))} style={S.input}/>
                  <input placeholder="Est. Labor Cost $" type="number" value={bidForm.estimatedLaborCost} onChange={e=>setBidForm(p=>({...p,estimatedLaborCost:e.target.value}))} style={S.input}/>
                  <input placeholder="Est. Vehicle Cost $" type="number" value={bidForm.estimatedVehicleCost} onChange={e=>setBidForm(p=>({...p,estimatedVehicleCost:e.target.value}))} style={S.input}/>
                </div>
                <select value={bidForm.awardStatus} onChange={e=>setBidForm(p=>({...p,awardStatus:e.target.value}))} style={{...S.input,marginBottom:8}}>
                  <option>Pending</option><option>Awarded</option><option>Not Awarded</option>
                </select>
                <textarea placeholder="Notes" value={bidForm.notes} onChange={e=>setBidForm(p=>({...p,notes:e.target.value}))} style={{...S.input,marginBottom:8,minHeight:60}}/>
                <button className="hov" onClick={()=>{
                  const totalCost=(parseFloat(bidForm.estimatedFuelCost||0)+parseFloat(bidForm.estimatedLaborCost||0)+parseFloat(bidForm.estimatedVehicleCost||0));
                  const netAnnual=parseFloat(bidForm.bidAmount||0)-totalCost;
                  setBidTracker(p=>[{id:Date.now(),estimatedTotalCost:totalCost,estimatedNetAnnual:netAnnual,...bidForm},...p]);
                  setBidForm({routeId:"",routeDescription:"",bidSubmittedDate:"",bidAmount:"",estimatedMilesPerYear:"",estimatedFuelCost:"",estimatedLaborCost:"",estimatedVehicleCost:"",estimatedTotalCost:"",estimatedNetAnnual:"",awardStatus:"Pending",awardDate:"",actualCostAfter30Days:"",actualCostAfter60Days:"",lessonLearned:"",notes:""});
                  setShowBidAdd(false);
                }} style={S.btn}>Save Bid</button>
              </div>}
              {bidsTab==="active"&&<>
                {bidTracker.filter(b=>b.awardStatus==="Pending").length===0&&<div style={{color:"#999",fontSize:12}}>No pending bids.</div>}
                {bidTracker.filter(b=>b.awardStatus==="Pending").map(b=>{
                  const daysSince=b.bidSubmittedDate?Math.floor((Date.now()-new Date(b.bidSubmittedDate).getTime())/(1000*60*60*24)):0;
                  return <div key={b.id} style={{...S.card,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"#e8e4d8"}}>{b.routeDescription}</div>
                        <div style={{fontSize:11,color:"#888"}}>Submitted: {b.bidSubmittedDate||"—"} · {daysSince}d ago</div>
                        <div style={{fontSize:12,color:parseFloat(b.estimatedNetAnnual||0)>0?"#22c55e":"#ef4444"}}>Est. Net/Year: ${parseFloat(b.estimatedNetAnnual||0).toFixed(0)}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:16,fontWeight:700,color:accent}}>${parseFloat(b.bidAmount||0).toFixed(0)}</div>
                        <div style={{display:"flex",gap:4,marginTop:4}}>
                          {["Awarded","Not Awarded"].map(s=><button key={s} className="hov" onClick={()=>setBidTracker(p=>p.map(x=>x.id===b.id?{...x,awardStatus:s,awardDate:new Date().toISOString().slice(0,10)}:x))} style={{fontSize:9,padding:"2px 6px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer"}}>{s}</button>)}
                        </div>
                      </div>
                    </div>
                  </div>;
                })}
              </>}
              {bidsTab==="history"&&<>
                {bidTracker.filter(b=>b.awardStatus!=="Pending").length===0&&<div style={{color:"#999",fontSize:12}}>No completed bids yet.</div>}
                {bidTracker.filter(b=>b.awardStatus!=="Pending").map(b=>(
                  <div key={b.id} style={{...S.card,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div><div style={{fontSize:13,color:"#e8e4d8"}}>{b.routeDescription}</div><div style={{fontSize:11,color:"#888"}}>{b.bidSubmittedDate}</div></div>
                      <span style={{fontSize:11,padding:"2px 8px",borderRadius:3,background:b.awardStatus==="Awarded"?"#22c55e33":"#ef444433",color:b.awardStatus==="Awarded"?"#22c55e":"#ef4444"}}>{b.awardStatus}</span>
                    </div>
                  </div>
                ))}
              </>}
            </div>
          )}
          {(contractsSubTab==="contracts"||segment!=="usps")&&<div style={{maxWidth:800,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <div style={S.section}>CONTRACT TRACKER</div>
                <div style={{fontSize:11,color:"#999",marginTop:4}}>Track renewal dates, performance requirements, and contract value.</div>
              </div>
              <button className="hov" onClick={()=>setShowAddContract(!showAddContract)} style={{...S.btn,background:"#8888cc"}}>{showAddContract?"Cancel":"+ Add Contract"}</button>
            </div>
            {showAddContract&&(
              <div style={{...S.card,marginBottom:18}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Contract Name *</label><input value={contractForm.name} onChange={e=>setContractForm(p=>({...p,name:e.target.value}))} placeholder={seg.id==="fedex"?"FedEx ISP Agreement":seg.id==="amazon"?"DSP Operating Agreement":seg.id==="usps"?"HCR Contract":"Contract name"} style={S.input}/></div>
                  <div><label style={S.label}>Company / Client</label><input value={contractForm.company} onChange={e=>setContractForm(p=>({...p,company:e.target.value}))} placeholder="FedEx Ground, Amazon, etc." style={S.input}/></div>
                  <div><label style={S.label}>Start Date</label><input type="date" value={contractForm.startDate} onChange={e=>setContractForm(p=>({...p,startDate:e.target.value}))} style={S.input}/></div>
                  <div><label style={S.label}>Renewal / Expiry Date</label><input type="date" value={contractForm.renewalDate} onChange={e=>setContractForm(p=>({...p,renewalDate:e.target.value}))} style={S.input}/></div>
                  <div><label style={S.label}>Annual Contract Value ($)</label><input type="number" value={contractForm.value} onChange={e=>setContractForm(p=>({...p,value:e.target.value}))} placeholder="500000" style={S.input}/></div>
                  <div><label style={S.label}>Status</label>
                    <select value={contractForm.status} onChange={e=>setContractForm(p=>({...p,status:e.target.value}))} style={S.input}>
                      <option value="active">Active</option><option value="up_for_renewal">Up for Renewal</option><option value="in_negotiation">In Negotiation</option><option value="expired">Expired</option>
                    </select>
                  </div>
                  <div style={{gridColumn:"1/-1"}}><label style={S.label}>Key Notes / Performance Requirements</label><textarea value={contractForm.notes} onChange={e=>setContractForm(p=>({...p,notes:e.target.value}))} placeholder="Performance metrics, compliance requirements, escalation contacts..." style={{...S.input,height:80,resize:"vertical"}}/></div>
                </div>
                <button className="hov" onClick={()=>{ if(!contractForm.name){showValidation("Contract name is required");return;} setContracts(p=>[...p,{...contractForm,id:Date.now()}]); setContractForm({name:"",company:"",startDate:"",renewalDate:"",value:"",status:"active",notes:""}); setShowAddContract(false); }} style={{...S.btn,background:"#8888cc",marginTop:14}}>Save Contract</button>
              </div>
            )}
            {contracts.length===0&&!showAddContract&&(
              <div style={{...S.card,textAlign:"center",padding:40}}>
                <div style={{fontSize:13,color:"#999",marginBottom:8}}>No contracts tracked yet.</div>
                <div style={{fontSize:11,color:"#888",lineHeight:1.7}}>
                  {seg.id==="fedex"?"Your FedEx ISP agreement is your most valuable asset. Add it here to track renewal dates and performance requirements.":seg.id==="amazon"?"Your DSP operating agreement governs everything. Track its renewal date and compliance requirements here.":"Add your contracts to track renewal dates and protect your business."}
                </div>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {contracts.map(c=>{
                const d=daysUntil(c.renewalDate),col=statusColor(d);
                const statusBg={active:"#051a05",up_for_renewal:"#1a1005",in_negotiation:"#05051a",expired:"#1a0505"}[c.status]||"#111";
                const statusC={active:"#22c55e",up_for_renewal:"#f59e0b",in_negotiation:"#8888cc",expired:"#ef4444"}[c.status]||"#555";
                return (
                  <div key={c.id} style={{...S.card,background:statusBg,borderLeft:`3px solid ${statusC}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                      <div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8"}}>{c.name}</div>
                        <div style={{fontSize:10,color:"#999"}}>{c.company} {c.startDate?`· Started ${c.startDate}`:""}</div>
                      </div>
                      <div style={{display:"flex",gap:10,alignItems:"center"}}>
                        <span style={{fontSize:9,color:statusC,border:`1px solid ${statusC}33`,padding:"2px 8px",borderRadius:3,textTransform:"uppercase",letterSpacing:"0.1em"}}>{c.status.replace(/_/g," ")}</span>
                        <button onClick={()=>openEdit("contract",c)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                        <button onClick={()=>setContracts(p=>p.filter(x=>x.id!==c.id))} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12}}>✕</button>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:c.notes?12:0}}>
                      <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Annual Value</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#22c55e"}}>{c.value?fmt$(parseFloat(c.value)):"—"}</div></div>
                      <div style={{background:"#0f0f0f",border:`1px solid ${col}22`,borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Renewal Date</div><div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:col}}>{c.renewalDate?new Date(c.renewalDate).toLocaleDateString():"Not set"}</div>{d!==null&&<div style={{fontSize:9,color:col,marginTop:2}}>{statusLabel(d)}</div>}</div>
                      <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}><div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Monthly Value</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#8888cc"}}>{c.value?fmt$(parseFloat(c.value)/12):"—"}</div></div>
                    </div>
                    {c.notes&&<div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"10px 14px",fontSize:11,color:"#888",lineHeight:1.7}}>{c.notes}</div>}
                  </div>
                );
              })}
            </div>
          </div>}
          </div>
        </div>

  );
}
