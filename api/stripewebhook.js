import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PRICE_TO_TIER = {
  [process.env.STRIPE_PRICE_SOLO]: "solo",
  [process.env.STRIPE_PRICE_FLEET]: "fleet",
  [process.env.STRIPE_PRICE_ENTERPRISE]: "enterprise",
};

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
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
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
          console.log(`✓ Upgraded org ${orgId} to ${tierName}`);
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
          console.log(`✓ Updated org ${orgId} to ${tier}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const orgId = sub.metadata?.orgId;
        if (orgId) {
          await updateOrgTier(orgId, "solo");
          console.log(`✓ Downgraded org ${orgId} to solo`);
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
}

export const config = {
  api: { bodyParser: false },
};
