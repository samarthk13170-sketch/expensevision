import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'
import { StatusBadge } from '@/components/status-badge'
import { getCategory } from '@/lib/categories'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Expense } from '@/lib/types'

export function ExpenseCard({ expense }: { expense: Expense }) {
  return (
    <Link
      href={`/expenses/${expense.id}`}
      className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
    >
      <CategoryIcon category={expense.category} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{expense.merchant}</p>
        <p className="truncate text-xs text-muted-foreground">
          {getCategory(expense.category).label} · {formatDate(expense.date)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p className="font-mono text-sm font-semibold tabular-nums">{formatCurrency(expense.amount, expense.currency)}</p>
        <StatusBadge status={expense.status} />
      </div>
      <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
    </Link>
  )
}
