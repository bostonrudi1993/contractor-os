export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const { priceId, orgId, userEmail, tierName } = req.body;

  if (!priceId || !orgId) {
    return res.status(400).json({ error: "Missing priceId or orgId" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `https://contractoroshub.com/?upgrade=success&tier=${tierName}`,
      cancel_url: "https://contractoroshub.com/",
      customer_email: userEmail,
      metadata: { orgId, tierName },
      subscription_data: { metadata: { orgId, tierName } },
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: err.message });
  }
}
