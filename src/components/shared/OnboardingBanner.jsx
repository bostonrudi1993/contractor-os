export default function OnboardingBanner({onboardStep, setOnboardStep, onboardDismissed, setOnboardDismissed, accent, S, onNav, setNavOpen}) {
  if(onboardDismissed) return null;

  if(onboardStep === 6) {
    return (
      <div style={{position:"fixed",bottom:20,right:20,width:320,background:"#0a150a",border:"1px solid #22c55e44",borderRadius:10,padding:"20px 22px",zIndex:400,boxShadow:"0 8px 32px rgba(0,0,0,0.6)",animation:"fadeUp 0.3s ease"}}>
        <div style={{fontSize:24,marginBottom:8}}>🎉</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"#22c55e",marginBottom:6}}>Setup Complete!</div>
        <div style={{fontSize:11,color:"#aaa",lineHeight:1.7,marginBottom:16}}>ContractorOS is ready to run your operation. Your data saves automatically to the cloud.</div>
        <button className="hov" onClick={()=>{setOnboardDismissed(true);localStorage.setItem("cos_onboard_done","1");}} style={{...S.btn,background:"#22c55e",width:"100%",fontSize:12}}>Let's Go →</button>
      </div>
    );
  }

  if(onboardStep < 1 || onboardStep > 5) return null;

  const steps = [
    { num:1, title:"Navigate the App", icon:"☰", desc:"Tap the ☰ hamburger menu in the top-left corner to open navigation. All screens are accessible from there — compliance, fleet, drivers, finance, and more.", action:"Open Menu", screen:null, specialAction:()=>setNavOpen(true) },
    { num:2, title:"Add Your First Truck", icon:"🚛", desc:"Let's get your fleet set up. Add your truck so compliance tracking and fuel logs work correctly.", action:"Go to Fleet", screen:"fleet" },
    { num:3, title:"Add Your First Driver", icon:"👤", desc:"Add yourself or your first driver. This unlocks payroll, HOS logs, and onboarding checklists.", action:"Go to Drivers", screen:"drivers" },
    { num:4, title:"Set Compliance Dates", icon:"🛡", desc:"Enter your DOT inspection, registration, and insurance expiry dates. The app will alert you before they expire.", action:"Go to Compliance", screen:"compliance" },
    { num:5, title:"Log Your First Expense", icon:"💰", desc:"Add a fuel fill-up or maintenance cost. This starts building your profit & loss picture automatically.", action:"Go to Finance", screen:"finance" },
  ];
  const step = steps[onboardStep - 1];
  const pct = (onboardStep / 5) * 100;

  return (
    <div style={{position:"fixed",bottom:20,right:20,width:320,background:"#141414",border:`1px solid ${accent}44`,borderRadius:10,padding:"20px 22px",zIndex:400,boxShadow:"0 8px 32px rgba(0,0,0,0.6)",animation:"fadeUp 0.3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.15em"}}>Getting Started — Step {onboardStep} of 5</div>
        <button onClick={()=>{setOnboardDismissed(true);localStorage.setItem("cos_onboard_done","1");}} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:14,lineHeight:1}}>✕</button>
      </div>
      <div style={{height:3,background:"#1e1e1e",borderRadius:2,marginBottom:16}}>
        <div style={{height:"100%",width:`${pct}%`,background:accent,borderRadius:2,transition:"width 0.4s ease"}}/>
      </div>
      <div style={{fontSize:24,marginBottom:8}}>{step.icon}</div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"#e8e4d8",marginBottom:6}}>{step.title}</div>
      <div style={{fontSize:11,color:"#aaa",lineHeight:1.7,marginBottom:16}}>{step.desc}</div>
      <div style={{display:"flex",gap:8}}>
        <button className="hov" onClick={()=>{if(step.specialAction){step.specialAction();}else{onNav(step.screen);}setOnboardStep(s=>s+1);}} style={{...S.btn,fontSize:12,flex:1}}>{step.action} →</button>
        {onboardStep < 5 && <button onClick={()=>setOnboardStep(s=>s+1)} style={{...S.ghost,fontSize:10,padding:"10px 12px"}}>Skip</button>}
      </div>
    </div>
  );
}
