import { CategoryIcon } from '@/components/category-icon'
import { getCategory } from '@/lib/categories'
import { formatCurrency } from '@/lib/format'
import type { CategoryId } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CategoryCardProps {
  category: CategoryId
  total: number
  count: number
  budget?: number
  currency?: string
}

export function CategoryCard({ category, total, count, budget, currency = 'USD' }: CategoryCardProps) {
  const meta = getCategory(category)
  const pct = budget ? Math.round((total / budget) * 100) : null
  const over = pct !== null && pct >= 100

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <CategoryIcon category={category} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{meta.label}</p>
          <p className="text-xs text-muted-foreground">
            {count} {count === 1 ? 'expense' : 'expenses'}
          </p>
        </div>
        <p className="font-mono text-sm font-semibold tabular-nums">{formatCurrency(total, currency)}</p>
      </div>
      {budget ? (
        <div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full', over && 'bg-destructive')}
              style={{ width: `${Math.min(pct!, 100)}%`, backgroundColor: over ? undefined : meta.color }}
            />
          </div>
          <p className={cn('mt-1.5 text-xs', over ? 'text-destructive' : 'text-muted-foreground')}>
            {pct}% of {formatCurrency(budget, currency)} budget
          </p>
        </div>
      ) : null}
    </div>
  )
}
