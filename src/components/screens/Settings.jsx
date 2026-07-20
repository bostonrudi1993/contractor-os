import { SEGMENTS } from "../../config/segments.js";

export default function Settings({seg, accent, S, settings, setSettings, segment, organization, currentTier, TIERS, onUpgrade}) {
  return (
    <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{...S.section,marginBottom:20}}>SETTINGS</div>
        <div style={{...S.card,marginBottom:16}}>
          <div style={{fontSize:10,color:"#999",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Company Info</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["companyName","Company Name","My Fleet LLC"],["homeBase","Home Base (City, ST)","Greer, SC"]].map(([f,lbl,ph])=>(
              <div key={f}><label style={S.label}>{lbl}</label><input value={settings[f]||""} onChange={e=>setSettings(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input}/></div>
            ))}
          </div>
          <div style={{marginTop:12}}>
            <label style={S.label}>Alert Email Address</label>
            <input type="email" value={settings.alertEmail||""} onChange={e=>setSettings(p=>({...p,alertEmail:e.target.value}))} placeholder="you@company.com" style={S.input}/>
            <div style={{fontSize:9,color:"#999",marginTop:4}}>Where Autopilot sends compliance and settlement alerts. This can be different from your login email.</div>
          </div>
        </div>
        <div style={{...S.card,marginBottom:16}}>
          <div style={{fontSize:10,color:"#999",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Vehicle Cost Settings</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["mpg","Truck MPG","8"],["dieselPrice","Diesel Price ($/gal)","3.85"],["cpm","Cost Per Mile ($)","0.18"]].map(([f,lbl,ph])=>(
              <div key={f}><label style={S.label}>{lbl}</label><input value={settings[f]||""} onChange={e=>setSettings(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input}/></div>
            ))}
          </div>
        </div>
        {(segment==="lastmile"||segment==="fedex")&&(
          <div style={{...S.card,marginBottom:16}}>
            <div style={{fontSize:10,color:"#999",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Daily Cost Settings</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={S.label}>Monthly Insurance Premium ($)</label>
                <input type="number" value={settings.monthlyInsurance||""} onChange={e=>setSettings(p=>({...p,monthlyInsurance:e.target.value}))} placeholder="e.g. 850.00" style={S.input} min={0} step={0.01}/>
                {parseFloat(settings.monthlyInsurance||0)>0&&<div style={{fontSize:9,color:"#999",marginTop:4}}>= ${(parseFloat(settings.monthlyInsurance)/30).toFixed(2)}/day</div>}
              </div>
              <div>
                <label style={S.label}>Weekly Truck Payment ($)</label>
                <input type="number" value={settings.weeklyTruckPayment||""} onChange={e=>setSettings(p=>({...p,weeklyTruckPayment:e.target.value}))} placeholder="e.g. 1200.00" style={S.input} min={0} step={0.01}/>
                {parseFloat(settings.weeklyTruckPayment||0)>0&&<div style={{fontSize:9,color:"#999",marginTop:4}}>= ${(parseFloat(settings.weeklyTruckPayment)/7).toFixed(2)}/day</div>}
              </div>
              <div>
                <label style={S.label}>Client Daily Rate ($) — pre-fills Stop Profit</label>
                <input type="number" value={settings.clientDailyRate||""} onChange={e=>setSettings(p=>({...p,clientDailyRate:e.target.value}))} placeholder="e.g. 500.00" style={S.input} min={0} step={0.01}/>
                <div style={{fontSize:9,color:"#999",marginTop:3}}>Fixed daily guarantee Lowe's/FedEx pays you</div>
              </div>
              <div>
                <label style={S.label}>Mile Stipend Rate ($/mile)</label>
                <input type="number" value={settings.mileStipendRate||""} onChange={e=>setSettings(p=>({...p,mileStipendRate:e.target.value}))} placeholder="e.g. 0.45" style={S.input} min={0} step={0.01}/>
                <div style={{fontSize:9,color:"#999",marginTop:3}}>Per-mile rate client pays — auto-fills Stop Profit</div>
              </div>
            </div>
          </div>
        )}
        <div style={{...S.card,marginBottom:16}}>
          <div style={{fontSize:10,color:"#999",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Contractor Type</div>
          <div style={{fontSize:11,color:"#888",marginBottom:12}}>Currently: {seg.icon} {seg.label}</div>
          <div style={{fontSize:10,color:"#999",marginBottom:10,lineHeight:1.7}}>Contractor type is locked after initial setup to prevent accidental data changes. Contact support to change it.</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {Object.values(SEGMENTS).map(s=>(
              <div key={s.id} style={{background:segment===s.id?s.color+"22":"#0f0f0f",border:`1px solid ${segment===s.id?s.color+"44":"#1e1e1e"}`,borderRadius:6,padding:"10px 14px",textAlign:"left",color:segment===s.id?s.color:"#aaa",fontSize:11,fontFamily:"'DM Mono',monospace"}}>
                {s.icon} {s.label}
              </div>
            ))}
          </div>
        </div>
        <div style={{...S.card,marginBottom:16}}>
          <div style={{fontSize:10,color:"#999",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Account & Storage</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:6}}>
              <div style={{fontSize:10,color:"#999"}}>Account Type</div>
              <div style={{fontSize:11,color:organization?"#22c55e":"#f59e0b",fontFamily:"'DM Mono',monospace"}}>{organization?"Team (Org)":"Personal / Device"}</div>
            </div>
            {organization&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:6}}>
              <div style={{fontSize:10,color:"#999"}}>Organization ID</div>
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
        {TIERS&&currentTier&&(
          <div style={{...S.card,marginBottom:16}}>
            <div style={{fontSize:10,color:"#999",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Subscription Plan</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,padding:"12px 14px",background:"#0f0f0f",border:`1px solid ${TIERS[currentTier]?.color||accent}33`,borderRadius:6}}>
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:TIERS[currentTier]?.color||accent}}>{TIERS[currentTier]?.label||"Fleet"} Plan</div>
                <div style={{fontSize:10,color:"#999"}}>{TIERS[currentTier]?.price||"$99/mo"} · {TIERS[currentTier]?.desc||""}</div>
              </div>
              <div style={{fontSize:9,color:TIERS[currentTier]?.color||accent,border:`1px solid ${TIERS[currentTier]?.color||accent}44`,padding:"4px 12px",borderRadius:3,letterSpacing:"0.12em",textTransform:"uppercase"}}>Active</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
              {Object.entries(TIERS).map(([key,tier])=>(
                <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:currentTier===key?"#111":"#080808",border:`1px solid ${currentTier===key?tier.color+"44":"#1a1a1a"}`,borderRadius:5}}>
                  <div>
                    <span style={{fontSize:11,color:currentTier===key?tier.color:"#999",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{tier.label}</span>
                    <span style={{fontSize:9,color:"#888",marginLeft:8}}>{tier.price}</span>
                    <span style={{fontSize:9,color:"#333",marginLeft:6}}>— {tier.desc}</span>
                  </div>
                  {currentTier===key
                    ? <span style={{fontSize:9,color:tier.color,letterSpacing:"0.1em"}}>CURRENT</span>
                    : <button onClick={()=>onUpgrade&&onUpgrade(key)} style={{fontSize:9,color:"#999",background:"transparent",border:"1px solid #2a2a2a",padding:"3px 10px",borderRadius:3,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Upgrade →</button>
                  }
                </div>
              ))}
            </div>
            <div style={{borderTop:"1px solid #1a1a1a",paddingTop:12}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:settings.devMode?10:0}}>
                <div>
                  <div style={{fontSize:10,color:"#333",letterSpacing:"0.1em",textTransform:"uppercase"}}>Dev Mode</div>
                  <div style={{fontSize:9,color:"#2a2a2a"}}>Unlock tier switcher for testing</div>
                </div>
                <button onClick={()=>setSettings(p=>({...p,devMode:!p.devMode}))}
                  style={{background:settings.devMode?"#1a1a2a":"transparent",border:`1px solid ${settings.devMode?"#3a3a6a":"#2a2a2a"}`,color:settings.devMode?"#8888cc":"#333",padding:"4px 14px",borderRadius:3,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace",letterSpacing:"0.05em"}}>
                  {settings.devMode?"ON":"OFF"}
                </button>
              </div>
              {settings.devMode&&(
                <div style={{display:"flex",gap:6}}>
                  {Object.keys(TIERS).map(key=>(
                    <button key={key} onClick={()=>setSettings(p=>({...p,subscriptionTier:key}))}
                      style={{flex:1,padding:"7px 0",background:currentTier===key?TIERS[key].color+"22":"#0f0f0f",border:`1px solid ${currentTier===key?TIERS[key].color+"55":"#1e1e1e"}`,color:currentTier===key?TIERS[key].color:"#999",borderRadius:3,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace",letterSpacing:"0.05em"}}>
                      {TIERS[key].label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {onUpgrade&&(()=>{const tierOrder=Object.keys(TIERS);const nextTier=tierOrder[tierOrder.indexOf(currentTier)+1];return nextTier?<button className="hov" onClick={()=>onUpgrade(nextTier)} style={{...S.btn,marginTop:12,width:"100%"}}>Upgrade to {TIERS[nextTier].label} →</button>:null;})()}
          </div>
        )}
        <div style={{...S.card,marginBottom:16}}>
          <div style={{fontSize:10,color:"#999",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Business Profile — Lender Report</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["businessLegalName","Legal Business Name","My Fleet LLC"],["ownerName","Owner / Operator Name",""],["ein","EIN (Tax ID)","12-3456789"],["bankName","Bank Name",""],["businessStartDate","Business Start Date","date"]].map(([f,lbl,ph])=>(
              <div key={f}><label style={S.label}>{lbl}</label><input type={ph==="date"?"date":"text"} value={settings[f]||""} onChange={e=>setSettings(p=>({...p,[f]:e.target.value}))} placeholder={ph!=="date"?ph:undefined} style={S.input}/></div>
            ))}
          </div>
          <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["existingLoanBalance","Existing Loan Balance ($)","0"],["existingLoanMonthlyPayment","Loan Monthly Payment ($)","0"],["monthlyDepreciation","Monthly Depreciation ($)","0"],["monthlyLoanInterest","Monthly Loan Interest ($)","0"],["monthlyTaxEstimate","Monthly Tax Estimate ($)","0"],["cashReserve","Cash Reserve / Savings ($)","0"]].map(([f,lbl,ph])=>(
              <div key={f}><label style={S.label}>{lbl}</label><input type="number" value={settings[f]||""} onChange={e=>setSettings(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={S.input} min={0} step={0.01}/></div>
            ))}
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
