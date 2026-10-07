import type { ExpenseStatus, ExtractionSource } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<ExpenseStatus, { label: string; className: string }> = {
  verified: { label: 'Verified', className: 'bg-accent text-accent-foreground' },
  pending: { label: 'Needs review', className: 'bg-warning/15 text-[oklch(0.45_0.1_70)]' },
  flagged: { label: 'Flagged', className: 'bg-destructive/10 text-destructive' },
}

export function StatusBadge({ status, className }: { status: ExpenseStatus; className?: string }) {
  const s = STATUS_STYLES[status]
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', s.className, className)}>
      {s.label}
    </span>
  )
}

const SOURCE_LABELS: Record<ExtractionSource, string> = {
  gemini: 'Gemini Vision',
  tesseract: 'Tesseract OCR',
  manual: 'Manual entry',
}

export function SourceBadge({ source }: { source: ExtractionSource }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
      {SOURCE_LABELS[source]}
    </span>
  )
}
