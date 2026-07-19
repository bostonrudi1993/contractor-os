// api/stripe-webhook.js
// CommonJS — required for Vercel bodyParser:false config to work reliably

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PRICE_TO_TIER = {
  [process.env.STRIPE_PRICE_SOLO]: "solo",
  [process.env.STRIPE_PRICE_FLEET]: "fleet",
  [process.env.STRIPE_PRICE_ENTERPRISE]: "enterprise",
};

const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

async function updateOrgTier(orgId, tier) {
  const { data: existing } = await supabase
    .from("cos_data")
    .select("data_value")
    .eq("user_id", orgId)
    .eq("data_key", "cos_settings")
    .maybeSingle();

  const currentSettings = existing?.data_value || {};
  const updatedSettings = {
    ...currentSettings,
    subscriptionTier: tier,
    tierUpdatedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("cos_data")
    .upsert(
      { user_id: orgId, data_key: "cos_settings", data_value: updatedSettings },
      { onConflict: "user_id,data_key" }
    );

  if (error) {
    console.error("Supabase update error:", error);
    throw error;
  }

  console.log(`✓ Updated org ${orgId} to tier: ${tier}`);
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
        const { orgId, tierName } = session.metadata || {};
        if (orgId && tierName) {
          await updateOrgTier(orgId, tierName);
        } else {
          console.warn("checkout.session.completed missing orgId or tierName");
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const orgId = sub.metadata?.orgId;
        const priceId = sub.items?.data?.[0]?.price?.id;
        const tier = PRICE_TO_TIER[priceId];
        if (orgId && tier) {
          await updateOrgTier(orgId, tier);
        } else {
          console.warn("subscription.updated — could not resolve tier from priceId:", priceId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const orgId = sub.metadata?.orgId;
        if (orgId) {
          await updateOrgTier(orgId, "solo");
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// CRITICAL: must be CommonJS module.exports.config — not ES export const config
// ES module export syntax is NOT reliably picked up by Vercel for bodyParser:false
module.exports.config = {
  api: { bodyParser: false },
};
