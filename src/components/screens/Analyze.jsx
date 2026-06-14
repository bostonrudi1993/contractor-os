// Analyze screen
export default function Analyze(p) {
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
          <div style={{display:"flex",borderBottom:"1px solid #1e1e1e",background:"#0d0d0d",padding:"0 24px"}}>
            {[["paste","Paste Load"],["confirm","Confirm"],["result","Score"]].map(([id,lbl],i)=>{
              const active=(analyzeStep===id);
              const done=(i===0&&analyzeStep!=="paste")||(i===1&&analyzeStep==="result");
              return <div key={id} style={{padding:"12px 16px",fontSize:10,color:active?accent:done?"#555":"#333",borderBottom:active?`2px solid ${accent}`:"2px solid transparent",letterSpacing:"0.1em",textTransform:"uppercase"}}><span style={{color:done?"#22c55e":active?accent:"#2a2a2a",marginRight:5}}>{done?"✓":`0${i+1}`}</span>{lbl}</div>;
            })}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:24,maxWidth:800,margin:"0 auto",width:"100%"}}>
            {aiLoading&&<Loader msg="Analyzing rate..."/>}

            {analyzeStep==="paste"&&!aiLoading&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:8}}>PASTE YOUR LOAD</div>
                <p style={{fontSize:11,color:"#555",marginBottom:16,lineHeight:1.8}}>Copy from DAT, Truckstop, broker email or text. Paste everything — AI extracts what it needs.</p>
                <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)} placeholder={"Chicago, IL to Nashville, TN\n487 miles | 42,000 lbs\nRate: $1,450\nPickup: Tomorrow 7am\nBroker: Coyote Logistics"} style={{...S.input,height:160,resize:"vertical",lineHeight:1.7}}/>
                <div style={{display:"flex",gap:12,marginTop:14}}>
                  <button className="hov" onClick={parseLoad} disabled={!pasteText.trim()} style={{...S.btn,opacity:pasteText.trim()?1:0.4}}>Parse Load →</button>
                  <button onClick={()=>setAnalyzeStep("confirm")} style={S.ghost}>Enter manually</button>
                </div>
              </div>
            )}

            {aiError&&!aiLoading&&analyzeStep!=="result"&&(<div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010",color:"#f87171",fontSize:11,padding:16,marginBottom:12,animation:"fadeUp 0.3s ease"}}>⚠ {aiError}<br/><span style={{fontSize:9,color:"#7a4040"}}>Check your VITE_ANTHROPIC_API_KEY in Vercel, or try again.</span></div>)}
            {analyzeStep==="confirm"&&!aiLoading&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:8}}>CONFIRM DETAILS</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                  {[["origin","Origin *","City, ST"],["destination","Destination *","City, ST"],["miles","Loaded Miles","487"],["deadheadMiles","Deadhead Miles","0"],["offeredRate","Offered Rate ($) *","1450"],["commodity","Commodity","General freight"],["pickupDate","Pickup Date",""],["brokerName","Broker Name",""]].map(([f,lbl,ph])=>(
                    <div key={f}><label style={S.label}>{lbl}</label><input value={loadForm[f]} onChange={e=>setLoadForm(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input}/></div>
                  ))}
                </div>
                <div style={{display:"flex",gap:12}}>
                  <button className="hov" onClick={analyzeLoad} disabled={!loadForm.origin||!loadForm.destination||!loadForm.offeredRate} style={{...S.btn,opacity:(loadForm.origin&&loadForm.destination&&loadForm.offeredRate)?1:0.4}}>Score This Load →</button>
                  <button onClick={()=>setAnalyzeStep("paste")} style={S.ghost}>← Back</button>
                </div>
              </div>
            )}

            {analyzeStep!=="paste"&&!aiLoading&&!aiResult&&aiError&&(<div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010",color:"#f87171",fontSize:12,padding:20,marginBottom:16,animation:"fadeUp 0.3s ease"}}>⚠ {aiError}<br/><span style={{fontSize:10,color:"#7a4040"}}>Check your API key in Vercel environment variables, or try again in a moment.</span></div>)}
            {analyzeStep==="result"&&aiResult&&!aiLoading&&(()=>{
              const vBg={green:"#051a0a",yellow:"#1a1505",red:"#1a0505"};
              const vBd={green:"#0d3a1a",yellow:"#3a2a0a",red:"#3a0a0a"};
              return (
                <div style={{animation:"fadeUp 0.3s ease"}}>
                  <div style={{background:vBg[aiResult.verdictColor]||"#111",border:`1px solid ${vBd[aiResult.verdictColor]||"#222"}`,borderRadius:8,padding:"20px 24px",display:"flex",alignItems:"center",gap:20,marginBottom:16}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:64,fontWeight:900,color:gradeColor(aiResult.grade),lineHeight:1}}>{aiResult.grade}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:800,color:aiResult.verdictColor==="green"?"#22c55e":aiResult.verdictColor==="yellow"?"#f59e0b":"#ef4444"}}>{aiResult.verdict}</div>
                      <div style={{fontSize:12,color:"#888",lineHeight:1.7,marginTop:4}}>{aiResult.summary}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:10,color:"#555",marginBottom:2}}>NET RPM</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:36,fontWeight:900,color:aiResult.verdictColor==="green"?"#22c55e":aiResult.verdictColor==="yellow"?"#f59e0b":"#ef4444"}}>${(aiResult.netRPM||0).toFixed(2)}</div>
                    </div>
                  </div>
                  <div style={{...S.card,marginBottom:14}}>
                    <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:12}}>Rate Breakdown</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                      {[["Gross Rate",fmt$(aiResult.grossRate),"#c8c4bc"],["Gross RPM",`$${(aiResult.grossRPM||0).toFixed(2)}/mi`,"#c8c4bc"],["Fuel Cost",`-${fmt$(aiResult.fuelCost)}`,"#ef4444"],["Deadhead",`-${fmt$(aiResult.deadheadCost)}`,"#ef4444"],["Truck Cost",`-${fmt$(aiResult.truckCost)}`,"#ef4444"],["Net Revenue",fmt$(aiResult.netRevenue),"#22c55e"]].map(([lbl,val,col])=>(
                        <div key={lbl} style={{padding:"8px 0",borderTop:"1px solid #1e1e1e"}}><div style={{fontSize:9,color:"#555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{lbl}</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:col}}>{val}</div></div>
                      ))}
                    </div>
                  </div>
                  {aiResult.counterOffer&&(
                    <div style={{background:"#110f00",border:"1px solid #2a2500",borderRadius:8,padding:"16px 20px",marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div><div style={{fontSize:9,color:"#5a5000",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:3}}>Negotiation Script</div><div style={{fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#f59e0b"}}>Counter: {fmt$(aiResult.counterOffer.suggestedRate)}</div></div>
                        <button onClick={()=>navigator.clipboard.writeText(aiResult.counterOffer.script)} style={{background:"#1a1500",border:"1px solid #2a2000",color:"#f59e0b",padding:"5px 12px",fontSize:9,cursor:"pointer",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>Copy</button>
                      </div>
                      <div style={{background:"#0a0900",border:"1px solid #1a1800",borderRadius:4,padding:"12px 14px",fontSize:12,color:"#c8c080",lineHeight:1.8,fontStyle:"italic"}}>"{aiResult.counterOffer.script}"</div>
                    </div>
                  )}
                  <div style={{display:"flex",gap:12}}>
                    <button className="hov" onClick={()=>{
                      setLoadHistory(prev=>[{id:Date.now(),date:new Date().toISOString().slice(0,10),origin:loadForm.origin,destination:loadForm.destination,miles:loadForm.miles,offeredRate:loadForm.offeredRate,grossRPM:parseFloat(loadForm.miles)>0?(parseFloat(loadForm.offeredRate)/parseFloat(loadForm.miles)).toFixed(3):0,grade:aiResult?.grade||"—",verdict:"TAKE",brokerName:loadForm.brokerName,actualOutcome:null},...prev].slice(0,200));
                      setAnalyzeStep("paste");setPasteText("");setAiResult(null);setLoadForm({origin:"",destination:"",miles:"",offeredRate:"",deadheadMiles:"",commodity:"",pickupDate:"",brokerName:""});
                    }} style={{...S.btn,background:"#22c55e"}}>✓ Take It</button>
                    <button className="hov" onClick={()=>{
                      setLoadHistory(prev=>[{id:Date.now(),date:new Date().toISOString().slice(0,10),origin:loadForm.origin,destination:loadForm.destination,miles:loadForm.miles,offeredRate:loadForm.offeredRate,grossRPM:parseFloat(loadForm.miles)>0?(parseFloat(loadForm.offeredRate)/parseFloat(loadForm.miles)).toFixed(3):0,grade:aiResult?.grade||"—",verdict:"PASS",brokerName:loadForm.brokerName,actualOutcome:null},...prev].slice(0,200));
                      setAnalyzeStep("paste");setPasteText("");setAiResult(null);setLoadForm({origin:"",destination:"",miles:"",offeredRate:"",deadheadMiles:"",commodity:"",pickupDate:"",brokerName:""});
                    }} style={{...S.btn,background:"#ef4444"}}>✗ Pass</button>
                    <button className="hov" onClick={()=>{setAnalyzeStep("paste");setPasteText("");setAiResult(null);setLoadForm({origin:"",destination:"",miles:"",offeredRate:"",deadheadMiles:"",commodity:"",pickupDate:"",brokerName:""});}} style={S.btn}>→ Analyze Another</button>
                    <button onClick={()=>setAnalyzeSubTab("history")} style={S.ghost}>View History</button>
                  </div>
                </div>
              );
            })()}
            {/* ── D10: Load History ── */}
            {analyzeSubTab==="history"&&segment==="otr"&&(
              <div style={{animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8"}}>Load History</div>
                  <button className="hov" onClick={()=>setAnalyzeSubTab("analyze")} style={{...S.btn,fontSize:10,padding:"4px 12px"}}>← Back to Analyze</button>
                </div>
                {loadHistory.length>0&&(()=>{
                  const taken=loadHistory.filter(l=>l.verdict==="TAKE");
                  const avgRPM=taken.length>0?(taken.reduce((s,l)=>s+parseFloat(l.grossRPM||0),0)/taken.length).toFixed(3):0;
                  return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12,marginBottom:16}}>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Total Analyzed</div><div style={{fontSize:24,fontWeight:700,color:accent}}>{loadHistory.length}</div></div>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Avg RPM (Taken)</div><div style={{fontSize:24,fontWeight:700,color:accent}}>${avgRPM}</div></div>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Pass Rate</div><div style={{fontSize:24,fontWeight:700,color:accent}}>{loadHistory.length>0?(loadHistory.filter(l=>l.verdict==="PASS").length/loadHistory.length*100).toFixed(0):0}%</div></div>
                  </div>;
                })()}
                {loadHistory.length===0&&<div style={{color:"#555",fontSize:12}}>No load history yet. Analyze loads and click Take It or Pass.</div>}
                {loadHistory.map(l=>(
                  <div key={l.id} style={{...S.card,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:13,color:"#e8e4d8"}}>{l.origin} → {l.destination}</div>
                        <div style={{fontSize:11,color:"#888"}}>{l.date} · {l.brokerName||"—"} · ${parseFloat(l.offeredRate||0).toFixed(0)} · {l.miles}mi</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <span style={{fontSize:11,padding:"2px 8px",borderRadius:3,background:l.verdict==="TAKE"?"#22c55e33":"#ef444433",color:l.verdict==="TAKE"?"#22c55e":"#ef4444"}}>{l.verdict}</span>
                        <div style={{fontSize:10,color:accent,marginTop:4}}>{l.grade} grade</div>
                      </div>
                    </div>
                    {loadHistoryUpdateId===l.id?(
                      <div style={{marginTop:8}}>
                        <input placeholder="Actual Net Earned $" value={loadHistoryUpdateForm.actualNet} onChange={e=>setLoadHistoryUpdateForm(p=>({...p,actualNet:e.target.value}))} style={{...S.input,marginBottom:6}}/>
                        <div style={{display:"flex",gap:6}}>
                          <button className="hov" onClick={()=>{setLoadHistory(p=>p.map(x=>x.id===l.id?{...x,actualOutcome:loadHistoryUpdateForm.actualNet}:x));setLoadHistoryUpdateId(null);setLoadHistoryUpdateForm({actualNet:"",notes:""}); }} style={S.btn}>Save</button>
                          <button className="hov" onClick={()=>setLoadHistoryUpdateId(null)} style={{...S.btn,background:"#333"}}>Cancel</button>
                        </div>
                      </div>
                    ):(
                      <button className="hov" onClick={()=>{setLoadHistoryUpdateId(l.id);setLoadHistoryUpdateForm({actualNet:l.actualOutcome||"",notes:""});}} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:`1px solid ${accent}44`,background:"transparent",color:accent,cursor:"pointer",marginTop:6}}>Update Outcome</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

  );
}
