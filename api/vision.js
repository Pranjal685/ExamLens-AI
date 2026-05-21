/* global process, Buffer */
// Vercel Serverless Function — proxies vision-based Gemini API calls
// The API key lives ONLY on the server (process.env.GEMINI_API_KEY)

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB base64 payload limit

export default async function handler(req, res) {
  // ── CORS ────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()

  // ── Method check ────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // ── API key check ───────────────────────────────────────
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // ── Parse & validate body ───────────────────────────────
  const { imageBase64 } = req.body || {}

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "imageBase64" field' })
  }

  // Size guard
  if (Buffer.byteLength(imageBase64, 'utf8') > MAX_IMAGE_BYTES) {
    return res.status(413).json({ error: 'Image too large (max 10 MB)' })
  }

  // ── Build Gemini vision request ─────────────────────────
  const geminiBody = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            text: 'Extract all text from this exam question paper page. Return only the raw text, preserve question numbers and structure.',
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 2000,
      thinkingConfig: { thinkingBudget: 0 },
    },
  }

  // ── Call Gemini ─────────────────────────────────────────
  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    })

    const data = await geminiRes.json()

    if (data.error) {
      return res.status(geminiRes.status).json({
        error: data.error.message || 'Gemini Vision API error',
      })
    }

    // Extract text from response and return simplified payload
    if (!data.candidates?.[0]?.content?.parts?.length) {
      return res.status(200).json({ text: '' })
    }

    const parts = data.candidates[0].content.parts
    const text = parts.find((p) => !p.thought)?.text ?? parts[parts.length - 1].text

    return res.status(200).json({ text: text || '' })
  } catch (err) {
    console.error('Vision proxy error:', err.message)
    return res.status(502).json({ error: 'Failed to reach AI vision service' })
  }
}
