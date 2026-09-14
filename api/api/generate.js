// This runs on the server (Vercel), never in the customer's browser.
// Your Gemini API key stays hidden here — it is never sent to the website's visitors.
// Uses Google's Gemini free tier — no cost to run this.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  const { businessName, businessType, promoDetails, tone, platform, brandVoice } = req.body || {};

  if (!businessName || !businessType || !promoDetails) {
    return res.status(400).json({ error: "Missing business details." });
  }

  const brandVoiceLine = brandVoice && brandVoice.trim()
    ? `\nThe business owner has described their brand voice like this: "${brandVoice.trim()}". Apply this consistently across all 3 options — it should feel like the same shop is speaking every time, not just match the selected tone in isolation.\n`
    : "";

  const prompt = `You are a marketing copywriter who specializes in hyper-local small business content in Kerala, India. You write like someone who has actually stood behind the counter of shops like this — not like a corporate marketing agency.

Business name: ${businessName}
Business type: ${businessType}
What to promote: ${promoDetails}
Tone: ${tone}
Platform: ${platform}
${brandVoiceLine}
Write 3 DISTINCT ${platform} options. Each option must take a genuinely different angle — for example, one built around a direct benefit/deal, one built around curiosity or a question, one built around local flavor, a story, or social proof (e.g. "our regulars ask for this every week"). Do not make all 3 sound like variations of the same sentence.

Rules for quality:
- Never use these overused phrases or anything equivalent to them: "don't miss out", "visit us today", "hurry", "limited time only", "check it out", "we've got you covered", "elevate your", "experience the difference"
- Ground every option in a concrete, specific detail from what's being promoted — smells, textures, a specific dish/item name, a specific local moment (weekend, festival, evening rush) — not vague claims
- Each "hook" is a short opening line, under 8 words, that could stop a scrolling thumb. It must NOT be a greeting or a generic claim. Favor a specific detail, a question, or a bold specific statement over a general one.
- Match the requested tone precisely — "Bold & festive" should feel different in rhythm and word choice from "Professional & polished", not just swap one adjective.
- Include 4-6 relevant hashtags per option, specific to the business and location, not just generic ones like #shoplocal (no hashtags if platform is WhatsApp status).

Write EVERY option in two versions: English, and natural spoken Malayalam using Malayalam script (not transliteration). The Malayalam should read exactly like a real shop owner talking to a regular customer in Kerala — casual, warm, using natural code-mixing with English words where a real shop owner actually would (like "offer", "stock", weekday names), not a stiff textbook translation.

Respond ONLY with valid JSON, no preamble, no markdown fences, in this exact shape:
{"posts": [{"hook_en": "string", "caption_en": "string", "hook_ml": "string", "caption_ml": "string", "hashtags": ["string"]}]}
Include exactly 3 objects in the posts array.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 4000 },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Gemini API error: ${errText}` });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("\n") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
