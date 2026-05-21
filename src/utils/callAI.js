export async function callAI(prompt, systemPrompt = '') {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemPrompt }),
  })

  const data = await res.json()

  if (data.error) throw new Error(data.error)
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('AI returned an unexpected response. Please try again.')
  }

  const parts = data.candidates[0].content.parts
  const text = parts.find((p) => !p.thought)?.text ?? parts[parts.length - 1].text
  return text
}
