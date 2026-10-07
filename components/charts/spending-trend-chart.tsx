'use client'

import { Bar, Line } from 'react-chartjs-2'
import { CHART_COLORS, tooltipStyle } from './chart-setup'
import type { MonthlyTotal } from '@/lib/analytics'

interface SpendingTrendChartProps {
  data: MonthlyTotal[]
  variant?: 'line' | 'bar'
  budget?: number
  height?: number
}

export function SpendingTrendChart({ data, variant = 'line', budget, height = 260 }: SpendingTrendChartProps) {
  const labels = data.map((d) => d.label)
  const values = data.map((d) => d.total)

  const scales = {
    x: { grid: { display: false }, border: { display: false } },
    y: {
      beginAtZero: true,
      grid: { color: CHART_COLORS.grid },
      border: { display: false },
      ticks: { callback: (v: string | number) => `$${v}` },
    },
  }

  const budgetDataset = budget
    ? [
        {
          type: 'line' as const,
          label: 'Budget',
          data: labels.map(() => budget),
          borderColor: CHART_COLORS.navy,
          borderDash: [6, 6],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
        },
      ]
    : []

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: Boolean(budget), position: 'bottom' as const, labels: { boxWidth: 10, usePointStyle: true } },
      tooltip: tooltipStyle,
    },
    scales,
  }

  return (
    <div style={{ height }} role="img" aria-label={`Monthly spending: ${data.map((d) => `${d.label} $${d.total}`).join(', ')}`}>
      {variant === 'bar' ? (
        <Bar
          options={options}
          data={{
            labels,
            datasets: [
              { label: 'Spending', data: values, backgroundColor: CHART_COLORS.primary, borderRadius: 6, maxBarThickness: 36 },
              ...budgetDataset,
            ] as never,
          }}
        />
      ) : (
        <Line
          options={options}
          data={{
            labels,
            datasets: [
              {
                label: 'Spending',
                data: values,
                borderColor: CHART_COLORS.primary,
                backgroundColor: CHART_COLORS.primarySoft,
                fill: true,
                tension: 0.35,
                pointRadius: 3,
                pointBackgroundColor: CHART_COLORS.primary,
              },
              ...budgetDataset,
            ],
          }}
        />
      )}
    </div>
  )
}
