export async function extractTextFromImage(base64Image) {
  try {
    const res = await fetch('/api/vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64Image }),
    })

    const data = await res.json()

    if (data.error) {
      console.error('Vision API failed:', data.error)
      return ''
    }

    return data.text || ''
  } catch (err) {
    console.error('Vision extraction failed:', err.message)
    return ''
  }
}
