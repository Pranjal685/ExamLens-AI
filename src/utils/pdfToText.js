import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { extractTextFromImage } from './visionAI'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

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

    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item) => item.str).join(' ')

    if (pageText.trim().length > 50) {
      fullText += pageText + '\n'
    } else {
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')
      await page.render({ canvasContext: ctx, viewport }).promise
      const base64Image = canvas.toDataURL('image/jpeg', 0.85).split(',')[1]

      const extracted = await extractTextFromImage(base64Image)
      fullText += extracted + '\n'
    }
  }

  return fullText
}
