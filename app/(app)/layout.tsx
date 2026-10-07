import { AppShell } from '@/components/app-shell'
import { expensesInMonth, sumAmount } from '@/lib/analytics'
import { getAlerts, getCurrentUser, getExpenses, REFERENCE_DATE } from '@/lib/data'
import { formatCurrency } from '@/lib/format'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, alerts, expenses] = await Promise.all([getCurrentUser(), getAlerts(), getExpenses()])
  const spent = sumAmount(expensesInMonth(expenses, REFERENCE_DATE))

  return (
    <AppShell
      userName={user.name}
      userEmail={user.email}
      unreadAlerts={alerts.filter((a) => !a.read).length}
      monthlyBudget={formatCurrency(user.monthlyBudget, user.currency)}
      budgetUsedPercent={Math.round((spent / user.monthlyBudget) * 100)}
    >
      {children}
    </AppShell>
  )
}
