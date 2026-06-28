// Documents screen
export default function Documents(p) {
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
        const DOC_TYPES=["Rate Confirmation","Bill of Lading (BOL)","Delivery Confirmation","Insurance Certificate","Contract","Invoice","Driver File","Inspection Report","Permit","Business Tax Return","Personal Tax Return","Bank Statement","Operating Authority","Articles of Incorporation","LLC Operating Agreement","Business License","EIN Confirmation","Personal Financial Statement","Down Payment Documentation","Other"];
        const TYPE_COLORS={"Rate Confirmation":"#f59e0b","Bill of Lading (BOL)":"#60a5fa","Delivery Confirmation":"#22c55e","Insurance Certificate":"#ef4444","Contract":"#8888cc","Invoice":"#22c55e","Driver File":"#60a5fa","Inspection Report":"#f59e0b","Permit":"#f87171","Other":"#555"};
        const types=["all",...DOC_TYPES];
        const filtered=docFilter==="all"?documents:documents.filter(d=>d.type===docFilter);
        const typeCount={};documents.forEach(d=>{typeCount[d.type]=(typeCount[d.type]||0)+1;});
        const handleFileUpload=async(e)=>{const file=e.target.files[0];if(!file)return;if(file.size>2*1024*1024){showValidation("File too large (max 2MB). Use filename/reference only for large files.");e.target.value="";return;}const isImg=file.type.startsWith("image/");if(isImg&&p.compressImage){const compressed=await p.compressImage(file);setDocFileData({name:file.name,dataUrl:compressed,size:Math.round(compressed.length*0.75)});setDocForm(pr=>({...pr,fileName:file.name}));return;}const reader=new FileReader();reader.onload=(ev)=>{setDocFileData({name:file.name,dataUrl:ev.target.result,size:file.size});setDocForm(pr=>({...pr,fileName:file.name}));};reader.readAsDataURL(file);};
        return(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{maxWidth:900,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div><div style={S.section}>DOCUMENT CENTER</div><div style={{fontSize:11,color:"#999",marginTop:4}}>Rate cons, BOLs, insurance certs, and all key documents.</div></div>
              <button className="hov" onClick={()=>setDocShowAdd(!docShowAdd)} style={S.btn}>{docShowAdd?"Cancel":"+ Add Document"}</button>
            </div>
            <div style={{background:"#0a0f1a",border:"1px solid #1a1a3a",borderRadius:8,padding:"12px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
              <div style={{fontSize:20}}>📎</div>
              <div style={{fontSize:10,color:"#4a4a8a",lineHeight:1.7}}>Small files (&lt;2MB) are stored as Base64 in localStorage. For large files, log the filename/reference here and keep the original in Google Drive or Dropbox. Cloud sync coming in next update.</div>
            </div>
            {docShowAdd&&(
              <div style={{...S.card,marginBottom:18,border:`1px solid ${accent}33`}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div style={{gridColumn:"1/-1"}}><label style={S.label}>Document Name *</label><input value={docForm.name} onChange={e=>setDocForm(p=>({...p,name:e.target.value}))} placeholder="Rate Con #1234 — Hub Group, BOL Chicago run..." style={S.input}/></div>
                  <div><label style={S.label}>Type</label><select value={docForm.type} onChange={e=>setDocForm(p=>({...p,type:e.target.value}))} style={S.input}>{DOC_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                  <div><label style={S.label}>Date</label><input type="date" value={docForm.date} onChange={e=>setDocForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                  <div><label style={S.label}>Linked To (truck / driver / load)</label><input value={docForm.linkedTo} onChange={e=>setDocForm(p=>({...p,linkedTo:e.target.value}))} placeholder="Unit 1, John Smith, Load #5678..." style={S.input}/></div>
                  <div>
                    <label style={S.label}>File (optional, max 2MB)</label>
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.csv,.xlsx" onChange={async(e)=>{
                      handleFileUpload(e);
                      // OCR: if it's an image/pdf, try to extract key fields using Claude
                      const file = e.target.files?.[0];
                      if(!file||(file.type!=="image/jpeg"&&file.type!=="image/png"&&file.type!=="application/pdf")) return;
                      if(file.size > 2*1024*1024) { showValidation("File too large (max 2MB). Use filename/reference only for large files."); return; }
                      try {
                        const reader = new FileReader();
                        reader.onload = async(ev) => {
                          const base64 = ev.target.result.split(",")[1];
                          const mediaType = file.type === "application/pdf" ? "application/pdf" : file.type;
                          const res = await fetch("/api/claude", {
                            method:"POST",
                            headers:{"Content-Type":"application/json"},
                            body:JSON.stringify({prompt:"Extract these fields from this document if present. Return ONLY a JSON object with these keys (null if not found): documentName, documentType (Rate Confirmation/BOL/Delivery Confirmation/Invoice/Other), date (YYYY-MM-DD), linkedTo (truck or driver name), referenceNumber, notes (any important info like load#, PO#, rate amount). No other text.", base64Data:base64, mediaType, max_tokens:500})
                          });
                          const data = await res.json();
                          try {
                            const text = data.content?.[0]?.text || "{}";
                            const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
                            if(parsed.documentName) setDocForm(p=>({...p,name:parsed.documentName||p.name,type:parsed.documentType||p.type,date:parsed.date||p.date,linkedTo:parsed.linkedTo||p.linkedTo,fileName:file.name,notes:parsed.notes||p.notes}));
                          } catch{}
                        };
                        reader.readAsDataURL(file);
                      } catch{}
                    }} style={{...S.input,padding:"7px 14px"}}/>
                    <div style={{fontSize:9,color:"#888",marginTop:4}}>💡 Images and PDFs are automatically scanned to fill in document details</div>
                  </div>
                  <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={docForm.notes} onChange={e=>setDocForm(p=>({...p,notes:e.target.value}))} placeholder="Confirmation #, broker contact, expiry..." style={S.input}/></div>
                </div>
                {docFileData&&<div style={{marginTop:8,fontSize:10,color:"#22c55e"}}>✓ {docFileData.name} ({(docFileData.size/1024).toFixed(0)}KB) — will be stored in browser</div>}
                <button className="hov" onClick={()=>{if(!docForm.name){showValidation("Document name is required");return;}const doc={...docForm,id:Date.now(),createdDate:new Date().toISOString().slice(0,10),fileData:docFileData?.dataUrl||null,fileSize:docFileData?.size||null};setDocuments(p=>[doc,...p]);setDocForm({name:"",type:"Rate Confirmation",date:"",linkedTo:"",notes:"",fileName:""});setDocFileData(null);setDocShowAdd(false);}} style={{...S.btn,marginTop:14}}>Save Document</button>
              </div>
            )}
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
              {types.map(t=>(<button key={t} onClick={()=>setDocFilter(t)} style={{background:docFilter===t?accent+"22":"transparent",border:`1px solid ${docFilter===t?accent:"#2a2a2a"}`,color:docFilter===t?accent:"#555",padding:"4px 12px",borderRadius:4,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>{t==="all"?`All (${documents.length})`:`${t} (${typeCount[t]||0})`}</button>))}
            </div>
            {filtered.length===0&&!docShowAdd&&<div style={{...S.card,textAlign:"center",color:"#999",fontSize:12,padding:40}}>{docFilter==="all"?"No documents tracked yet.":`No ${docFilter} documents yet.`}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filtered.map(doc=>(
                <div key={doc.id} style={{...S.card,borderLeft:`3px solid ${TYPE_COLORS[doc.type]||"#555"}`}}>
                  {docEditId===doc.id?(
                    <div>
                      <div style={{fontSize:9,color:accent,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Editing Document</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                        <div style={{gridColumn:"1/-1"}}><label style={S.label}>Name</label><input value={docEditForm.name||""} onChange={e=>setDocEditForm(p=>({...p,name:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Type</label><select value={docEditForm.type||""} onChange={e=>setDocEditForm(p=>({...p,type:e.target.value}))} style={S.input}>{DOC_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                        <div><label style={S.label}>Date</label><input type="date" value={docEditForm.date||""} onChange={e=>setDocEditForm(p=>({...p,date:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>Linked To</label><input value={docEditForm.linkedTo||""} onChange={e=>setDocEditForm(p=>({...p,linkedTo:e.target.value}))} style={S.input}/></div>
                        <div><label style={S.label}>File Name / Reference</label><input value={docEditForm.fileName||""} onChange={e=>setDocEditForm(p=>({...p,fileName:e.target.value}))} style={S.input}/></div>
                        <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={docEditForm.notes||""} onChange={e=>setDocEditForm(p=>({...p,notes:e.target.value}))} style={S.input}/></div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>{setDocuments(p=>p.map(d=>d.id===doc.id?{...d,...docEditForm}:d));setDocEditId(null);}} style={{...S.btn,fontSize:11,padding:"6px 16px"}}>Save</button>
                        <button onClick={()=>setDocEditId(null)} style={{...S.ghost,fontSize:10,padding:"6px 12px"}}>Cancel</button>
                      </div>
                    </div>
                  ):(
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                          <div style={{fontSize:12,color:"#c8c4bc"}}>{doc.name}</div>
                          <span style={{fontSize:9,color:TYPE_COLORS[doc.type]||"#555",border:`1px solid ${TYPE_COLORS[doc.type]||"#555"}33`,padding:"1px 7px",borderRadius:3}}>{doc.type}</span>
                        </div>
                        <div style={{fontSize:10,color:"#999"}}>{fmtDate(doc.date||doc.createdDate)}{doc.linkedTo&&` · ${doc.linkedTo}`}{doc.fileName&&` · ${doc.fileName}`}{doc.notes&&` · ${doc.notes}`}</div>
                      </div>
                      <div style={{display:"flex",gap:8,flexShrink:0,alignItems:"center"}}>
                        {doc.fileData&&<a href={doc.fileData} download={doc.fileName||doc.name} style={{...S.btn,background:"#22c55e",fontSize:10,padding:"5px 12px",textDecoration:"none",display:"inline-block"}}>↓ Download</a>}
                        <div style={{fontSize:9,color:"#333",border:"1px solid #222",padding:"2px 8px",borderRadius:3}}>{doc.fileData?"📎 File":"📋 Ref"}</div>
                        <button onClick={()=>{setDocEditId(doc.id);setDocEditForm({name:doc.name,type:doc.type,date:doc.date||"",linkedTo:doc.linkedTo||"",fileName:doc.fileName||"",notes:doc.notes||""});}} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,cursor:"pointer",fontSize:10,padding:"4px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Edit</button>
                        <button onClick={()=>setDocuments(p=>p.filter(x=>x.id!==doc.id))} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12}}>✕</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )})();
}
