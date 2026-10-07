'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Menu, ScanLine } from 'lucide-react'
import { APP_NAV, isActive } from '@/components/navigation'
import { buttonVariants } from '@/components/ui/button'

interface NavbarProps {
  onMenuClick: () => void
  userName: string
  userEmail: string
  unreadAlerts: number
}

export function Navbar({ onMenuClick, userName, userEmail, unreadAlerts }: NavbarProps) {
  const pathname = usePathname()
  const current = APP_NAV.find((item) => isActive(pathname, item.href))
  const initials = userName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden"
        aria-label="Open navigation"
        aria-controls="app-sidebar"
      >
        <Menu className="size-5" />
      </button>

      <p className="text-sm font-medium text-muted-foreground">{current?.label ?? 'Expense Vision'}</p>

      <div className="ml-auto flex items-center gap-2">
        <Link href="/scan" className={buttonVariants({ size: 'lg', className: 'hidden px-3 sm:inline-flex' })}>
          <ScanLine data-icon="inline-start" />
          Scan receipt
        </Link>
        <Link
          href="/alerts"
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={`Alerts, ${unreadAlerts} unread`}
        >
          <Bell className="size-5" />
          {unreadAlerts > 0 && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
          )}
        </Link>
        <Link href="/profile" className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-muted">
          <span className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            {initials}
          </span>
          <span className="hidden flex-col leading-tight md:flex">
            <span className="text-sm font-medium">{userName}</span>
            <span className="text-xs text-muted-foreground">{userEmail}</span>
          </span>
        </Link>
      </div>
    </header>
  )
}
