// api/create-checkout-session.js
// Starts a Stripe Checkout for a company's plan.
// CommonJS (module.exports) for Vercel compatibility.
//
// SECURITY: the browser only says WHICH plan it wants ("solo" | "fleet" | "enterprise").
// This function verifies the Clerk login and company membership, and picks the Stripe
// price itself, so nobody can pay for one plan and label it another.

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createClient } = require("@supabase/supabase-js");
const { requireOrgMember, sendError, httpError } = require("./_lib/clerkAuth");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PRICES = {
  solo: process.env.STRIPE_PRICE_SOLO,
  fleet: process.env.STRIPE_PRICE_FLEET,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
};

const ALLOWED_ORIGINS = [
  "https://contractoroshub.com",
  "https://www.contractoroshub.com",
];

// A subscription in any of these states still exists, so a second checkout would double-bill.
const LIVE_STATUSES = ["trialing", "active", "past_due", "unpaid", "paused"];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw httpError(500, "Stripe is not configured.");
    }

    const { tier, orgId, userEmail } = req.body || {};
    const priceId = PRICES[tier];
    if (!priceId) throw httpError(400, "Unknown plan.");

    // Verifies the Clerk login and that this user belongs to this company.
    await requireOrgMember(req, orgId);

    const { data: existing, error: readError } = await supabase
      .from("org_subscriptions")
      .select("*")
      .eq("org_id", orgId)
      .maybeSingle();
    if (readError) throw readError;

    if (existing && existing.comped) {
      throw httpError(400, "This company has free access, so no payment is needed.");
    }
    if (existing && LIVE_STATUSES.includes(existing.status)) {
      throw httpError(
        409,
        "This company already has a plan. Use billing to change it or update the card."
      );
    }

    // A company that had a subscription before does not get a second free trial.
    const returning = !!(existing && existing.stripe_subscription_id);

    const origin = ALLOWED_ORIGINS.includes(req.headers.origin)
      ? req.headers.origin
      : ALLOWED_ORIGINS[0];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      payment_method_collection: "always", // card required up front, even during the trial
      line_items: [{ price: priceId, quantity: 1 }],
      ...(existing && existing.stripe_customer_id
        ? { customer: existing.stripe_customer_id }
        : { customer_email: userEmail || undefined }),
      client_reference_id: orgId,
      metadata: { orgId, tierName: tier },
      subscription_data: {
        metadata: { orgId, tierName: tier },
        ...(returning ? {} : { trial_period_days: 14 }),
      },
      allow_promotion_codes: true,
      success_url: `${origin}/app?checkout=success`,
      cancel_url: `${origin}/app?checkout=canceled`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    return sendError(res, err);
  }
};
