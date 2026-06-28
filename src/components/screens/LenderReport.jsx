import { useState } from "react";

const fmt$ = n => `$${(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fmtPct = n => `${(n||0).toFixed(1)}%`;
const today = new Date();

function calcMonthlyAvg(arr, months, field="amount") {
  const monthKeys = Array.from({length:months},(_,i)=>{
    const d=new Date(today.getFullYear(),today.getMonth()-i,1);
    return d.toISOString().slice(0,7);
  });
  const totals = monthKeys.map(k=>arr.filter(r=>r.date?.startsWith(k)).reduce((s,r)=>s+parseFloat(r[field]||0),0));
  return totals.reduce((a,b)=>a+b,0)/months;
}

function SectionHeader({title}) {
  return <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,color:"#e8e4d8",letterSpacing:"0.12em",textTransform:"uppercase",borderBottom:"1px solid #222",paddingBottom:8,marginBottom:12,marginTop:24}}>{title}</div>;
}

function DataRow({label, value, valueColor, indent, bold}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:`${bold?"6":"4"}px 0`,paddingLeft:indent?16:0,borderBottom:"1px solid #0f0f0f"}}>
      <span style={{fontSize:11,color:bold?"#c8c4bc":"#666"}}>{label}</span>
      <span style={{fontSize:12,color:valueColor||"#e8e4d8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:bold?700:400}}>{value}</span>
    </div>
  );
}

function StatusBadge({status}) {
  const colors = {READY:"#22c55e",PARTIAL:"#f59e0b",NEEDED:"#ef4444",EXTERNAL:"#6366f1",AUTO:"#22c55e"};
  const c = colors[status]||"#555";
  return <span style={{fontSize:8,fontWeight:700,color:c,background:c+"18",padding:"2px 6px",borderRadius:3,letterSpacing:"0.1em",whiteSpace:"nowrap"}}>{status}</span>;
}

export default function LenderReport(p) {
  const {
    seg, accent, S, segment, settings, setSettings,
    revenue, expenses, invoices, contracts, compliance, drivers, documents, maintenance,
    assetsList, setAssetsList, debtList, setDebtList, payablesList, setPayablesList,
    fmcsaResult, handleNav,
    lenderTab, setLenderTab,
  } = p;

  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [showPayableForm, setShowPayableForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    businessLegalName: settings.businessLegalName||"",
    ownerName: settings.ownerName||"",
    businessStartDate: settings.businessStartDate||"",
    ein: settings.ein||"",
    bankName: settings.bankName||"",
    existingLoanMonthlyPayment: settings.existingLoanMonthlyPayment||"",
    cashReserve: settings.cashReserve||"",
  });
  const [assetForm, setAssetForm] = useState({assetName:"",assetType:"Vehicle",purchaseDate:"",purchasePrice:"",currentValue:"",lienBalance:"",monthlyPayment:"",lenderName:"",notes:""});
  const [debtForm, setDebtForm] = useState({creditorName:"",debtType:"Truck Loan",originalAmount:"",currentBalance:"",monthlyPayment:"",interestRate:"",loanStartDate:"",collateral:"",notes:""});
  const [payableForm, setPayableForm] = useState({vendorName:"",description:"",amountOwed:"",dueDate:"",status:"Current"});

  const tabs = [
    ["report","Business Report"],["balance","Balance Sheet"],["debt","Debt Schedule"],
    ["aging","AR/AP Aging"],["assets","Assets & Liabilities"],["docs","Doc Checklist"],
  ];

  // ── Shared calculations ──
  const avg3Rev = calcMonthlyAvg(revenue, 3);
  const avg12Rev = calcMonthlyAvg(revenue, 12);
  const avg3Exp = calcMonthlyAvg(expenses, 3);
  const avg12Exp = calcMonthlyAvg(expenses, 12);
  const ytdYear = today.getFullYear().toString();
  const ytdRev = revenue.filter(r=>r.date?.startsWith(ytdYear)).reduce((s,r)=>s+parseFloat(r.amount||0),0);

  const monthlyFixed=(parseFloat(settings.weeklyTruckPayment||0)*52/12)+parseFloat(settings.monthlyInsurance||0)+parseFloat(settings.existingLoanMonthlyPayment||0);

  const totalAssetsValue = assetsList.reduce((s,a)=>s+parseFloat(a.currentValue||0),0) + parseFloat(settings.cashReserve||0);
  const totalDebtBalance = debtList.reduce((s,d)=>s+parseFloat(d.currentBalance||0),0);
  const totalLienBalance = assetsList.reduce((s,a)=>s+parseFloat(a.lienBalance||0),0);

  const saveProfile = () => {
    setSettings(prev=>({...prev,...profileForm}));
    setShowProfileForm(false);
  };

  // ── Render tabs ──
  function renderReport() {
    const profileIncomplete = !settings.businessLegalName||!settings.ownerName||!settings.ein;
    const timeBusiness = () => {
      if(!settings.businessStartDate) return "Not provided";
      const start = new Date(settings.businessStartDate);
      const diffMs = today-start;
      const years = Math.floor(diffMs/(365.25*24*60*60*1000));
      const months = Math.floor((diffMs%(365.25*24*60*60*1000))/(30.44*24*60*60*1000));
      return `${years} year${years!==1?"s":""}, ${months} month${months!==1?"s":""}`;
    };

    const prior3RevKeys = Array.from({length:3},(_,i)=>new Date(today.getFullYear(),today.getMonth()-3-i,1).toISOString().slice(0,7));
    const prior3Rev = prior3RevKeys.map(k=>revenue.filter(r=>r.date?.startsWith(k)).reduce((s,r)=>s+parseFloat(r.amount||0),0));
    const avg3Prior = prior3Rev.reduce((a,b)=>a+b,0)/3;
    const trendPct = avg3Prior>0?((avg3Rev-avg3Prior)/avg3Prior)*100:0;

    const ytdMonths = revenue.filter(r=>r.date?.startsWith(ytdYear));
    const byMonth = {};
    ytdMonths.forEach(r=>{const k=r.date?.slice(0,7)||"";byMonth[k]=(byMonth[k]||0)+parseFloat(r.amount||0);});
    const monthEntries = Object.entries(byMonth).filter(([,v])=>v>0);
    const highMonth = monthEntries.length?monthEntries.reduce((a,b)=>a[1]>b[1]?a:b):null;
    const lowMonth = monthEntries.length?monthEntries.reduce((a,b)=>a[1]<b[1]?a:b):null;
    const fmtMonthLabel = k=>{if(!k)return"";const[y,m]=k.split("-");return new Date(y,parseInt(m)-1).toLocaleDateString("en-US",{month:"short",year:"numeric"});};

    const catTotals = {};
    expenses.forEach(e=>{const c=e.category||"other";catTotals[c]=(catTotals[c]||0)+parseFloat(e.amount||0);});
    const topCats = Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).slice(0,3);
    const expRatio = avg3Rev>0?(avg3Exp/avg3Rev)*100:0;
    const expRatioColor = expRatio<70?"#22c55e":expRatio<85?"#f59e0b":"#ef4444";

    const operatingExp = avg3Exp - (()=>{
      const keywords=["loan","interest","depreciation","tax"];
      return expenses
        .filter(e=>{const cat=(e.category||"").toLowerCase();const desc=(e.description||"").toLowerCase();return keywords.some(k=>cat.includes(k)||desc.includes(k));})
        .reduce((s,e)=>s+parseFloat(e.amount||0),0)/3;
    })();
    const ebitda = avg3Rev - operatingExp;
    const ebitdaMargin = avg3Rev>0?(ebitda/avg3Rev)*100:0;
    const depreciation = parseFloat(settings.monthlyDepreciation||0);
    const loanInterest = parseFloat(settings.monthlyLoanInterest||0);
    const taxEst = parseFloat(settings.monthlyTaxEstimate||0);
    const ebit = ebitda-depreciation-loanInterest;
    const netIncome = ebit-taxEst;
    const ebitdaColor = ebitdaMargin>=20?"#22c55e":ebitdaMargin>=15?"#f59e0b":"#ef4444";
    const ebitdaMsg = ebitdaMargin>=20?"Strong — above lender minimum":ebitdaMargin>=15?"Acceptable to most lenders":"Below typical 15% threshold";

    const months12 = Array.from({length:12},(_,i)=>{
      const d=new Date(today.getFullYear(),today.getMonth()-11+i,1);
      const k=d.toISOString().slice(0,7);
      const label=d.toLocaleDateString("en-US",{month:"short",year:"numeric"});
      const inflow=revenue.filter(r=>r.date?.startsWith(k)).reduce((s,r)=>s+parseFloat(r.amount||0),0);
      const outflow=expenses.filter(e=>e.date?.startsWith(k)).reduce((s,e)=>s+parseFloat(e.amount||0),0);
      return{label,inflow,outflow,net:inflow-outflow};
    });
    const cumulative = months12.reduce((acc,m,i)=>{acc.push((i>0?acc[i-1]:0)+m.net);return acc;},[]);
    const posMonths = months12.filter(m=>m.net>0).length;
    const cashReserve = parseFloat(settings.cashReserve||0);
    const cashRunway = avg3Exp>0?cashReserve/avg3Exp:0;
    const cashRunwayColor = cashRunway>=3?"#22c55e":cashRunway>=1?"#f59e0b":"#ef4444";

    const dscr = monthlyFixed>0?(avg3Rev-avg3Exp)/monthlyFixed:0;
    const dscrColor = dscr>=1.25?"#22c55e":dscr>=1.0?"#f59e0b":"#ef4444";
    const dscrMsg = dscr>=1.25?"✓ Meets lender minimum (1.25x)":dscr>=1.0?"⚠ Below typical 1.25x minimum":"✗ Expenses exceed income";

    return (
      <div>
        <button onClick={()=>window.print()} className="no-print" style={{...S.ghost,fontSize:10,marginBottom:16}}>🖨 Print / Export Report</button>

        {profileIncomplete&&(
          <div style={{background:"#1a1200",border:"1px solid #3a2800",borderRadius:6,padding:"12px 16px",marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:11,color:"#f59e0b"}}>⚠ Complete your business profile for a full lender report</div>
              <button onClick={()=>setShowProfileForm(!showProfileForm)} style={{...S.ghost,fontSize:10,padding:"4px 10px"}}>{showProfileForm?"Cancel":"Complete Profile"}</button>
            </div>
            {showProfileForm&&(
              <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["businessLegalName","Legal Business Name"],["ownerName","Owner Name"],["ein","EIN (XX-XXXXXXX)"],["bankName","Primary Bank"],["existingLoanMonthlyPayment","Existing Loan Payment/mo ($)"],["cashReserve","Current Cash Reserve ($)"]].map(([f,lbl])=>(
                  <div key={f}><label style={S.label}>{lbl}</label><input value={profileForm[f]} onChange={e=>setProfileForm(prev=>({...prev,[f]:e.target.value}))} style={S.input}/></div>
                ))}
                <div><label style={S.label}>Business Start Date</label><input type="date" value={profileForm.businessStartDate} onChange={e=>setProfileForm(prev=>({...prev,businessStartDate:e.target.value}))} style={S.input}/></div>
                <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
                  <button onClick={saveProfile} style={S.btn}>Save Profile</button>
                </div>
              </div>
            )}
          </div>
        )}

        <SectionHeader title="1. Business Overview"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <DataRow label="Legal Name" value={settings.businessLegalName||settings.companyName||"Not set"}/>
          <DataRow label="Owner" value={settings.ownerName||"Not set"}/>
          <DataRow label="Contractor Type" value={seg.label}/>
          <DataRow label="Time in Business" value={timeBusiness()}/>
          <DataRow label="EIN" value={settings.ein?`XX-XXX${settings.ein.slice(-4)}`:"Not provided"}/>
          <DataRow label="Primary Bank" value={settings.bankName||"Not provided"}/>
        </div>

        <SectionHeader title="2. Revenue Summary"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <DataRow label="3-Month Avg Monthly Revenue" value={fmt$(avg3Rev)} bold/>
          <DataRow label="12-Month Avg Monthly Revenue" value={fmt$(avg12Rev)}/>
          <DataRow label="YTD Total Revenue" value={fmt$(ytdRev)}/>
          <DataRow label="Revenue Trend (vs prior 3 months)" value={trendPct>0?`↑ ${trendPct.toFixed(0)}% improving`:`↓ ${Math.abs(trendPct).toFixed(0)}% declining`} valueColor={trendPct>0?"#22c55e":"#ef4444"}/>
          {highMonth&&<DataRow label="Highest Month (YTD)" value={`${fmtMonthLabel(highMonth[0])}: ${fmt$(highMonth[1])}`} valueColor="#22c55e"/>}
          {lowMonth&&<DataRow label="Lowest Month (YTD)" value={`${fmtMonthLabel(lowMonth[0])}: ${fmt$(lowMonth[1])}`} valueColor="#f59e0b"/>}
        </div>

        <SectionHeader title="3. Expense Summary"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <DataRow label="3-Month Avg Monthly Expenses" value={fmt$(avg3Exp)} bold/>
          <DataRow label="12-Month Avg Monthly Expenses" value={fmt$(avg12Exp)}/>
          <DataRow label="Expense Ratio (expenses/revenue)" value={avg3Rev>0?fmtPct(expRatio):"N/A"} valueColor={expRatioColor}/>
        </div>
        {topCats.length>0&&(
          <div style={{marginTop:8}}>
            <div style={{fontSize:9,color:"#999",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Top Expense Categories</div>
            {topCats.map(([cat,total])=>(
              <DataRow key={cat} label={cat.replace(/_/g," ")} value={fmt$(total)} indent/>
            ))}
          </div>
        )}

        <SectionHeader title="4. Profitability / EBITDA"/>
        <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:6,padding:"12px 16px",marginBottom:12}}>
          {[
            {label:"Revenue (avg/mo)",value:fmt$(avg3Rev),color:"#22c55e",bold:true},
            {label:"- Operating Expenses",value:`(${fmt$(operatingExp)})`,color:"#ef4444"},
            {label:"= EBITDA",value:fmt$(ebitda),color:ebitdaColor,bold:true},
            {label:`  EBITDA Margin — ${ebitdaMsg}`,value:fmtPct(ebitdaMargin),color:ebitdaColor},
            {label:"- Depreciation",value:`(${fmt$(depreciation)})`,color:"#888"},
            {label:"- Loan Interest",value:`(${fmt$(loanInterest)})`,color:"#888"},
            {label:"= EBIT",value:fmt$(ebit),color:"#c8c4bc",bold:true},
            {label:"- Taxes (est.)",value:`(${fmt$(taxEst)})`,color:"#888"},
            {label:"= Net Income",value:fmt$(netIncome),color:netIncome>=0?"#22c55e":"#ef4444",bold:true},
          ].map((row,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #141414"}}>
              <span style={{fontSize:11,color:row.color||"#666",fontWeight:row.bold?700:400,fontFamily:row.bold?"'Barlow Condensed',sans-serif":"inherit"}}>{row.label}</span>
              <span style={{fontSize:12,color:row.color||"#c8c4bc",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:row.bold?800:500}}>{row.value}</span>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:8}}>
          {[["monthlyDepreciation","Depreciation/mo ($)"],["monthlyLoanInterest","Loan Interest/mo ($)"],["monthlyTaxEstimate","Tax Estimate/mo ($)"]].map(([f,lbl])=>(
            <div key={f}><label style={S.label}>{lbl}</label><input type="number" value={settings[f]||""} onChange={e=>setSettings(prev=>({...prev,[f]:e.target.value}))} placeholder="0" style={S.input}/></div>
          ))}
        </div>

        <SectionHeader title="5. Cash Flow (12 Months)"/>
        <div style={{overflowX:"auto",marginBottom:12}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
            <thead>
              <tr style={{borderBottom:"1px solid #222"}}>
                {["Month","Revenue","Expenses","Net","Cumulative"].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"right",color:"#999",letterSpacing:"0.08em",fontWeight:600,textTransform:"uppercase",whiteSpace:"nowrap",":first-child":{textAlign:"left"}}}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {months12.map((m,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #111"}}>
                  <td style={{padding:"5px 8px",color:"#888",fontSize:10,whiteSpace:"nowrap"}}>{m.label}</td>
                  <td style={{padding:"5px 8px",textAlign:"right",color:"#22c55e",fontSize:10}}>{m.inflow>0?fmt$(m.inflow):"—"}</td>
                  <td style={{padding:"5px 8px",textAlign:"right",color:"#ef4444",fontSize:10}}>{m.outflow>0?fmt$(m.outflow):"—"}</td>
                  <td style={{padding:"5px 8px",textAlign:"right",color:m.net>=0?"#22c55e":"#ef4444",fontSize:10,fontWeight:700}}>{m.inflow>0||m.outflow>0?fmt$(m.net):"—"}</td>
                  <td style={{padding:"5px 8px",textAlign:"right",color:cumulative[i]>=0?"#22c55e":"#ef4444",fontSize:10}}>{m.inflow>0||m.outflow>0?fmt$(cumulative[i]):"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
          <div style={{...S.card,padding:"10px 14px"}}>
            <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Positive Months</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:posMonths>=9?"#22c55e":posMonths>=6?"#f59e0b":"#ef4444"}}>{posMonths}/12</div>
          </div>
          <div style={{...S.card,padding:"10px 14px"}}>
            <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Avg Monthly Net</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#c8c4bc"}}>{fmt$(months12.reduce((s,m)=>s+m.net,0)/12)}</div>
          </div>
          <div style={{...S.card,padding:"10px 14px"}}>
            <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Consistency</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#c8c4bc"}}>{fmtPct((posMonths/12)*100)}</div>
          </div>
        </div>
        <div style={{...S.card,padding:"12px 16px",marginBottom:8}}>
          <div style={{fontSize:10,color:"#999",marginBottom:8,letterSpacing:"0.1em",textTransform:"uppercase"}}>Cash Position</div>
          <DataRow label="Current Cash Reserve" value={cashReserve>0?fmt$(cashReserve):"Not set"} bold/>
          <DataRow label="Monthly Avg Expenses" value={fmt$(avg3Exp)}/>
          {cashReserve>0&&avg3Exp>0&&<DataRow label="Cash Runway" value={`${cashRunway.toFixed(1)} months`} valueColor={cashRunwayColor} bold/>}
          <div style={{marginTop:8,display:"flex",gap:10,alignItems:"flex-end"}}>
            <div style={{flex:1}}><label style={S.label}>Update Cash Reserve ($)</label><input type="number" value={settings.cashReserve||""} onChange={e=>setSettings(prev=>({...prev,cashReserve:e.target.value}))} placeholder="e.g. 15000" style={S.input}/></div>
          </div>
          <div style={{fontSize:10,color:"#999",marginTop:8}}>Lenders want 2-3 months cash reserve. You currently have {cashReserve>0&&avg3Exp>0?`${cashRunway.toFixed(1)} months.`:"—."}</div>
        </div>

        <SectionHeader title="6. Debt Service Coverage"/>
        <div style={{...S.card,padding:"12px 16px",marginBottom:12}}>
          <DataRow label="Avg Monthly Net Income" value={fmt$(avg3Rev-avg3Exp)} bold/>
          <DataRow label="Monthly Obligations" value={fmt$(monthlyFixed)} bold/>
          <DataRow label="  Truck Payment" value={fmt$(parseFloat(settings.weeklyTruckPayment||0)*52/12)} indent/>
          <DataRow label="  Insurance" value={fmt$(parseFloat(settings.monthlyInsurance||0))} indent/>
          <DataRow label="  Other Loans" value={fmt$(parseFloat(settings.existingLoanMonthlyPayment||0))} indent/>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"1px solid #222",marginTop:6}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#e8e4d8"}}>DSCR Ratio</span>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:dscrColor}}>{monthlyFixed>0?dscr.toFixed(2):"N/A"}</div>
              <div style={{fontSize:10,color:dscrColor}}>{monthlyFixed>0?dscrMsg:"Add obligations in Settings"}</div>
            </div>
          </div>
          <div style={{fontSize:10,color:"#999",marginTop:8,lineHeight:1.6,padding:"8px 12px",background:"#0f0f0f",borderRadius:4}}>
            Debt Service Coverage Ratio shows how many times your income covers your debt payments. Most lenders require 1.25x minimum.
          </div>
        </div>

        <SectionHeader title="7. Contract History"/>
        {contracts.length===0?(
          <div style={{fontSize:11,color:"#999",padding:"12px 0"}}>No contracts logged — add contracts in the Contracts screen</div>
        ):(
          <div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                <thead><tr style={{borderBottom:"1px solid #222"}}>
                  {["Contract","Client","Start Date","Value","Status"].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left",color:"#999",letterSpacing:"0.08em",textTransform:"uppercase"}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {contracts.map(c=>(
                    <tr key={c.id} style={{borderBottom:"1px solid #111"}}>
                      <td style={{padding:"6px 8px",color:"#c8c4bc",fontSize:11}}>{c.name||"—"}</td>
                      <td style={{padding:"6px 8px",color:"#888"}}>{c.company||"—"}</td>
                      <td style={{padding:"6px 8px",color:"#888"}}>{c.startDate||"—"}</td>
                      <td style={{padding:"6px 8px",color:"#22c55e"}}>{c.value?fmt$(c.value):"—"}</td>
                      <td style={{padding:"6px 8px"}}><span style={{fontSize:9,color:c.status==="active"?"#22c55e":"#888",background:c.status==="active"?"#22c55e18":"#88888818",padding:"2px 6px",borderRadius:3}}>{c.status||"—"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{fontSize:10,color:"#999",marginTop:8}}>Active contracts demonstrate stable recurring revenue to lenders</div>
          </div>
        )}

        <SectionHeader title="8. Fleet Assets"/>
        {compliance.trucks.length===0?(
          <div style={{fontSize:11,color:"#999",padding:"12px 0"}}>No vehicles on file — add vehicles in Compliance</div>
        ):(
          <div>
            {compliance.trucks.map(t=>(
              <div key={t.id||t.name} style={{display:"flex",gap:12,padding:"8px 0",borderBottom:"1px solid #111",alignItems:"center"}}>
                <div style={{fontSize:14}}>🚛</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:"#c8c4bc",fontWeight:600}}>{t.name}</div>
                  <div style={{fontSize:9,color:"#999"}}>{[t.year,t.make].filter(Boolean).join(" ")||"—"}{t.vin?` · VIN: ${t.vin}`:""}</div>
                </div>
              </div>
            ))}
            <button onClick={()=>setLenderTab("assets")} style={{...S.ghost,fontSize:10,marginTop:8}}>Add financial details for these vehicles →</button>
          </div>
        )}
      </div>
    );
  }

  function renderBalance() {
    const arTotal = invoices.filter(inv=>inv.status!=="paid").reduce((s,inv)=>s+parseFloat(inv.amount||0),0);
    const cashAmt = parseFloat(settings.cashReserve||0);
    const fixedAssetsTotal = assetsList.reduce((s,a)=>s+parseFloat(a.currentValue||0),0);
    const totalCurrentAssets = cashAmt+arTotal;
    const totalAssets = totalCurrentAssets+fixedAssetsTotal;

    const now30 = new Date(Date.now()+30*86400000);
    const apCurrentTotal = payablesList.filter(item=>item.status==="Overdue"||(item.dueDate&&new Date(item.dueDate)<=now30)).reduce((s,item)=>s+parseFloat(item.amountOwed||0),0);
    const ltDebtTotal = debtList.reduce((s,d)=>s+parseFloat(d.currentBalance||0),0);
    const totalLiabilities = apCurrentTotal+ltDebtTotal;
    const ownerEquity = totalAssets-totalLiabilities;
    const retainedEarnings = revenue.reduce((s,r)=>s+parseFloat(r.amount||0),0)-expenses.reduce((s,e)=>s+parseFloat(e.amount||0),0);

    return (
      <div>
        <button onClick={()=>window.print()} className="no-print" style={{...S.ghost,fontSize:10,marginBottom:16}}>🖨 Print Balance Sheet</button>
        <div style={{fontSize:10,color:"#999",marginBottom:16}}>As of {today.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,color:accent,marginBottom:8,letterSpacing:"0.1em"}}>ASSETS</div>
            <div style={{fontSize:10,color:"#999",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Current Assets</div>
            <DataRow label="Cash & Equivalents" value={fmt$(cashAmt)} indent/>
            <DataRow label="Accounts Receivable" value={fmt$(arTotal)} indent/>
            <DataRow label="Total Current Assets" value={fmt$(totalCurrentAssets)} bold/>
            <div style={{fontSize:10,color:"#999",marginBottom:4,marginTop:12,textTransform:"uppercase",letterSpacing:"0.1em"}}>Fixed Assets</div>
            {assetsList.length===0&&<div style={{fontSize:10,color:"#333",padding:"4px 8px"}}>None added — add in Assets tab</div>}
            {assetsList.map(a=><DataRow key={a.id} label={a.assetName} value={fmt$(parseFloat(a.currentValue||0))} indent/>)}
            <DataRow label="Total Fixed Assets" value={fmt$(fixedAssetsTotal)} bold/>
            <div style={{borderTop:"2px solid #333",marginTop:8,paddingTop:8}}>
              <DataRow label="TOTAL ASSETS" value={fmt$(totalAssets)} bold valueColor={accent}/>
            </div>
          </div>

          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,color:"#ef4444",marginBottom:8,letterSpacing:"0.1em"}}>LIABILITIES</div>
            <div style={{fontSize:10,color:"#999",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Current Liabilities</div>
            <DataRow label="Accounts Payable (current/overdue)" value={fmt$(apCurrentTotal)} indent/>
            <DataRow label="Total Current Liabilities" value={fmt$(apCurrentTotal)} bold/>
            <div style={{fontSize:10,color:"#999",marginBottom:4,marginTop:12,textTransform:"uppercase",letterSpacing:"0.1em"}}>Long-term Liabilities</div>
            {debtList.length===0&&<div style={{fontSize:10,color:"#333",padding:"4px 8px"}}>None added — add in Debt Schedule tab</div>}
            {debtList.map(d=><DataRow key={d.id} label={`${d.creditorName} (${d.debtType})`} value={fmt$(parseFloat(d.currentBalance||0))} indent/>)}
            <DataRow label="Total Long-term Liabilities" value={fmt$(ltDebtTotal)} bold/>
            <div style={{borderTop:"2px solid #333",marginTop:8,paddingTop:8}}>
              <DataRow label="TOTAL LIABILITIES" value={fmt$(totalLiabilities)} bold valueColor="#ef4444"/>
            </div>

            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,color:"#22c55e",marginBottom:8,marginTop:20,letterSpacing:"0.1em"}}>EQUITY</div>
            <DataRow label="Owner Equity" value={fmt$(ownerEquity)}/>
            <DataRow label="Retained Earnings (all-time)" value={fmt$(retainedEarnings)}/>
            <div style={{borderTop:"2px solid #333",marginTop:8,paddingTop:8}}>
              <DataRow label="TOTAL EQUITY" value={fmt$(ownerEquity)} bold valueColor="#22c55e"/>
            </div>
            <div style={{marginTop:12,padding:"8px 12px",background:Math.abs(totalLiabilities+ownerEquity-totalAssets)<1?"#0a1a0a":"#1a0a0a",border:`1px solid ${Math.abs(totalLiabilities+ownerEquity-totalAssets)<1?"#22c55e22":"#ef444422"}`,borderRadius:4,fontSize:10}}>
              {Math.abs(totalLiabilities+ownerEquity-totalAssets)<1?<span style={{color:"#22c55e"}}>✓ Balance sheet balances</span>:<span style={{color:"#f59e0b"}}>Difference: {fmt$(Math.abs(totalLiabilities+ownerEquity-totalAssets))} — some items may not be fully recorded</span>}
            </div>
          </div>
        </div>
        <div style={{fontSize:10,color:"#888",marginTop:16,padding:"10px 14px",background:"#0a0a12",borderRadius:4,border:"1px solid #1a1a2a",lineHeight:1.7}}>
          This balance sheet is generated from data entered in ContractorOS. For tax and legal purposes, have your accountant review and certify.
        </div>
      </div>
    );
  }

  function renderDebt() {
    const totalMonthlyPmt = debtList.reduce((s,d)=>s+parseFloat(d.monthlyPayment||0),0);
    const totalOutstanding = debtList.reduce((s,d)=>s+parseFloat(d.currentBalance||0),0);
    const annualInterest = debtList.reduce((s,d)=>s+(parseFloat(d.currentBalance||0)*parseFloat(d.interestRate||0)/100),0);
    const dtar = totalAssetsValue>0?(totalOutstanding/totalAssetsValue)*100:null;
    const dtarColor = dtar===null?"#555":dtar<50?"#22c55e":dtar<75?"#f59e0b":"#ef4444";

    return (
      <div>
        <button onClick={()=>window.print()} className="no-print" style={{...S.ghost,fontSize:10,marginBottom:12}}>🖨 Print Debt Schedule</button>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16}}>
          {[
            {label:"Total Monthly Payments",value:fmt$(totalMonthlyPmt),color:"#ef4444"},
            {label:"Total Outstanding",value:fmt$(totalOutstanding),color:"#f59e0b"},
            {label:"Debt-to-Asset Ratio",value:dtar!==null?fmtPct(dtar):"Add assets first",color:dtarColor},
            {label:"Annual Interest Cost",value:fmt$(annualInterest),color:"#888"},
          ].map(card=>(
            <div key={card.label} style={{...S.card,padding:"10px 14px"}}>
              <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{card.label}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:card.color}}>{card.value}</div>
            </div>
          ))}
        </div>

        <div style={{marginBottom:12}}>
          <button onClick={()=>setShowDebtForm(!showDebtForm)} style={{...S.btn,marginBottom:showDebtForm?12:0}}>{showDebtForm?"Cancel":"+ Add Debt"}</button>
          {showDebtForm&&(
            <div style={{...S.card,border:`1px solid ${accent}33`}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={S.label}>Creditor Name *</label><input value={debtForm.creditorName} onChange={e=>setDebtForm(prev=>({...prev,creditorName:e.target.value}))} placeholder="Bank of America" style={S.input}/></div>
                <div><label style={S.label}>Debt Type</label>
                  <select value={debtForm.debtType} onChange={e=>setDebtForm(prev=>({...prev,debtType:e.target.value}))} style={S.input}>
                    {["Truck Loan","Equipment Loan","Line of Credit","Credit Card","SBA Loan","Business Credit","Other"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><label style={S.label}>Original Amount ($)</label><input type="number" value={debtForm.originalAmount} onChange={e=>setDebtForm(prev=>({...prev,originalAmount:e.target.value}))} style={S.input}/></div>
                <div><label style={S.label}>Current Balance ($) *</label><input type="number" value={debtForm.currentBalance} onChange={e=>setDebtForm(prev=>({...prev,currentBalance:e.target.value}))} style={S.input}/></div>
                <div><label style={S.label}>Monthly Payment ($) *</label><input type="number" value={debtForm.monthlyPayment} onChange={e=>setDebtForm(prev=>({...prev,monthlyPayment:e.target.value}))} style={S.input}/></div>
                <div><label style={S.label}>Interest Rate (%)</label><input type="number" value={debtForm.interestRate} onChange={e=>setDebtForm(prev=>({...prev,interestRate:e.target.value}))} placeholder="e.g. 7.5" style={S.input}/></div>
                <div><label style={S.label}>Loan Start Date</label><input type="date" value={debtForm.loanStartDate} onChange={e=>setDebtForm(prev=>({...prev,loanStartDate:e.target.value}))} style={S.input}/></div>
                <div><label style={S.label}>Collateral</label><input value={debtForm.collateral} onChange={e=>setDebtForm(prev=>({...prev,collateral:e.target.value}))} placeholder="2021 Freightliner" style={S.input}/></div>
                <div style={{gridColumn:"1/-1"}}><label style={S.label}>Notes</label><input value={debtForm.notes} onChange={e=>setDebtForm(prev=>({...prev,notes:e.target.value}))} style={S.input}/></div>
              </div>
              {debtForm.currentBalance&&debtForm.monthlyPayment&&(
                <div style={{fontSize:10,color:"#999",marginTop:8}}>
                  Payoff in ~{Math.ceil(parseFloat(debtForm.currentBalance)/parseFloat(debtForm.monthlyPayment))} months ({new Date(Date.now()+Math.ceil(parseFloat(debtForm.currentBalance)/parseFloat(debtForm.monthlyPayment))*30*86400000).toLocaleDateString("en-US",{month:"short",year:"numeric"})})
                </div>
              )}
              <button onClick={()=>{if(!debtForm.creditorName||!debtForm.currentBalance)return;setDebtList(prev=>[...prev,{id:Date.now(),...debtForm}]);setDebtForm({creditorName:"",debtType:"Truck Loan",originalAmount:"",currentBalance:"",monthlyPayment:"",interestRate:"",loanStartDate:"",collateral:"",notes:""});setShowDebtForm(false);}} style={{...S.btn,marginTop:12}}>Add Debt</button>
            </div>
          )}
        </div>

        {debtList.length===0?(
          <div style={{fontSize:11,color:"#999",padding:"12px 0"}}>No debts logged yet. Add your truck loans, lines of credit, and other obligations.</div>
        ):(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
              <thead><tr style={{borderBottom:"1px solid #222"}}>
                {["Creditor","Type","Original","Balance","Payment","Rate","Payoff","Collateral",""].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left",color:"#999",letterSpacing:"0.08em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {debtList.map(d=>{
                  const months=parseFloat(d.currentBalance)>0&&parseFloat(d.monthlyPayment)>0?Math.ceil(parseFloat(d.currentBalance)/parseFloat(d.monthlyPayment)):null;
                  const payoff=months?new Date(Date.now()+months*30*86400000).toLocaleDateString("en-US",{month:"short",year:"numeric"}):"—";
                  return(
                    <tr key={d.id} style={{borderBottom:"1px solid #111"}}>
                      <td style={{padding:"6px 8px",color:"#c8c4bc",fontWeight:600}}>{d.creditorName}</td>
                      <td style={{padding:"6px 8px",color:"#888"}}>{d.debtType}</td>
                      <td style={{padding:"6px 8px",color:"#888"}}>{d.originalAmount?fmt$(parseFloat(d.originalAmount)):"—"}</td>
                      <td style={{padding:"6px 8px",color:"#ef4444"}}>{fmt$(parseFloat(d.currentBalance||0))}</td>
                      <td style={{padding:"6px 8px",color:"#f59e0b"}}>{fmt$(parseFloat(d.monthlyPayment||0))}/mo</td>
                      <td style={{padding:"6px 8px",color:"#888"}}>{d.interestRate?`${d.interestRate}%`:"—"}</td>
                      <td style={{padding:"6px 8px",color:"#888",whiteSpace:"nowrap"}}>{payoff}</td>
                      <td style={{padding:"6px 8px",color:"#888"}}>{d.collateral||"—"}</td>
                      <td style={{padding:"6px 8px"}}><button onClick={()=>setDebtList(prev=>prev.filter(x=>x.id!==d.id))} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12,padding:"2px 6px"}}>✕</button></td>
                    </tr>
                  );
                })}
                <tr style={{borderTop:"2px solid #333",fontWeight:700}}>
                  <td style={{padding:"8px",color:"#e8e4d8",fontSize:11}}>TOTALS</td>
                  <td/><td/>
                  <td style={{padding:"8px",color:"#ef4444",fontSize:11}}>{fmt$(totalOutstanding)}</td>
                  <td style={{padding:"8px",color:"#f59e0b",fontSize:11}}>{fmt$(totalMonthlyPmt)}/mo</td>
                  <td colSpan={4}/>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div style={{fontSize:10,color:"#999",marginTop:12}}>Provide this schedule to your lender with your loan application. It demonstrates full disclosure of existing obligations.</div>
      </div>
    );
  }

  function renderAging() {
    const unpaidInvoices = invoices.filter(inv=>inv.status!=="paid");
    const agingBuckets = [{label:"Current (0-30)",min:0,max:30,color:"#22c55e"},{label:"31-60 Days",min:31,max:60,color:"#f59e0b"},{label:"61-90 Days",min:61,max:90,color:"#f97316"},{label:"90+ Days",min:91,max:Infinity,color:"#ef4444"}];
    const getDays = inv => {
      const d = inv.issueDate||inv.dueDate;
      if(!d) return 0;
      return Math.floor((Date.now()-new Date(d))/(86400000));
    };
    const grouped = agingBuckets.map(b=>({...b,items:unpaidInvoices.filter(inv=>{const days=getDays(inv);return days>=b.min&&days<=b.max;})}));
    const totalAR = unpaidInvoices.reduce((s,inv)=>s+parseFloat(inv.amount||0),0);
    const totalAP = payablesList.reduce((s,p)=>s+parseFloat(p.amountOwed||0),0);
    const netWC = totalAR-totalAP;

    return (
      <div>
        <div style={{...S.card,padding:"12px 16px",marginBottom:16,border:`1px solid ${netWC>=0?"#22c55e22":"#ef444422"}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Net Working Capital</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:netWC>=0?"#22c55e":"#ef4444"}}>{fmt$(netWC)}</div>
              <div style={{fontSize:10,color:netWC>=0?"#22c55e":"#ef4444",marginTop:2}}>{netWC>=0?`You are owed ${fmt$(netWC)} more than you owe`:`You owe ${fmt$(Math.abs(netWC))} more than you are owed — cash flow risk`}</div>
            </div>
            <div style={{display:"flex",gap:16}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#999",marginBottom:2}}>TOTAL AR</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"#22c55e"}}>{fmt$(totalAR)}</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#999",marginBottom:2}}>TOTAL AP</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"#ef4444"}}>{fmt$(totalAP)}</div></div>
            </div>
          </div>
        </div>

        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,color:"#e8e4d8",marginBottom:12,letterSpacing:"0.1em"}}>ACCOUNTS RECEIVABLE (Money Owed To You)</div>
        {unpaidInvoices.length===0?(
          <div style={{fontSize:11,color:"#999",padding:"8px 0",marginBottom:16}}>No open invoices</div>
        ):(
          <div style={{marginBottom:20}}>
            {grouped.map(bucket=>(
              <div key={bucket.label} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{fontSize:10,color:bucket.color,fontWeight:700,letterSpacing:"0.08em"}}>{bucket.label} — {bucket.items.length} invoice{bucket.items.length!==1?"s":""}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,color:bucket.color}}>{fmt$(bucket.items.reduce((s,inv)=>s+parseFloat(inv.amount||0),0))}</div>
                </div>
                {bucket.items.map(inv=>(
                  <div key={inv.id||inv.invoiceNum} style={{display:"flex",gap:10,padding:"5px 8px",background:"#0f0f0f",borderRadius:4,marginBottom:4,fontSize:10}}>
                    <span style={{color:"#888",flex:1}}>{inv.clientName||"—"}</span>
                    <span style={{color:"#999"}}>{inv.invoiceNum||"—"}</span>
                    <span style={{color:"#22c55e"}}>{fmt$(parseFloat(inv.amount||0))}</span>
                    <span style={{color:bucket.color}}>{getDays(inv)}d</span>
                  </div>
                ))}
                {bucket.min>=91&&bucket.items.length>0&&<div style={{fontSize:10,color:"#ef4444",marginTop:4}}>⚠ Consider follow-up or collections</div>}
              </div>
            ))}
          </div>
        )}

        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,color:"#e8e4d8",marginBottom:12,letterSpacing:"0.1em"}}>ACCOUNTS PAYABLE (Money You Owe)</div>
        <div style={{marginBottom:12}}>
          <button onClick={()=>setShowPayableForm(!showPayableForm)} style={{...S.btn,marginBottom:showPayableForm?12:0}}>{showPayableForm?"Cancel":"+ Add Payable"}</button>
          {showPayableForm&&(
            <div style={{...S.card,border:`1px solid ${accent}33`}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={S.label}>Vendor Name *</label><input value={payableForm.vendorName} onChange={e=>setPayableForm(prev=>({...prev,vendorName:e.target.value}))} style={S.input}/></div>
                <div><label style={S.label}>Amount Owed ($) *</label><input type="number" value={payableForm.amountOwed} onChange={e=>setPayableForm(prev=>({...prev,amountOwed:e.target.value}))} style={S.input}/></div>
                <div><label style={S.label}>Due Date</label><input type="date" value={payableForm.dueDate} onChange={e=>setPayableForm(prev=>({...prev,dueDate:e.target.value}))} style={S.input}/></div>
                <div><label style={S.label}>Status</label>
                  <select value={payableForm.status} onChange={e=>setPayableForm(prev=>({...prev,status:e.target.value}))} style={S.input}>
                    {["Current","Overdue","Disputed"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{gridColumn:"1/-1"}}><label style={S.label}>Description</label><input value={payableForm.description} onChange={e=>setPayableForm(prev=>({...prev,description:e.target.value}))} style={S.input}/></div>
              </div>
              <button onClick={()=>{if(!payableForm.vendorName||!payableForm.amountOwed)return;setPayablesList(prev=>[...prev,{id:Date.now(),...payableForm}]);setPayableForm({vendorName:"",description:"",amountOwed:"",dueDate:"",status:"Current"});setShowPayableForm(false);}} style={{...S.btn,marginTop:12}}>Add Payable</button>
            </div>
          )}
        </div>
        {payablesList.length===0?(
          <div style={{fontSize:11,color:"#999",padding:"8px 0"}}>No payables logged</div>
        ):(
          <div>
            {payablesList.map(item=>(
              <div key={item.id} style={{display:"flex",gap:10,padding:"7px 10px",background:"#0f0f0f",borderRadius:4,marginBottom:4,alignItems:"center",fontSize:10}}>
                <span style={{color:"#c8c4bc",flex:1,fontWeight:600}}>{item.vendorName}</span>
                <span style={{color:"#888"}}>{item.description||"—"}</span>
                <span style={{color:"#ef4444"}}>{fmt$(parseFloat(item.amountOwed||0))}</span>
                <span style={{fontSize:9,color:item.status==="Overdue"?"#ef4444":item.status==="Disputed"?"#f59e0b":"#22c55e",background:item.status==="Overdue"?"#ef444418":item.status==="Disputed"?"#f59e0b18":"#22c55e18",padding:"2px 6px",borderRadius:3}}>{item.status}</span>
                <button onClick={()=>setPayablesList(prev=>prev.filter(x=>x.id!==item.id))} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12}}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderAssets() {
    const totalValue = assetsList.reduce((s,a)=>s+parseFloat(a.currentValue||0),0);
    const totalLien = assetsList.reduce((s,a)=>s+parseFloat(a.lienBalance||0),0);
    const totalEquity = totalValue-totalLien;
    const unlinkedTrucks = (compliance.trucks||[]).filter(truck=>!assetsList.some(a=>a.assetName===truck.name));

    return (
      <div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16}}>
          {[
            {label:"Total Asset Value",value:fmt$(totalValue),color:"#22c55e"},
            {label:"Total Liabilities (Liens)",value:fmt$(totalLien),color:"#ef4444"},
            {label:"Total Equity",value:fmt$(totalEquity),color:totalEquity>=0?"#22c55e":"#ef4444"},
            {label:"Net Worth",value:fmt$(totalEquity),color:totalEquity>=0?"#22c55e":"#ef4444"},
          ].map(card=>(
            <div key={card.label} style={{...S.card,padding:"10px 14px"}}>
              <div style={{fontSize:9,color:"#999",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{card.label}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:card.color}}>{card.value}</div>
            </div>
          ))}
        </div>

        {unlinkedTrucks.length>0&&(
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,color:"#f59e0b",marginBottom:8,fontWeight:600}}>⚠ Add financial details for your vehicles:</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {unlinkedTrucks.map(truck=>(
                <button key={truck.name} onClick={()=>{setAssetForm(prev=>({...prev,assetName:truck.name,assetType:"Vehicle"}));setShowAssetForm(true);}} style={{background:"#1a1000",border:"1px solid #3a2800",color:"#f59e0b",padding:"6px 14px",borderRadius:4,fontSize:10,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>
                  + Add details for {truck.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{marginBottom:12}}>
          <button onClick={()=>setShowAssetForm(!showAssetForm)} style={{...S.btn,marginBottom:showAssetForm?12:0}}>{showAssetForm?"Cancel":"+ Add Asset"}</button>
          {showAssetForm&&(
            <div style={{...S.card,border:`1px solid ${accent}33`}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={S.label}>Asset Name *</label><input value={assetForm.assetName} onChange={e=>setAssetForm(prev=>({...prev,assetName:e.target.value}))} placeholder="2021 Freightliner Cascadia" style={S.input}/></div>
                <div><label style={S.label}>Asset Type</label>
                  <select value={assetForm.assetType} onChange={e=>setAssetForm(prev=>({...prev,assetType:e.target.value}))} style={S.input}>
                    {["Vehicle","Equipment","Real Estate","Other"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><label style={S.label}>Purchase Date</label><input type="date" value={assetForm.purchaseDate} onChange={e=>setAssetForm(prev=>({...prev,purchaseDate:e.target.value}))} style={S.input}/></div>
                <div><label style={S.label}>Purchase Price ($)</label><input type="number" value={assetForm.purchasePrice} onChange={e=>setAssetForm(prev=>({...prev,purchasePrice:e.target.value}))} style={S.input}/></div>
                <div><label style={S.label}>Current Value ($) *</label><input type="number" value={assetForm.currentValue} onChange={e=>setAssetForm(prev=>({...prev,currentValue:e.target.value}))} style={S.input}/></div>
                <div><label style={S.label}>Lien Balance ($)</label><input type="number" value={assetForm.lienBalance} onChange={e=>setAssetForm(prev=>({...prev,lienBalance:e.target.value}))} style={S.input}/></div>
                <div><label style={S.label}>Monthly Payment ($)</label><input type="number" value={assetForm.monthlyPayment} onChange={e=>setAssetForm(prev=>({...prev,monthlyPayment:e.target.value}))} style={S.input}/></div>
                <div><label style={S.label}>Lender Name</label><input value={assetForm.lenderName} onChange={e=>setAssetForm(prev=>({...prev,lenderName:e.target.value}))} style={S.input}/></div>
              </div>
              {assetForm.currentValue&&assetForm.lienBalance&&(
                <div style={{fontSize:10,color:"#999",marginTop:8}}>Equity: {fmt$(parseFloat(assetForm.currentValue||0)-parseFloat(assetForm.lienBalance||0))}</div>
              )}
              <button onClick={()=>{if(!assetForm.assetName||!assetForm.currentValue)return;setAssetsList(prev=>[...prev,{id:Date.now(),...assetForm}]);setAssetForm({assetName:"",assetType:"Vehicle",purchaseDate:"",purchasePrice:"",currentValue:"",lienBalance:"",monthlyPayment:"",lenderName:"",notes:""});setShowAssetForm(false);}} style={{...S.btn,marginTop:12}}>Add Asset</button>
            </div>
          )}
        </div>

        {assetsList.length===0?(
          <div style={{fontSize:11,color:"#999",padding:"12px 0"}}>No assets logged. Add your trucks, equipment, and other business assets.</div>
        ):(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
              <thead><tr style={{borderBottom:"1px solid #222"}}>
                {["Asset","Type","Value","Lien","Equity","Pmt/mo",""].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left",color:"#999",letterSpacing:"0.08em",textTransform:"uppercase"}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {assetsList.map(a=>{
                  const eq=parseFloat(a.currentValue||0)-parseFloat(a.lienBalance||0);
                  return(
                    <tr key={a.id} style={{borderBottom:"1px solid #111"}}>
                      <td style={{padding:"6px 8px",color:"#c8c4bc",fontWeight:600}}>{a.assetName}</td>
                      <td style={{padding:"6px 8px",color:"#888"}}>{a.assetType}</td>
                      <td style={{padding:"6px 8px",color:"#22c55e"}}>{fmt$(parseFloat(a.currentValue||0))}</td>
                      <td style={{padding:"6px 8px",color:"#ef4444"}}>{a.lienBalance?fmt$(parseFloat(a.lienBalance||0)):"—"}</td>
                      <td style={{padding:"6px 8px",color:eq>=0?"#22c55e":"#ef4444"}}>{fmt$(eq)}</td>
                      <td style={{padding:"6px 8px",color:"#888"}}>{a.monthlyPayment?`${fmt$(parseFloat(a.monthlyPayment||0))}`:"—"}</td>
                      <td style={{padding:"6px 8px"}}><button onClick={()=>setAssetsList(prev=>prev.filter(x=>x.id!==a.id))} style={{background:"transparent",border:"none",color:"#888",cursor:"pointer",fontSize:12}}>✕</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  function renderDocs() {
    const hasDocType = type => documents.some(d=>d.type===type);
    const hasDocTypes = (...types) => types.some(t=>hasDocType(t));
    const fmtInsExpiry = () => {
      const valid = (compliance.trucks||[]).filter(t=>t.insuranceExpiry&&new Date(t.insuranceExpiry)>new Date());
      if(!valid.length) return null;
      const soonest = valid.sort((a,b)=>new Date(a.insuranceExpiry)-new Date(b.insuranceExpiry))[0];
      return soonest.insuranceExpiry;
    };
    const insExpiry = fmtInsExpiry();
    const activeContracts = contracts.filter(c=>c.status==="active");
    const cdlDriverCount = drivers.filter(d=>d.onboarding?.cdl_copy).length;

    const items = [
      // Financial
      {group:"FINANCIAL DOCUMENTS",title:"Business Tax Returns (last 3 years)",status:hasDocType("Business Tax Return")?"READY":"NEEDED",note:hasDocType("Business Tax Return")?`${documents.filter(d=>d.type==="Business Tax Return").length} file(s) on file`:"Upload needed",actionLabel:"Upload in Document Center →",actionFn:()=>handleNav("documents"),isAuto:false},
      {group:"FINANCIAL DOCUMENTS",title:"Personal Tax Returns (last 2 years)",status:hasDocType("Personal Tax Return")?"READY":"NEEDED",note:hasDocType("Personal Tax Return")?`${documents.filter(d=>d.type==="Personal Tax Return").length} file(s) on file`:"Upload needed",actionLabel:"Upload in Document Center →",actionFn:()=>handleNav("documents"),isAuto:false},
      {group:"FINANCIAL DOCUMENTS",title:"Bank Statements (last 6 months)",status:hasDocType("Bank Statement")?"READY":"NEEDED",note:"Download from your bank's online portal → Statements → last 6 months",actionLabel:"Upload in Document Center →",actionFn:()=>handleNav("documents"),isAuto:false},
      {group:"FINANCIAL DOCUMENTS",title:"Profit & Loss Statement",status:"READY",note:"Generated from your revenue and expense data",actionLabel:"View Report →",actionFn:()=>setLenderTab("report"),isAuto:true},
      {group:"FINANCIAL DOCUMENTS",title:"Balance Sheet",status:assetsList.length>0&&revenue.length>0?"READY":"PARTIAL",note:assetsList.length===0?"Add assets in the Assets tab for a complete balance sheet":"Generated from your data",actionLabel:"View Balance Sheet →",actionFn:()=>setLenderTab("balance"),isAuto:true},
      {group:"FINANCIAL DOCUMENTS",title:"Cash Flow Statement",status:revenue.length>=3?"READY":"PARTIAL",note:revenue.length<3?"Log at least 3 months of revenue for a complete cash flow statement":"Generated from your data",actionLabel:"View Report →",actionFn:()=>setLenderTab("report"),isAuto:true},
      {group:"FINANCIAL DOCUMENTS",title:"Business Debt Schedule",status:debtList.length>0?"READY":"NEEDED",note:debtList.length>0?`${debtList.length} debt(s) on file`:"Add your loans and obligations in the Debt Schedule tab",actionLabel:"View Debt Schedule →",actionFn:()=>setLenderTab("debt"),isAuto:debtList.length>0},
      // Operational
      {group:"OPERATIONAL DOCUMENTS",title:"USDOT Certificate / Number",status:fmcsaResult?.dotNum?"READY":"NEEDED",note:fmcsaResult?.dotNum?`DOT# ${fmcsaResult.dotNum} verified via FMCSA`:"Run FMCSA Lookup to verify",actionLabel:"FMCSA Lookup →",actionFn:()=>handleNav("fmcsa"),isAuto:false,externalHref:"https://safer.fmcsa.dot.gov",externalLabel:"Verify on FMCSA SAFER ↗"},
      {group:"OPERATIONAL DOCUMENTS",title:"MC Operating Authority",status:hasDocType("Operating Authority")?"READY":"NEEDED",note:hasDocType("Operating Authority")?"On file in Document Center":"Upload needed",actionLabel:"Upload in Document Center →",actionFn:()=>handleNav("documents"),isAuto:false,externalHref:"https://www.fmcsa.dot.gov/registration/getting-started",externalLabel:"FMCSA Registration Portal ↗"},
      {group:"OPERATIONAL DOCUMENTS",title:"Proof of Insurance",status:insExpiry?"READY":"NEEDED",note:insExpiry?`Insurance tracked — expires ${insExpiry}`:"Upload insurance certificate",actionLabel:"Upload Certificate →",actionFn:()=>handleNav("documents"),isAuto:false},
      {group:"OPERATIONAL DOCUMENTS",title:"Fleet List",status:compliance.trucks.length>0?"READY":"NEEDED",note:`${compliance.trucks.length} vehicle(s) on file. Lenders want year, make, VIN, and estimated value.`,actionLabel:"View Fleet →",actionFn:()=>handleNav("fleet"),isAuto:true},
      {group:"OPERATIONAL DOCUMENTS",title:"Major Client Contracts",status:activeContracts.length>0?"READY":"NEEDED",note:`${activeContracts.length} active contract(s) on file. FedEx, Amazon, and Lowe's contracts show guaranteed revenue.`,actionLabel:"View Contracts →",actionFn:()=>handleNav("contracts"),isAuto:false},
      {group:"OPERATIONAL DOCUMENTS",title:"AR/AP Aging Report",status:"READY",note:"Auto-generated from your invoices",actionLabel:"View AR/AP Aging →",actionFn:()=>setLenderTab("aging"),isAuto:true},
      // Entity
      {group:"ENTITY DOCUMENTS",title:"Articles of Incorporation / LLC Agreement",status:hasDocTypes("Articles of Incorporation","LLC Operating Agreement")?"READY":"NEEDED",note:hasDocTypes("Articles of Incorporation","LLC Operating Agreement")?"On file in Document Center":"Log into your state's Secretary of State portal to download",actionLabel:"Upload in Document Center →",actionFn:()=>handleNav("documents"),isAuto:false,externalHref:"https://businessfilings.sc.gov",externalLabel:"SC Secretary of State ↗"},
      {group:"ENTITY DOCUMENTS",title:"Business License",status:hasDocType("Business License")?"READY":"NEEDED",note:hasDocType("Business License")?"On file":"Upload needed",actionLabel:"Upload in Document Center →",actionFn:()=>handleNav("documents"),isAuto:false,externalHref:"https://businessfilings.sc.gov",externalLabel:"SC Business Filings ↗"},
      {group:"ENTITY DOCUMENTS",title:"EIN Confirmation Letter",status:settings.ein?"READY":"NEEDED",note:settings.ein?`EIN on file (XX-XXX${settings.ein.slice(-4)})`:"Add your EIN in the Settings screen",actionLabel:null,actionFn:null,isAuto:false,externalHref:"https://www.irs.gov/businesses/small-businesses-self-employed/lost-or-misplaced-your-ein",externalLabel:"Retrieve EIN from IRS ↗"},
      {group:"ENTITY DOCUMENTS",title:"SBA Form 413 — Personal Financial Statement",status:"EXTERNAL",note:"Required for SBA loans and most commercial truck financing. Complete and bring to your lender meeting.",actionLabel:null,actionFn:null,isAuto:false,externalHref:"https://www.sba.gov/document/sba-form-413-personal-financial-statement",externalLabel:"⬇ Download SBA Form 413 ↗",externalBig:true},
      {group:"ENTITY DOCUMENTS",title:"Government-Issued ID",status:"EXTERNAL",note:"Bring driver's license or passport to your lender meeting",actionLabel:null,actionFn:null,isAuto:false},
      {group:"ENTITY DOCUMENTS",title:"Down Payment Documentation",status:"EXTERNAL",note:"Download last 60 days of bank statements showing available funds. Most lenders require 10-20% down on truck financing.",actionLabel:null,actionFn:null,isAuto:false},
      {group:"ENTITY DOCUMENTS",title:"Commercial Driver's License (CDL)",status:cdlDriverCount>0?"READY":"NEEDED",note:cdlDriverCount>0?`CDL on file for ${cdlDriverCount} driver(s)`:"Collect CDL copies in Driver onboarding",actionLabel:"View Driver Files →",actionFn:()=>handleNav("drivers"),isAuto:false,externalHref:"https://www.fmcsa.dot.gov/registration/commercial-drivers-license",externalLabel:"FMCSA CDL Requirements ↗"},
    ];

    const autoCount = items.filter(i=>i.isAuto&&i.status==="READY").length;
    const uploadedCount = items.filter(i=>!i.isAuto&&i.status==="READY").length;
    const neededCount = items.filter(i=>i.status==="NEEDED"||i.status==="PARTIAL").length;
    const readinessPct = Math.round(((autoCount+uploadedCount)/items.length)*100);
    const readinessColor = readinessPct>=80?"#22c55e":readinessPct>=50?"#f59e0b":"#ef4444";

    const groups = [...new Set(items.map(i=>i.group))];

    return (
      <div>
        <div style={{...S.card,marginBottom:16,border:`1px solid ${readinessColor}22`}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,color:"#e8e4d8",marginBottom:8}}>📋 Loan Application Readiness</div>
          <div style={{height:6,background:"#1e1e1e",borderRadius:3,marginBottom:10}}>
            <div style={{height:"100%",width:`${readinessPct}%`,background:readinessColor,borderRadius:3,transition:"width 0.4s ease"}}/>
          </div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <div style={{fontSize:10,color:"#22c55e"}}>✓ Auto-generated: {autoCount}</div>
            <div style={{fontSize:10,color:"#22c55e"}}>✓ Uploaded: {uploadedCount}</div>
            <div style={{fontSize:10,color:"#f59e0b"}}>⚠ Still needed: {neededCount}</div>
            <div style={{fontSize:10,color:readinessColor,fontWeight:700,marginLeft:"auto"}}>Your application is {readinessPct}% document-ready</div>
          </div>
        </div>

        {groups.map(group=>(
          <div key={group} style={{marginBottom:20}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:800,color:"#999",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10,borderBottom:"1px solid #1a1a1a",paddingBottom:6}}>{group}</div>
            {items.filter(i=>i.group===group).map((item,idx)=>{
              const statusColor={READY:"#22c55e",PARTIAL:"#f59e0b",NEEDED:"#ef4444",EXTERNAL:"#6366f1"}[item.status]||"#555";
              return(
                <div key={idx} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid #0f0f0f",alignItems:"flex-start"}}>
                  <div style={{fontSize:16,marginTop:2,flexShrink:0}}>{item.status==="READY"?"✅":item.status==="PARTIAL"?"🟡":item.status==="EXTERNAL"?"📄":"☐"}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontSize:11,color:"#c8c4bc",fontWeight:600}}>{item.title}</span>
                      <StatusBadge status={item.status}/>
                      {item.isAuto&&<span style={{fontSize:8,color:"#22c55e",background:"#22c55e18",padding:"2px 6px",borderRadius:3,letterSpacing:"0.1em"}}>AUTO</span>}
                    </div>
                    <div style={{fontSize:10,color:"#999",marginBottom:item.actionFn||item.externalHref?6:0,lineHeight:1.5}}>{item.note}</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {item.actionFn&&<button onClick={item.actionFn} style={{background:"transparent",border:`1px solid ${statusColor}44`,color:statusColor,fontSize:10,cursor:"pointer",padding:"3px 10px",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>{item.actionLabel}</button>}
                      {item.externalHref&&<a href={item.externalHref} target="_blank" rel="noopener noreferrer" style={{background:item.externalBig?"#1a1a3a":"transparent",border:`1px solid ${item.externalBig?"#4444aa":"#2a2a4a"}`,color:item.externalBig?"#8888dd":"#5555aa",fontSize:10,cursor:"pointer",padding:item.externalBig?"6px 16px":"3px 10px",borderRadius:4,fontFamily:"'DM Mono',monospace",textDecoration:"none",display:"inline-block"}}>{item.externalLabel}</a>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  const tabContent = {report:renderReport,balance:renderBalance,debt:renderDebt,aging:renderAging,assets:renderAssets,docs:renderDocs};

  return (
    <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}>
      <style>{`@media print { .no-print { display: none !important; } body { background: white !important; color: #1a1a1a !important; } .print-section { page-break-inside: avoid; } }`}</style>
      <div style={{maxWidth:1000,margin:"0 auto"}}>

        {/* Header */}
        <div style={{marginBottom:20}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:900,color:"#e8e4d8"}}>🏦 LENDER REPORT</div>
          <div style={{fontSize:11,color:"#999",marginTop:4}}>{settings.businessLegalName||settings.companyName||"Your Company"} · ContractorOS</div>
        </div>

        {/* Lender Meeting Prep Card */}
        <div style={{background:"#0a0f1a",border:"1px solid #1a1a3a",borderRadius:8,padding:"16px 20px",marginBottom:20}} className="no-print">
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"#e8e4d8",marginBottom:4}}>🏦 Lender Meeting Checklist</div>
          <div style={{fontSize:10,color:"#4a4a8a",marginBottom:14}}>Everything in one place for your financing conversation</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
            <div>
              <div style={{fontSize:9,color:"#3a3a6a",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Bring With You</div>
              {["Government ID","Personal tax returns (2 yrs)","Business tax returns (3 yrs)","Bank statements (6 months)","Down payment bank statement","SBA Form 413","LLC agreement / articles"].map(item=>(
                <div key={item} style={{fontSize:10,color:"#6666aa",padding:"2px 0"}}>• {item}</div>
              ))}
            </div>
            <div>
              <div style={{fontSize:9,color:"#22c55e",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>ContractorOS Generates</div>
              {["Profit & Loss Statement ✓","Balance Sheet ✓","Cash Flow Statement ✓","Business Debt Schedule ✓","AR/AP Aging Report ✓","Fleet Asset List ✓","Contract Summary ✓"].map(item=>(
                <div key={item} style={{fontSize:10,color:"#22c55e",padding:"2px 0"}}>• {item}</div>
              ))}
            </div>
            <div>
              <div style={{fontSize:9,color:"#f59e0b",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Verify Before Meeting</div>
              {["FMCSA USDOT number current","Insurance certificates valid","No overdue compliance items","Cash reserve documented"].map(item=>(
                <div key={item} style={{fontSize:10,color:"#f59e0b",padding:"2px 0"}}>• {item}</div>
              ))}
            </div>
          </div>
          <button onClick={()=>window.print()} style={{...S.ghost,fontSize:10,marginTop:12}}>🖨 Print This Checklist</button>
        </div>

        {/* Tab bar */}
        <div style={{display:"flex",borderBottom:"1px solid #1e1e1e",marginBottom:20,overflowX:"auto"}} className="no-print">
          {tabs.map(([id,label])=>(
            <button key={id} onClick={()=>setLenderTab(id)} style={{background:"transparent",border:"none",borderBottom:lenderTab===id?`2px solid ${accent}`:"2px solid transparent",color:lenderTab===id?accent:"#444",padding:"10px 14px",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap",transition:"all 0.15s"}}>{label}</button>
          ))}
        </div>

        {/* Tab content */}
        {(tabContent[lenderTab]||renderReport)()}
      </div>
    </div>
  );
}
