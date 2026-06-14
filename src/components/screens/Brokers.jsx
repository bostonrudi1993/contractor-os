// Brokers screen
export default function Brokers(p) {
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
  if (!seg.features.brokerScorecard) return (
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:"#e8e4d8",marginBottom:16}}>Client Relationship</div>
            <div style={{...S.card,marginBottom:16}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>
                {segment==="fedex"?"FedEx Ground":segment==="amazon"?"Amazon DSP":segment==="lastmile"?"Lowe's / Home Depot":segment==="usps"?"USPS":"Primary Client"}
              </div>
              <div style={{fontSize:11,color:"#555",marginBottom:12}}>Track your key client relationship details and contract terms.</div>
              {[["Weekly Stop Guarantee","weeklyStops"],["Revenue Per Stop $","revenuePerStop"],["Fuel Surcharge %","fuelSurcharge"],["Contract Expiry","contractExpiry"],["Performance Tier","performanceTier"]].map(([label,field])=>{
                const co=segment==="fedex"?"FedEx Ground":segment==="amazon"?"Amazon DSP":segment==="lastmile"?"Lowe's":"USPS";
                const client=contacts.find(c=>c.type==="Client"&&c.company===co)||{};
                return <div key={field} style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#888",marginBottom:3}}>{label}</div>
                  <input value={client[field]||""} onChange={e=>{
                    const existing=contacts.find(c=>c.type==="Client"&&c.company===co);
                    if(existing){setContacts(p=>p.map(c=>c.id===existing.id?{...c,[field]:e.target.value}:c));}
                    else{setContacts(p=>[{id:Date.now(),type:"Client",company:co,[field]:e.target.value},...p]);}
                  }} style={S.input}/>
                </div>;
              })}
            </div>
          </div>
        </div>
  );
  return (()=>{
        const laneStats=()=>{
          const lanes={};
          loads.forEach(l=>{ if(!l.load?.origin||!l.load?.destination)return; const k=`${l.load.origin} → ${l.load.destination}`; if(!lanes[k])lanes[k]={count:0,total:0}; lanes[k].count++; lanes[k].total+=l.result?.netRPM||0; });
          return Object.entries(lanes).map(([lane,d])=>({lane,count:d.count,avg:d.total/d.count})).sort((a,b)=>b.avg-a.avg);
        };
        return (
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <SubNav tabs={[["scores","Scoreboard"],["lanes","Lanes"],["add","Add Broker"]]} active={subScreen||"scores"} onSelect={setSubScreen}/>
            <div style={{flex:1,overflowY:"auto",padding:24}}>
              {(!subScreen||subScreen==="scores")&&(
                <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{...S.section,marginBottom:20}}>BROKER SCOREBOARD</div>
                  {brokers.filter(b=>!b.blacklisted).length===0&&loads.length===0&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No broker data yet. Analyze loads or add brokers manually.</div>}
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[...new Set([...brokers.map(b=>b.name),...loads.map(l=>l.load?.brokerName).filter(Boolean)])].filter(name=>!brokers.find(b=>b.name===name&&b.blacklisted)).map((name,i)=>{
                      const manual=brokers.find(b=>b.name===name);
                      const bLoads=loads.filter(l=>l.load?.brokerName===name);
                      const avgNet=bLoads.length?bLoads.reduce((s,l)=>s+(l.result?.netRPM||0),0)/bLoads.length:0;
                      return (
                        <div key={name} style={{...S.card,display:"flex",alignItems:"center",gap:16}} className="cardhov">
                          <div style={{width:26,fontSize:11,color:"#444",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>#{i+1}</div>
                          <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8"}}>{name}</div>{manual?.notes&&<div style={{fontSize:10,color:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{manual.notes}</div>}</div>
                          {manual?.rating&&<div style={{fontSize:12,color:"#f59e0b",letterSpacing:2}}>{"★".repeat(manual.rating)}</div>}
                          {manual?.paySpeed&&<div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Pay Speed</div><div style={{fontSize:11,color:"#8888cc"}}>{manual.paySpeed}</div></div>}
                          {bLoads.length>0&&<div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Loads</div><div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#c8c4bc"}}>{bLoads.length}</div></div>}
                          {bLoads.length>0&&<div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Avg Net RPM</div><div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:avgNet>=1.5?"#22c55e":avgNet>=1?"#f59e0b":"#ef4444"}}>${avgNet.toFixed(2)}/mi</div></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {subScreen==="lanes"&&(
                <div style={{maxWidth:760,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{...S.section,marginBottom:20}}>LANE INTELLIGENCE</div>
                  {laneStats().length===0?<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No lane data yet. Analyze loads to populate lanes.</div>:
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {laneStats().map((l,i)=>(
                      <div key={l.lane} style={{...S.card,display:"flex",alignItems:"center",gap:14}} className="cardhov">
                        <div style={{width:24,fontSize:11,color:"#444",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>#{i+1}</div>
                        <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{l.lane}</div><div style={{fontSize:10,color:"#555"}}>{l.count} load{l.count>1?"s":""}</div></div>
                        <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#555"}}>Avg Net RPM</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:l.avg>=1.5?"#22c55e":l.avg>=1?"#f59e0b":"#ef4444"}}>${l.avg.toFixed(2)}/mi</div></div>
                      </div>
                    ))}
                  </div>}
                </div>
              )}
              {subScreen==="blacklist"&&(
                <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{...S.section,marginBottom:20}}>BLACKLIST</div>
                  {brokers.filter(b=>b.blacklisted).length===0?<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No blacklisted brokers.</div>:
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {brokers.filter(b=>b.blacklisted).map(b=>(
                      <div key={b.id} style={{...S.card,background:"#1a0808",border:"1px solid #3a1010",display:"flex",alignItems:"center",gap:14}}>
                        <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#ef4444"}}>{b.name}</div>{b.notes&&<div style={{fontSize:10,color:"#7a4040"}}>{b.notes}</div>}</div>
                        <button onClick={()=>setBrokers(p=>p.map(x=>x.id===b.id?{...x,blacklisted:false}:x))} style={{background:"transparent",border:"1px solid #3a1010",color:"#7a4040",padding:"5px 12px",fontSize:10,cursor:"pointer",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>Remove</button>
                      </div>
                    ))}
                  </div>}
                </div>
              )}
              {subScreen==="add"&&(
                <div style={{maxWidth:600,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                  <div style={{...S.section,marginBottom:20}}>ADD BROKER</div>
                  <div style={S.card}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Broker Name *</label><input value={brokerForm.name} onChange={e=>setBrokerForm(p=>({...p,name:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Phone</label><input value={brokerForm.phone||""} onChange={e=>setBrokerForm(p=>({...p,phone:e.target.value}))} placeholder="(555) 555-0100" style={S.input}/></div>
                      <div><label style={S.label}>Email</label><input type="email" value={brokerForm.email||""} onChange={e=>setBrokerForm(p=>({...p,email:e.target.value}))} placeholder="dispatch@broker.com" style={S.input}/></div>
                      <div><label style={S.label}>Pay Speed</label>
                        <select value={brokerForm.paySpeed} onChange={e=>setBrokerForm(p=>({...p,paySpeed:e.target.value}))} style={S.input}>
                          <option value="">Select...</option>
                          {["Quick Pay (1-3d)","Net 7","Net 14","Net 21","Net 30","Net 45+","Slow / Problems"].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div><label style={S.label}>Rating (1–5)</label>
                        <select value={brokerForm.rating} onChange={e=>setBrokerForm(p=>({...p,rating:parseInt(e.target.value)}))} style={S.input}>
                          {[5,4,3,2,1].map(n=><option key={n} value={n}>{"★".repeat(n)} {n}/5</option>)}
                        </select>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:18}}>
                        <input type="checkbox" checked={brokerForm.blacklisted} onChange={e=>setBrokerForm(p=>({...p,blacklisted:e.target.checked}))} style={{accentColor:"#ef4444",width:14,height:14}}/>
                        <label style={{fontSize:11,color:"#ef4444",cursor:"pointer"}}>Add to Blacklist</label>
                      </div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><textarea value={brokerForm.notes} onChange={e=>setBrokerForm(p=>({...p,notes:e.target.value}))} placeholder="Pay issues, good loads, contacts..." style={{...S.input,height:70,resize:"vertical"}}/></div>
                    </div>
                    <button className="hov" onClick={()=>{ if(!brokerForm.name){showValidation("Broker name is required");return;} setBrokers(p=>[...p,{...brokerForm,id:Date.now()}]); setBrokerForm({name:"",paySpeed:"",rating:3,notes:"",blacklisted:false}); setSubScreen("scores"); }} style={{...S.btn,marginTop:14}}>Save Broker</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })();
}
