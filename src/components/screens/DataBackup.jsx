// DataBackup screen
export default function DataBackup(p) {
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
        const currentYear=new Date().getFullYear();const lastYear=currentYear-1;
        const yearTotals=(yr)=>{const rev=revenue.filter(r=>r.date?.startsWith(yr.toString())).reduce((s,r)=>s+parseFloat(r.amount||0),0);const exp=expenses.filter(e=>e.date?.startsWith(yr.toString())).reduce((s,e)=>s+parseFloat(e.amount||0),0);return{rev,exp,net:rev-exp};};
        const cy=yearTotals(currentYear);const ly=yearTotals(lastYear);
        const revChange=ly.rev>0?(((cy.rev-ly.rev)/ly.rev)*100).toFixed(1):null;
        const netChange=ly.net!==0?(((cy.net-ly.net)/Math.abs(ly.net))*100).toFixed(1):null;
        const downloadJSON=()=>{const allData={exportDate:new Date().toISOString(),version:"ContractorOS-v10",revenue,expenses,drivers,vehicles,maintenance,compliance,contracts,incidents,brokers,loads,dispatches,payroll,fuelLog,invoices,odometer,tires,documents:documents.map(d=>({...d,fileData:undefined})),contacts};const blob=new Blob([JSON.stringify(allData,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`ContractorOS_Backup_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);};
        const downloadCSV=(data,filename,cols)=>{if(!data.length)return;const header=cols.join(",");const rows=data.map(r=>cols.map(c=>`"${(r[c]||"").toString().replace(/"/g,'""')}"`).join(","));const blob=new Blob([[header,...rows].join("\n")],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);};
        const calcBytes=(arr)=>new Blob([JSON.stringify(arr)]).size;
        const docFilesBytes=documents.reduce((s,d)=>s+(d.fileData?Math.round((d.fileData.length*3)/4):0),0);
        const breakdowns=[
          {label:"Documents (files)",bytes:docFilesBytes,color:"#f59e0b"},
          {label:"Revenue / Expenses",bytes:calcBytes([...revenue,...expenses]),color:"#22c55e"},
          {label:"Drivers",bytes:calcBytes(drivers),color:"#60a5fa"},
          {label:"Maintenance",bytes:calcBytes(maintenance),color:"#ef4444"},
          {label:"Compliance",bytes:calcBytes(compliance),color:"#8888cc"},
        ].sort((a,b)=>b.bytes-a.bytes);
        const totalBytes=breakdowns.reduce((s,b)=>s+b.bytes,0)+calcBytes([...vehicles,...loads,...routes,...payroll,...fuelLog,...invoices,...odometer,...tires,...dispatches,...contacts,...hosLog,...incidents,...contracts,...brokers]);
        const LS_MAX=5*1024*1024;
        const usedPct=Math.min(100,(totalBytes/LS_MAX)*100);
        const storColor=usedPct>85?"#ef4444":usedPct>65?"#f59e0b":"#22c55e";
        const fmtKB=(b)=>b<1024?`${b}B`:b<1024*1024?`${(b/1024).toFixed(1)}KB`:`${(b/1024/1024).toFixed(2)}MB`;
        const lastCleanup=settings?.lastCleanupDate||null;
        const doCleanup=(archiveMonths=12)=>{
          const cutoff=new Date();cutoff.setMonth(cutoff.getMonth()-archiveMonths);
          const cutStr=cutoff.toISOString().slice(0,10);
          setRevenue(p=>p.filter(r=>r.date>=cutStr));
          setExpenses(p=>p.filter(e=>e.date>=cutStr));
          setMaintenance(p=>p.filter(m=>m.date>=cutStr));
          setFuelLog(p=>p.filter(f=>f.date>=cutStr));
          setOdometer(p=>p.filter(o=>o.date>=cutStr));
          setDocuments(p=>p.map(d=>({...d,fileData:null,fileSize:null})));
          setSettings(p=>({...p,lastCleanupDate:new Date().toISOString().slice(0,10)}));
          showValidation("Cleanup complete — old records archived and uploaded files cleared.");
        };
        return(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:800,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
            <div style={{...S.section,marginBottom:4}}>DATA & BACKUP</div>
            <p style={{fontSize:11,color:"#999",marginBottom:24,lineHeight:1.8}}>Export your data for backup, accounting, or migration. ContractorOS stores everything in your browser — export regularly so you don't lose anything if you clear your cache.</p>
            {/* Storage Usage */}
            <div style={{...S.card,marginBottom:24,background:"#0a0f1a",border:"1px solid #1a1a3a"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8"}}>Storage Usage</div>
                <div style={{fontSize:12,color:storColor,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{fmtKB(totalBytes)} / 5MB</div>
              </div>
              <div style={{height:8,background:"#1a1a2a",borderRadius:4,marginBottom:16}}>
                <div style={{height:"100%",width:`${usedPct}%`,background:storColor,borderRadius:4,transition:"width 0.4s"}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {breakdowns.slice(0,5).map(b=>(
                  <div key={b.label} style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:b.color,flexShrink:0}}/>
                    <div style={{flex:1,fontSize:10,color:"#aaa"}}>{b.label}</div>
                    <div style={{fontSize:10,color:"#888",width:60,textAlign:"right"}}>{fmtKB(b.bytes)}</div>
                    <div style={{width:80,height:3,background:"#1a1a2a",borderRadius:2}}>
                      <div style={{height:"100%",width:`${totalBytes>0?Math.min(100,(b.bytes/totalBytes)*100):0}%`,background:b.color,borderRadius:2}}/>
                    </div>
                  </div>
                ))}
              </div>
              {usedPct>65&&<div style={{marginTop:12,fontSize:10,color:storColor,lineHeight:1.7}}>⚠ {usedPct>85?"Storage nearly full — run Data Cleanup or download a backup and clear browser data.":"Storage getting full — consider running Data Cleanup soon."}</div>}
            </div>
            {/* Data Cleanup */}
            <div style={{...S.card,marginBottom:24,background:"#0a0f1a",border:"1px solid #1a1a3a"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:4}}>Data Cleanup</div>
              <div style={{fontSize:11,color:"#999",marginBottom:14,lineHeight:1.7}}>Archive records older than 12 months and clear all uploaded file data (images/PDFs stored in browser). Document names and metadata are kept. <strong style={{color:"#888"}}>Export a backup before running.</strong></div>
              {lastCleanup&&<div style={{fontSize:10,color:"#3a3a6a",marginBottom:10}}>Last cleanup: {fmtDate(lastCleanup)}</div>}
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button className="hov" onClick={()=>{if(window.confirm("Archive records older than 12 months and clear all uploaded files from browser storage?\n\nDocument names/references are kept. Download a backup first."))doCleanup(12);}} style={{...S.btn,background:"#1a1a2a",border:"1px solid #3a3a6a",fontSize:11}}>Archive Old Records + Clear Files</button>
                <button className="hov" onClick={()=>{if(window.confirm("Clear ONLY uploaded files from browser storage? Document names and all other data are kept."))setDocuments(p=>p.map(d=>({...d,fileData:null,fileSize:null})));}} style={{...S.btn,background:"#1a0808",border:"1px solid #3a1010",fontSize:11}}>Clear Uploaded Files Only</button>
              </div>
            </div>
            {/* Year-over-year */}
            <div style={{...S.card,marginBottom:24,background:"#0d0d14",border:"1px solid #1a1a2a"}}>
              <div style={{fontSize:10,color:"#3a3a6a",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>Year-Over-Year Comparison</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                {[["Revenue",fmt$(ly.rev),fmt$(cy.rev),revChange],["Expenses",fmt$(ly.exp),fmt$(cy.exp),null],["Net Profit",fmt$(ly.net),fmt$(cy.net),netChange]].map(([lbl,prev,curr,chg])=>{const isPos=lbl==="Expenses"?false:parseFloat(chg)>0;return(
                  <div key={lbl} style={{background:"#0f0f1a",border:"1px solid #1a1a2a",borderRadius:6,padding:14}}>
                    <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>{lbl}</div>
                    <div style={{marginBottom:6}}><div style={{fontSize:10,color:"#888"}}>{lastYear}</div><div style={{fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:"#aaa"}}>{prev}</div></div>
                    <div><div style={{fontSize:10,color:"#aaa"}}>{currentYear}</div><div style={{fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:lbl==="Expenses"?"#ef4444":"#22c55e"}}>{curr}</div></div>
                    {chg!==null&&<div style={{marginTop:8,fontSize:11,color:isPos?"#22c55e":"#ef4444",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{parseFloat(chg)>0?"▲":"▼"} {Math.abs(parseFloat(chg))}% vs last year</div>}
                  </div>
                );})}
              </div>
            </div>
            {/* Restore from backup */}
            <div style={{...S.card,marginBottom:20,background:"#0a0f1a",border:"1px solid #1a1a3a"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8"}}>Restore from Backup</div>
                  <div style={{fontSize:11,color:"#999",marginTop:4}}>Upload a previously exported JSON backup to restore all your data.</div>
                </div>
              </div>
              <input type="file" accept=".json" onChange={async(e)=>{
                const file = e.target.files[0];
                if(!file) return;
                try {
                  const text = await file.text();
                  const data = JSON.parse(text);
                  if(!data.version?.includes("ContractorOS")) { alert("This doesn't look like a ContractorOS backup file."); return; }
                  if(!window.confirm("Restore this backup? This will replace ALL current data. Make sure to export a backup of your current data first.")) return;
                  // Restore each data slice
                  const restoreMap = {revenue:setRevenue,expenses:setExpenses,drivers:setDrivers,vehicles:setVehicles,maintenance:setMaintenance,compliance:setCompliance,contracts:setContracts,incidents:setIncidents,brokers:setBrokers,loads:setLoads,routes:setRoutes,payroll:setPayroll,fuelLog:setFuelLog,invoices:setInvoices,odometer:setOdometer,tires:setTires,contacts:setContacts,dispatches:setDispatches,hosLog:setHosLog};
                  Object.entries(restoreMap).forEach(([key,setter])=>{ if(data[key]) setter(data[key]); });
                  if(data.settings) setSettings(data.settings);
                  if(data.segment) setSegment(data.segment);
                  alert("✓ Backup restored successfully! Your data has been updated.");
                } catch(err) { alert("Failed to read backup file. Make sure it's a valid ContractorOS JSON export."); }
                e.target.value = "";
              }} style={{...S.input,padding:"8px 14px",cursor:"pointer"}}/>
              <div style={{marginTop:8,fontSize:10,color:"#3a3a6a",lineHeight:1.7}}>⚠ Restoring a backup replaces all current data. Always export a fresh backup before restoring.</div>
            </div>

            {/* Full backup */}
            <div style={{...S.card,marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8"}}>Full Data Backup (JSON)</div><div style={{fontSize:11,color:"#999",marginTop:4}}>Exports all data — drivers, vehicles, compliance, finance, payroll, everything. Note: uploaded files are excluded to keep backup small.</div></div>
                <button className="hov" onClick={downloadJSON} style={S.btn}>Download →</button>
              </div>
              <div style={{padding:"10px 14px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:5,fontSize:10,color:"#888",lineHeight:1.7}}>💡 <strong style={{color:"#aaa"}}>Tip:</strong> Save to Google Drive or Dropbox. If you clear browser cache, this is your only recovery option until cloud sync is added.</div>
            </div>
            {/* CSV exports */}
            <div style={{...S.card,marginBottom:20}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:4}}>Spreadsheet Exports (CSV)</div>
              <div style={{fontSize:11,color:"#999",marginBottom:16}}>Individual tables as CSV — open in Excel, Google Sheets, or send to your accountant.</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                {[[revenue,"Revenue","revenue.csv",["date","description","amount","vehicle"]],[expenses,"Expenses","expenses.csv",["date","category","amount","description","vehicle"]],[drivers,"Drivers","drivers.csv",["name","phone","hireDate","payType","payRate","status"]],[maintenance,"Maintenance","maintenance.csv",["truckName","type","date","mileage","cost","notes"]],[payroll,"Payroll","payroll.csv",["driverName","periodStart","periodEnd","gross","status","paidDate"]],[fuelLog,"Fuel Log","fuel.csv",["date","truckName","gallons","pricePerGallon","totalCost","state"]]].map(([data,label,file,cols])=>(
                  <button key={file} className="hov" onClick={()=>downloadCSV(data,file,cols)} style={{...S.card,textAlign:"left",cursor:"pointer",display:"block",border:`1px solid ${accent}33`}}>
                    <div style={{fontSize:13,color:accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{label}</div>
                    <div style={{fontSize:10,color:"#999",marginTop:3}}>{data.length} records · .csv</div>
                  </button>
                ))}
              </div>
            </div>
            {/* Danger zone */}
            <div style={{...S.card,background:"#1a0808",border:"1px solid #3a1010"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:4}}>⚠ Danger Zone</div>
              <div style={{fontSize:11,color:"#7a4040",marginBottom:14,lineHeight:1.7}}>Permanently deletes data from your browser. <strong>Download a backup first.</strong> Cannot be undone.</div>
              <button onClick={()=>{if(window.confirm("Delete ALL ContractorOS data? This cannot be undone. Have you downloaded a backup?")){db.clearAll().then(()=>window.location.reload());}}} style={{...S.danger,fontSize:11,padding:"8px 16px"}}>Clear All Data</button>
            </div>
          </div>
        </div>
      )})();
}
