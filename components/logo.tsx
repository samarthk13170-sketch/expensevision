import Link from 'next/link'
import { ScanLine } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ href = '/', inverted = false, className }: { href?: string; inverted?: boolean; className?: string }) {
  return (
    <Link href={href} className={cn('flex items-center gap-2 font-semibold tracking-tight', className)}>
      <span
        className={cn(
          'flex size-8 items-center justify-center rounded-lg',
          inverted ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-primary text-primary-foreground',
        )}
      >
        <ScanLine className="size-4" aria-hidden="true" />
      </span>
      <span className={cn('text-base', inverted ? 'text-sidebar-accent-foreground' : 'text-foreground')}>
        Expense Vision
      </span>
    </Link>
  )
}
