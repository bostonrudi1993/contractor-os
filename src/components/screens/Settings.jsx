import { SEGMENTS } from "../../config/segments.js";

export default function Settings({seg, accent, S, settings, setSettings, segment, organization}) {
  return (
    <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{...S.section,marginBottom:20}}>SETTINGS</div>
        <div style={{...S.card,marginBottom:16}}>
          <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Company Info</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["companyName","Company Name","My Fleet LLC"],["homeBase","Home Base (City, ST)","Greer, SC"]].map(([f,lbl,ph])=>(
              <div key={f}><label style={S.label}>{lbl}</label><input value={settings[f]||""} onChange={e=>setSettings(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input}/></div>
            ))}
          </div>
        </div>
        <div style={{...S.card,marginBottom:16}}>
          <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Vehicle Cost Settings</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["mpg","Truck MPG","8"],["dieselPrice","Diesel Price ($/gal)","3.85"],["cpm","Cost Per Mile ($)","0.18"]].map(([f,lbl,ph])=>(
              <div key={f}><label style={S.label}>{lbl}</label><input value={settings[f]||""} onChange={e=>setSettings(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input}/></div>
            ))}
          </div>
        </div>
        {(segment==="lastmile"||segment==="fedex")&&(
          <div style={{...S.card,marginBottom:16}}>
            <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Daily Cost Settings</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={S.label}>Monthly Insurance Premium ($)</label>
                <input type="number" value={settings.monthlyInsurance||""} onChange={e=>setSettings(p=>({...p,monthlyInsurance:e.target.value}))} placeholder="e.g. 850.00" style={S.input} min={0} step={0.01}/>
                {parseFloat(settings.monthlyInsurance||0)>0&&<div style={{fontSize:9,color:"#555",marginTop:4}}>= ${(parseFloat(settings.monthlyInsurance)/30).toFixed(2)}/day</div>}
              </div>
              <div>
                <label style={S.label}>Weekly Truck Payment ($)</label>
                <input type="number" value={settings.weeklyTruckPayment||""} onChange={e=>setSettings(p=>({...p,weeklyTruckPayment:e.target.value}))} placeholder="e.g. 1200.00" style={S.input} min={0} step={0.01}/>
                {parseFloat(settings.weeklyTruckPayment||0)>0&&<div style={{fontSize:9,color:"#555",marginTop:4}}>= ${(parseFloat(settings.weeklyTruckPayment)/7).toFixed(2)}/day</div>}
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <label style={S.label}>Client Daily Rate ($) — pre-fills Stop Profit</label>
                <input type="number" value={settings.clientDailyRate||""} onChange={e=>setSettings(p=>({...p,clientDailyRate:e.target.value}))} placeholder="e.g. 500.00" style={S.input} min={0} step={0.01}/>
                <div style={{fontSize:9,color:"#555",marginTop:3}}>Fixed daily guarantee Lowe's/FedEx pays you — auto-fills the Stop Profit daily entry</div>
              </div>
            </div>
          </div>
        )}
        <div style={{...S.card,marginBottom:16}}>
          <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Contractor Type</div>
          <div style={{fontSize:11,color:"#888",marginBottom:12}}>Currently: {seg.icon} {seg.label}</div>
          <div style={{fontSize:10,color:"#555",marginBottom:10,lineHeight:1.7}}>Contractor type is locked after initial setup to prevent accidental data changes. Contact support to change it.</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {Object.values(SEGMENTS).map(s=>(
              <div key={s.id} style={{background:segment===s.id?s.color+"22":"#0f0f0f",border:`1px solid ${segment===s.id?s.color+"44":"#1e1e1e"}`,borderRadius:6,padding:"10px 14px",textAlign:"left",color:segment===s.id?s.color:"#666",fontSize:11,fontFamily:"'DM Mono',monospace"}}>
                {s.icon} {s.label}
              </div>
            ))}
          </div>
        </div>
        <div style={{...S.card,marginBottom:16}}>
          <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Account & Storage</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:6}}>
              <div style={{fontSize:10,color:"#555"}}>Account Type</div>
              <div style={{fontSize:11,color:organization?"#22c55e":"#f59e0b",fontFamily:"'DM Mono',monospace"}}>{organization?"Team (Org)":"Personal / Device"}</div>
            </div>
            {organization&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:6}}>
              <div style={{fontSize:10,color:"#555"}}>Organization ID</div>
              <div style={{fontSize:9,color:"#3a3a6a",fontFamily:"'DM Mono',monospace",wordBreak:"break-all",textAlign:"right",maxWidth:280}}>{organization.id}</div>
            </div>}
            <div style={{padding:"10px 12px",background:"#0a0a14",border:"1px solid #1a1a2a",borderRadius:6,fontSize:10,color:"#3a3a6a",lineHeight:1.8}}>
              🔒 All data is scoped to your {organization?"organization":"device"} and never shared. ContractorOS stores data in your browser and, if configured, in your Supabase cloud — not on Anthropic or Clerk servers.
            </div>
            {!organization&&<div style={{padding:"10px 12px",background:"#1a1000",border:"1px solid #3a2800",borderRadius:6,fontSize:10,color:"#a06020",lineHeight:1.8}}>
              ⚠ You're using a personal device account. Data is tied to this browser. Create an organization in your account settings to enable multi-device sync and team access.
            </div>}
          </div>
        </div>
        <div style={{padding:"12px 16px",background:"#0d0d14",border:"1px solid #1a1a2a",borderRadius:6}}>
          <div style={{fontSize:9,color:"#3a3a6a",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4}}>Auto-Saved</div>
          <div style={{fontSize:11,color:"#4a4a8a"}}>All data saves automatically to your browser.</div>
        </div>
      </div>
    </div>
  );
}
