export async function extractTextFromImage(base64Image) {
  try {
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
          generationConfig: {
            maxOutputTokens: 2000,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    )

    const data = await res.json()

    if (data.error) {
      console.error('Vision API failed:', data.error.message || 'Unknown error')
      return ''
    }

    if (!data.candidates || data.candidates.length === 0) return ''
    if (!data.candidates[0].content) return ''
    if (
      !data.candidates[0].content.parts ||
      data.candidates[0].content.parts.length === 0
    ) {
      return ''
    }

    const parts = data.candidates[0].content.parts
    return parts.find((p) => !p.thought)?.text ?? parts[parts.length - 1].text
  } catch (err) {
    console.error('Vision extraction failed:', err.message)
    return ''
  }
}
