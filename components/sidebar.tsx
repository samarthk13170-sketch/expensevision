'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { APP_NAV, isActive } from '@/components/navigation'
import { cn } from '@/lib/utils'

interface SidebarProps {
  open: boolean
  onClose: () => void
  unreadAlerts: number
  monthlyBudget: string
  budgetUsedPercent: number
}

export function Sidebar({ open, onClose, unreadAlerts, monthlyBudget, budgetUsedPercent }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        id="app-sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo href="/dashboard" inverted />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-1">
            {APP_NAV.map((item) => {
              const active = isActive(pathname, item.href)
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                    )}
                  >
                    <Icon className={cn('size-4', active && 'text-sidebar-primary')} aria-hidden="true" />
                    <span className="flex-1">{item.label}</span>
                    {item.href === '/alerts' && unreadAlerts > 0 && (
                      <span className="rounded-full bg-sidebar-primary px-2 py-0.5 text-xs font-semibold text-sidebar-primary-foreground">
                        {unreadAlerts}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="mx-3 mb-3 rounded-xl bg-sidebar-accent p-4">
          <p className="text-xs text-sidebar-foreground">Monthly budget</p>
          <p className="mt-1 text-sm font-semibold text-sidebar-accent-foreground">
            {budgetUsedPercent}% of {monthlyBudget}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sidebar">
            <div
              className="h-full rounded-full bg-sidebar-primary"
              style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="border-t border-sidebar-border p-3">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Link>
        </div>
      </aside>
    </>
  )
}
