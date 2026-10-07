'use client'

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip)

ChartJS.defaults.font.family = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
ChartJS.defaults.color = '#64748b'

export const CHART_COLORS = {
  primary: '#0f9d76',
  primarySoft: 'rgba(15, 157, 118, 0.12)',
  navy: '#2f3e5c',
  grid: 'rgba(100, 116, 139, 0.12)',
}

export const tooltipStyle = {
  backgroundColor: '#1e293b',
  padding: 10,
  cornerRadius: 8,
  titleFont: { weight: 600 as const },
}
