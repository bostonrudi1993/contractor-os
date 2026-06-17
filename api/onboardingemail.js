// api/onboarding-email.js
// Sends onboarding email sequence via Resend
// Called from the app when a user signs up (Day 0)
// Days 3 and 7 are triggered by Vercel Cron Jobs (see vercel.json)
//
// Setup:
//   1. Sign up free at resend.com → get API key
//   2. Add RESEND_API_KEY to Vercel environment variables
//   3. Add RESEND_FROM_EMAIL = "onboarding@contractoroshub.com" (or use resend.dev for testing)

import { createClient } from "@supabase/supabase-js";

// Returns true if the email is under the 2-per-day limit and increments the counter.
// Uses the existing cos_data Supabase table — no new infrastructure needed.
async function checkAndIncrementRateLimit(email) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return true; // fail open if Supabase isn't configured
  try {
    const supabase = createClient(url, key);
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const userId = `ratelimit_${email}`;
    const dataKey = `email_daily_${today}`;
    const { data } = await supabase
      .from("cos_data").select("data_value")
      .eq("user_id", userId).eq("data_key", dataKey).maybeSingle();
    const count = data?.data_value?.count || 0;
    if (count >= 2) return false;
    await supabase.from("cos_data").upsert(
      { user_id: userId, data_key: dataKey, data_value: { count: count + 1 } },
      { onConflict: "user_id,data_key" }
    );
    return true;
  } catch {
    return true; // fail open on error so legitimate emails aren't silently dropped
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) return res.status(500).json({ error: "RESEND_API_KEY not configured" });

  const { email, name, day, companyName, hasDrivers, hasTrucks } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const allowed = await checkAndIncrementRateLimit(email);
  if (!allowed) return res.status(429).json({ error: "Rate limit: max 2 emails per day per user" });

  const firstName = name?.split(" ")?.[0] || "there";
  const company = companyName || "your fleet";

  // ── Email templates by day ────────────────────────────────────────────────
  const templates = {
    0: {
      subject: `Welcome to ContractorOS, ${firstName} 👋`,
      html: `
        <div style="font-family:'Courier New',monospace;background:#0a0a0a;color:#e8e4d8;max-width:600px;margin:0 auto;padding:40px 32px;">
          <div style="font-family:Georgia,serif;font-weight:900;font-size:28px;letter-spacing:0.03em;margin-bottom:4px">CONTRACTOR<span style="color:#f59e0b">OS</span></div>
          <div style="font-size:10px;color:#555;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:40px">Fleet Operating System</div>
          
          <div style="font-size:22px;font-weight:700;color:#e8e4d8;margin-bottom:16px">Welcome aboard, ${firstName}.</div>
          <div style="font-size:13px;color:#888;line-height:1.9;margin-bottom:32px">
            Your ContractorOS account is set up and ready. You're 5 steps away from having your entire fleet operation in one place.
          </div>

          <div style="background:#141414;border:1px solid #2a2a2a;border-radius:8px;padding:24px;margin-bottom:28px">
            <div style="font-size:11px;color:#f59e0b;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:16px">Your Setup Checklist</div>
            ${["Add your first truck (unlocks compliance tracking)", "Add yourself or your first driver", "Set your DOT inspection and insurance expiry dates", "Log a fuel fill-up or maintenance cost", "Check your dashboard — it shows fleet health at a glance"].map((item, i) => `
              <div style="display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid #1e1e1e;">
                <div style="width:20px;height:20px;border-radius:50%;border:2px solid #333;color:#555;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">${i+1}</div>
                <div style="font-size:12px;color:#888">${item}</div>
              </div>
            `).join("")}
          </div>

          <a href="https://contractoroshub.com/app" style="display:inline-block;background:#f59e0b;color:#0a0a0a;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.05em;margin-bottom:32px">
            Open ContractorOS →
          </a>

          <div style="font-size:11px;color:#444;line-height:1.9;border-top:1px solid #1e1e1e;padding-top:24px">
            Questions? Reply to this email or reach us at 
            <a href="mailto:bostonrudi1993@gmail.com" style="color:#f59e0b;text-decoration:none">bostonrudi1993@gmail.com</a>
          </div>

          <div style="font-size:9px;color:#333;margin-top:24px">
            © ${new Date().getFullYear()} ContractorOS LLC. All rights reserved.<br/>
            You're receiving this because you created a ContractorOS account.
          </div>
        </div>
      `
    },

    3: {
      subject: `${firstName}, did you add your first truck?`,
      html: `
        <div style="font-family:'Courier New',monospace;background:#0a0a0a;color:#e8e4d8;max-width:600px;margin:0 auto;padding:40px 32px;">
          <div style="font-family:Georgia,serif;font-weight:900;font-size:28px;letter-spacing:0.03em;margin-bottom:40px">CONTRACTOR<span style="color:#f59e0b">OS</span></div>
          
          <div style="font-size:22px;font-weight:700;color:#e8e4d8;margin-bottom:16px">Quick check-in, ${firstName}.</div>
          <div style="font-size:13px;color:#888;line-height:1.9;margin-bottom:24px">
            ${hasTrucks ? `Looks like you've got your fleet set up in ContractorOS — nice work. Here's what to do next.` : `You signed up 3 days ago but haven't added your truck yet. It takes about 2 minutes — here's why it matters.`}
          </div>

          ${!hasTrucks ? `
          <div style="background:#1a0808;border:1px solid #3a1010;border-radius:8px;padding:20px;margin-bottom:24px">
            <div style="font-size:12px;color:#f87171;font-weight:700;margin-bottom:8px">Without a truck, you're missing:</div>
            <div style="font-size:11px;color:#888;line-height:1.9">
              • Compliance alerts before your DOT inspection expires<br/>
              • Fuel log and IFTA tracking per truck<br/>
              • Maintenance cost tracking for your P&L<br/>
              • Per-truck profit and loss breakdown
            </div>
          </div>
          ` : ""}

          <div style="background:#141414;border:1px solid #2a2a2a;border-radius:8px;padding:20px;margin-bottom:28px">
            <div style="font-size:11px;color:#f59e0b;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:12px">Most Used This Week</div>
            ${["Fleet → Maintenance Log — log your last service","Compliance → set expiry dates for DOT, insurance, registration","Finance → add your weekly revenue and fuel costs"].map(tip => `
              <div style="font-size:11px;color:#888;padding:8px 0;border-bottom:1px solid #1e1e1e;">${tip}</div>
            `).join("")}
          </div>

          <a href="https://contractoroshub.com/app" style="display:inline-block;background:#f59e0b;color:#0a0a0a;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.05em;margin-bottom:32px">
            ${hasTrucks ? "Continue Setup →" : "Add Your Truck Now →"}
          </a>

          <div style="font-size:9px;color:#333;margin-top:24px">
            © ${new Date().getFullYear()} ContractorOS LLC. 
            <a href="mailto:bostonrudi1993@gmail.com?subject=Unsubscribe" style="color:#333">Unsubscribe</a>
          </div>
        </div>
      `
    },

    7: {
      subject: `Here's what you're missing in ContractorOS`,
      html: `
        <div style="font-family:'Courier New',monospace;background:#0a0a0a;color:#e8e4d8;max-width:600px;margin:0 auto;padding:40px 32px;">
          <div style="font-family:Georgia,serif;font-weight:900;font-size:28px;letter-spacing:0.03em;margin-bottom:40px">CONTRACTOR<span style="color:#f59e0b">OS</span></div>
          
          <div style="font-size:22px;font-weight:700;color:#e8e4d8;margin-bottom:16px">One week in, ${firstName}.</div>
          <div style="font-size:13px;color:#888;line-height:1.9;margin-bottom:28px">
            Here are 3 features most contractors don't discover on their own — but wish they had from day one.
          </div>

          ${[
            { icon: "🏛", title: "FMCSA Live Lookup", desc: "Go to FMCSA Lookup in the nav. Enter your DOT number and pull your live carrier profile — authority status, safety rating, and MC number. Pre-fills your company info automatically." },
            { icon: "💵", title: "Payroll Pay Stubs", desc: "Payroll → Pay Runs → click 'Stub' on any pay run. Generates a printable pay stub for any driver instantly. Works for per-mile, per-stop, hourly, salary — any pay type." },
            { icon: "📊", title: "Segment Scorecard", desc: "Your contractor type has a custom Scorecard screen in the nav. Track your weekly performance metrics — pickup compliance for FedEx, DART/DCR for Amazon DSP, stop completion for last mile." },
          ].map(f => `
            <div style="background:#141414;border:1px solid #2a2a2a;border-radius:8px;padding:20px;margin-bottom:12px">
              <div style="font-size:20px;margin-bottom:8px">${f.icon}</div>
              <div style="font-size:14px;font-weight:700;color:#e8e4d8;margin-bottom:6px">${f.title}</div>
              <div style="font-size:11px;color:#666;line-height:1.8">${f.desc}</div>
            </div>
          `).join("")}

          <a href="https://contractoroshub.com/app" style="display:inline-block;background:#f59e0b;color:#0a0a0a;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.05em;margin:20px 0 32px">
            Open ContractorOS →
          </a>

          <div style="font-size:11px;color:#444;border-top:1px solid #1e1e1e;padding-top:20px;line-height:1.9">
            Running into issues? Reply to this email — we read every one.<br/>
            <a href="mailto:bostonrudi1993@gmail.com" style="color:#f59e0b;text-decoration:none">bostonrudi1993@gmail.com</a>
          </div>

          <div style="font-size:9px;color:#333;margin-top:20px">
            © ${new Date().getFullYear()} ContractorOS LLC.
            <a href="mailto:bostonrudi1993@gmail.com?subject=Unsubscribe" style="color:#333">Unsubscribe</a>
          </div>
        </div>
      `
    }
  };

  const template = templates[day ?? 0];
  if (!template) return res.status(400).json({ error: `Invalid day: ${day}` });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "ContractorOS <onboarding@resend.dev>",
        to: [email],
        subject: template.subject,
        html: template.html,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(400).json({ error: data.message });
    return res.status(200).json({ success: true, id: data.id, day });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
