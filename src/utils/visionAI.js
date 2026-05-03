export async function extractTextFromImage(base64Image) {
  try {
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
          generationConfig: {
            maxOutputTokens: 2000,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    )

    const data = await res.json()

    // Log full response for debugging
    console.log('Gemini vision response:', JSON.stringify(data, null, 2))

    // Validate response structure before accessing
    if (data.error) {
      console.warn('Gemini error:', data.error.message)
      return ''
    }

    if (!data.candidates || data.candidates.length === 0) {
      console.warn('No candidates in Gemini response')
      return ''
    }

    if (!data.candidates[0].content) {
      console.warn('No content in candidate:', data.candidates[0])
      return ''
    }

    if (
      !data.candidates[0].content.parts ||
      data.candidates[0].content.parts.length === 0
    ) {
      console.warn('No parts in content')
      return ''
    }

    const parts = data.candidates[0].content.parts
    return parts.find((p) => !p.thought)?.text ?? parts[parts.length - 1].text
  } catch (err) {
    console.warn('Vision extraction failed for page:', err.message)
    return ''
  }
}
