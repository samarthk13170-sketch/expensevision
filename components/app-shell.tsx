'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'

interface AppShellProps {
  children: React.ReactNode
  userName: string
  userEmail: string
  unreadAlerts: number
  monthlyBudget: string
  budgetUsedPercent: number
}

export function AppShell({ children, userName, userEmail, unreadAlerts, monthlyBudget, budgetUsedPercent }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-dvh">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        unreadAlerts={unreadAlerts}
        monthlyBudget={monthlyBudget}
        budgetUsedPercent={budgetUsedPercent}
      />
      <div className="flex min-h-dvh flex-col lg:pl-64">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
          userEmail={userEmail}
          unreadAlerts={unreadAlerts}
        />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
