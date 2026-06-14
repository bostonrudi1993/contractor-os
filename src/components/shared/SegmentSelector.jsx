import { SEGMENTS } from "../../config/segments.js";

export default function SegmentSelector({onSelect}) {
  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'DM Mono',monospace",padding:32}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap'); *{box-sizing:border-box} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{textAlign:"center",marginBottom:48,animation:"fadeUp 0.5s ease"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:"0.4em",color:"#444",textTransform:"uppercase",marginBottom:16}}>Welcome to</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:52,fontWeight:900,color:"#e8e4d8",lineHeight:1,letterSpacing:"-0.01em"}}>CONTRACTOR<span style={{color:"#f59e0b"}}>OS</span></div>
        <div style={{fontSize:12,color:"#555",marginTop:12,lineHeight:1.7}}>The complete operating system for contract carriers.<br/>Select your contractor type to get started.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,maxWidth:900,width:"100%",animation:"fadeUp 0.5s 0.1s ease both"}}>
        {Object.values(SEGMENTS).map(s=>(
          <button key={s.id} onClick={()=>onSelect(s.id)} style={{background:"#111",border:"1px solid #222",borderRadius:10,padding:"24px 26px",textAlign:"left",cursor:"pointer",transition:"all 0.2s",outline:"none"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.background="#161616";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#222";e.currentTarget.style.background="#111";}}>
            <div style={{fontSize:28,marginBottom:12}}>{s.icon}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#e8e4d8",marginBottom:6}}>{s.label}</div>
            <div style={{fontSize:11,color:"#555",lineHeight:1.6,marginBottom:16}}>{s.tagline}</div>
            <div style={{fontSize:10,color:s.color,letterSpacing:"0.15em",textTransform:"uppercase"}}>Select →</div>
          </button>
        ))}
      </div>
      <div style={{marginTop:32,fontSize:10,color:"#333",animation:"fadeUp 0.5s 0.2s ease both"}}>You can switch contractor types anytime in Settings</div>
    </div>
  );
}
