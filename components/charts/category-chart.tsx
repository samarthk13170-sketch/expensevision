'use client'

import { Doughnut } from 'react-chartjs-2'
import { tooltipStyle } from './chart-setup'
import type { CategoryTotal } from '@/lib/analytics'
import { getCategory } from '@/lib/categories'
import { formatCurrency } from '@/lib/format'

export function CategoryChart({ data, height = 220 }: { data: CategoryTotal[]; height?: number }) {
  const total = data.reduce((s, d) => s + d.total, 0)

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-full max-w-[220px]" style={{ height }}>
        <Doughnut
          aria-label="Spending by category"
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: { legend: { display: false }, tooltip: tooltipStyle },
          }}
          data={{
            labels: data.map((d) => getCategory(d.category).label),
            datasets: [
              {
                data: data.map((d) => d.total),
                backgroundColor: data.map((d) => getCategory(d.category).color),
                borderWidth: 2,
                borderColor: '#ffffff',
              },
            ],
          }}
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="font-mono text-lg font-semibold tabular-nums">{formatCurrency(total)}</span>
        </div>
      </div>
      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-2.5">
        {data.map((d) => {
          const meta = getCategory(d.category)
          return (
            <li key={d.category} className="flex items-center gap-2 text-sm">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">{meta.label}</span>
              <span className="font-mono tabular-nums">{total ? Math.round((d.total / total) * 100) : 0}%</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
