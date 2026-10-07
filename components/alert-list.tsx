'use client'

import { useState } from 'react'
import { AlertCard } from '@/components/alert-card'
import type { ExpenseAlert } from '@/lib/types'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'unread' | 'critical'

export function AlertList({ alerts, now }: { alerts: ExpenseAlert[]; now: string }) {
  const [filter, setFilter] = useState<Filter>('all')
  const reference = new Date(now)
  const shown = alerts.filter((a) => (filter === 'unread' ? !a.read : filter === 'critical' ? a.severity === 'critical' : true))

  const tabs: { value: Filter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: alerts.length },
    { value: 'unread', label: 'Unread', count: alerts.filter((a) => !a.read).length },
    { value: 'critical', label: 'Critical', count: alerts.filter((a) => a.severity === 'critical').length },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Filter alerts" className="flex w-fit gap-1 rounded-lg bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            aria-pressed={filter === t.value}
            onClick={() => setFilter(t.value)}
            className={cn(
              'rounded-md px-3 py-1 text-sm font-medium transition-colors',
              filter === t.value ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label} <span className="text-muted-foreground">{t.count}</span>
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="flex flex-col gap-3">
          {shown.map((a) => (
            <AlertCard key={a.id} alert={a} now={reference} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">You are all caught up.</p>
      )}
    </div>
  )
}
