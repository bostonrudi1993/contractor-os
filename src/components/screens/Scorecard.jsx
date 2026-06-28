// Scorecard screen
export default function Scorecard(p) {
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
  return (()=>{
        const isFedex = segment==="fedex";
        const isAmazon = segment==="amazon";
        const isLastMile = segment==="lastmile";
        const isUsps = segment==="usps";

        // FedEx metrics
        const fedexMetrics = [
          {key:"pickupCompliance",label:"Pickup Compliance",target:99,unit:"%",color:"#f59e0b"},
          {key:"deliveryCompliance",label:"Delivery Compliance",target:98,unit:"%",color:"#22c55e"},
          {key:"packageHandling",label:"Package Handling",target:99,unit:"%",color:"#60a5fa"},
          {key:"uniformCompliance",label:"Uniform / Vehicle Compliance",target:100,unit:"%",color:"#8888cc"},
          {key:"onTimePickup",label:"On-Time Pickup",target:97,unit:"%",color:"#f59e0b"},
          {key:"routeCompletion",label:"Route Completion Rate",target:99,unit:"%",color:"#22c55e"},
        ];

        // Amazon DSP metrics
        const amazonMetrics = [
          {key:"dart",label:"DART Score",target:98,unit:"%",color:"#f59e0b",desc:"Delivery Associate Reliability Today"},
          {key:"dcr",label:"DCR — Delivery Completion Rate",target:99,unit:"%",color:"#22c55e"},
          {key:"pod",label:"POD — Photo On Delivery",target:99,unit:"%",color:"#60a5fa"},
          {key:"mentor",label:"Mentor Safety Score (avg)",target:800,unit:"pts",color:"#8888cc"},
          {key:"contactCompliance",label:"Delivery Contact Compliance",target:97,unit:"%",color:"#f59e0b"},
          {key:"attendanceRate",label:"Driver Attendance Rate",target:98,unit:"%",color:"#22c55e"},
        ];

        // Last Mile / Lowe's metrics
        const lastmileMetrics = [
          {key:"stopCompletion",label:"Stop Completion Rate",target:99,unit:"%",color:"#22c55e"},
          {key:"onTimeDelivery",label:"On-Time Delivery",target:97,unit:"%",color:"#f59e0b"},
          {key:"customerSatisfaction",label:"Customer Satisfaction (CSAT)",target:95,unit:"%",color:"#60a5fa"},
          {key:"damageRate",label:"Damage-Free Rate",target:99,unit:"%",color:"#8888cc"},
          {key:"signatureCapture",label:"Signature Capture Rate",target:98,unit:"%",color:"#f59e0b"},
          {key:"callAhead",label:"Call-Ahead Compliance",target:95,unit:"%",color:"#22c55e"},
        ];

        // USPS metrics
        const uspsMetrics = [
          {key:"routeCompletion",label:"Route Completion Rate",target:100,unit:"%",color:"#22c55e"},
          {key:"onTime",label:"On-Time Performance",target:97,unit:"%",color:"#f59e0b"},
          {key:"vehicleInspection",label:"Vehicle Inspection Compliance",target:100,unit:"%",color:"#60a5fa"},
          {key:"substituteAvail",label:"Substitute Driver Availability",target:90,unit:"%",color:"#8888cc"},
          {key:"mailSecurity",label:"Mail Security Compliance",target:100,unit:"%",color:"#ef4444"},
        ];

        const metrics = isFedex?fedexMetrics:isAmazon?amazonMetrics:isLastMile?lastmileMetrics:uspsMetrics;
        const segLabel = isFedex?"FedEx Ground":isAmazon?"Amazon DSP":isLastMile?"Last Mile / Lowe's":"USPS Contract";

        // Get this week's scorecard entry
        const thisWeek = scorecardData.find(s=>s.week===scorecardWeek)||{week:scorecardWeek};
        const updateMetric = (key,val) => {
          const existing = scorecardData.find(s=>s.week===scorecardWeek);
          if(existing) {
            setScorecardData(p=>p.map(s=>s.week===scorecardWeek?{...s,[key]:val}:s));
          } else {
            setScorecardData(p=>[{week:scorecardWeek,[key]:val},...p]);
          }
        };

        const overallScore = metrics.reduce((sum,m)=>{
          const val = parseFloat(thisWeek[m.key]||0);
          const pct = m.unit==="%" ? val : Math.min((val/m.target)*100,100);
          return sum + pct;
        },0) / metrics.length;

        return(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
              <div>
                <div style={{...S.section}}>{segLabel.toUpperCase()} SCORECARD</div>
                <div style={{fontSize:11,color:"#999",marginTop:4}}>Track your weekly performance metrics. Enter your scores from your contractor portal.</div>
              </div>
              <div style={{textAlign:"center",background:"#141414",border:`1px solid ${accent}44`,borderRadius:8,padding:"12px 18px"}}>
                <div style={{fontSize:32,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,color:overallScore>=95?"#22c55e":overallScore>=85?"#f59e0b":"#ef4444"}}>{isNaN(overallScore)?"-":overallScore.toFixed(0)}%</div>
                <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em"}}>Overall Score</div>
              </div>
            </div>

            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <label style={{...S.label,marginBottom:0,whiteSpace:"nowrap"}}>Week of:</label>
              <input type="date" value={scorecardWeek} onChange={e=>setScorecardWeek(e.target.value)} style={{...S.input,maxWidth:180}}/>
            </div>

            {/* ── Amazon scorecard import ── */}
            {isAmazon&&<div style={{...S.card,marginBottom:16}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:4}}>Import Weekly Scorecard</div>
              <div style={{fontSize:11,color:"#888",marginBottom:10}}>Upload a photo or PDF of your Amazon scorecard to auto-fill metrics.</div>
              <input type="file" accept="image/*,.pdf" onChange={async e=>{
                const file=e.target.files?.[0];if(!file)return;
                if(file.size>2*1024*1024){showValidation("File too large (max 2MB). Use a smaller screenshot.");e.target.value="";return;}
                setScorecardImporting(true);setScorecardImportResult(null);setScorecardImportError("");
                try{
                  const reader=new FileReader();
                  reader.onload=async ev=>{
                    const base64=ev.target.result.split(",")[1];
                    const apiKey=import.meta.env.VITE_ANTHROPIC_API_KEY;
                    if(!apiKey){setScorecardImportError("API key not configured. Add VITE_ANTHROPIC_API_KEY to Vercel.");setScorecardImporting(false);return;}
                    try{
                      const resp=await fetch("https://api.anthropic.com/v1/messages",{
                        method:"POST",
                        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
                        body:JSON.stringify({model:"claude-haiku-4-5",max_tokens:500,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:file.type,data:base64}},{type:"text",text:"This is an Amazon DSP weekly scorecard. Extract ALL metrics: DART, DCR, POD compliance, Contact Compliance, DNR rate, Customer Escalations, Mentor score, Seatbelt compliance, Speeding, Harsh Braking. Return ONLY a JSON object with snake_case keys and numeric values. No markdown, no code blocks."}]}]})
                      });
                      const data=await resp.json();
                      const text=data.content?.[0]?.text||"{}";
                      let parsed={};
                      try{parsed=JSON.parse(text.replace(/```json|```/g,"").trim());}
                      catch{setScorecardImportError("Could not parse scorecard. Try a clearer image.");setScorecardImporting(false);return;}
                      setScorecardImportResult(parsed);
                      setScorecardImporting(false);
                      Object.entries(parsed).forEach(([k,v])=>updateMetric(k,String(v)));
                    }catch(err){setScorecardImportError("API error: "+err.message);setScorecardImporting(false);}
                  };
                  reader.readAsDataURL(file);
                }catch(err){setScorecardImportError(err.message);setScorecardImporting(false);}
                e.target.value="";
              }} style={{...S.input,padding:"6px",marginBottom:8}}/>
              {scorecardImporting&&<div style={{fontSize:11,color:accent,marginTop:4}}>⏳ Analyzing scorecard...</div>}
              {scorecardImportError&&<div style={{fontSize:11,color:"#ef4444",marginTop:4}}>{scorecardImportError}</div>}
              {scorecardImportResult&&<div style={{background:"#081a08",border:"1px solid #22c55e44",borderRadius:6,padding:"10px 14px",marginTop:8}}>
                <div style={{fontSize:11,color:"#22c55e",marginBottom:6}}>✓ Imported {Object.keys(scorecardImportResult).length} metrics</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {Object.entries(scorecardImportResult).map(([k,v])=>(
                    <div key={k} style={{fontSize:10,color:"#999",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:4,padding:"2px 8px"}}>{k}: <span style={{color:"#22c55e"}}>{v}</span></div>
                  ))}
                </div>
              </div>}
            </div>}

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12,marginBottom:24}}>
              {metrics.map(m=>{
                const val = thisWeek[m.key]||"";
                const numVal = parseFloat(val||0);
                const pct = m.unit==="%"?numVal:Math.min((numVal/m.target)*100,100);
                const status = pct>=m.target?"#22c55e":pct>=(m.target-5)?"#f59e0b":"#ef4444";
                return(
                  <div key={m.key} style={{...S.card,borderTop:`3px solid ${m.color}`}}>
                    <div style={{fontSize:11,color:"#888",marginBottom:8,lineHeight:1.4}}>{m.label}</div>
                    {m.desc&&<div style={{fontSize:9,color:"#888",marginBottom:6}}>{m.desc}</div>}
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
                      <input type="number" value={val} onChange={e=>updateMetric(m.key,e.target.value)} placeholder={m.target.toString()} style={{...S.input,maxWidth:90}} min={0} max={m.unit==="%"?100:undefined}/>
                      <div style={{fontSize:9,color:"#999"}}>{m.unit}</div>
                      <div style={{marginLeft:"auto",fontSize:10,color:val?status:"#444",fontWeight:700}}>Target: {m.target}{m.unit}</div>
                    </div>
                    <div style={{height:4,background:"#1e1e1e",borderRadius:2}}>
                      <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:val?status:m.color,borderRadius:2,transition:"width 0.3s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weekly history */}
            {scorecardData.length>0&&(
              <div style={S.card}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>Score History</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {[...scorecardData].sort((a,b)=>new Date(b.week)-new Date(a.week)).slice(0,8).map(week=>{
                    const weekAvg = metrics.reduce((sum,m)=>{
                      const v=parseFloat(week[m.key]||0);
                      return sum+(m.unit==="%"?v:Math.min((v/m.target)*100,100));
                    },0)/metrics.length;
                    return(
                      <div key={week.week} style={{display:"flex",alignItems:"center",gap:12,padding:"6px 0",borderBottom:"1px solid #1a1a1a"}}>
                        <div style={{fontSize:11,color:"#888",width:90,flexShrink:0}}>{fmtDate(week.week)}</div>
                        <div style={{flex:1,height:6,background:"#1e1e1e",borderRadius:3}}>
                          <div style={{height:"100%",width:`${Math.min(weekAvg,100)}%`,background:weekAvg>=95?"#22c55e":weekAvg>=85?"#f59e0b":"#ef4444",borderRadius:3}}/>
                        </div>
                        <div style={{fontSize:12,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:weekAvg>=95?"#22c55e":weekAvg>=85?"#f59e0b":"#ef4444",width:40,textAlign:"right"}}>{isNaN(weekAvg)?"-":weekAvg.toFixed(0)}%</div>
                        <button onClick={()=>setScorecardData(p=>p.filter(s=>s.week!==week.week))} style={{background:"transparent",border:"none",color:"#333",cursor:"pointer",fontSize:11}}>✕</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Segment-specific tips */}
            <div style={{marginTop:16,background:"#0a0a14",border:"1px solid #1a1a2a",borderRadius:6,padding:"14px 18px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>{segLabel} Tips</div>
              {isFedex&&<div style={{fontSize:11,color:"#999",lineHeight:1.9}}>• Pickup compliance is the most-watched FedEx metric — missing pickups triggers contractor reviews<br/>• Vehicle appearance inspections happen randomly — keep trucks clean and branded<br/>• Route completion below 99% for 3+ weeks can trigger ISP contract review<br/>• Log incidents in the Drivers → Incidents screen immediately — delays hurt your rating</div>}
              {isAmazon&&<div style={{fontSize:11,color:"#999",lineHeight:1.9}}>• DART below 95% for 2 consecutive weeks flags your DSP for coaching<br/>• Mentor scores below 700 require mandatory retraining — check scores weekly<br/>• POD compliance dropped below 98% is the #1 reason DSPs lose packages<br/>• Keep a rescue driver on standby for unexpected driver callouts</div>}
              {isLastMile&&<div style={{fontSize:11,color:"#999",lineHeight:1.9}}>• Always call ahead for large item deliveries (appliances, lumber) — it's contractually required<br/>• Log every delivery attempt with timestamp even if no one is home<br/>• Damage claims over 0.5% of stops triggers Lowe's contract review<br/>• White glove delivery requires two-person team — log both drivers</div>}
              {isUsps&&<div style={{fontSize:11,color:"#999",lineHeight:1.9}}>• HCR routes must be completed regardless of volume — no partial days<br/>• Substitute drivers must be pre-approved by your postmaster before running routes<br/>• Vehicle inspection forms must be completed daily and kept 90 days<br/>• Mail security incidents must be reported within 1 hour — no exceptions</div>}
            </div>
          </div>
        </div>
        );
      })();
}
