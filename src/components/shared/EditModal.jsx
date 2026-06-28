export default function EditModal({modal, editForm, setEditForm, saveEdit, closeModal, accent, S, MODAL_CONFIGS}) {
  if(!modal) return null;
  const config = MODAL_CONFIGS[modal.type];
  if(!config) return null;
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}} onClick={closeModal}>
      <div style={{background:"#141414",border:`1px solid ${accent}44`,borderRadius:10,padding:"28px 28px 24px",maxWidth:560,width:"100%",maxHeight:"85vh",overflowY:"auto",animation:"fadeUp 0.2s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#e8e4d8"}}>{config.title}</div>
          <button onClick={closeModal} style={{background:"transparent",border:"none",color:"#999",cursor:"pointer",fontSize:18,lineHeight:1}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          {config.fields.map(([field,label,type])=>{
            const isTextarea = type==="textarea";
            const isSelect = type.startsWith("select:");
            const options = isSelect ? type.replace("select:","").split("|") : [];
            const isFullWidth = isTextarea || field==="notes" || field==="name";
            return (
              <div key={field} style={{gridColumn:isFullWidth?"1/-1":"auto"}}>
                <label style={S.label}>{label}</label>
                {isTextarea ? (
                  <textarea value={editForm[field]||""} onChange={e=>setEditForm(p=>({...p,[field]:e.target.value}))} style={{...S.input,height:80,resize:"vertical"}}/>
                ) : isSelect ? (
                  <select value={editForm[field]||""} onChange={e=>setEditForm(p=>({...p,[field]:e.target.value}))} style={S.input}>
                    {options.map(o=><option key={o} value={o}>{o||"Select..."}</option>)}
                  </select>
                ) : (
                  <input type={type} value={editForm[field]||""} onChange={e=>setEditForm(p=>({...p,[field]:e.target.value}))} style={S.input}/>
                )}
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={saveEdit} style={S.btn}>Save Changes</button>
          <button onClick={closeModal} style={S.ghost}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
