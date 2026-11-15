// api/stripe-webhook.js
// CommonJS — required for Vercel bodyParser:false config to work reliably.
//
// On every subscription event this asks Stripe for the LATEST state of that subscription
// and saves it to the org_subscriptions table (status, plan, dates). The plan comes from
// the Stripe PRICE, never from anything the browser sent. Only this server writes that table.

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PRICE_TO_TIER = {};
if (process.env.STRIPE_PRICE_SOLO) PRICE_TO_TIER[process.env.STRIPE_PRICE_SOLO] = "solo";
if (process.env.STRIPE_PRICE_FLEET) PRICE_TO_TIER[process.env.STRIPE_PRICE_FLEET] = "fleet";
if (process.env.STRIPE_PRICE_ENTERPRISE) PRICE_TO_TIER[process.env.STRIPE_PRICE_ENTERPRISE] = "enterprise";

const LIVE_STATUSES = ["trialing", "active", "past_due", "unpaid", "paused"];
const DEAD_STATUSES = ["canceled", "incomplete_expired"];

const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

const toIso = (unixSeconds) =>
  unixSeconds ? new Date(unixSeconds * 1000).toISOString() : null;

async function syncSubscription(subscriptionId, orgIdHint) {
  // Always fetch the latest state, so late or out-of-order events can't save stale data.
  const sub = await stripe.subscriptions.retrieve(subscriptionId);

  const orgId = (sub.metadata && sub.metadata.orgId) || orgIdHint;
  if (!orgId) {
    console.warn(`Subscription ${sub.id} has no orgId in its metadata — skipped`);
    return;
  }

  // Ignore a stale event about an OLD, ended subscription when the company
  // already has a newer live one.
  const { data: current } = await supabase
    .from("org_subscriptions")
    .select("stripe_subscription_id, status")
    .eq("org_id", orgId)
    .maybeSingle();
  if (
    current &&
    current.stripe_subscription_id &&
    current.stripe_subscription_id !== sub.id &&
    LIVE_STATUSES.includes(current.status) &&
    DEAD_STATUSES.includes(sub.status)
  ) {
    console.log(`Ignoring ended subscription ${sub.id}; org ${orgId} has a newer one`);
    return;
  }

  const item = sub.items && sub.items.data && sub.items.data[0];
  const priceId = item && item.price && item.price.id;
  const tier = PRICE_TO_TIER[priceId];
  if (!tier) {
    console.error(`Unknown Stripe price ${priceId} for org ${orgId} — plan not updated`);
  }

  // Newer Stripe API versions keep the period end on the item instead of the subscription.
  const periodEnd = sub.current_period_end || (item && item.current_period_end) || null;

  const row = {
    org_id: orgId,
    status: sub.status,
    trial_end: toIso(sub.trial_end),
    current_period_end: toIso(periodEnd),
    cancel_at_period_end: !!sub.cancel_at_period_end,
    stripe_customer_id:
      typeof sub.customer === "string" ? sub.customer : sub.customer && sub.customer.id,
    stripe_subscription_id: sub.id,
    updated_at: new Date().toISOString(),
  };
  if (tier) row.tier = tier;
  // NOTE: "comped" is deliberately NOT written here, so free-access companies stay free.

  const { error } = await supabase
    .from("org_subscriptions")
    .upsert(row, { onConflict: "org_id" });
  if (error) {
    console.error("Supabase update error:", error);
    throw error;
  }

  console.log(`✓ Org ${orgId}: ${tier || "unknown plan"} / ${sub.status}`);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription" && session.subscription) {
          await syncSubscription(
            session.subscription,
            session.metadata && session.metadata.orgId
          );
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscription(event.data.object.id);
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    // A 500 makes Stripe retry this event later.
    return res.status(500).json({ error: err.message });
  }
};

// CRITICAL: must be CommonJS module.exports.config — not ES export const config.
module.exports.config = {
  api: { bodyParser: false },
};
