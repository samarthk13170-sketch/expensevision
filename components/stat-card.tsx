import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  change?: number
  invertChange?: boolean
}

export function StatCard({ label, value, hint, change, invertChange = false }: StatCardProps) {
  const hasChange = typeof change === 'number' && Number.isFinite(change)
  const up = hasChange && change! >= 0
  const good = invertChange ? up : !up

  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        <div className="flex items-center gap-2 text-xs">
          {hasChange && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium',
                good ? 'bg-accent text-accent-foreground' : 'bg-destructive/10 text-destructive',
              )}
            >
              {up ? <ArrowUpRight className="size-3" aria-hidden="true" /> : <ArrowDownRight className="size-3" aria-hidden="true" />}
              {Math.abs(Math.round(change!))}%
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
