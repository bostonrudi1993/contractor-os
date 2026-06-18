// api/create-checkout-session.js
// Vercel serverless function — creates a Stripe checkout session
// Uses CommonJS (not ES modules) for Vercel compatibility

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { priceId, orgId, userEmail, tierName } = req.body || {};

  if (!priceId) {
    return res.status(400).json({
      error: "Missing priceId — make sure VITE_STRIPE_PRICE_* env vars are set in Vercel"
    });
  }

  if (!orgId) {
    return res.status(400).json({
      error: "Missing orgId — user must be logged in"
    });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      error: "STRIPE_SECRET_KEY not configured in Vercel environment variables"
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `https://contractoroshub.com/?upgrade=success&tier=${tierName}`,
      cancel_url: "https://contractoroshub.com/",
      customer_email: userEmail || undefined,
      metadata: { orgId, tierName },
      subscription_data: {
        metadata: { orgId, tierName },
        trial_period_days: 14,
      },
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
