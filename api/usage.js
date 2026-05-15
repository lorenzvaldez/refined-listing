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
  const { email, action } = req.method === "GET" ? req.query : (req.body || {});

  if (!email) return res.status(400).json({ error: "Email required" });

  // Demo email is unlimited — skip all tracking
  if (email === 'demo@refinedlisting.com') {
    return res.status(200).json({ used: 0, remaining: 999, limit: 999, hasAccess: true });
  }

  const key = `usage:${email.toLowerCase().trim()}`;

  try {
    if (action === "check") {
      const count = await kvGet(key);
      return res.status(200).json({
        used: count,
        remaining: Math.max(0, FREE_LIMIT - count),
        limit: FREE_LIMIT,
        hasAccess: count < FREE_LIMIT,
      });
    }

    if (action === "increment") {
      const current = await kvGet(key);
      if (current >= FREE_LIMIT) {
        return res.status(403).json({
          error: "Free limit reached",
          used: current,
          remaining: 0,
          hasAccess: false,
        });
      }
      const newCount = current + 1;
      await kvSet(key, newCount);
      return res.status(200).json({
        used: newCount,
        remaining: Math.max(0, FREE_LIMIT - newCount),
        limit: FREE_LIMIT,
        hasAccess: newCount < FREE_LIMIT,
      });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    console.error("Upstash error:", err);
    return res.status(500).json({ error: "Storage error" });
  }
}
