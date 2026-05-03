export async function extractTextFromImage(base64Image) {
  console.log('Gemini key:', import.meta.env.VITE_GEMINI_KEY?.slice(0, 8))
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image,
                },
              },
              {
                text: 'Extract all text from this exam question paper page. Return only the raw text, preserve question numbers and structure.',
              },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 2000 },
      }),
    }
  )
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.candidates[0].content.parts[0].text
}
