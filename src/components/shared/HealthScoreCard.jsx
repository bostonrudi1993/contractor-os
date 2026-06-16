export default function HealthScoreCard({
  totalHealthScore, healthLabel, healthInsight,
  compScore, compWhy, compAction, compActionLabel,
  finScore, finWhy, finAction, finActionLabel,
  drvScore, drvWhy, drvAction, drvActionLabel,
  fltScore, fltWhy, fltAction, fltActionLabel,
  lenderScore, monthsOfData, dscr, hasActiveContract,
  healthScoreHistory, handleNav, S,
}) {
  const pillars = [
    {label:"Compliance", icon:"🛡", score:compScore, why:compWhy, action:compAction, actionLabel:compActionLabel},
    {label:"Financial",  icon:"💰", score:finScore,  why:finWhy,  action:finAction,  actionLabel:finActionLabel},
    {label:"Drivers",    icon:"👤", score:drvScore,  why:drvWhy,  action:drvAction,  actionLabel:drvActionLabel},
    {label:"Fleet",      icon:"🚛", score:fltScore,  why:fltWhy,  action:fltAction,  actionLabel:fltActionLabel},
  ];

  const scoreColor = totalHealthScore>=80?"#22c55e":totalHealthScore>=60?"#f59e0b":"#ef4444";

  const sparkData = [...healthScoreHistory]
    .sort((a,b)=>new Date(a.date)-new Date(b.date))
    .slice(-8);
  const sparkMax = Math.max(...sparkData.map(d=>d.total),100);

  return (
    <div style={{...S.card,marginBottom:16}}>
      {/* Header row */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:4}}>
            Business Health Score
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:42,fontWeight:900,color:scoreColor,lineHeight:1}}>
            {totalHealthScore}<span style={{fontSize:20,color:"#444"}}>/100</span>
          </div>
          <div style={{fontSize:12,color:scoreColor,fontWeight:700,marginTop:4}}>{healthLabel}</div>
          <div style={{fontSize:10,color:"#555",marginTop:4,maxWidth:240,lineHeight:1.6}}>{healthInsight}</div>
        </div>
        {sparkData.length>1&&(
          <div style={{textAlign:"center"}}>
            <svg width={120} height={50}>
              <polyline
                points={sparkData.map((d,i)=>`${(i/(sparkData.length-1))*110+5},${45-(d.total/sparkMax)*40}`).join(" ")}
                fill="none" stroke={scoreColor} strokeWidth={2}
              />
              {sparkData.map((d,i)=>(
                <circle key={i} cx={(i/(sparkData.length-1))*110+5} cy={45-(d.total/sparkMax)*40} r={3} fill={scoreColor}/>
              ))}
            </svg>
            <div style={{fontSize:8,color:"#444",letterSpacing:"0.1em"}}>8 WEEK TREND</div>
          </div>
        )}
      </div>

      {/* Four pillars */}
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
        {pillars.map(p=>{
          const pColor=p.score>=20?"#22c55e":p.score>=12?"#f59e0b":"#ef4444";
          const pLabel=p.score>=20?"STRONG":p.score>=12?"WATCH":"ACTION NEEDED";
          return (
            <div key={p.label} style={{background:"#0f0f0f",border:`1px solid ${pColor}22`,borderRadius:6,padding:"10px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:16}}>{p.icon}</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#e8e4d8"}}>{p.label}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:9,color:pColor,fontWeight:700,letterSpacing:"0.1em"}}>{pLabel}</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,color:pColor}}>{p.score}/25</span>
                </div>
              </div>
              <div style={{height:4,background:"#1e1e1e",borderRadius:2,marginBottom:8}}>
                <div style={{height:"100%",width:`${(p.score/25)*100}%`,background:pColor,borderRadius:2,transition:"width 0.4s ease"}}/>
              </div>
              <div style={{fontSize:10,color:"#666",marginBottom:6,lineHeight:1.5}}>{p.why}</div>
              {p.score<20&&(
                <button onClick={()=>handleNav(p.action)} style={{background:"transparent",border:`1px solid ${pColor}44`,color:pColor,fontSize:10,cursor:"pointer",padding:"4px 12px",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>
                  {p.actionLabel}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Lender Ready */}
      <div style={{background:"#0a0f1a",border:"1px solid #1a1a3a",borderRadius:6,padding:"10px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <div style={{fontSize:10,color:"#4a4a8a",fontWeight:700,letterSpacing:"0.1em"}}>🏦 LENDER READY</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:lenderScore>=75?"#22c55e":lenderScore>=50?"#f59e0b":"#ef4444"}}>
            {lenderScore}/100
          </div>
        </div>
        <div style={{fontSize:10,color:"#444",lineHeight:1.7,whiteSpace:"pre-line"}}>
          {monthsOfData<6&&`• ${6-monthsOfData} more months of data needed (have ${monthsOfData})\n`}
          {dscr<1.25&&`• DSCR ${dscr.toFixed(2)}x — lenders want 1.25x minimum\n`}
          {!hasActiveContract&&"• No active contract on file\n"}
          {lenderScore>=75&&"Ready to apply for financing"}
        </div>
        <button onClick={()=>handleNav("lender")} style={{marginTop:8,background:"transparent",border:"1px solid #2a2a5a",color:"#6666aa",fontSize:10,cursor:"pointer",padding:"4px 12px",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>
          View Full Lender Report →
        </button>
      </div>
    </div>
  );
}
