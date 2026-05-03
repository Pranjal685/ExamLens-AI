import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { extractTextFromImage } from './visionAI'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const MAX_PAGES = 15
const MAX_TEXT_LENGTH = 8000
const VISION_BATCH_SIZE = 5
const TEXT_THRESHOLD = 20

/**
 * @param {File} file — a PDF File object
 * @param {function} [onPageProgress] — optional callback(pageIndex, totalPages)
 * @returns {Promise<string>} — concatenated text from all pages (capped)
 */
export async function extractTextFromPDF(file, onPageProgress) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const numPages = Math.min(pdf.numPages, MAX_PAGES)

  // First pass — extract text from ALL pages simultaneously
  const textExtractionPromises = []
  for (let i = 1; i <= numPages; i++) {
    textExtractionPromises.push(
      pdf.getPage(i).then(async (page) => {
        const textContent = await page.getTextContent()
        return {
          pageNum: i,
          text: textContent.items.map((item) => item.str).join(' ').trim(),
        }
      })
    )
  }

  if (onPageProgress) onPageProgress(0, numPages)
  const pageTexts = await Promise.all(textExtractionPromises)

  // Separate text-based and image-based pages
  const textPages = pageTexts.filter((p) => p.text.length > TEXT_THRESHOLD)
  const imagePages = pageTexts.filter((p) => p.text.length <= TEXT_THRESHOLD)

  // If ≥50% of pages have text — treat as a text PDF
  const textRatio = textPages.length / numPages

  let fullText = ''

  if (textRatio >= 0.5) {
    // Mostly text-based — skip vision entirely, use extracted text
    fullText = pageTexts
      .sort((a, b) => a.pageNum - b.pageNum)
      .map((p) => p.text)
      .join('\n')
    if (onPageProgress) onPageProgress(numPages, numPages)
  } else {
    // Mostly image-based — run vision on image pages in parallel batches
    const visionResults = new Array(numPages).fill('')

    // Fill in text pages first
    textPages.forEach((p) => {
      visionResults[p.pageNum - 1] = p.text
    })

    // Process image pages in batches of VISION_BATCH_SIZE to avoid rate limits
    for (let b = 0; b < imagePages.length; b += VISION_BATCH_SIZE) {
      const batch = imagePages.slice(b, b + VISION_BATCH_SIZE)

      await Promise.all(
        batch.map(async (pageData) => {
          const page = await pdf.getPage(pageData.pageNum)
          const viewport = page.getViewport({ scale: 1.5 })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext('2d')
          await page.render({ canvasContext: ctx, viewport }).promise
          const base64Image = canvas.toDataURL('image/jpeg', 0.7).split(',')[1]

          const text = await extractTextFromImage(base64Image)
          visionResults[pageData.pageNum - 1] = text
        })
      )

      if (onPageProgress)
        onPageProgress(
          Math.min(b + VISION_BATCH_SIZE, imagePages.length),
          numPages
        )
    }

    fullText = visionResults.join('\n')
  }

  return fullText.slice(0, MAX_TEXT_LENGTH)
}
