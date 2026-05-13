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
    return res.status(500).json({ error: "Mailchimp not configured" });
  }

  try {
    const response = await fetch(
      `https://${DC}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `apikey ${API_KEY}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          merge_fields: { FNAME: name || "" },
        }),
      }
    );

    const data = await response.json();

    // 400 with "Member Exists" is fine — already subscribed
    if (response.ok || data.title === "Member Exists") {
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: data.detail || "Mailchimp error" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
