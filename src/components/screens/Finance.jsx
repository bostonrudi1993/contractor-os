// Finance screen
export default function Finance(p) {
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
    urgentItems, totalRevenue, totalExpenses, netProfit, SubNav, Stat, ExpiryBadge, Loader, fmt$, fmtDate, daysUntil,
    statusColor, statusLabel, gradeColor, MODAL_CONFIGS,
  } = p;
  return (
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <SubNav tabs={[["pl","P&L Dashboard"],["revenue","Revenue"],["expenses","Expenses"],["import","Import from Excel/QB"],...(segment==="otr"?[["deadmiles","Dead Miles"]]:[])]  } active={subScreen||"pl"} onSelect={setSubScreen}/>
          <div style={{flex:1,overflowY:"auto",padding:24}}>
            {(!subScreen||subScreen==="pl")&&(
              <div style={{maxWidth:900,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:20}}>PROFIT & LOSS</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
                  <Stat label="Total Revenue" value={fmt$(totalRevenue)} color="#22c55e"/>
                  <Stat label="Total Expenses" value={fmt$(totalExpenses)} color="#ef4444"/>
                  <Stat label="Net Profit" value={fmt$(netProfit)} color={netProfit>=0?"#22c55e":"#ef4444"}/>
                </div>
                {(()=>{
                  const months={};
                  revenue.forEach(r=>{ if(!r.date)return; const k=r.date.slice(0,7); if(!months[k])months[k]={rev:0,exp:0}; months[k].rev+=parseFloat(r.amount||0); });
                  expenses.forEach(e=>{ if(!e.date)return; const k=e.date.slice(0,7); if(!months[k])months[k]={rev:0,exp:0}; months[k].exp+=parseFloat(e.amount||0); });
                  const sorted=Object.entries(months).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,6);
                  if(!sorted.length) return <div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:32}}>No financial data yet. Add revenue and expenses to see your P&L.</div>;
                  return (
                    <div style={S.card}>
                      <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Monthly Summary</div>
                      {sorted.map(([month,d])=>{
                        const net=d.rev-d.exp;
                        return <div key={month} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #1a1a1a"}}>
                          <span style={{fontSize:11,color:"#888"}}>{month}</span>
                          <div style={{display:"flex",gap:20,alignItems:"center"}}>
                            <span style={{fontSize:10,color:"#22c55e"}}>{fmt$(d.rev)} rev</span>
                            <span style={{fontSize:10,color:"#ef4444"}}>{fmt$(d.exp)} exp</span>
                            <span style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:net>=0?"#22c55e":"#ef4444"}}>{fmt$(net)}</span>
                          </div>
                        </div>;
                      })}
                    </div>
                  );
                })()}
                <div style={{display:"flex",gap:12,marginTop:16}}>
                  <button className="hov" onClick={()=>setSubScreen("revenue")} style={S.btn}>+ Add Revenue</button>
                  <button className="hov" onClick={()=>setSubScreen("expenses")} style={{...S.btn,background:"#ef4444"}}>+ Add Expense</button>
                </div>
              </div>
            )}

            {subScreen==="revenue"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={S.section}>REVENUE</div>
                  <button className="hov" onClick={()=>setShowAddRevenue(!showAddRevenue)} style={S.btn}>{showAddRevenue?"Cancel":"+ Add Revenue"}</button>
                </div>
                {showAddRevenue&&(
                  <div style={{...S.card,marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Date</label><input type="date" value={revenueForm.date} onChange={e=>setRevenueForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Amount ($) *</label><input type="number" value={revenueForm.amount} onChange={e=>setRevenueForm(p=>({...p,amount:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                      <div><label style={S.label}>Source / Description</label><input value={revenueForm.description} onChange={e=>setRevenueForm(p=>({...p,description:e.target.value}))} placeholder={seg.id==="otr"?"Broker/Load":"Route payment / settlement"} style={S.input}/></div>
                      <div><label style={S.label}>Vehicle</label>
                        <select value={revenueForm.vehicle} onChange={e=>setRevenueForm(p=>({...p,vehicle:e.target.value}))} style={S.input}>
                          <option value="">All / General</option>
                          {compliance.trucks.map(t=><option key={t.id} value={t.name}>{t.name}{t.nickname?` "${t.nickname}"`:""}{ t.vin?` · ${t.vin.slice(-6)}`:""}</option>)}
                        </select>
                      </div>
                    </div>
                    <button className="hov" onClick={()=>{ if(!revenueForm.amount){showValidation("Amount is required");return;} if(!revenueForm.date){showValidation("Date is required");return;} setRevenue(p=>[{...revenueForm,id:Date.now()},...p]); setRevenueForm({date:"",description:"",amount:"",vehicle:""}); setShowAddRevenue(false); }} style={{...S.btn,marginTop:14}}>Save Revenue</button>
                  </div>
                )}
                {revenue.length===0&&!showAddRevenue&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No revenue logged yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {revenue.map(r=>(
                    <div key={r.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}><div style={{fontSize:12,color:"#c8c4bc"}}>{r.description||"Revenue"}</div><div style={{fontSize:10,color:"#555"}}>{r.date} {r.vehicle?`· ${r.vehicle}`:""}</div></div>
                      <div style={{fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#22c55e",flexShrink:0}}>{fmt$(parseFloat(r.amount||0))}</div>
                      <button onClick={()=>openEdit("revenue",r)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace",flexShrink:0}}>Edit</button>
                      <button onClick={()=>setRevenue(p=>p.filter(x=>x.id!==r.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12,flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subScreen==="expenses"&&(
              <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div style={S.section}>EXPENSES</div>
                  <button className="hov" onClick={()=>setShowAddExpense(!showAddExpense)} style={{...S.btn,background:"#ef4444"}}>{showAddExpense?"Cancel":"+ Add Expense"}</button>
                </div>
                {showAddExpense&&(
                  <div style={{...S.card,marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><label style={S.label}>Date</label><input type="date" value={expenseForm.date} onChange={e=>setExpenseForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                      <div><label style={S.label}>Category</label>
                        <select value={expenseForm.category} onChange={e=>setExpenseForm(p=>({...p,category:e.target.value}))} style={S.input}>
                          {["fuel","maintenance","insurance","tires","repairs","driver_pay","tolls","permits","registration","ifta","ucr","eld","uniforms","equipment","phone","other"].map(c=><option key={c} value={c}>{c.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
                        </select>
                      </div>
                      <div><label style={S.label}>Amount ($) *</label><input type="number" value={expenseForm.amount} onChange={e=>setExpenseForm(p=>({...p,amount:e.target.value}))} placeholder="0.00" style={S.input}/></div>
                      <div><label style={S.label}>Vehicle</label>
                        <select value={expenseForm.vehicle} onChange={e=>setExpenseForm(p=>({...p,vehicle:e.target.value}))} style={S.input}>
                          <option value="">All / General</option>
                          {compliance.trucks.map(t=><option key={t.id} value={t.name}>{t.name}{t.nickname?` "${t.nickname}"`:""}{ t.vin?` · ${t.vin.slice(-6)}`:""}</option>)}
                        </select>
                      </div>
                      <div style={{gridColumn:"1/-1"}}><label style={S.label}>Description</label><input value={expenseForm.description} onChange={e=>setExpenseForm(p=>({...p,description:e.target.value}))} placeholder="Optional notes" style={S.input}/></div>
                    </div>
                    <button className="hov" onClick={()=>{ if(!expenseForm.amount){showValidation("Amount is required");return;} if(!expenseForm.date){showValidation("Date is required");return;} setExpenses(p=>[{...expenseForm,id:Date.now()},...p]); setExpenseForm({date:"",category:"fuel",amount:"",description:"",vehicle:""}); setShowAddExpense(false); }} style={{...S.btn,background:"#ef4444",marginTop:14}}>Save Expense</button>
                  </div>
                )}
                {expenses.length===0&&!showAddExpense&&<div style={{...S.card,textAlign:"center",color:"#555",fontSize:12,padding:40}}>No expenses logged yet.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {expenses.map(e=>(
                    <div key={e.id} style={{...S.card,display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,color:"#c8c4bc",display:"flex",alignItems:"center",gap:8}}>
                          {e.category.replace(/_/g," ").replace(/\w/g,l=>l.toUpperCase())} {e.description?`— ${e.description}`:""}
                          {e.source&&<span style={{fontSize:8,color:"#555",border:"1px solid #2a2a2a",padding:"1px 5px",borderRadius:3,textTransform:"uppercase",letterSpacing:"0.08em"}}>{e.source==="fuel_log"?"⛽ fuel":e.source==="maintenance"?"🔧 maint":e.source==="payroll"?"💵 payroll":"auto"}</span>}
                        </div>
                        <div style={{fontSize:10,color:"#555"}}>{e.date} {e.vehicle?`· ${e.vehicle}`:""}</div>
                      </div>
                      <div style={{fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#ef4444",flexShrink:0}}>{fmt$(parseFloat(e.amount||0))}</div>
                      {!e.source&&<button onClick={()=>openEdit("expense",e)} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace",flexShrink:0}}>Edit</button>}
                      <button onClick={()=>setExpenses(p=>p.filter(x=>x.id!==e.id))} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:12,flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subScreen==="import"&&(
              <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{...S.section,marginBottom:4}}>IMPORT FROM EXCEL / QUICKBOOKS</div>
                <p style={{fontSize:11,color:"#555",marginBottom:16,lineHeight:1.8}}>
                  Export your P&L from QuickBooks Online or Excel as a CSV file, then drop it here. ContractorOS will read it and automatically create your revenue and expense entries.
                </p>

                {/* Template download */}
                <div style={{background:"#0a0f1a",border:`1px solid ${accent}33`,borderRadius:8,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:16}}>
                  <div style={{fontSize:28,flexShrink:0}}>📥</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:3}}>Download the ContractorOS Template</div>
                    <div style={{fontSize:11,color:"#555",lineHeight:1.7}}>Not using QuickBooks? Download our Excel template — it has step-by-step instructions, example data, a category guide, and auto-calculates your P&L summary.</div>
                  </div>
                  <a href="/ContractorOS_PL_Template.xlsx" download="ContractorOS_PL_Template.xlsx" style={{...S.btn,background:accent,color:"#0a0a0a",textDecoration:"none",display:"inline-block",flexShrink:0,padding:"10px 20px",textAlign:"center"}}>
                    Download Template →
                  </a>
                </div>

                {/* How to export guide */}
                <div style={{background:"#0c0c14",border:"1px solid #1a1a2a",borderRadius:8,padding:"16px 20px",marginBottom:20}}>
                  <div style={{fontSize:10,color:"#3a3a6a",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:12}}>How to Export from QuickBooks</div>
                  {[
                    ["1","Go to Reports → Profit and Loss"],
                    ["2","Set your date range"],
                    ["3","Click Export / Print → Export to CSV"],
                    ["4","Save the file and upload it below"],
                  ].map(([n,step])=>(
                    <div key={n} style={{display:"flex",gap:12,padding:"6px 0",borderTop:n!=="1"?"1px solid #14141e":"none",alignItems:"center"}}>
                      <div style={{width:20,height:20,background:"#1a1a2a",border:"1px solid #2a2a4a",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#6060aa",flexShrink:0}}>{n}</div>
                      <div style={{fontSize:11,color:"#8888cc"}}>{step}</div>
                    </div>
                  ))}
                  <div style={{marginTop:10,fontSize:10,color:"#3a3a5a",fontStyle:"italic"}}>Excel users: Save your spreadsheet as CSV (File → Save As → CSV) before uploading.</div>
                </div>

                {/* Upload area */}
                {!excelResult&&!excelImporting&&(
                  <label style={{display:"block",cursor:"pointer"}}>
                    <div style={{border:"2px dashed #2a2a4a",borderRadius:8,padding:"40px 24px",textAlign:"center",background:"#0d0d14",transition:"all 0.2s"}}
                      onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#6060aa";}}
                      onDragLeave={e=>{e.currentTarget.style.borderColor="#2a2a4a";}}
                      onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)importExcelPL(f);}}>
                      <div style={{fontSize:32,marginBottom:12}}>📊</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:6}}>Drop your CSV file here</div>
                      <div style={{fontSize:11,color:"#555",marginBottom:16}}>or click to browse</div>
                      <div style={{fontSize:10,color:"#3a3a5a"}}>Supports: QuickBooks CSV export, Excel CSV, plain text P&L</div>
                    </div>
                    <input type="file" accept=".csv,.txt,.xls,.xlsx" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)importExcelPL(f);}}/>
                  </label>
                )}

                {excelImporting&&(
                  <div style={{...S.card,textAlign:"center",padding:40}}>
                    <div style={{width:36,height:36,border:`2px solid #1e1e1e`,borderTop:`2px solid ${accent}`,borderRadius:"50%",animation:"spin 0.7s linear infinite",margin:"0 auto 16px"}}/>
                    <div style={{fontSize:12,color:"#555"}}>Reading your file and extracting line items...</div>
                  </div>
                )}

                {excelResult&&!excelResult.error&&(
                  <div style={{animation:"fadeUp 0.3s ease"}}>
                    <div style={{...S.card,marginBottom:14,background:"#051a05",border:"1px solid #0d3a1a"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#22c55e",marginBottom:10}}>✓ File Parsed Successfully</div>
                      {excelResult.summary&&(
                        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
                          {[["Revenue",fmt$(excelResult.summary.totalRevenue||0),"#22c55e"],["Expenses",fmt$(excelResult.summary.totalExpenses||0),"#ef4444"],["Net Profit",fmt$(excelResult.summary.netProfit||0),(excelResult.summary.netProfit||0)>=0?"#22c55e":"#ef4444"]].map(([lbl,val,col])=>(
                            <div key={lbl} style={{background:"#0a0f0a",border:"1px solid #1a2a1a",borderRadius:5,padding:"10px 12px"}}>
                              <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{lbl}</div>
                              <div style={{fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:col}}>{val}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{fontSize:11,color:"#2d5a2d",marginBottom:14}}>
                        Found {excelResult.revenue?.length||0} revenue items and {excelResult.expenses?.length||0} expense items.
                        {excelResult.summary?.period&&` Period: ${excelResult.summary.period}`}
                      </div>
                      <div style={{display:"flex",gap:10}}>
                        <button className="hov" onClick={confirmExcelImport} style={S.btn}>Import All Items →</button>
                        <button onClick={()=>setExcelResult(null)} style={S.ghost}>Cancel</button>
                      </div>
                    </div>

                    {/* Preview */}
                    {excelResult.revenue?.slice(0,3).map((r,i)=>(
                      <div key={i} style={{...S.card,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div><div style={{fontSize:11,color:"#c8c4bc"}}>{r.description}</div><div style={{fontSize:9,color:"#555"}}>Revenue · {r.date}</div></div>
                        <div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#22c55e"}}>{fmt$(r.amount)}</div>
                      </div>
                    ))}
                    {excelResult.expenses?.slice(0,3).map((e,i)=>(
                      <div key={i} style={{...S.card,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div><div style={{fontSize:11,color:"#c8c4bc"}}>{e.description}</div><div style={{fontSize:9,color:"#555"}}>{e.category} · {e.date}</div></div>
                        <div style={{fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#ef4444"}}>{fmt$(e.amount)}</div>
                      </div>
                    ))}
                    {((excelResult.revenue?.length||0)+(excelResult.expenses?.length||0))>6&&(
                      <div style={{fontSize:11,color:"#555",textAlign:"center",padding:"10px 0"}}>...and {((excelResult.revenue?.length||0)+(excelResult.expenses?.length||0))-6} more items</div>
                    )}
                  </div>
                )}

                {excelResult?.error&&(
                  <div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010"}}>
                    <div style={{fontSize:13,color:"#ef4444",marginBottom:8}}>⚠ Import Failed</div>
                    <div style={{fontSize:11,color:"#7a4040",marginBottom:14}}>{excelResult.error}</div>
                    <button onClick={()=>setExcelResult(null)} style={S.ghost}>Try Again</button>
                  </div>
                )}

                {/* QuickBooks API note */}
                <div style={{marginTop:24,background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:8,padding:"16px 20px"}}>
                  <div style={{fontSize:10,color:"#444",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>🔌 QuickBooks Direct Sync — Coming Soon</div>
                  <div style={{fontSize:11,color:"#444",lineHeight:1.7}}>A direct QuickBooks Online integration will automatically sync your P&L without any manual export. Requires a QB developer account and Intuit app review — on the roadmap for Phase 2.</div>
                </div>
              </div>
            )}

            {/* ── D9: Dead Miles ── */}
            {subScreen==="deadmiles"&&segment==="otr"&&(
              <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#e8e4d8"}}>Dead Miles Tracker</div>
                  <button className="hov" onClick={()=>setShowDeadMilesAdd(p=>!p)} style={S.btn}>+ Add Entry</button>
                </div>
                {showDeadMilesAdd&&<div style={{...S.card,marginBottom:16}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <input type="date" value={deadMilesForm.date} onChange={e=>setDeadMilesForm(p=>({...p,date:e.target.value}))} style={S.input}/>
                    <input placeholder="From Location" value={deadMilesForm.fromLocation} onChange={e=>setDeadMilesForm(p=>({...p,fromLocation:e.target.value}))} style={S.input}/>
                    <input placeholder="To Location" value={deadMilesForm.toLocation} onChange={e=>setDeadMilesForm(p=>({...p,toLocation:e.target.value}))} style={S.input}/>
                    <input placeholder="Empty Miles" type="number" value={deadMilesForm.emptyMiles} onChange={e=>setDeadMilesForm(p=>({...p,emptyMiles:e.target.value}))} style={S.input}/>
                  </div>
                  <select value={deadMilesForm.reason} onChange={e=>setDeadMilesForm(p=>({...p,reason:e.target.value}))} style={{...S.input,marginBottom:8}}>
                    {["Looking for load","Repositioning","Home time","Other"].map(r=><option key={r}>{r}</option>)}
                  </select>
                  <input placeholder="Notes" value={deadMilesForm.notes} onChange={e=>setDeadMilesForm(p=>({...p,notes:e.target.value}))} style={{...S.input,marginBottom:8}}/>
                  <button className="hov" onClick={()=>{
                    setDeadMilesLog(p=>[{id:Date.now(),...deadMilesForm},...p]);
                    setDeadMilesForm({date:"",fromLocation:"",toLocation:"",emptyMiles:"",reason:"Looking for load",notes:""});
                    setShowDeadMilesAdd(false);
                  }} style={S.btn}>Save Entry</button>
                </div>}
                {(()=>{
                  const monthStr=new Date().toISOString().slice(0,7);
                  const monthDead=deadMilesLog.filter(d=>d.date&&d.date.startsWith(monthStr)).reduce((s,d)=>s+parseFloat(d.emptyMiles||0),0);
                  const estCost=monthDead*parseFloat(settings.cpm||0.18);
                  return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:16}}>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Dead Miles This Month</div><div style={{fontSize:24,fontWeight:700,color:accent}}>{monthDead.toFixed(0)}</div></div>
                    <div style={S.card}><div style={{fontSize:11,color:"#888"}}>Est. Cost (CPM)</div><div style={{fontSize:24,fontWeight:700,color:"#ef4444"}}>${estCost.toFixed(0)}</div></div>
                  </div>;
                })()}
                {deadMilesLog.length===0&&<div style={{color:"#555",fontSize:12}}>No dead miles logged yet.</div>}
                {deadMilesLog.map(d=>(
                  <div key={d.id} style={{...S.card,marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:12,color:"#e8e4d8"}}>{d.date} · {d.fromLocation}→{d.toLocation}</div>
                        <div style={{fontSize:11,color:"#888"}}>{d.emptyMiles}mi · {d.reason}</div>
                      </div>
                      <button className="hov" onClick={()=>setDeadMilesLog(p=>p.filter(x=>x.id!==d.id))} style={{fontSize:10,padding:"2px 8px",borderRadius:3,border:"1px solid #ef444444",background:"transparent",color:"#ef4444",cursor:"pointer"}}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

  );
}
