'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ExpenseCard } from '@/components/expense-card'
import { Input } from '@/components/ui/input'
import { CATEGORY_LIST } from '@/lib/categories'
import { formatCurrency } from '@/lib/format'
import type { CategoryId, Expense, ExpenseStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_FILTERS: { value: ExpenseStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Needs review' },
  { value: 'flagged', label: 'Flagged' },
]

export function ExpenseList({ expenses }: { expenses: Expense[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryId | 'all'>('all')
  const [status, setStatus] = useState<ExpenseStatus | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return expenses.filter(
      (e) =>
        (category === 'all' || e.category === category) &&
        (status === 'all' || e.status === status) &&
        (!q || e.merchant.toLowerCase().includes(q) || e.notes?.toLowerCase().includes(q)),
    )
  }, [expenses, query, category, status])

  const total = filtered.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search merchant or notes"
            aria-label="Search expenses"
            className="h-9 pl-8"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryId | 'all')}
          aria-label="Filter by category"
          className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">All categories</option>
          {CATEGORY_LIST.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <div role="group" aria-label="Filter by status" className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={status === f.value}
              onClick={() => setStatus(f.value)}
              className={cn(
                'shrink-0 rounded-md px-2.5 py-1 text-sm font-medium transition-colors',
                status === f.value ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground" aria-live="polite">
        <span>
          {filtered.length} {filtered.length === 1 ? 'expense' : 'expenses'}
        </span>
        <span className="font-mono tabular-nums text-foreground">{formatCurrency(total)}</span>
      </div>

      {filtered.length ? (
        <ul className="px-1 pb-2">
          {filtered.map((e) => (
            <li key={e.id}>
              <ExpenseCard expense={e} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 pb-10 pt-6 text-center text-sm text-muted-foreground">No expenses match these filters.</p>
      )}
    </div>
  )
}
