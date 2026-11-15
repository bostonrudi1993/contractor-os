// api/billing-portal.js
// Opens Stripe's customer portal so a company can update its card, change plan, or cancel.
// POST { orgId }   (requires a signed-in member of that company)

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createClient } = require("@supabase/supabase-js");
const { requireOrgMember, sendError, httpError } = require("./_lib/clerkAuth");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ALLOWED_ORIGINS = [
  "https://contractoroshub.com",
  "https://www.contractoroshub.com",
];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orgId } = req.body || {};
    await requireOrgMember(req, orgId);

    const { data: row, error } = await supabase
      .from("org_subscriptions")
      .select("stripe_customer_id")
      .eq("org_id", orgId)
      .maybeSingle();
    if (error) throw error;

    if (!row || !row.stripe_customer_id) {
      throw httpError(400, "There is no billing account for this company yet.");
    }

    const origin = ALLOWED_ORIGINS.includes(req.headers.origin)
      ? req.headers.origin
      : ALLOWED_ORIGINS[0];

    const session = await stripe.billingPortal.sessions.create({
      customer: row.stripe_customer_id,
      return_url: `${origin}/app`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    return sendError(res, err);
  }
};
