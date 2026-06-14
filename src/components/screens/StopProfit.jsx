import { useState } from "react";

export default function StopProfit(p) {
  const {
    seg, accent, S, segment,
    drivers, fuelLog, dispatches, settings, odometer,
    stopProfitLog, setStopProfitLog,
    stopProfitTab, setStopProfitTab, stopProfitForm, setStopProfitForm,
    showValidation, fmt$, fmtDate,
  } = p;

  const [gasOvr, setGasOvr] = useState({on:false,v:""});
  const [dpOvr, setDpOvr] = useState({on:false,v:""});
  const [insOvr, setInsOvr] = useState({on:false,v:""});
  const [truckOvr, setTruckOvr] = useState({on:false,v:""});
  const [hourlyMap, setHourlyMap] = useState({});
  const [gasExpanded, setGasExpanded] = useState(false);
  const [manualDays, setManualDays] = useState("");

  const today = new Date().toISOString().slice(0,10);
  const entryDate = stopProfitForm.date || today;
  const stops = parseFloat(stopProfitForm.stops||0);
  const stopRate = parseFloat(stopProfitForm.stopRate||0);
  const dailyGuarantee = parseFloat(stopProfitForm.dailyGuarantee!=null ? stopProfitForm.dailyGuarantee : (settings?.clientDailyRate||0));
  const mileStipendRate = parseFloat(stopProfitForm.mileStipendRate!=null ? stopProfitForm.mileStipendRate : (settings?.mileStipendRate||0));

  // Auto-fill miles from odometer: diff of two entries on entryDate
  const todayOdom = (odometer||[]).filter(o=>o.date===entryDate).sort((a,b)=>parseFloat(b.reading)-parseFloat(a.reading));
  const odomMiles = todayOdom.length>=2 ? parseFloat(todayOdom[0].reading)-parseFloat(todayOdom[todayOdom.length-1].reading) : null;
  const milesDriven = parseFloat(stopProfitForm.milesDriven!=null&&stopProfitForm.milesDriven!==""
    ? stopProfitForm.milesDriven
    : (odomMiles!=null ? odomMiles : 0));
  const mileStipend = milesDriven * mileStipendRate;

  const stopBonus = stops * stopRate;
  const totalRevenue = dailyGuarantee + stopBonus + mileStipend;

  // Driver pay — full payType model
  const todayDisp = dispatches.filter(d=>d.date===entryDate);
  const driverBreakdowns = todayDisp.map(d=>{
    const dr = drivers.find(x=>x.name===d.driverName||x.id===d.driverId);
    if(!dr) return {name:d.driverName||"Unknown",pay:0,desc:"Unknown driver",needsHours:false};
    const rate = parseFloat(dr.payRate||0);
    const hours = parseFloat(hourlyMap[d.driverName]||hourlyMap[dr.id]||0);
    let base=0, desc="";
    if(dr.payType==="per_day")       { base=rate; desc=`$${rate.toFixed(2)}/day base`; }
    else if(dr.payType==="per_stop") { base=stops*rate; desc=`${stops} stops × $${rate.toFixed(2)}`; }
    else if(dr.payType==="percentage"){ base=totalRevenue*(rate/100); desc=`${rate}% of $${totalRevenue.toFixed(0)} revenue`; }
    else if(dr.payType==="hourly")   { base=hours*rate; desc=hours>0?`${hours}h × $${rate.toFixed(2)}`:"Enter hours below"; }
    else if(dr.payType==="salary")   { base=rate/52/5; desc=`$${rate.toFixed(0)}/yr ÷ 260 days`; }
    const bonusRate = parseFloat(dr.bonusRate||0);
    let bonus=0, bonusDesc="";
    if(bonusRate>0 && dr.payType==="per_day" && stops>0){
      bonus=stops*bonusRate;
      bonusDesc=` + $${bonus.toFixed(2)} stop bonus (${stops} × $${bonusRate.toFixed(2)})`;
    }
    return {name:dr.name||d.driverName,pay:base+bonus,desc:`${desc}${bonusDesc}`,needsHours:dr.payType==="hourly"&&hours===0,driverKey:d.driverName||dr.id};
  });
  const dpAuto = driverBreakdowns.reduce((s,d)=>s+d.pay,0);
  const driverPay = dpOvr.on ? parseFloat(dpOvr.v||0) : dpAuto;

  // Gas — spread fill cost across estimated days of range
  const getDailyFuelCost = (selectedDate) => {
    const recentFills = fuelLog.filter(f=>f.date<=selectedDate).sort((a,b)=>new Date(b.date)-new Date(a.date));
    if(!recentFills.length) return null;
    const lastFill = recentFills[0];
    const gallons = parseFloat(lastFill.gallons||0);
    const amount = parseFloat(lastFill.totalCost||0);
    const mpg = parseFloat(settings?.mpg||8);
    const recentOdom = (odometer||[]).filter(o=>o.truckName===lastFill.truckName).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,7);
    let avgDailyMiles=200, odomSource="estimated";
    if(recentOdom.length>=2){
      const totalMiles=parseFloat(recentOdom[0].reading)-parseFloat(recentOdom[recentOdom.length-1].reading);
      const days=recentOdom.length-1;
      avgDailyMiles=totalMiles>0?totalMiles/days:200;
      odomSource="odometer";
    }
    const daysOfRange=gallons>0&&mpg>0?gallons/(avgDailyMiles/mpg):1;
    const dailyFuelCost=amount/Math.max(daysOfRange,1);
    return {dailyFuelCost:parseFloat(dailyFuelCost.toFixed(2)),daysOfRange:parseFloat(daysOfRange.toFixed(1)),lastFillAmount:amount,lastFillDate:lastFill.date,gallons,mpg,avgDailyMiles:Math.round(avgDailyMiles),odomSource};
  };
  const fuelCalc = getDailyFuelCost(entryDate);
  const manualDaysNum = parseFloat(manualDays||0);
  const effectiveDays = manualDaysNum>0 ? manualDaysNum : (fuelCalc?.daysOfRange||1);
  const fuelAuto = fuelCalc ? parseFloat((fuelCalc.lastFillAmount/Math.max(effectiveDays,1)).toFixed(2)) : 0;
  const hasFuelLog = fuelCalc !== null;
  const mpgSet = parseFloat(settings?.mpg||0)>0;
  const gasCost = gasOvr.on ? parseFloat(gasOvr.v||0) : fuelAuto;

  // Insurance
  const insMonthly = parseFloat(settings?.monthlyInsurance||0);
  const insDay = insMonthly>0 ? insMonthly/30 : 0;
  const insuranceCost = insOvr.on ? parseFloat(insOvr.v||0) : insDay;

  // Truck
  const truckWeekly = parseFloat(settings?.weeklyTruckPayment||0);
  const truckDay = truckWeekly>0 ? truckWeekly/7 : 0;
  const truckCost = truckOvr.on ? parseFloat(truckOvr.v||0) : truckDay;

  // Other
  const otherCosts = parseFloat(stopProfitForm.otherCosts||0);

  // Results
  const totalCost = driverPay + gasCost + insuranceCost + truckCost + otherCosts;
  const grossProfit = totalRevenue - totalCost;
  const netPerStop = stops>0 ? grossProfit/stops : 0;
  const marginPct = totalRevenue>0 ? (grossProfit/totalRevenue)*100 : 0;
  const marginColor = marginPct>20?"#22c55e":marginPct>=10?"#f59e0b":"#ef4444";
  const profitBg = (totalRevenue===0&&totalCost===0)?"#0f0f14":marginPct>20?"#081a08":marginPct>=10?"#1a1200":"#1a0808";
  const costPct = v => totalCost>0?((v/totalCost)*100).toFixed(0)+"%" : "—";

  // Break-even insight
  const driverDailyBase = driverBreakdowns.reduce((s,d)=>{
    const dr = drivers.find(x=>x.name===d.name);
    return s+(dr?.payType==="per_day"?parseFloat(dr.payRate||0):0);
  },0);
  const fixedCosts = insuranceCost + truckCost + driverDailyBase;
  const stopsToBreakEven = stopRate>0 ? Math.max(0,(fixedCosts-dailyGuarantee)/stopRate) : 0;
  const guaranteeCoversFixed = dailyGuarantee >= fixedCosts;

  // Weekly trend
  const weekEntries = stopProfitLog.filter(e=>{
    if(!e.date) return false;
    return (new Date()-new Date(e.date))/86400000<7;
  });
  const last14 = [...stopProfitLog].filter(e=>e.date).sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(-14);
  const maxNetAbs = Math.max(...last14.map(e=>Math.abs(parseFloat(e.netPerStop||0))),1);
  const wkRevTotal = weekEntries.reduce((s,e)=>s+parseFloat(e.totalRevenue||0),0);
  const wkCostTotal = weekEntries.reduce((s,e)=>s+parseFloat(e.totalCost||0),0);
  const wkProfit = weekEntries.reduce((s,e)=>s+parseFloat(e.grossProfit||0),0);
  const avgMargin = weekEntries.length ? weekEntries.reduce((s,e)=>s+parseFloat(e.marginPct||e.margin||0),0)/weekEntries.length : 0;
  const wkGuarantees = weekEntries.reduce((s,e)=>s+parseFloat(e.dailyGuarantee||0),0);
  const wkStopBonus = weekEntries.reduce((s,e)=>s+parseFloat(e.stopBonus||0),0);
  const wkGas = weekEntries.reduce((s,e)=>s+parseFloat(e.gasCost||0),0);
  const wkDp = weekEntries.reduce((s,e)=>s+parseFloat(e.driverPay||0),0);
  const wkIns = weekEntries.reduce((s,e)=>s+parseFloat(e.insuranceCostDay||0),0);
  const wkTruck = weekEntries.reduce((s,e)=>s+parseFloat(e.truckCostDay||0),0);
  const wkCostBreak = wkGas+wkDp+wkIns+wkTruck;
  const wkPct = v => wkCostBreak>0?((v/wkCostBreak)*100).toFixed(0)+"%" : "0%";

  // Flags
  const flagDays = weekEntries.filter(e=>{
    const rev = parseFloat(e.totalRevenue||0);
    const gas = parseFloat(e.gasCost||0);
    const dp = parseFloat(e.driverPay||0);
    const gp = parseFloat(e.grossProfit||0);
    return (rev>0&&gas/rev>0.25)||(rev>0&&dp/rev>0.40)||gp<0;
  });

  const saveEntry = () => {
    if(!stopProfitForm.stops||!entryDate){showValidation("Date and stops are required");return;}
    setStopProfitLog(prev=>[{
      id:Date.now(), date:entryDate,
      stops, stopRate, dailyGuarantee, stopBonus,
      milesDriven, mileStipendRate, mileStipend,
      driverPay, gasCost, insuranceCostDay:insuranceCost, truckCostDay:truckCost, otherCosts,
      totalRevenue, totalCost, grossProfit, netPerStop, marginPct,
      wasAnyOverridden:gasOvr.on||dpOvr.on||insOvr.on||truckOvr.on,
    },...prev]);
    setStopProfitForm({date:"",stops:"",stopRate:"",dailyGuarantee:"",milesDriven:"",mileStipendRate:"",revenuePerStop:"",driverPay:"",fuelCost:"",vehicleCost:"",otherCosts:""});
    setGasOvr({on:false,v:""});setDpOvr({on:false,v:""});setInsOvr({on:false,v:""});setTruckOvr({on:false,v:""});setHourlyMap({});setManualDays("");
  };

  const linkBtn = (label, screen) => (
    <button onClick={()=>p.setScreen&&p.setScreen(screen)} style={{background:"none",border:"none",color:accent,cursor:"pointer",fontSize:11,fontFamily:"'DM Mono',monospace",padding:0}}>{label}</button>
  );

  const autoRow = (label, displayNode, isOverride, onToggle, editNode) => (
    <div style={{background:"#0f0f18",border:"1px solid #1e1e2e",borderRadius:6,padding:"10px 14px",marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
        <div style={{flex:1}}>
          <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>
            {label}{isOverride&&<span style={{color:"#f59e0b",fontSize:8,marginLeft:6}}>(manual)</span>}
          </div>
          {isOverride ? editNode : displayNode}
        </div>
        <button onClick={onToggle} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,fontSize:9,padding:"3px 10px",borderRadius:3,cursor:"pointer",fontFamily:"'DM Mono',monospace",flexShrink:0}}>
          {isOverride?"Auto":"Edit"}
        </button>
      </div>
    </div>
  );

  const row$ = (label, val, color) => (
    <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #1a1a2a"}}>
      <div style={{fontSize:11,color:"#888"}}>{label}</div>
      <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:color||"#e8e4d8"}}>{fmt$(val)}</div>
    </div>
  );

  return (
    <div style={{flex:1,overflowY:"auto",padding:24}}>
      <div style={{maxWidth:860,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:"#e8e4d8",marginBottom:16}}>📍 Stop Profit</div>
        <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
          {[["entry","Daily Entry"],["trend","Weekly Trend"]].map(([t,l])=>(
            <button key={t} className="hov" onClick={()=>setStopProfitTab(t)} style={{...S.btn,background:stopProfitTab===t?accent:"#1e1e1e",color:stopProfitTab===t?"#000":"#888"}}>{l}</button>
          ))}
        </div>

        {stopProfitTab==="entry"&&(
          <div>
            <div style={S.card}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8",marginBottom:14}}>New Entry</div>

              {/* Date */}
              <div style={{marginBottom:14}}>
                <label style={S.label}>Date</label>
                <input type="date" value={stopProfitForm.date||today} onChange={e=>setStopProfitForm(pr=>({...pr,date:e.target.value}))} style={{...S.input,maxWidth:200}}/>
              </div>

              {/* Revenue section */}
              <div style={{fontSize:10,color:accent,textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:8}}>Revenue (What Lowe's/Client Pays You)</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
                <div>
                  <label style={S.label}>Daily Guarantee ($)</label>
                  <input type="number" placeholder={settings?.clientDailyRate?"Pre-filled from settings":"e.g. 500.00"} value={stopProfitForm.dailyGuarantee!=null?stopProfitForm.dailyGuarantee:""} onChange={e=>setStopProfitForm(pr=>({...pr,dailyGuarantee:e.target.value}))} style={S.input} min={0} step={0.01}/>
                  <div style={{fontSize:9,color:"#555",marginTop:3}}>Fixed daily rate regardless of stops</div>
                </div>
                <div>
                  <label style={S.label}>Stop Rate ($/stop)</label>
                  <input type="number" placeholder="e.g. 35.00" value={stopProfitForm.stopRate||""} onChange={e=>setStopProfitForm(pr=>({...pr,stopRate:e.target.value}))} style={S.input} min={0} step={0.01}/>
                  <div style={{fontSize:9,color:"#555",marginTop:3}}>Bonus Lowe's pays per stop completed</div>
                </div>
                <div>
                  <label style={S.label}>Stops Completed</label>
                  <input type="number" placeholder="e.g. 20" value={stopProfitForm.stops||""} onChange={e=>setStopProfitForm(pr=>({...pr,stops:e.target.value}))} style={S.input} min={0}/>
                </div>
                <div>
                  <label style={S.label}>Miles Driven Today</label>
                  <input type="number" placeholder={odomMiles!=null?`Auto: ${odomMiles} mi`:"e.g. 180"} value={stopProfitForm.milesDriven!=null?stopProfitForm.milesDriven:""} onChange={e=>setStopProfitForm(pr=>({...pr,milesDriven:e.target.value}))} style={S.input} min={0}/>
                  <div style={{fontSize:9,color:"#555",marginTop:3}}>{odomMiles!=null?"Auto-filled from odometer":"Enter or log odometer readings"}</div>
                </div>
                <div>
                  <label style={S.label}>Mile Stipend Rate ($/mile)</label>
                  <input type="number" placeholder={settings?.mileStipendRate?"Pre-filled from settings":"e.g. 0.45"} value={stopProfitForm.mileStipendRate!=null?stopProfitForm.mileStipendRate:""} onChange={e=>setStopProfitForm(pr=>({...pr,mileStipendRate:e.target.value}))} style={S.input} min={0} step={0.01}/>
                  <div style={{fontSize:9,color:"#555",marginTop:3}}>Per-mile rate your client pays</div>
                </div>
              </div>

              {/* Revenue breakdown */}
              {(dailyGuarantee>0||stopBonus>0||mileStipend>0)&&(
                <div style={{background:"#081a08",border:"1px solid #22c55e22",borderRadius:6,padding:"10px 14px",marginBottom:14}}>
                  <div style={{fontSize:9,color:"#22c55e",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Revenue Breakdown</div>
                  {row$("Daily guarantee",dailyGuarantee,"#22c55e")}
                  {stopBonus>0&&row$(`Stop bonus (${stops} × $${stopRate.toFixed(2)})`,stopBonus,"#22c55e")}
                  {mileStipend>0&&row$(`Mile stipend (${milesDriven} mi × $${mileStipendRate.toFixed(2)})`,mileStipend,"#22c55e")}
                  <div style={{display:"flex",justifyContent:"space-between",paddingTop:6,marginTop:2}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#22c55e"}}>Total Revenue</div>
                    <div style={{fontSize:14,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:"#22c55e"}}>{fmt$(totalRevenue)}</div>
                  </div>
                </div>
              )}

              {/* Cost section */}
              <div style={{fontSize:10,color:"#ef4444",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:8}}>Costs (What You Pay Out)</div>

              {/* Driver Pay */}
              {autoRow(
                "Driver Pay (what YOU pay your driver)",
                <div>
                  {todayDisp.length===0&&<div style={{fontSize:12,color:"#f59e0b"}}>No drivers dispatched today</div>}
                  {driverBreakdowns.map((d,i)=>(
                    <div key={i} style={{fontSize:11,color:d.pay>0?"#e8e4d8":"#f59e0b",marginBottom:3}}>
                      {d.name}: {d.desc} = <strong>{fmt$(d.pay)}</strong>
                      {d.needsHours&&(
                        <span style={{marginLeft:8}}>
                          <input type="number" placeholder="hrs" min={0} step={0.5}
                            value={hourlyMap[d.driverKey]||""}
                            onChange={e=>setHourlyMap(m=>({...m,[d.driverKey]:e.target.value}))}
                            style={{...S.input,width:60,display:"inline-block",padding:"2px 6px",fontSize:10}}/>
                        </span>
                      )}
                    </div>
                  ))}
                  {todayDisp.length>0&&<div style={{fontSize:12,color:"#e8e4d8",marginTop:4,fontWeight:700}}>Total Driver Pay: {fmt$(dpAuto)}</div>}
                </div>,
                dpOvr.on,
                ()=>setDpOvr(x=>({on:!x.on,v:x.on?"":dpAuto.toFixed(2)})),
                <input type="number" value={dpOvr.v} onChange={e=>setDpOvr(x=>({...x,v:e.target.value}))} style={{...S.input,maxWidth:160}} min={0} step={0.01}/>
              )}

              {autoRow(
                "Gas Cost Today (daily portion)",
                <div>
                  {!hasFuelLog&&<div style={{fontSize:12,color:"#f59e0b"}}>No fuel log entries — {linkBtn("→ Log Fuel","fleet")}</div>}
                  {hasFuelLog&&(
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{fontSize:13,color:"#e8e4d8"}}>{fmt$(fuelAuto)}/day</div>
                        <button onClick={()=>setGasExpanded(x=>!x)} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:9,fontFamily:"'DM Mono',monospace",padding:0}}>{gasExpanded?"▲ less":"▼ detail"}</button>
                      </div>
                      {gasExpanded&&fuelCalc&&(
                        <div style={{marginTop:6,fontSize:10,color:"#666",lineHeight:1.9}}>
                          Last fill: {fmt$(fuelCalc.lastFillAmount)} on {fmtDate(fuelCalc.lastFillDate)}<br/>
                          Auto range: ~{fuelCalc.daysOfRange} days · {fmt$(fuelCalc.lastFillAmount/Math.max(fuelCalc.daysOfRange,1))}/day<br/>
                          Based on: {fuelCalc.gallons} gal ÷ ({fuelCalc.avgDailyMiles} mi/day ÷ {fuelCalc.mpg} MPG)<br/>
                          {fuelCalc.odomSource==="odometer"
                            ? <span style={{color:"#22c55e"}}>Daily avg miles from odometer: {fuelCalc.avgDailyMiles} mi</span>
                            : <span style={{color:"#f59e0b"}}>Using estimated {fuelCalc.avgDailyMiles} mi/day — add odometer readings for accuracy</span>}
                          <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
                            <span style={{color:"#888"}}>Override days this tank lasts:</span>
                            <input type="number" placeholder={`auto: ${fuelCalc.daysOfRange}`} value={manualDays} onChange={e=>setManualDays(e.target.value)} min={1} step={0.5} style={{...S.input,width:80,padding:"2px 8px",fontSize:10}}/>
                            {manualDays&&<button onClick={()=>setManualDays("")} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:9,fontFamily:"'DM Mono',monospace",padding:0}}>reset</button>}
                          </div>
                          {manualDaysNum>0&&<div style={{color:accent,marginTop:2}}>Using {manualDaysNum} days → {fmt$(fuelAuto)}/day</div>}
                        </div>
                      )}
                      {!mpgSet&&<div style={{fontSize:10,color:"#f59e0b",marginTop:4}}>Set your MPG in Settings for accurate fuel spreading — {linkBtn("→ Settings","settings")}</div>}
                    </div>
                  )}
                </div>,
                gasOvr.on,
                ()=>setGasOvr(x=>({on:!x.on,v:x.on?"":fuelAuto.toFixed(2)})),
                <input type="number" value={gasOvr.v} onChange={e=>setGasOvr(x=>({...x,v:e.target.value}))} style={{...S.input,maxWidth:160}} min={0} step={0.01}/>
              )}

              {autoRow(
                "Insurance Cost Today",
                <div style={{fontSize:12,color:insMonthly>0?"#e8e4d8":"#f59e0b"}}>
                  {insMonthly>0?`Monthly $${insMonthly.toFixed(0)} ÷ 30 = ${fmt$(insDay)}/day`:linkBtn("Set in Settings →","settings")}
                </div>,
                insOvr.on,
                ()=>setInsOvr(x=>({on:!x.on,v:x.on?"":insDay.toFixed(2)})),
                <input type="number" value={insOvr.v} onChange={e=>setInsOvr(x=>({...x,v:e.target.value}))} style={{...S.input,maxWidth:160}} min={0} step={0.01}/>
              )}

              {autoRow(
                "Truck Cost Today",
                <div style={{fontSize:12,color:truckWeekly>0?"#e8e4d8":"#f59e0b"}}>
                  {truckWeekly>0?`Weekly $${truckWeekly.toFixed(0)} ÷ 7 = ${fmt$(truckDay)}/day`:linkBtn("Set in Settings →","settings")}
                </div>,
                truckOvr.on,
                ()=>setTruckOvr(x=>({on:!x.on,v:x.on?"":truckDay.toFixed(2)})),
                <input type="number" value={truckOvr.v} onChange={e=>setTruckOvr(x=>({...x,v:e.target.value}))} style={{...S.input,maxWidth:160}} min={0} step={0.01}/>
              )}

              <div style={{marginBottom:14}}>
                <label style={S.label}>Other Costs (optional)</label>
                <input type="number" placeholder="Tolls, supplies, etc." value={stopProfitForm.otherCosts||""} onChange={e=>setStopProfitForm(pr=>({...pr,otherCosts:e.target.value}))} style={{...S.input,maxWidth:200}} min={0} step={0.01}/>
              </div>

              {/* Results card */}
              <div style={{background:profitBg,border:`1px solid ${(totalRevenue===0&&totalCost===0)?"#1e1e1e":marginColor+"55"}`,borderRadius:8,padding:14,marginBottom:14}}>
                {/* Revenue block */}
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:9,color:"#22c55e",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>Revenue</div>
                  {row$("Daily guarantee",dailyGuarantee)}
                  {row$(`Stop bonus (${stops} × $${stopRate.toFixed(2)})`,stopBonus)}
                  {mileStipend>0&&row$(`Mile stipend (${milesDriven} mi × $${mileStipendRate.toFixed(2)})`,mileStipend)}
                  <div style={{display:"flex",justifyContent:"space-between",paddingTop:6}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#e8e4d8"}}>Total Revenue</div>
                    <div style={{fontSize:13,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:accent}}>{fmt$(totalRevenue)}</div>
                  </div>
                </div>
                {/* Cost block */}
                <div style={{borderTop:"1px solid #2a2a3a",paddingTop:10,marginBottom:10}}>
                  <div style={{fontSize:9,color:"#ef4444",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>Costs</div>
                  {row$("Driver pay",driverPay)}
                  {row$("Gas",gasCost)}
                  {row$("Insurance/day",insuranceCost)}
                  {row$("Truck/day",truckCost)}
                  {otherCosts>0&&row$("Other",otherCosts)}
                  <div style={{display:"flex",justifyContent:"space-between",paddingTop:6}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#e8e4d8"}}>Total Cost</div>
                    <div style={{fontSize:13,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:"#e8e4d8"}}>{fmt$(totalCost)}</div>
                  </div>
                </div>
                {/* Profit block */}
                <div style={{borderTop:"1px solid #2a2a3a",paddingTop:10}}>
                  <div style={{fontSize:9,color:marginColor,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>Profit</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                    <div><div style={{fontSize:9,color:"#888"}}>Gross Profit</div><div style={{fontSize:18,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:grossProfit>=0?"#22c55e":"#ef4444"}}>{fmt$(grossProfit)}</div></div>
                    <div><div style={{fontSize:9,color:"#888"}}>Net/Stop</div><div style={{fontSize:18,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:stops>0?marginColor:"#444"}}>{stops>0?`$${netPerStop.toFixed(2)}`:"—"}</div></div>
                    <div><div style={{fontSize:9,color:"#888"}}>Margin</div><div style={{fontSize:18,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:totalRevenue>0?marginColor:"#444"}}>{totalRevenue>0?`${marginPct.toFixed(1)}%`:"—"}</div></div>
                  </div>
                  {totalCost>0&&<div style={{fontSize:10,color:"#555",marginTop:8}}>Wages {costPct(driverPay)} · Gas {costPct(gasCost)} · Insurance {costPct(insuranceCost)} · Truck {costPct(truckCost)}</div>}
                </div>
              </div>

              {/* Break-even insight */}
              {(insuranceCost>0||truckCost>0||driverDailyBase>0)&&(
                <div style={{background:guaranteeCoversFixed?"#081a08":"#0a0f1a",border:`1px solid ${guaranteeCoversFixed?"#22c55e33":"#3a3a6a"}`,borderRadius:6,padding:"10px 14px",marginBottom:14,fontSize:11}}>
                  {guaranteeCoversFixed
                    ? <div style={{color:"#22c55e"}}>✓ Daily guarantee covers all fixed costs — every stop is pure profit</div>
                    : stopRate>0
                      ? <div style={{color:"#888"}}>You cover fixed costs after <strong style={{color:"#f59e0b"}}>{Math.ceil(stopsToBreakEven)} stops</strong> (guarantee covers ${dailyGuarantee.toFixed(0)} of ${fixedCosts.toFixed(0)} fixed costs)</div>
                      : <div style={{color:"#888"}}>Set a stop rate to see break-even calculation</div>
                  }
                </div>
              )}

              <button className="hov" onClick={saveEntry} style={S.btn}>Save Entry</button>
            </div>

            {/* Fuel fills with range indicators */}
            {fuelLog.length>0&&(
              <div style={{...S.card,marginTop:16}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8",marginBottom:10}}>Recent Fuel Fills</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {[...fuelLog].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5).map((f,i)=>{
                    const gallons=parseFloat(f.gallons||0);
                    const amount=parseFloat(f.totalCost||0);
                    const mpg=parseFloat(settings?.mpg||8);
                    const recentOdom=(odometer||[]).filter(o=>o.truckName===f.truckName).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,7);
                    let avgMi=200;
                    if(recentOdom.length>=2){const tm=parseFloat(recentOdom[0].reading)-parseFloat(recentOdom[recentOdom.length-1].reading);if(tm>0)avgMi=tm/(recentOdom.length-1);}
                    const daysRange=gallons>0&&mpg>0?gallons/(avgMi/mpg):0;
                    const dayRate=daysRange>0?amount/daysRange:0;
                    return(
                      <div key={f.id||i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #1a1a2a"}}>
                        <div>
                          <div style={{fontSize:11,color:"#e8e4d8"}}>{fmtDate(f.date)}{f.truckName?` · ${f.truckName}`:""}</div>
                          <div style={{fontSize:10,color:"#555"}}>{gallons>0?`${gallons} gal`:""}{daysRange>0?` · ~${daysRange.toFixed(1)} days range`:""}{dayRate>0?` · ${fmt$(dayRate)}/day`:""}</div>
                        </div>
                        <div style={{fontSize:13,fontWeight:700,color:accent}}>{fmt$(amount)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent log */}
            {stopProfitLog.length===0&&<div style={{color:"#555",fontSize:12,marginTop:16}}>No entries yet.</div>}
            <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
              {stopProfitLog.slice(0,10).map(e=>{
                const mc=parseFloat(e.marginPct||e.margin||0)>20?"#22c55e":parseFloat(e.marginPct||e.margin||0)>=10?"#f59e0b":"#ef4444";
                return(
                  <div key={e.id} style={{...S.card,marginBottom:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:12,color:"#e8e4d8"}}>{fmtDate(e.date)} · {e.stops} stops</div>
                        <div style={{fontSize:10,color:"#555"}}>Rev: {fmt$(e.totalRevenue)} · Cost: {fmt$(e.totalCost)}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:16,fontWeight:700,color:mc}}>${parseFloat(e.netPerStop||0).toFixed(2)}/stop</div>
                        <div style={{fontSize:10,color:mc}}>{parseFloat(e.marginPct||e.margin||0).toFixed(1)}% margin</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stopProfitTab==="trend"&&(
          <div>
            {/* Summary row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12,marginBottom:20}}>
              {[["Total Revenue",fmt$(wkRevTotal),accent],["Total Cost",fmt$(wkCostTotal),"#e8e4d8"],["Total Profit",fmt$(wkProfit),wkProfit>=0?"#22c55e":"#ef4444"],["Avg Margin",weekEntries.length?`${avgMargin.toFixed(1)}%`:"—",avgMargin>20?"#22c55e":avgMargin>=10?"#f59e0b":"#ef4444"]].map(([lbl,val,col])=>(
                <div key={lbl} style={S.card}>
                  <div style={{fontSize:10,color:"#888",marginBottom:4}}>{lbl} This Week</div>
                  <div style={{fontSize:20,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",color:col}}>{val}</div>
                </div>
              ))}
            </div>

            {/* Revenue breakdown for week */}
            {weekEntries.length>0&&(
              <div style={{...S.card,marginBottom:16}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8",marginBottom:6}}>Revenue This Week</div>
                <div style={{fontSize:11,color:"#888"}}>Guarantees: <span style={{color:"#22c55e"}}>{fmt$(wkGuarantees)}</span> · Stop bonuses: <span style={{color:"#60a5fa"}}>{fmt$(wkStopBonus)}</span></div>
              </div>
            )}

            {/* Bar chart */}
            {last14.length===0&&<div style={{color:"#555",fontSize:12,marginBottom:16}}>No entries to chart yet.</div>}
            {last14.length>0&&(
              <div style={{...S.card,marginBottom:20}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>Last 14 Days — Net Per Stop</div>
                <div style={{display:"flex",alignItems:"flex-end",gap:3,height:120,marginBottom:8}}>
                  {last14.map((e,i)=>{
                    const val=parseFloat(e.netPerStop||0);
                    const mg=parseFloat(e.marginPct||e.margin||0);
                    const barColor=mg>20?"#22c55e":mg>=10?"#f59e0b":"#ef4444";
                    const barH=Math.max(4,Math.abs(val)/maxNetAbs*90);
                    return(
                      <div key={e.id||i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                        <div style={{fontSize:7,color:barColor,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>${val.toFixed(0)}</div>
                        <div style={{width:"100%",height:barH,background:barColor,borderRadius:"2px 2px 0 0",minHeight:4}}/>
                        <div style={{fontSize:7,color:"#444",transform:"rotate(-45deg)",transformOrigin:"top left",whiteSpace:"nowrap",marginTop:4}}>{e.date?.slice(5)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cost breakdown */}
            {weekEntries.length>0&&(
              <div style={{...S.card,marginBottom:16}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>Cost Breakdown This Week</div>
                {[["Wages",wkDp],["Gas",wkGas],["Insurance",wkIns],["Truck",wkTruck]].map(([lbl,val])=>(
                  <div key={lbl} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{width:90,fontSize:10,color:"#888"}}>{lbl}</div>
                    <div style={{flex:1,height:6,background:"#1a1a1a",borderRadius:3}}>
                      <div style={{height:"100%",width:`${wkCostBreak>0?(val/wkCostBreak*100):0}%`,background:accent,borderRadius:3}}/>
                    </div>
                    <div style={{width:60,fontSize:10,color:"#e8e4d8",textAlign:"right"}}>{fmt$(val)}</div>
                    <div style={{width:32,fontSize:9,color:"#555",textAlign:"right"}}>{wkPct(val)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Day flags */}
            {flagDays.length>0&&(
              <div style={{background:"#1a0f00",border:"1px solid #3a2500",borderRadius:6,padding:"10px 14px"}}>
                <div style={{fontSize:11,color:"#f59e0b",marginBottom:8}}>⚠ Flagged Days This Week</div>
                {flagDays.map(e=>{
                  const rev=parseFloat(e.totalRevenue||0);
                  const gas=parseFloat(e.gasCost||0);
                  const dp=parseFloat(e.driverPay||0);
                  const gp=parseFloat(e.grossProfit||0);
                  return(
                    <div key={e.id} style={{fontSize:10,color:"#888",marginBottom:6}}>
                      <span style={{color:"#e8e4d8"}}>{fmtDate(e.date)}</span>
                      {rev>0&&gas/rev>0.25&&<span style={{color:"#f59e0b",marginLeft:8}}>High fuel day ({(gas/rev*100).toFixed(0)}% of revenue)</span>}
                      {rev>0&&dp/rev>0.40&&<span style={{color:"#f59e0b",marginLeft:8}}>High labor day ({(dp/rev*100).toFixed(0)}% of revenue)</span>}
                      {gp<0&&<span style={{color:"#ef4444",marginLeft:8}}>Lost money this day ({fmt$(gp)})</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
