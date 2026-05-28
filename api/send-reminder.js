// api/send-reminder.js
// Vercel serverless function — sends compliance reminder emails via Resend
// Setup:
//   1. Sign up free at resend.com
//   2. Get your API key from resend.com/api-keys
//   3. Add to Vercel env vars: RESEND_API_KEY = re_xxxxxxxxxxxx
//   4. Add your sending domain or use onboarding@resend.dev for testing

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    return res.status(500).json({ error: "RESEND_API_KEY not configured" });
  }

  const { to, companyName, urgentItems, alertEmail } = req.body;

  if (!to && !alertEmail) {
    return res.status(400).json({ error: "No recipient email provided" });
  }

  const recipient = to || alertEmail;

  // Build email content
  const urgentList = (urgentItems || [])
    .slice(0, 10)
    .map(item => `• ${item.label} — ${item.days < 0 ? `OVERDUE ${Math.abs(item.days)} days` : item.days === 0 ? "DUE TODAY" : `Due in ${item.days} days`}`)
    .join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { font-family: 'DM Mono', 'Courier New', monospace; background: #0a0a0a; color: #e8e4d8; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
    .logo { font-size: 28px; font-weight: 900; color: #e8e4d8; letter-spacing: 0.02em; margin-bottom: 4px; }
    .logo span { color: #f59e0b; }
    .subtitle { font-size: 11px; color: #555; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 32px; }
    .alert-box { background: #141414; border: 1px solid #2a2a2a; border-left: 4px solid #ef4444; border-radius: 6px; padding: 20px 24px; margin-bottom: 24px; }
    .alert-title { font-size: 18px; font-weight: 700; color: #ef4444; margin-bottom: 4px; }
    .alert-sub { font-size: 11px; color: #555; margin-bottom: 16px; }
    .item { padding: 8px 0; border-bottom: 1px solid #1e1e1e; font-size: 12px; color: #c8c4bc; }
    .item:last-child { border-bottom: none; }
    .overdue { color: #ef4444; font-weight: 700; }
    .soon { color: #f59e0b; }
    .cta { display: inline-block; background: #f59e0b; color: #0a0a0a; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; margin-top: 24px; }
    .footer { margin-top: 40px; font-size: 9px; color: #333; border-top: 1px solid #1e1e1e; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="logo">CONTRACTOR<span>OS</span></div>
    <div class="subtitle">Compliance Alert — ${companyName || "Your Fleet"}</div>
    
    <div class="alert-box">
      <div class="alert-title">⚠ ${(urgentItems || []).length} Compliance Item${(urgentItems || []).length !== 1 ? "s" : ""} Need Attention</div>
      <div class="alert-sub">The following items are expiring soon or are already overdue.</div>
      ${(urgentItems || []).slice(0, 10).map(item => `
        <div class="item ${item.days < 0 ? "overdue" : item.days <= 14 ? "soon" : ""}">
          ${item.label} — ${item.days < 0 ? `OVERDUE ${Math.abs(item.days)}d` : item.days === 0 ? "DUE TODAY" : `Due in ${item.days} days`}
        </div>
      `).join("")}
    </div>

    <p style="font-size:12px;color:#666;line-height:1.8;">
      Log in to ContractorOS to update these items before they cause a compliance violation.
    </p>
    
    <a href="https://contractoroshub.com" class="cta">Open ContractorOS →</a>
    
    <div class="footer">
      © ${new Date().getFullYear()} ContractorOS LLC. You're receiving this because you enabled compliance alerts.<br/>
      To stop these emails, go to Reports → Push Notifications → Disable Alerts.
    </div>
  </div>
</body>
</html>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from: "ContractorOS Alerts <alerts@contractoroshub.com>",
        to: [recipient],
        subject: `⚠ ${(urgentItems || []).length} Compliance Item${(urgentItems || []).length !== 1 ? "s" : ""} Need Attention — ${companyName || "ContractorOS"}`,
        html,
        text: `ContractorOS Compliance Alert\n\n${urgentList}\n\nLog in at https://contractoroshub.com`,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(400).json({ error: data.message || "Failed to send email" });
    }
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
