import { formatDate } from '@/lib/format'
import type { AuditLog } from '@/lib/types'

const ACTION_LABELS: Record<AuditLog['action'], string> = {
  'expense.created': 'Expense created',
  'expense.updated': 'Expense updated',
  'expense.deleted': 'Expense deleted',
  'receipt.scanned': 'Receipt scanned',
  'user.login': 'Signed in',
  'profile.updated': 'Profile updated',
}

export function AuditTimeline({ logs }: { logs: AuditLog[] }) {
  if (!logs.length) return <p className="text-sm text-muted-foreground">No activity recorded yet.</p>

  return (
    <ol className="relative flex flex-col gap-5 border-l pl-5">
      {logs.map((log) => (
        <li key={log.id} className="relative">
          <span className="absolute top-1.5 -left-[25px] size-2.5 rounded-full bg-primary ring-4 ring-card" aria-hidden="true" />
          <p className="text-sm font-medium">{ACTION_LABELS[log.action]}</p>
          <p className="text-sm text-muted-foreground">{log.detail}</p>
          <time dateTime={log.createdAt} className="mt-0.5 block font-mono text-xs text-muted-foreground">
            {formatDate(log.createdAt, { hour: 'numeric', minute: '2-digit' })}
          </time>
        </li>
      ))}
    </ol>
  )
}
