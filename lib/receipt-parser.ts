import { CATEGORY_LIST } from './categories'
import type { CategoryId, LineItem, ParsedReceipt } from './types'

const AMOUNT = /(?:[$€£₹]\s?)?(\d{1,3}(?:[,]\d{3})*(?:[.]\d{2})|\d+[.]\d{2})/
const AMOUNT_GLOBAL = new RegExp(AMOUNT.source, 'g')

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}

const SKIP_ITEM = /(sub\s*total|total|tax|vat|gst|change|cash|card|visa|mastercard|balance|tip|amount due|tender)/i

function toNumber(raw: string) {
  return Number.parseFloat(raw.replace(/,/g, ''))
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function detectCurrency(text: string): string {
  if (text.includes('₹') || /\b(INR|Rs\.?)\b/i.test(text)) return 'INR'
  if (text.includes('€') || /\bEUR\b/.test(text)) return 'EUR'
  if (text.includes('£') || /\bGBP\b/.test(text)) return 'GBP'
  return 'USD'
}

export function extractDate(text: string): string | null {
  const iso = text.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/)
  if (iso) return `${iso[1]}-${pad(+iso[2])}-${pad(+iso[3])}`

  const numeric = text.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})\b/)
  if (numeric) {
    let [, a, b, y] = numeric
    const year = y.length === 2 ? 2000 + +y : +y
    let month = +a
    let day = +b
    if (month > 12) [month, day] = [day, month]
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) return `${year}-${pad(month)}-${pad(day)}`
  }

  const named = text.match(/\b(\d{1,2})?\s?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s?(\d{1,2})?,?\s?(20\d{2})\b/i)
  if (named) {
    const month = MONTHS[named[2].toLowerCase()]
    const day = +(named[1] ?? named[3] ?? 1)
    return `${named[4]}-${pad(month)}-${pad(day)}`
  }
  return null
}

function findLabeledAmount(lines: string[], label: RegExp, exclude?: RegExp): number | null {
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i]
    if (!label.test(line) || (exclude && exclude.test(line))) continue
    const matches = line.match(AMOUNT_GLOBAL)
    if (matches?.length) return toNumber(matches[matches.length - 1].replace(/[^\d.,]/g, ''))
  }
  return null
}

export function extractTotal(lines: string[]): number | null {
  const labeled =
    findLabeledAmount(lines, /\b(grand\s*total|total\s*due|amount\s*due|total)\b/i, /sub\s*total/i) ??
    findLabeledAmount(lines, /\b(balance|amount)\b/i)
  if (labeled !== null) return labeled

  const all = lines.flatMap((l) => l.match(AMOUNT_GLOBAL) ?? []).map((m) => toNumber(m.replace(/[^\d.,]/g, '')))
  return all.length ? Math.max(...all) : null
}

export function extractMerchant(lines: string[]): string {
  const candidate = lines
    .slice(0, 6)
    .find((l) => /[a-z]{3,}/i.test(l) && !/(receipt|invoice|tel|phone|www|http|\d{3}[-\s]\d{3})/i.test(l))
  return candidate ? candidate.replace(/[^\w&'.\- ]/g, '').trim() : 'Unknown merchant'
}

export function extractItems(lines: string[]): LineItem[] {
  const items: LineItem[] = []
  for (const line of lines) {
    if (SKIP_ITEM.test(line)) continue
    const match = line.match(/^(?:(\d+)\s*[x×]?\s+)?([a-z][\w &'./-]{2,}?)\s+[$€£₹]?(\d+[.,]\d{2})\s*$/i)
    if (!match) continue
    items.push({
      quantity: match[1] ? +match[1] : 1,
      description: match[2].trim(),
      amount: toNumber(match[3].replace(',', '.')),
    })
  }
  return items.slice(0, 20)
}

export function suggestCategory(text: string): CategoryId {
  const lower = text.toLowerCase()
  let best: { id: CategoryId; score: number } = { id: 'other', score: 0 }
  for (const c of CATEGORY_LIST) {
    const score = c.keywords.reduce((s, k) => (lower.includes(k) ? s + 1 : s), 0)
    if (score > best.score) best = { id: c.id, score }
  }
  return best.id
}

export function parseReceiptText(rawText: string, ocrConfidence = 0.8): ParsedReceipt {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  const total = extractTotal(lines)
  const date = extractDate(rawText)
  const merchant = extractMerchant(lines)
  const tax = findLabeledAmount(lines, /\b(tax|vat|gst)\b/i) ?? 0

  const fieldsFound = [total !== null, date !== null, merchant !== 'Unknown merchant'].filter(Boolean).length
  const confidence = Math.min(1, Math.max(0, ocrConfidence * (0.55 + fieldsFound * 0.15)))

  return {
    merchant,
    date: date ?? new Date().toISOString().slice(0, 10),
    total: total ?? 0,
    tax,
    currency: detectCurrency(rawText),
    category: suggestCategory(rawText),
    items: extractItems(lines),
    confidence: Math.round(confidence * 100) / 100,
    rawText,
    source: 'tesseract',
  }
}
