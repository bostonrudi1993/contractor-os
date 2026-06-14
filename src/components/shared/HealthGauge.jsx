export function calcHealthScore({compliance, revenue, drivers, maintenance, vehicles}) {
  const today = new Date();
  const monthStr = today.toISOString().slice(0,7);
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth()-1, 1);
  const lastMonthStr = lastMonthDate.toISOString().slice(0,7);
  // COMPLIANCE (25 pts)
  const allItems = [...(compliance.trucks||[]),...(compliance.drivers||[])];
  const compFields = ["dotInspection","ifta","irp","registration","insuranceExpiry","cdlExpiry","medCardExpiry","mvrDue","drugTest","annualReview"];
  const overdue = allItems.filter(item=>compFields.some(f=>item[f]&&new Date(item[f])<today));
  const soon30 = new Date(today); soon30.setDate(soon30.getDate()+30);
  const urgent = allItems.filter(item=>compFields.some(f=>item[f]&&new Date(item[f])>=today&&new Date(item[f])<=soon30));
  const compScore = overdue.length>0?0:urgent.length===0?25:urgent.length<=2?15:5;
  // FINANCIAL (25 pts)
  const thisMonthRev = revenue.filter(r=>r.date&&r.date.slice(0,7)===monthStr).reduce((s,r)=>s+parseFloat(r.amount||0),0);
  const lastMonthRev = revenue.filter(r=>r.date&&r.date.slice(0,7)===lastMonthStr).reduce((s,r)=>s+parseFloat(r.amount||0),0);
  const finScore = thisMonthRev===0?0:lastMonthRev===0||thisMonthRev>=lastMonthRev?25:((lastMonthRev-thisMonthRev)/lastMonthRev)<0.1?15:5;
  // DRIVERS (25 pts)
  const activeDrivers = drivers.filter(d=>d.status==="active");
  const incomplete = activeDrivers.filter(d=>!d.hireDate||!d.phone);
  const driverScore = Math.max(0, 25 - incomplete.length*5);
  // FLEET (25 pts)
  const overdueMaint = maintenance.filter(m=>{
    if(!m.date) return false;
    const newer = maintenance.filter(x=>x.truckName===m.truckName&&new Date(x.date)>new Date(m.date));
    return newer.length===0&&(Date.now()-new Date(m.date).getTime())>90*24*3600*1000;
  });
  const vehiclesNoMaint = vehicles.filter(v=>!maintenance.some(m=>m.truckName===v.name||m.truckName===v.nickname));
  const fleetScore = vehiclesNoMaint.length>0?0:overdueMaint.length===0?25:overdueMaint.length===1?15:5;
  const total = compScore+finScore+driverScore+fleetScore;
  const color = total>=80?"#22c55e":total>=60?"#f59e0b":"#ef4444";
  let insight = "All systems healthy";
  if(overdue.length>0) insight=`${overdue.length} compliance item${overdue.length>1?"s":""} overdue`;
  else if(urgent.length>0) insight=`${urgent.length} item${urgent.length>1?"s":""} expiring within 30 days`;
  else if(finScore===0) insight="No revenue logged this month";
  else if(finScore===25&&lastMonthRev>0) insight="Revenue up this month — strong";
  else if(incomplete.length>0) insight=`${incomplete.length} driver${incomplete.length>1?"s":""} have incomplete onboarding`;
  else if(fleetScore<25) insight="Fleet maintenance needs attention";
  return {total, color, insight};
}

export default function HealthGauge({score, color, insight}) {
  return (
    <div style={{textAlign:"center",padding:"12px 20px"}}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r="38" fill="none" stroke="#222" strokeWidth="8"/>
        <circle cx="45" cy="45" r="38" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${(score/100)*238.76} 238.76`}
          strokeLinecap="round" transform="rotate(-90 45 45)"/>
        <text x="45" y="50" textAnchor="middle" fill={color} fontSize="22" fontWeight="700">{score}</text>
      </svg>
      <div style={{fontSize:10,color:"#888",marginTop:2}}>Business Health</div>
      <div style={{fontSize:9,color:color,marginTop:2,maxWidth:120}}>{insight}</div>
    </div>
  );
}
