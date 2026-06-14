import StatCard from "../shared/StatCard.jsx";
import ExpiryBadge from "../shared/ExpiryBadge.jsx";
import HealthGauge, { calcHealthScore } from "../shared/HealthGauge.jsx";

const gradeColor = g => ({A:"#22c55e",B:"#84cc16",C:"#f59e0b",D:"#ef4444"}[g]||"#555");
const fmt$ = n => `$${(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;

export default function Dashboard(p) {
  const {seg, accent, S, settings, revenue, expenses, compliance, drivers, maintenance, vehicles, contracts, loads, routes, urgentItems, setScreen, setSubScreen} = p;
  const totalRevenue = revenue.reduce((s,r)=>s+parseFloat(r.amount||0),0);
  const totalExpenses = expenses.reduce((s,e)=>s+parseFloat(e.amount||0),0);
  const netProfit = totalRevenue - totalExpenses;
  const Stat = ({label,value,color,sub}) => <StatCard label={label} value={value} color={color||accent} sub={sub} card={S.card}/>;
  const ExBadge = ({label,days}) => <ExpiryBadge label={label} days={days}/>;
  const hs = calcHealthScore({compliance, revenue, drivers, maintenance, vehicles});

  return (
    <div style={{flex:1,padding:24,maxWidth:1000,margin:"0 auto",width:"100%",animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:28}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:36,fontWeight:900,color:"#e8e4d8",lineHeight:1}}>
          {settings.companyName||"YOUR FLEET"}<br/>
          <span style={{color:accent,fontSize:28}}>OPERATIONS DASHBOARD</span>
        </div>
        <div style={{fontSize:11,color:"#555",marginTop:8}}>{seg.icon} {seg.label} · ContractorOS</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr) auto",gap:12,marginBottom:24,alignItems:"stretch"}}>
        <Stat label="Total Revenue" value={fmt$(totalRevenue)} color="#22c55e"/>
        <Stat label="Total Expenses" value={fmt$(totalExpenses)} color="#ef4444"/>
        <Stat label="Net Profit" value={fmt$(netProfit)} color={netProfit>=0?"#22c55e":"#ef4444"}/>
        <Stat label="Compliance Alerts" value={urgentItems.length} color={urgentItems.length>0?"#ef4444":"#22c55e"} sub={urgentItems.length>0?"Needs attention":"All clear"}/>
        <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <HealthGauge score={hs.total} color={hs.color} insight={hs.insight}/>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        <div style={S.card}>
          <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Quick Actions</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {seg.features.loadAnalysis&&<button className="cardhov" onClick={()=>setScreen("analyze")} style={{...S.card,padding:"10px 14px",fontSize:11,color:accent,cursor:"pointer",textAlign:"left",border:`1px solid ${accent}22`}}>→ Analyze a Load</button>}
            {seg.features.routeProfit&&<button className="cardhov" onClick={()=>setScreen("routes")} style={{...S.card,padding:"10px 14px",fontSize:11,color:accent,cursor:"pointer",textAlign:"left",border:`1px solid ${accent}22`}}>→ View Route Profitability</button>}
            <button className="cardhov" onClick={()=>setScreen("compliance")} style={{...S.card,padding:"10px 14px",fontSize:11,color:"#ef4444",cursor:"pointer",textAlign:"left",border:"1px solid #ef444422"}}>→ Check Compliance</button>
            <button className="cardhov" onClick={()=>{setScreen("fleet");setSubScreen("schedule");}} style={{...S.card,padding:"10px 14px",fontSize:11,color:"#f59e0b",cursor:"pointer",textAlign:"left",border:"1px solid #f59e0b22"}}>→ Fleet Upcoming Service</button>
            <button className="cardhov" onClick={()=>{setScreen("finance");setSubScreen("expenses");}} style={{...S.card,padding:"10px 14px",fontSize:11,color:"#22c55e",cursor:"pointer",textAlign:"left",border:"1px solid #22c55e22"}}>→ Log an Expense</button>
            {seg.features.contractTracker&&<button className="cardhov" onClick={()=>setScreen("contracts")} style={{...S.card,padding:"10px 14px",fontSize:11,color:"#8888cc",cursor:"pointer",textAlign:"left",border:"1px solid #8888cc22"}}>→ View Contracts</button>}
          </div>
        </div>
        <div style={S.card}>
          <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>
            {urgentItems.length>0?"⚠ Urgent Items":"Compliance Status"}
          </div>
          {urgentItems.length===0&&<div style={{fontSize:12,color:"#22c55e"}}>✓ No urgent compliance items</div>}
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {urgentItems.slice(0,4).map((item,i)=><ExBadge key={i} {...item}/>)}
            {urgentItems.length>4&&<div style={{fontSize:10,color:"#555",textAlign:"center",paddingTop:4}}>+{urgentItems.length-4} more — check Compliance tab</div>}
          </div>
        </div>
      </div>

      {seg.features.loadAnalysis&&loads.length>0&&(
        <div style={S.card}>
          <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Recent Load Analysis</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {loads.slice(0,4).map(l=>(
              <div key={l.id} style={{display:"flex",alignItems:"center",gap:12,padding:"7px 0",borderBottom:"1px solid #1a1a1a"}}>
                <div style={{width:24,height:24,background:gradeColor(l.result?.grade)+"22",border:`1px solid ${gradeColor(l.result?.grade)}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,color:gradeColor(l.result?.grade),borderRadius:3,flexShrink:0}}>{l.result?.grade}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:11,color:"#c8c4bc",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.load?.origin} → {l.load?.destination}</div><div style={{fontSize:9,color:"#555"}}>{l.date} · {l.load?.brokerName}</div></div>
                <div style={{fontSize:12,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:l.result?.verdictColor==="green"?"#22c55e":l.result?.verdictColor==="yellow"?"#f59e0b":"#ef4444",flexShrink:0}}>{l.result?.verdict}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {seg.features.routeProfit&&routes.length>0&&(
        <div style={{...S.card,marginTop:16}}>
          <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Route Summary</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
            {routes.slice(0,4).map(r=>(
              <div key={r.id} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:6,padding:"12px 14px"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"#e8e4d8",marginBottom:4}}>{r.name}</div>
                <div style={{fontSize:10,color:"#555"}}>{r.stops} stops · {r.miles} mi</div>
                {r.analysis&&<div style={{fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color:gradeColor(r.analysis.profitabilityScore),marginTop:6}}>{r.analysis.verdict}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
