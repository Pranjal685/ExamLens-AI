export async function callAI(prompt, systemPrompt = '') {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 4000,
          temperature: 0.3,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    }
  )
  const data = await res.json()

  if (data.error) throw new Error(data.error.message)
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('AI returned an unexpected response. Please try again.')
  }

  const parts = data.candidates[0].content.parts
  const text = parts.find((p) => !p.thought)?.text ?? parts[parts.length - 1].text
  return text
}
