// Checks a submitted password against the secret you set in Vercel.
// The real password is never sent to the browser — only "ok: true/false" is returned.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  const { password } = req.body || {};
  const correctPassword = process.env.APP_PASSWORD;

  if (!correctPassword) {
    return res.status(500).json({ error: "App password is not configured on the server yet." });
  }

  if (password === correctPassword) {
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: "Incorrect password." });
}
