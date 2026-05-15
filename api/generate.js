const FREE_LIMIT = 3;

async function kvGet(key) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
  });
  const data = await res.json();
  return data.result ? parseInt(data.result) : 0;
}

async function kvSet(key, value) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(key)}/${value}`;
  await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, email } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  // --- Check usage limit first (don't increment yet) ---
  let usageKey = null;
  if (email && email !== 'demo@refinedlisting.com') {
    usageKey = `usage:${email.toLowerCase().trim()}`;
    try {
      const current = await kvGet(usageKey);
      if (current >= FREE_LIMIT) {
        return res.status(403).json({
          error: "Free limit reached",
          used: current,
          remaining: 0,
          hasAccess: false,
        });
      }
    } catch (kvErr) {
      console.error("Upstash error:", kvErr);
    }
  }

  // --- Generate listing ---
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.error?.message || JSON.stringify(data);
      return res.status(response.status).json({ error: errorMsg });
    }

    const text = data.content?.map((b) => b.text || "").join("") || "";

    // --- Only increment AFTER successful generation ---
    if (usageKey) {
      try {
        const current = await kvGet(usageKey);
        await kvSet(usageKey, current + 1);
      } catch (kvErr) {
        console.error("Upstash increment error:", kvErr);
      }
    }

    return res.status(200).json({ result: text.trim() });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
