'use client'

import { parseReceiptText } from './receipt-parser'
import type { ParsedReceipt } from './types'

export interface OcrProgress {
  status: string
  progress: number
}

export async function extractWithTesseract(
  image: File | Blob,
  onProgress?: (p: OcrProgress) => void,
): Promise<ParsedReceipt> {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('eng', 1, {
    logger: (m: { status: string; progress: number }) => onProgress?.({ status: m.status, progress: m.progress }),
  })
  try {
    const { data } = await worker.recognize(image)
    return parseReceiptText(data.text, (data.confidence ?? 80) / 100)
  } finally {
    await worker.terminate()
  }
}
