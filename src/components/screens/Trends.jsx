// Trends screen
export default function Trends(p) {
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
        // Build monthly data
        const monthlyData = (()=>{
          const months = {};
          revenue.forEach(r=>{
            if(!r.date) return;
            const k = r.date.slice(0,7);
            if(!months[k]) months[k]={month:k,revenue:0,expenses:0,routes:{}};
            months[k].revenue += parseFloat(r.amount||0);
          });
          expenses.forEach(e=>{
            if(!e.date) return;
            const k = e.date.slice(0,7);
            if(!months[k]) months[k]={month:k,revenue:0,expenses:0,routes:{}};
            months[k].expenses += parseFloat(e.amount||0);
          });
          return Object.values(months).sort((a,b)=>a.month.localeCompare(b.month)).map(m=>({...m,net:m.revenue-m.expenses,margin:m.revenue>0?((m.revenue-m.expenses)/m.revenue*100).toFixed(1):0}));
        })();

        // Build per-route data with revenue log entries by route name
        const routeTrends = routes.map(r=>{
          const routeRevEntries = revenue.filter(rv=>(rv.description||"").toLowerCase().includes(r.name.toLowerCase()));
          const months={};
          routeRevEntries.forEach(rv=>{
            if(!rv.date) return;
            const k=rv.date.slice(0,7);
            if(!months[k]) months[k]={month:k,revenue:0};
            months[k].revenue+=parseFloat(rv.amount||0);
          });
          return {...r, monthlyRevenue:Object.values(months).sort((a,b)=>a.month.localeCompare(b.month))};
        });

        const maxRev = Math.max(...monthlyData.map(m=>m.revenue),1);
        const maxNet = Math.max(...monthlyData.map(m=>Math.abs(m.net)),1);

        return (
          <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
            <div style={{maxWidth:1000,margin:"0 auto"}}>
              <div style={{...S.section,marginBottom:4}}>P&L TRENDS</div>
              <p style={{fontSize:11,color:"#999",marginBottom:22,lineHeight:1.8}}>Month over month revenue, expenses, and net profit. Route-level breakdown shows which lanes are improving or declining.</p>

              {/* View toggle */}
              <div style={{display:"flex",gap:8,marginBottom:22}}>
                {[["monthly","Monthly"],["weekly","By Route"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setTrendsView(v)} style={{background:trendsView===v?accent:"transparent",color:trendsView===v?"#0a0a0a":"#555",border:`1px solid ${trendsView===v?accent:"#2a2a2a"}`,padding:"7px 18px",borderRadius:4,fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>{l}</button>
                ))}
              </div>

              {monthlyData.length===0?(
                <div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>No financial data yet. Add revenue and expenses in Finance to see trends.</div>
              ):(
                <>
                {trendsView==="monthly"&&(
                  <>
                    {/* Bar chart */}
                    <div style={{...S.card,marginBottom:20}}>
                      <div style={{fontSize:10,color:"#999",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>Monthly Revenue vs Expenses</div>
                      <div style={{display:"flex",alignItems:"flex-end",gap:8,height:180,padding:"0 8px"}}>
                        {monthlyData.map(m=>(
                          <div key={m.month} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                            <div style={{width:"100%",display:"flex",gap:2,alignItems:"flex-end",height:150}}>
                              <div style={{flex:1,background:"#22c55e",borderRadius:"3px 3px 0 0",height:`${(m.revenue/maxRev)*140}px`,minHeight:2,transition:"height 0.5s ease"}} title={`Revenue: ${fmt$(m.revenue)}`}/>
                              <div style={{flex:1,background:"#ef4444",borderRadius:"3px 3px 0 0",height:`${(m.expenses/maxRev)*140}px`,minHeight:2,transition:"height 0.5s ease"}} title={`Expenses: ${fmt$(m.expenses)}`}/>
                            </div>
                            <div style={{fontSize:8,color:"#888",textAlign:"center",whiteSpace:"nowrap"}}>{m.month.slice(5)}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{display:"flex",gap:16,marginTop:10,fontSize:10,color:"#999"}}>
                        <span><span style={{display:"inline-block",width:10,height:10,background:"#22c55e",borderRadius:2,marginRight:4}}/>Revenue</span>
                        <span><span style={{display:"inline-block",width:10,height:10,background:"#ef4444",borderRadius:2,marginRight:4}}/>Expenses</span>
                      </div>
                    </div>

                    {/* Net profit line */}
                    <div style={{...S.card,marginBottom:20}}>
                      <div style={{fontSize:10,color:"#999",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>Net Profit Trend</div>
                      <div style={{position:"relative",height:100,padding:"0 8px"}}>
                        <svg width="100%" height="100" viewBox={`0 0 ${Math.max(monthlyData.length*60,300)} 100`} preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3"/>
                              <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          {monthlyData.length>1&&(()=>{
                            const w = Math.max(monthlyData.length*60,300);
                            const points = monthlyData.map((m,i)=>{
                              const x = (i/(monthlyData.length-1))*w;
                              const y = 90 - ((m.net+maxNet)/(maxNet*2))*80;
                              return `${x},${y}`;
                            });
                            const areaPoints = `${points[0].split(",")[0]},90 ${points.join(" ")} ${points[points.length-1].split(",")[0]},90`;
                            return <>
                              <polygon points={areaPoints} fill="url(#netGrad)"/>
                              <polyline points={points.join(" ")} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinejoin="round"/>
                              {monthlyData.map((m,i)=>{
                                const x=(i/(monthlyData.length-1))*w;
                                const y=90-((m.net+maxNet)/(maxNet*2))*80;
                                return <circle key={i} cx={x} cy={y} r="4" fill={m.net>=0?"#22c55e":"#ef4444"} stroke="#0a0a0a" strokeWidth="1.5"/>;
                              })}
                            </>;
                          })()}
                          <line x1="0" y1="90" x2="100%" y2="90" stroke="#1e1e1e" strokeWidth="1"/>
                          <line x1="0" y1={90-80*0.5} x2="100%" y2={90-80*0.5} stroke="#1a1a1a" strokeWidth="1" strokeDasharray="4,4"/>
                        </svg>
                      </div>
                    </div>

                    {/* Monthly table */}
                    <div style={S.card}>
                      <div style={{fontSize:10,color:"#999",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Monthly Summary</div>
                      <div style={{overflowX:"auto"}}>
                        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                          <thead>
                            <tr style={{borderBottom:"1px solid #1e1e1e"}}>
                              {["Month","Revenue","Expenses","Net Profit","Margin"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:h==="Month"?"left":"right",fontSize:9,color:"#999",letterSpacing:"0.15em",textTransform:"uppercase"}}>{h}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {[...monthlyData].reverse().map(m=>(
                              <tr key={m.month} style={{borderBottom:"1px solid #141414"}}>
                                <td style={{padding:"10px 12px",color:"#c8c4bc",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{m.month}</td>
                                <td style={{padding:"10px 12px",textAlign:"right",color:"#22c55e"}}>{fmt$(m.revenue)}</td>
                                <td style={{padding:"10px 12px",textAlign:"right",color:"#ef4444"}}>{fmt$(m.expenses)}</td>
                                <td style={{padding:"10px 12px",textAlign:"right",fontWeight:700,color:m.net>=0?"#22c55e":"#ef4444"}}>{fmt$(m.net)}</td>
                                <td style={{padding:"10px 12px",textAlign:"right",color:parseFloat(m.margin)>=20?"#22c55e":parseFloat(m.margin)>=10?"#f59e0b":"#ef4444"}}>{m.margin}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {trendsView==="weekly"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:16}}>
                    <div style={{fontSize:10,color:"#999",letterSpacing:"0.2em",textTransform:"uppercase"}}>Route Profitability — All Time</div>
                    {routes.length===0?<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:32}}>No routes added. Add routes in the Routes screen first.</div>:
                    routes.map(r=>{
                      const netEst = parseFloat(r.rate||0)-((parseFloat(r.miles||0)/settings.mpg)*settings.dieselPrice)-parseFloat(r.driverPay||0)-parseFloat(r.otherCosts||0);
                      const margin = parseFloat(r.rate||0)>0?(netEst/parseFloat(r.rate))*100:0;
                      const grade = margin>=30?"A":margin>=20?"B":margin>=10?"C":"D";
                      return (
                        <div key={r.id} style={S.card}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                            <div>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:"#e8e4d8"}}>{r.name}</div>
                              <div style={{fontSize:10,color:"#999"}}>{r.stops||0} stops · {r.miles||0} mi · {r.frequency||"Daily"}</div>
                            </div>
                            <div style={{display:"flex",gap:10,alignItems:"center"}}>
                              <div style={{width:36,height:36,background:gradeColor(grade)+"22",border:`1px solid ${gradeColor(grade)}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:gradeColor(grade),borderRadius:4}}>{grade}</div>
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
                            {[["Contracted",fmt$(parseFloat(r.rate||0)),"#22c55e"],["Est Expenses",fmt$(parseFloat(r.rate||0)-netEst),"#ef4444"],["Net Profit",fmt$(netEst),netEst>=0?"#22c55e":"#ef4444"],["Margin",`${margin.toFixed(1)}%`,parseFloat(margin)>=20?"#22c55e":parseFloat(margin)>=10?"#f59e0b":"#ef4444"]].map(([lbl,val,col])=>(
                              <div key={lbl} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,padding:"9px 12px"}}>
                                <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{lbl}</div>
                                <div style={{fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:col}}>{val}</div>
                              </div>
                            ))}
                          </div>
                          {/* Mini profitability bar */}
                          <div>
                            <div style={{fontSize:9,color:"#999",marginBottom:4}}>Profitability</div>
                            <div style={{height:8,background:"#1a1a1a",borderRadius:4,overflow:"hidden"}}>
                              <div style={{height:"100%",width:`${Math.min(100,Math.max(0,margin))}%`,background:parseFloat(margin)>=20?"#22c55e":parseFloat(margin)>=10?"#f59e0b":"#ef4444",borderRadius:4,transition:"width 0.5s ease"}}/>
                            </div>
                          </div>
                          {r.analysis&&(
                            <div style={{marginTop:10,padding:"8px 12px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:4,fontSize:11,color:"#888",lineHeight:1.6}}>{r.analysis.summary}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                </>
              )}
            </div>
          </div>
        );
      })();
}
