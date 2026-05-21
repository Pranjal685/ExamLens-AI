/* global process, Buffer */
// Vercel Serverless Function — proxies text-based Gemini API calls
// The API key lives ONLY on the server (process.env.GEMINI_API_KEY)

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const MAX_PROMPT_BYTES = 50 * 1024 // 50 KB

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
  const { prompt, systemPrompt } = req.body || {}

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "prompt" field' })
  }

  if (systemPrompt !== undefined && typeof systemPrompt !== 'string') {
    return res.status(400).json({ error: '"systemPrompt" must be a string' })
  }

  // Size guard
  const totalSize = Buffer.byteLength(prompt, 'utf8') +
    Buffer.byteLength(systemPrompt || '', 'utf8')
  if (totalSize > MAX_PROMPT_BYTES) {
    return res.status(413).json({ error: 'Prompt too large (max 50 KB)' })
  }

  // ── Build Gemini request ────────────────────────────────
  const geminiBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: 4000,
      temperature: 0.3,
      thinkingConfig: { thinkingBudget: 0 },
    },
  }

  if (systemPrompt) {
    geminiBody.system_instruction = { parts: [{ text: systemPrompt }] }
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
      // Sanitize — never forward the raw error which might contain the key
      return res.status(geminiRes.status).json({
        error: data.error.message || 'Gemini API error',
      })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Gemini proxy error:', err.message)
    return res.status(502).json({ error: 'Failed to reach AI service' })
  }
}
