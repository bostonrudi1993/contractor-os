export const NAV_ICONS = {dashboard:"◈",analyze:"⚡",boards:"📋",compliance:"🛡",brokers:"🤝",fleet:"🚛",finance:"💰",routes:"🗺",drivers:"👤",contracts:"📄",reports:"📊",trends:"📈",users:"👥",settings:"⚙",payroll:"💵",invoices:"🧾",dispatch:"📡",contacts:"📞",documents:"📁",data:"💾",fmcsa:"🏛",scorecard:"📊",stopprofit:"📍",settlement:"💳",driverschedule:"📅",claims:"📋",deadmiles:"🛣",lender:"🏦"};

export const NAV_LABELS = {dashboard:"Dashboard",analyze:"Analyze Load",boards:"Load Boards",compliance:"Compliance",brokers:"Brokers",fleet:"Fleet",finance:"Finance",routes:"Routes",drivers:"Drivers",contracts:"Contracts",reports:"Reports",trends:"P&L Trends",users:"Users",settings:"Settings",payroll:"Payroll",invoices:"Invoices",dispatch:"Dispatch",contacts:"Contacts",documents:"Documents",data:"Data & Backup",fmcsa:"FMCSA Lookup",scorecard:"Scorecard",stopprofit:"Stop Profit",settlement:"Settlement",driverschedule:"Schedule",claims:"Claims",deadmiles:"Dead Miles",lender:"Lender Report"};

export default function Nav({
  navOpen, setNavOpen, seg, screen, accent, urgentItems, onNav,
  navExpanded, toggleNavExpand, canAccessScreen, SUB_PAGES,
  currentTier, TIERS, subScreen, setSubScreen, onLockedClick,
  onSubNav, currentUser, userRole, signOut,
}) {
  return (
    <>
      {navOpen && <div onClick={()=>setNavOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,backdropFilter:"blur(2px)"}}/>}
      <div style={{position:"fixed",top:0,left:0,height:"100%",width:260,background:"#0d0d0d",borderRight:"1px solid #1e1e1e",zIndex:201,transform:navOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.25s cubic-bezier(0.4,0,0.2,1)",display:"flex",flexDirection:"column",overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",borderBottom:"1px solid #1e1e1e",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,background:accent,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:4,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,color:"#0a0a0a"}}>CO</div>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:"#e8e4d8",lineHeight:1}}>CONTRACTOR<span style={{color:accent}}>OS</span></div>
              <div style={{fontSize:8,color:"#888",letterSpacing:"0.12em",textTransform:"uppercase"}}>{seg.icon} {seg.label}</div>
            </div>
          </div>
          <button onClick={()=>setNavOpen(false)} style={{background:"transparent",border:"none",color:"#999",fontSize:20,cursor:"pointer",padding:"4px 8px",lineHeight:1}}>✕</button>
        </div>

        <div style={{flex:1,padding:"8px 0"}}>
          {seg.nav.map(id => {
            const isActive = screen === id;
            const isLocked = canAccessScreen ? !canAccessScreen(id) : false;
            const rawSubPages = SUB_PAGES ? (SUB_PAGES[id] || []) : [];
            const subPages = rawSubPages.filter(sp => !sp.segment || (seg && sp.segment.includes(seg.id)));
            const hasSubPages = subPages.length > 0;
            const isExpanded = navExpanded ? navExpanded[id] : false;
            const label = urgentItems.length > 0 && id === "compliance" ? "Compliance 🔴" : (NAV_LABELS[id] || id);

            return (
              <div key={id}>
                <div style={{display:"flex",alignItems:"center",borderLeft:isActive?`3px solid ${accent}`:"3px solid transparent",background:isActive?accent+"18":"transparent"}}>
                  <button
                    onClick={()=>{
                      if(isLocked){
                        if(onLockedClick) onLockedClick(id);
                      } else {
                        onNav(id);
                        setNavOpen(false);
                      }
                    }}
                    style={{flex:1,display:"flex",alignItems:"center",gap:12,padding:"11px 18px",background:"transparent",border:"none",color:isLocked?"#444":isActive?accent:"#666",fontSize:12,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",textAlign:"left",transition:"all 0.12s"}}
                  >
                    <span style={{fontSize:14,width:20,textAlign:"center",flexShrink:0,opacity:isLocked?0.4:1}}>{NAV_ICONS[id]||"·"}</span>
                    <span style={{flex:1,opacity:isLocked?0.4:1}}>{label}</span>
                    {isLocked && <span style={{fontSize:10,color:"#999"}}>🔒</span>}
                  </button>
                  {hasSubPages && (
                    <button
                      onClick={(e)=>{
                        if(isLocked){if(onLockedClick) onLockedClick(id);}
                        else {toggleNavExpand&&toggleNavExpand(id,e);}
                      }}
                      style={{background:"transparent",border:"none",color:isLocked?"#444":isExpanded?accent:"#444",cursor:"pointer",padding:"11px 14px",fontSize:14,transition:"transform 0.2s ease",transform:(!isLocked&&isExpanded)?"rotate(90deg)":"rotate(0deg)",opacity:isLocked?0.5:1}}
                    >›</button>
                  )}
                </div>
                {hasSubPages && isExpanded && !isLocked && (
                  <div style={{background:"#080808",borderLeft:`3px solid ${accent}22`,marginLeft:20}}>
                    {subPages.map(sp => {
                      const spActive = screen === id && subScreen === sp.id;
                      return (
                        <button
                          key={sp.id}
                          onClick={()=>{onNav(id);if(onSubNav)onSubNav(id,sp.id);else setSubScreen&&setSubScreen(sp.id);setNavOpen(false);}}
                          style={{display:"block",width:"100%",padding:"8px 18px 8px 24px",background:spActive?accent+"11":"transparent",border:"none",borderBottom:"1px solid #111",color:spActive?accent:"#555",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em",cursor:"pointer",textAlign:"left",transition:"all 0.1s"}}
                        >
                          {spActive ? "▸ " : "  "}{sp.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{flexShrink:0}}>
          <div style={{padding:"8px 18px",borderTop:"1px solid #1e1e1e",background:"#080808"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:9,color:"#999",letterSpacing:"0.1em",textTransform:"uppercase"}}>{seg.icon} {seg.label}</div>
              {TIERS && currentTier && (
                <div style={{fontSize:9,color:TIERS[currentTier]?.color||accent,border:`1px solid ${TIERS[currentTier]?.color||accent}33`,padding:"2px 8px",borderRadius:3,letterSpacing:"0.1em",textTransform:"uppercase"}}>
                  {TIERS[currentTier]?.label||"Fleet"}
                </div>
              )}
            </div>
            {userRole && (
              <div style={{fontSize:9,color:"#aaa",marginTop:4,letterSpacing:"0.08em"}}>
                {userRole==="owner"?"👑 Owner":userRole==="manager"?"🏢 Manager":"🚛 Driver"}
              </div>
            )}
            {signOut && (
              <button
                onClick={()=>{setNavOpen(false);signOut();}}
                style={{marginTop:10,width:"100%",background:"#1a0808",border:"1px solid #ef444455",color:"#ef4444",padding:"8px 0",borderRadius:4,fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",fontWeight:700}}
              >
                ⎋ SIGN OUT
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
