export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const API_KEY = process.env.MC_API_KEY;
  const AUDIENCE_ID = process.env.MC_AUDIENCE_ID;
  const DC = process.env.MC_DC || "us15";

  if (!API_KEY || !AUDIENCE_ID) {
    return res.status(500).json({ error: "Mailchimp not configured", hasKey: !!API_KEY, hasAudience: !!AUDIENCE_ID });
  }

  // Strip -us15 suffix from API key if present (it's passed separately as DC)
  const cleanKey = API_KEY.includes("-") ? API_KEY.split("-")[0] : API_KEY;
  const cleanDC = API_KEY.includes("-") ? API_KEY.split("-").pop() : DC;

  try {
    const url = `https://${cleanDC}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`anystring:${cleanKey}`).toString("base64")}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        merge_fields: { FNAME: name || "" },
      }),
    });

    const data = await response.json();

    // Member already exists is fine
    if (response.ok || data.title === "Member Exists") {
      return res.status(200).json({ success: true });
    }

    // Return full Mailchimp error for debugging
    return res.status(400).json({ error: data.detail || data.title || "Mailchimp error", full: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
