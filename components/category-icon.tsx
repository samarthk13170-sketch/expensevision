import { getCategory } from '@/lib/categories'
import type { CategoryId } from '@/lib/types'
import { cn } from '@/lib/utils'

export function CategoryIcon({ category, className }: { category: CategoryId; className?: string }) {
  const meta = getCategory(category)
  const Icon = meta.icon
  return (
    <span
      className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', className)}
      style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
    >
      <Icon className="size-[18px]" aria-hidden="true" />
    </span>
  )
}
