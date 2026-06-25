const NAV_LABELS = {dashboard:"Dashboard",analyze:"Analyze Load",boards:"Load Boards",compliance:"Compliance",brokers:"Brokers",fleet:"Fleet",finance:"Finance",routes:"Routes",drivers:"Drivers",contracts:"Contracts",reports:"Reports",trends:"P&L Trends",users:"Users",settings:"Settings",payroll:"Payroll",invoices:"Invoices",dispatch:"Dispatch",contacts:"Contacts",documents:"Documents",data:"Data & Backup",fmcsa:"FMCSA Lookup",scorecard:"Scorecard",stopprofit:"Stop Profit",settlement:"Settlement",driverschedule:"Schedule",claims:"Claims",deadmiles:"Dead Miles",lender:"Lender Report"};

export default function TopBar({setNavOpen, seg, accent, screen, urgentItems, userEmail, onNav, onSwitchType, prevScreen, onBack, signOut}) {
  return (
    <div style={{display:"flex",alignItems:"center",height:50,borderBottom:"1px solid #1e1e1e",background:"#0d0d0d",padding:"0 16px",gap:10,flexShrink:0,position:"sticky",top:0,zIndex:100}}>
      <button onClick={()=>setNavOpen(true)} style={{background:"transparent",border:"none",color:"#888",fontSize:22,cursor:"pointer",padding:"4px 8px",lineHeight:1,flexShrink:0}} aria-label="Open menu">☰</button>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <div style={{width:30,height:30,background:accent,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:4,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,color:"#0a0a0a"}}>CO</div>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:"#e8e4d8",lineHeight:1}}>CONTRACTOR<span style={{color:accent}}>OS</span></div>
          <div style={{fontSize:8,color:"#444",letterSpacing:"0.15em",textTransform:"uppercase"}}>{seg.icon} {seg.label}</div>
        </div>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
        {prevScreen&&onBack&&(
          <button onClick={onBack} style={{background:"transparent",border:"none",color:"#555",fontSize:16,cursor:"pointer",padding:"4px 6px",lineHeight:1,flexShrink:0}} aria-label="Go back">←</button>
        )}
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,color:"#e8e4d8",textTransform:"uppercase",letterSpacing:"0.08em"}}>{NAV_LABELS[screen]||screen}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        {urgentItems.length>0&&<button onClick={()=>onNav("compliance")} style={{background:"#1a0808",border:"1px solid #ef444433",color:"#ef4444",padding:"4px 10px",borderRadius:4,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>🔴 {urgentItems.length}</button>}
        {userEmail==="bostonrudi1993@gmail.com"&&(
          <button onClick={onSwitchType} style={{background:"#1a0a00",border:"1px solid #f59e0b44",color:"#f59e0b",padding:"4px 10px",borderRadius:4,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>👑 SWITCH TYPE</button>
        )}
        {signOut&&(
          <button onClick={()=>signOut()} style={{background:"transparent",border:"1px solid #333",color:"#666",padding:"4px 10px",borderRadius:4,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}} aria-label="Sign out">SIGN OUT</button>
        )}
      </div>
    </div>
  );
}
