/**
 * Single OpenRouter fetch utility
 * Supports both text and vision (image) models
 */
export async function callAI(messages, model = 'anthropic/claude-3.5-sonnet') {
  const apiKey = import.meta.env.VITE_OPENROUTER_KEY
  if (!apiKey || apiKey === 'your_key_here') {
    throw new Error('Please set VITE_OPENROUTER_KEY in your .env file with a valid OpenRouter API key')
  }

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'ExamLens AI',
    },
    body: JSON.stringify({ model, messages, max_tokens: 4000 }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter error ${res.status}: ${err}`)
  }

  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.choices[0].message.content
}
