export default function StatCard({label, value, color, sub, card}) {
  return (
    <div style={card}>
      <div style={{fontSize:28,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:color||"#f59e0b",lineHeight:1}}>{value}</div>
      <div style={{fontSize:9,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:5}}>{label}</div>
      {sub&&<div style={{fontSize:10,color:"#444",marginTop:3}}>{sub}</div>}
    </div>
  );
}
