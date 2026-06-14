// ─── SHARED STYLES ─────────────────────────────────────────────────────────────
export const mkStyles = (accent) => ({
  input: {width:"100%",background:"#0f0f0f",border:"1px solid #2a2a2a",borderRadius:6,padding:"10px 14px",color:"#e8e4d8",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none"},
  label: {fontSize:9,color:"#555",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:5,display:"block"},
  card: {background:"#141414",border:"1px solid #222",borderRadius:8,padding:"18px 20px"},
  btn: {background:accent,color:"#0a0a0a",border:"none",padding:"10px 22px",borderRadius:6,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",letterSpacing:"0.08em"},
  ghost: {background:"transparent",border:"1px solid #2a2a2a",color:"#666",padding:"10px 18px",borderRadius:6,fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer"},
  danger: {background:"#ef4444",color:"#fff",border:"none",padding:"10px 22px",borderRadius:6,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"},
  section: {fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:800,color:"#e8e4d8",letterSpacing:"0.02em"},
});
