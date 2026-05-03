export async function callAI(prompt, systemPrompt = '') {
  const apiKey = import.meta.env.VITE_GROQ_KEY
  if (!apiKey || apiKey === 'your_groq_key_here') {
    throw new Error('Please set VITE_GROQ_KEY in your .env file with a valid Groq API key')
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    }),
  })

  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.choices[0].message.content
}
