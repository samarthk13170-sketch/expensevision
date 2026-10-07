import Link from 'next/link'
import { AlertTriangle, CircleAlert, Info } from 'lucide-react'
import { formatRelative } from '@/lib/format'
import type { AlertSeverity, ExpenseAlert } from '@/lib/types'
import { cn } from '@/lib/utils'

const SEVERITY: Record<AlertSeverity, { icon: typeof Info; className: string; label: string }> = {
  critical: { icon: CircleAlert, className: 'bg-destructive/10 text-destructive', label: 'Critical' },
  warning: { icon: AlertTriangle, className: 'bg-warning/15 text-[oklch(0.5_0.12_70)]', label: 'Warning' },
  info: { icon: Info, className: 'bg-chart-4/15 text-chart-4', label: 'Info' },
}

export function AlertCard({ alert, now, compact = false }: { alert: ExpenseAlert; now: Date; compact?: boolean }) {
  const s = SEVERITY[alert.severity]
  const Icon = s.icon

  return (
    <article
      className={cn(
        'flex gap-3 rounded-xl border bg-card p-4',
        !alert.read && 'border-l-4 border-l-primary',
        compact && 'border-0 p-3',
      )}
    >
      <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', s.className)}>
        <Icon className="size-4" aria-hidden="true" />
        <span className="sr-only">{s.label}</span>
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold">{alert.title}</h3>
          <time dateTime={alert.createdAt} className="shrink-0 text-xs text-muted-foreground">
            {formatRelative(alert.createdAt, now)}
          </time>
        </div>
        <p className={cn('mt-1 text-sm text-muted-foreground text-pretty', compact && 'line-clamp-2')}>{alert.message}</p>
        {alert.expenseId && !compact && (
          <Link href={`/expenses/${alert.expenseId}`} className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
            Review expense
          </Link>
        )}
      </div>
    </article>
  )
}
