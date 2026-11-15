// api/subscription.js
// Tells the app what plan a company has and whether it may use the app.
// GET /api/subscription?orgId=org_xxx   (requires a signed-in member of that company)

const { createClient } = require("@supabase/supabase-js");
const { requireOrgMember, sendError } = require("./_lib/clerkAuth");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Only these Stripe statuses may use the app. past_due, unpaid, canceled, etc. are locked out.
const ACCESS_STATUSES = ["trialing", "active"];

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const orgId = req.query.orgId;
    await requireOrgMember(req, orgId);

    const { data, error } = await supabase
      .from("org_subscriptions")
      .select("*")
      .eq("org_id", orgId)
      .maybeSingle();
    if (error) throw error;

    const row = data || {};
    const comped = !!row.comped;
    const status = row.status || "none";

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      hasAccess: comped || ACCESS_STATUSES.includes(status),
      comped,
      status,
      tier: row.tier || null,
      hadSubscription: !!row.stripe_subscription_id,
      hasBillingAccount: !!row.stripe_customer_id,
      trialEnd: row.trial_end || null,
      currentPeriodEnd: row.current_period_end || null,
      cancelAtPeriodEnd: !!row.cancel_at_period_end,
    });
  } catch (err) {
    return sendError(res, err);
  }
};
