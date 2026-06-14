import { useState } from "react";

// StopProfit screen
export default function StopProfit(p) {
  const {
    seg, accent, S, segment,
    drivers, fuelLog, dispatches, settings,
    stopProfitLog, setStopProfitLog,
    stopProfitTab, setStopProfitTab, stopProfitForm, setStopProfitForm,
    showValidation, fmt$, fmtDate,
  } = p;

  const [gasOvr, setGasOvr] = useState({on:false,v:""});
  const [dpOvr, setDpOvr] = useState({on:false,v:""});
  const [insOvr, setInsOvr] = useState({on:false,v:""});
  const [truckOvr, setTruckOvr] = useState({on:false,v:""});

  const today = new Date().toISOString().slice(0,10);
  const entryDate = stopProfitForm.date || today;
  const stops = parseFloat(stopProfitForm.stops||0);
  const stopRate = parseFloat(stopProfitForm.revenuePerStop||0);

  // Gas: sum fuelLog for selected date
  const fuelEntries = fuelLog.filter(f=>f.date===entryDate);
  const fuelAuto = fuelEntries.reduce((s,f)=>s+parseFloat(f.totalCost||0),0);
  const hasFuelLog = fuelEntries.length>0;
  const gasCost = gasOvr.on ? parseFloat(gasOvr.v||0) : fuelAuto;

  // Driver pay: sum dispatches for date, match per_day drivers
  const todayDisp = dispatches.filter(d=>d.date===entryDate);
  const dpAuto = todayDisp.reduce((s,d)=>{
    const dr = drivers.find(x=>x.name===d.driverName||x.id===d.driverId);
    return s+(dr?.payType==="per_day"?parseFloat(dr.payRate||0):0);
  },0);
  const driverPay = dpOvr.on ? parseFloat(dpOvr.v||0) : dpAuto;

  const insMonthly = parseFloat(settings?.monthlyInsurance||0);
  const insDay = insMonthly>0 ? insMonthly/30 : 0;
  const insuranceCost = insOvr.on ? parseFloat(insOvr.v||0) : insDay;

  const truckWeekly = parseFloat(settings?.weeklyTruckPayment||0);
  const truckDay = truckWeekly>0 ? truckWeekly/7 : 0;
  const truckCost = truckOvr.on ? parseFloat(truckOvr.v||0) : truckDay;

  const totalRevenue = stops*stopRate;
  const totalCost = gasCost+driverPay+insuranceCost+truckCost;
  const grossProfit = totalRevenue-totalCost;
  const netPerStop = stops>0 ? grossProfit/stops : 0;
  const marginPct = totalRevenue>0 ? (grossProfit/totalRevenue)*100 : 0;
  const marginColor = marginPct>20?"#22c55e":marginPct>=10?"#f59e0b":"#ef4444";
  const resultsBg = (totalRevenue===0&&totalCost===0)?"#0f0f14":marginPct>20?"#081a08":marginPct>=10?"#1a1200":"#1a0808";
  const costPct = v => totalCost>0?((v/totalCost)*100).toFixed(0)+"%" : "—";

  // Weekly trend data
  const weekEntries = stopProfitLog.filter(e=>{
    if(!e.date) return false;
    return (new Date()-new Date(e.date))/86400000<7;
  });
  const last14 = [...stopProfitLog].filter(e=>e.date).sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(-14);
  const maxNetAbs = Math.max(...last14.map(e=>Math.abs(parseFloat(e.netPerStop||0))),1);
  const bestEntry = weekEntries.reduce((b,e)=>(!b||parseFloat(e.netPerStop||0)>parseFloat(b.netPerStop||0))?e:b,null);
  const worstEntry = weekEntries.reduce((w,e)=>(!w||parseFloat(e.netPerStop||0)<parseFloat(w.netPerStop||0))?e:w,null);
  const avgMargin = weekEntries.length ? weekEntries.reduce((s,e)=>s+parseFloat(e.marginPct||e.margin||0),0)/weekEntries.length : 0;
  const totalGrossProfit = weekEntries.reduce((s,e)=>s+parseFloat(e.grossProfit||0),0);
  const wkGas = weekEntries.reduce((s,e)=>s+parseFloat(e.gasCost||0),0);
  const wkDp = weekEntries.reduce((s,e)=>s+parseFloat(e.driverPay||0),0);
  const wkIns = weekEntries.reduce((s,e)=>s+parseFloat(e.insuranceCostDay||0),0);
  const wkTruck = weekEntries.reduce((s,e)=>s+parseFloat(e.truckCostDay||0),0);
  const wkTotal = wkGas+wkDp+wkIns+wkTruck;
  const wkPct = v => wkTotal>0?((v/wkTotal)*100).toFixed(0)+"%" : "0%";
  const highFuelDays = weekEntries.filter(e=>parseFloat(e.gasCost||0)>parseFloat(e.driverPay||0));

  const saveEntry = () => {
    if(!stopProfitForm.stops||!entryDate){showValidation("Date and stops are required");return;}
    setStopProfitLog(prev=>[{
      id:Date.now(), date:entryDate,
      stops:stopProfitForm.stops, stopRate,
      gasCost, driverPay, insuranceCostDay:insuranceCost, truckCostDay:truckCost,
      totalRevenue, totalCost, grossProfit, netPerStop, marginPct,
      wasGasOverridden:gasOvr.on, wasDriverPayOverridden:dpOvr.on,
    },...prev]);
    setStopProfitForm({date:"",stops:"",revenuePerStop:"",driverPay:"",fuelCost:"",vehicleCost:"",otherCosts:""});
    setGasOvr({on:false,v:""});setDpOvr({on:false,v:""});setInsOvr({on:false,v:""});setTruckOvr({on:false,v:""});
  };

  const autoRow = (label, display, isOverride, onEdit, editNode) => (
    <div style={{...S.card,marginBottom:10,padding:"10px 14px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>
            {label} {isOverride&&<span style={{color:"#f59e0b",fontSize:8}}>(manual)</span>}
          </div>
          {isOverride ? editNode : display}
        </div>
        <button onClick={onEdit} style={{background:"transparent",border:`1px solid ${accent}44`,color:accent,fontSize:9,padding:"3px 10px",borderRadius:3,cursor:"pointer",fontFamily:"'DM Mono',monospace",flexShrink:0,marginLeft:12}}>
          {isOverride?"Auto":"Edit"}
        </button>
      </div>
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

              {/* User inputs */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
                <div>
                  <label style={S.label}>Date</label>
                  <input type="date" value={stopProfitForm.date||today} onChange={e=>setStopProfitForm(pr=>({...pr,date:e.target.value}))} style={S.input}/>
                </div>
                <div>
                  <label style={S.label}>Stops Completed</label>
                  <input type="number" placeholder="e.g. 85" value={stopProfitForm.stops} onChange={e=>setStopProfitForm(pr=>({...pr,stops:e.target.value}))} style={S.input} min={0}/>
                </div>
                <div>
                  <label style={S.label}>Stop Rate ($/stop)</label>
                  <input type="number" placeholder="e.g. 2.10" value={stopProfitForm.revenuePerStop} onChange={e=>setStopProfitForm(pr=>({...pr,revenuePerStop:e.target.value}))} style={S.input} min={0} step={0.01}/>
                </div>
              </div>

              {/* Auto-filled fields */}
              <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8}}>Auto-Filled Costs</div>

              {autoRow(
                "Gas Cost Today",
                <div style={{fontSize:13,color:hasFuelLog?"#e8e4d8":"#f59e0b"}}>
                  {hasFuelLog ? `From fuel log: $${fuelAuto.toFixed(2)}` : <>No fuel logged today — <button onClick={()=>p.setScreen&&p.setScreen("fleet")} style={{background:"none",border:"none",color:accent,cursor:"pointer",fontSize:11,fontFamily:"'DM Mono',monospace",padding:0}}>→ Log Fuel</button></>}
                </div>,
                gasOvr.on,
                ()=>setGasOvr(x=>({on:!x.on,v:x.on?"":fuelAuto.toFixed(2)})),
                <input type="number" value={gasOvr.v} onChange={e=>setGasOvr(x=>({...x,v:e.target.value}))} style={{...S.input,maxWidth:140}} min={0} step={0.01}/>
              )}

              {autoRow(
                "Driver Pay Today",
                <div style={{fontSize:13,color:todayDisp.length>0?"#e8e4d8":"#f59e0b"}}>
                  {todayDisp.length>0 ? `${todayDisp.length} driver(s) dispatched: $${dpAuto.toFixed(2)}` : "No drivers dispatched today"}
                </div>,
                dpOvr.on,
                ()=>setDpOvr(x=>({on:!x.on,v:x.on?"":dpAuto.toFixed(2)})),
                <input type="number" value={dpOvr.v} onChange={e=>setDpOvr(x=>({...x,v:e.target.value}))} style={{...S.input,maxWidth:140}} min={0} step={0.01}/>
              )}

              {autoRow(
                "Insurance Cost Today",
                <div style={{fontSize:13,color:insMonthly>0?"#e8e4d8":"#f59e0b"}}>
                  {insMonthly>0 ? `Monthly $${insMonthly.toFixed(0)} ÷ 30 = $${insDay.toFixed(2)}/day` : <button onClick={()=>p.setScreen&&p.setScreen("settings")} style={{background:"none",border:"none",color:accent,cursor:"pointer",fontSize:11,fontFamily:"'DM Mono',monospace",padding:0}}>Set in Settings →</button>}
                </div>,
                insOvr.on,
                ()=>setInsOvr(x=>({on:!x.on,v:x.on?"":insDay.toFixed(2)})),
                <input type="number" value={insOvr.v} onChange={e=>setInsOvr(x=>({...x,v:e.target.value}))} style={{...S.input,maxWidth:140}} min={0} step={0.01}/>
              )}

              {autoRow(
                "Truck Cost Today",
                <div style={{fontSize:13,color:truckWeekly>0?"#e8e4d8":"#f59e0b"}}>
                  {truckWeekly>0 ? `Weekly $${truckWeekly.toFixed(0)} ÷ 7 = $${truckDay.toFixed(2)}/day` : <button onClick={()=>p.setScreen&&p.setScreen("settings")} style={{background:"none",border:"none",color:accent,cursor:"pointer",fontSize:11,fontFamily:"'DM Mono',monospace",padding:0}}>Set in Settings →</button>}
                </div>,
                truckOvr.on,
                ()=>setTruckOvr(x=>({on:!x.on,v:x.on?"":truckDay.toFixed(2)})),
                <input type="number" value={truckOvr.v} onChange={e=>setTruckOvr(x=>({...x,v:e.target.value}))} style={{...S.input,maxWidth:140}} min={0} step={0.01}/>
              )}

              {/* Live results */}
              <div style={{background:resultsBg,border:`1px solid ${(totalRevenue===0&&totalCost===0)?"#1e1e1e":marginColor+"44"}`,borderRadius:8,padding:14,marginTop:6,marginBottom:14}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10,marginBottom:10}}>
                  <div><div style={{fontSize:9,color:"#888",textTransform:"uppercase"}}>Total Revenue</div><div style={{fontSize:18,fontWeight:700,color:accent}}>{fmt$(totalRevenue)}</div></div>
                  <div><div style={{fontSize:9,color:"#888",textTransform:"uppercase"}}>Total Cost</div><div style={{fontSize:18,fontWeight:700,color:"#e8e4d8"}}>{fmt$(totalCost)}</div></div>
                  <div><div style={{fontSize:9,color:"#888",textTransform:"uppercase"}}>Gross Profit</div><div style={{fontSize:18,fontWeight:700,color:grossProfit>=0?"#22c55e":"#ef4444"}}>{fmt$(grossProfit)}</div></div>
                  <div><div style={{fontSize:9,color:"#888",textTransform:"uppercase"}}>Net/Stop</div><div style={{fontSize:18,fontWeight:700,color:stops>0?marginColor:"#444"}}>{stops>0?`$${netPerStop.toFixed(2)}`:"—"}</div></div>
                  <div><div style={{fontSize:9,color:"#888",textTransform:"uppercase"}}>Margin</div><div style={{fontSize:18,fontWeight:700,color:totalRevenue>0?marginColor:"#444"}}>{totalRevenue>0?`${marginPct.toFixed(1)}%`:"—"}</div></div>
                </div>
                {totalCost>0&&<div style={{fontSize:10,color:"#555"}}>
                  Gas {costPct(gasCost)} · Wages {costPct(driverPay)} · Insurance {costPct(insuranceCost)} · Truck {costPct(truckCost)}
                </div>}
              </div>

              <button className="hov" onClick={saveEntry} style={S.btn}>Save Entry</button>
            </div>

            {/* Recent entries */}
            {stopProfitLog.length===0&&<div style={{color:"#555",fontSize:12,marginTop:12}}>No entries yet.</div>}
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
            {/* Summary cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:20}}>
              <div style={S.card}>
                <div style={{fontSize:10,color:"#888",marginBottom:4}}>Best Net/Stop This Week</div>
                <div style={{fontSize:22,fontWeight:700,color:"#22c55e"}}>{bestEntry?`$${parseFloat(bestEntry.netPerStop||0).toFixed(2)}`:"—"}</div>
                {bestEntry&&<div style={{fontSize:9,color:"#555"}}>{fmtDate(bestEntry.date)}</div>}
              </div>
              <div style={S.card}>
                <div style={{fontSize:10,color:"#888",marginBottom:4}}>Worst Net/Stop This Week</div>
                <div style={{fontSize:22,fontWeight:700,color:"#ef4444"}}>{worstEntry?`$${parseFloat(worstEntry.netPerStop||0).toFixed(2)}`:"—"}</div>
                {worstEntry&&<div style={{fontSize:9,color:"#555"}}>{fmtDate(worstEntry.date)}</div>}
              </div>
              <div style={S.card}>
                <div style={{fontSize:10,color:"#888",marginBottom:4}}>Avg Margin This Week</div>
                <div style={{fontSize:22,fontWeight:700,color:avgMargin>20?"#22c55e":avgMargin>=10?"#f59e0b":"#ef4444"}}>{weekEntries.length?`${avgMargin.toFixed(1)}%`:"—"}</div>
              </div>
              <div style={S.card}>
                <div style={{fontSize:10,color:"#888",marginBottom:4}}>Total Gross Profit</div>
                <div style={{fontSize:22,fontWeight:700,color:accent}}>{weekEntries.length?fmt$(totalGrossProfit):"—"}</div>
              </div>
            </div>

            {/* Bar chart — last 14 days */}
            {last14.length===0&&<div style={{color:"#555",fontSize:12,marginBottom:16}}>No entries to chart yet.</div>}
            {last14.length>0&&(
              <div style={{...S.card,marginBottom:20}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>Last 14 Days — Net Per Stop</div>
                <div style={{display:"flex",alignItems:"flex-end",gap:4,height:120}}>
                  {last14.map((e,i)=>{
                    const val=parseFloat(e.netPerStop||0);
                    const mg=parseFloat(e.marginPct||e.margin||0);
                    const barColor=mg>20?"#22c55e":mg>=10?"#f59e0b":"#ef4444";
                    const barH=Math.max(4,Math.abs(val)/maxNetAbs*90);
                    return(
                      <div key={e.id||i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                        <div style={{fontSize:8,color:barColor,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>${val.toFixed(2)}</div>
                        <div style={{width:"100%",height:barH,background:barColor,borderRadius:"2px 2px 0 0",minHeight:4}}/>
                        <div style={{fontSize:7,color:"#444",transform:"rotate(-45deg)",transformOrigin:"top left",whiteSpace:"nowrap",marginTop:4}}>{e.date?.slice(5)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Weekly cost breakdown */}
            {weekEntries.length>0&&(
              <div style={{...S.card,marginBottom:16}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8",marginBottom:12}}>Cost Breakdown This Week</div>
                {[["Gas",wkGas],["Driver Pay",wkDp],["Insurance",wkIns],["Truck",wkTruck]].map(([lbl,val])=>(
                  <div key={lbl} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{width:90,fontSize:10,color:"#888"}}>{lbl}</div>
                    <div style={{flex:1,height:6,background:"#1a1a1a",borderRadius:3}}>
                      <div style={{height:"100%",width:`${wkTotal>0?(val/wkTotal*100):0}%`,background:accent,borderRadius:3}}/>
                    </div>
                    <div style={{width:50,fontSize:10,color:"#e8e4d8",textAlign:"right"}}>{fmt$(val)}</div>
                    <div style={{width:36,fontSize:9,color:"#555",textAlign:"right"}}>{wkPct(val)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* High fuel day flags */}
            {highFuelDays.length>0&&(
              <div style={{background:"#1a1200",border:"1px solid #3a2800",borderRadius:6,padding:"10px 14px"}}>
                <div style={{fontSize:11,color:"#f59e0b",marginBottom:6}}>⚠ High Fuel Days This Week</div>
                {highFuelDays.map(e=>(
                  <div key={e.id} style={{fontSize:10,color:"#888",marginBottom:3}}>
                    {fmtDate(e.date)} — Gas ${parseFloat(e.gasCost||0).toFixed(2)} exceeded Driver Pay ${parseFloat(e.driverPay||0).toFixed(2)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
