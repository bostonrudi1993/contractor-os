module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set in environment variables");
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured on the server. Set it in Vercel → Settings → Environment Variables." });
  }

  const { prompt, system, base64Data, mediaType, model, max_tokens } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
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
