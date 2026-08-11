const { createClient } = require("@supabase/supabase-js");

const MAX_REQUESTS_PER_HOUR = 20;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set in environment variables");
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured on the server. Set it in Vercel → Settings → Environment Variables." });
  }

  const { prompt, system, base64Data, mediaType, model, max_tokens, orgId } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  // ── RATE LIMITING ──
  // Prefer the Clerk org ID (real multi-tenant
  // scoping). Personal/device accounts (no
  // organization) fall back to IP-based limiting
  // so they're still protected, just less
  // precisely — one busy office network sharing
  // an IP could theoretically share a limit.
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";
  const rateLimitId = orgId || `ip:${clientIp}`;

  // Bucket by current hour — e.g. "org_abc:2026-08-09T18".
  // A new hour means a brand-new bucket key, so the
  // count naturally "resets" with no separate expiry
  // logic needed.
  const hourBucket = new Date().toISOString().slice(0, 13);
  const bucketKey = `${rateLimitId}:${hourBucket}`;

  try {
    const { data: currentCount, error: rateLimitError } = await supabase.rpc(
      "increment_rate_limit",
      { p_bucket_key: bucketKey }
    );

    if (rateLimitError) {
      // If rate limit tracking itself fails, log it
      // but don't block the actual request — a
      // monitoring problem should never take down
      // the feature it's protecting.
      console.error("Rate limit check failed (allowing request):", rateLimitError);
    } else if (currentCount > MAX_REQUESTS_PER_HOUR) {
      console.warn(`Rate limit exceeded for ${rateLimitId}: ${currentCount} requests this hour`);
      return res.status(429).json({
        error: `Rate limit exceeded — max ${MAX_REQUESTS_PER_HOUR} AI requests per hour. Please try again later.`,
      });
    }
  } catch (err) {
    console.error("Rate limit check threw (allowing request):", err);
  }

  const contentParts = base64Data
    ? [
        {
          type: mediaType && mediaType.startsWith("image/") ? "image" : "document",
          source: { type: "base64", media_type: mediaType || "application/pdf", data: base64Data },
        },
        { type: "text", text: prompt },
      ]
    : prompt;

  const body = {
    model: model || "claude-sonnet-4-6",
    max_tokens: max_tokens || 1024,
    messages: [{ role: "user", content: contentParts }],
  };
  if (system) body.system = system;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic API error:", response.status, data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Claude proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
};
