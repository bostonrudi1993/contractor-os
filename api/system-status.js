// api/system-status.js
// Checks whether each external service
// ContractorOS depends on is actually up and
// the stored API key still works. Used by the
// Observability Dashboard.
//
// Each check is a lightweight call — no real
// data is created, modified, or charged for.
// A failure here means "this integration would
// currently break for real users," which is
// exactly what the dashboard needs to surface.

module.exports = async (req, res) => {
  const checks = [
    checkStripe,
    checkSupabase,
    checkAnthropic,
    checkResend,
    checkFmcsa,
    checkClerk,
  ];

  const results = await Promise.all(
    checks.map((check) => runCheck(check))
  );

  res.status(200).json({
    checkedAt: new Date().toISOString(),
    services: results,
  });
};

// Wraps each individual check so one failing
// service can never crash the whole endpoint,
// and times every check consistently.
async function runCheck(checkFn) {
  const start = Date.now();
  try {
    const result = await checkFn();
    return {
      ...result,
      responseTimeMs: Date.now() - start,
    };
  } catch (err) {
    return {
      service: checkFn.serviceName || "unknown",
      status: "down",
      message: err.message || "Unknown error",
      responseTimeMs: Date.now() - start,
    };
  }
}

// ── STRIPE ──────────────────────────────────
async function checkStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return {
      service: "stripe",
      status: "down",
      message: "STRIPE_SECRET_KEY not set",
    };
  }

  const response = await fetch(
    "https://api.stripe.com/v1/balance",
    {
      headers: { Authorization: `Bearer ${key}` },
    }
  );

  if (!response.ok) {
    return {
      service: "stripe",
      status: "down",
      message: `Stripe returned ${response.status}`,
    };
  }

  return { service: "stripe", status: "up" };
}
checkStripe.serviceName = "stripe";

// ── SUPABASE ────────────────────────────────
async function checkSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return {
      service: "supabase",
      status: "down",
      message: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set",
    };
  }

  const response = await fetch(
    `${url}/rest/v1/cos_data?select=id&limit=1`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    }
  );

  if (!response.ok) {
    return {
      service: "supabase",
      status: "down",
      message: `Supabase returned ${response.status}`,
    };
  }

  return { service: "supabase", status: "up" };
}
checkSupabase.serviceName = "supabase";

// ── ANTHROPIC ───────────────────────────────
async function checkAnthropic() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return {
      service: "anthropic",
      status: "down",
      message: "ANTHROPIC_API_KEY not set",
    };
  }

  // Lists available models — confirms the key
  // is valid without generating any tokens or
  // incurring any usage cost.
  const response = await fetch(
    "https://api.anthropic.com/v1/models",
    {
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
    }
  );

  if (!response.ok) {
    return {
      service: "anthropic",
      status: "down",
      message: `Anthropic returned ${response.status}`,
    };
  }

  return { service: "anthropic", status: "up" };
}
checkAnthropic.serviceName = "anthropic";

// ── RESEND ──────────────────────────────────
async function checkResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return {
      service: "resend",
      status: "down",
      message: "RESEND_API_KEY not set",
    };
  }

  const response = await fetch(
    "https://api.resend.com/domains",
    {
      headers: { Authorization: `Bearer ${key}` },
    }
  );

  if (response.status === 401) {
    // A 401 here usually means the key has
    // "Sending access" only (recommended,
    // more secure) rather than "Full access" —
    // /domains requires Full access, but
    // sending emails (all this app actually
    // does) only needs Sending access. This is
    // NOT the same as a broken/invalid key.
    return {
      service: "resend",
      status: "restricted",
      message:
        "Key likely has Sending-access-only " +
        "permissions (recommended) — this " +
        "endpoint requires Full access, but " +
        "sending emails still works fine.",
    };
  }

  if (!response.ok) {
    return {
      service: "resend",
      status: "down",
      message: `Resend returned ${response.status}`,
    };
  }

  return { service: "resend", status: "up" };
}
checkResend.serviceName = "resend";

// ── FMCSA ───────────────────────────────────
async function checkFmcsa() {
  const key = process.env.VITE_FMCSA_API_KEY;
  if (!key) {
    return {
      service: "fmcsa",
      status: "down",
      message: "VITE_FMCSA_API_KEY not set",
    };
  }

  // Uses a known real DOT number as a canary —
  // if this stops returning data, either the
  // key broke or FMCSA's API changed.
  const testDot = "657472";
  const response = await fetch(
    `https://mobile.fmcsa.dot.gov/qc/services/carriers/${testDot}?webKey=${key}`
  );

  if (!response.ok) {
    return {
      service: "fmcsa",
      status: "down",
      message: `FMCSA returned ${response.status}`,
    };
  }

  return { service: "fmcsa", status: "up" };
}
checkFmcsa.serviceName = "fmcsa";

// ── CLERK ───────────────────────────────────
async function checkClerk() {
  const key = process.env.CLERK_SECRET_KEY;
  if (!key) {
    return {
      service: "clerk",
      status: "down",
      message: "CLERK_SECRET_KEY not set",
    };
  }

  const response = await fetch(
    "https://api.clerk.com/v1/users?limit=1",
    {
      headers: { Authorization: `Bearer ${key}` },
    }
  );

  if (!response.ok) {
    return {
      service: "clerk",
      status: "down",
      message: `Clerk returned ${response.status}`,
    };
  }

  return { service: "clerk", status: "up" };
}
checkClerk.serviceName = "clerk";
