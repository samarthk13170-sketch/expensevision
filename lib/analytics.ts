import { CATEGORY_LIST } from './categories'
import type { CategoryId, Expense } from './types'

export interface CategoryTotal {
  category: CategoryId
  total: number
  count: number
}

export interface MonthlyTotal {
  key: string
  label: string
  total: number
}

const monthKey = (iso: string) => iso.slice(0, 7)

export function totalsByCategory(expenses: Expense[]): CategoryTotal[] {
  return CATEGORY_LIST.map((c) => {
    const inCategory = expenses.filter((e) => e.category === c.id)
    return {
      category: c.id,
      total: round(inCategory.reduce((sum, e) => sum + e.amount, 0)),
      count: inCategory.length,
    }
  })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.total - a.total)
}

export function monthlyTotals(expenses: Expense[], reference: Date, months = 6): MonthlyTotal[] {
  const result: MonthlyTotal[] = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() - i, 1))
    const key = d.toISOString().slice(0, 7)
    const total = expenses.filter((e) => monthKey(e.date) === key).reduce((s, e) => s + e.amount, 0)
    result.push({
      key,
      label: d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
      total: round(total),
    })
  }
  return result
}

export function expensesInMonth(expenses: Expense[], reference: Date, offset = 0) {
  const d = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() - offset, 1))
  const key = d.toISOString().slice(0, 7)
  return expenses.filter((e) => monthKey(e.date) === key)
}

export function sumAmount(expenses: Expense[]) {
  return round(expenses.reduce((s, e) => s + e.amount, 0))
}

export function sumTax(expenses: Expense[]) {
  return round(expenses.reduce((s, e) => s + e.taxAmount, 0))
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}

function round(n: number) {
  return Math.round(n * 100) / 100
}
