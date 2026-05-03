/**
 * PDF text extraction — handles BOTH text-based and image-based PDFs.
 * Text pages use pdf.js text extraction; image pages render to canvas
 * and send to a vision model (Gemini 2.0 Flash) via OpenRouter.
 */
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

/**
 * @param {File} file — a PDF File object
 * @param {function} [onPageProgress] — optional callback(pageIndex, totalPages)
 * @returns {Promise<string>} — concatenated text from all pages
 */
export async function extractTextFromPDF(file, onPageProgress) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    if (onPageProgress) onPageProgress(i, pdf.numPages)

    const page = await pdf.getPage(i)

    // Try text extraction first
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item) => item.str).join(' ')

    if (pageText.trim().length > 50) {
      // Text-based page — direct extraction worked
      fullText += pageText + '\n'
    } else {
      // Image-based page — render to canvas and send to vision model
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')
      await page.render({ canvasContext: ctx, viewport }).promise
      const base64Image = canvas.toDataURL('image/jpeg', 0.85).split(',')[1]

      // Send to vision model (Gemini 2.0 Flash)
      const visionResponse = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'ExamLens AI',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash-001',
            max_tokens: 2000,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:image/jpeg;base64,${base64Image}`,
                    },
                  },
                  {
                    type: 'text',
                    text: 'Extract all text from this exam question paper page. Return only the raw text, preserve question numbers and structure.',
                  },
                ],
              },
            ],
          }),
        }
      )

      if (!visionResponse.ok) {
        const errText = await visionResponse.text()
        throw new Error(
          `Vision API error ${visionResponse.status}: ${errText}`
        )
      }

      const visionData = await visionResponse.json()
      if (visionData.error) throw new Error(visionData.error.message)
      fullText += visionData.choices[0].message.content + '\n'
    }
  }

  return fullText
}
