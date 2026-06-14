const statusColor = d => { if(d===null) return "#444"; if(d<0) return "#ef4444"; if(d<=30) return "#ef4444"; if(d<=60) return "#f59e0b"; if(d<=90) return "#facc15"; return "#22c55e"; };
const statusLabel = d => { if(d===null) return "Not set"; if(d<0) return `OVERDUE ${Math.abs(d)}d`; if(d===0) return "TODAY"; if(d<=30) return `${d}d URGENT`; if(d<=90) return `${d}d Soon`; return `${d}d`; };

export default function ExpiryBadge({label, days}) {
  return (
    <div style={{background:days<0?"#1c0505":days<=30?"#1a1005":"#141414",border:`1px solid ${statusColor(days)}33`,borderLeft:`3px solid ${statusColor(days)}`,borderRadius:6,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,color:"#c8c4bc"}}>{label}</span>
      <span style={{fontSize:11,color:statusColor(days),fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{statusLabel(days)}</span>
    </div>
  );
}
