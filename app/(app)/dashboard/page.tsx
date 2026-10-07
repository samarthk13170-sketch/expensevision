import type { Metadata } from 'next'
import Link from 'next/link'
import { ScanLine } from 'lucide-react'
import { AlertCard } from '@/components/alert-card'
import { CategoryChart } from '@/components/charts/category-chart'
import { SpendingTrendChart } from '@/components/charts/spending-trend-chart'
import { ExpenseCard } from '@/components/expense-card'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { expensesInMonth, monthlyTotals, percentChange, sumAmount, sumTax, totalsByCategory } from '@/lib/analytics'
import { getAlerts, getCurrentUser, getExpenses, REFERENCE_DATE } from '@/lib/data'
import { formatCurrency } from '@/lib/format'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const [user, expenses, alerts] = await Promise.all([getCurrentUser(), getExpenses(), getAlerts()])
  const thisMonth = expensesInMonth(expenses, REFERENCE_DATE)
  const lastMonth = expensesInMonth(expenses, REFERENCE_DATE, 1)
  const spent = sumAmount(thisMonth)
  const pending = expenses.filter((e) => e.status !== 'verified').length
  const firstName = user.name.split(' ')[0]

  return (
    <>
      <PageHeader
        title={`Good afternoon, ${firstName}`}
        description="Here is how your business spending looks this month."
        actions={
          <Link href="/scan" className={buttonVariants({ size: 'lg', className: 'h-10 px-4 sm:hidden' })}>
            <ScanLine data-icon="inline-start" />
            Scan receipt
          </Link>
        }
      />

      <section aria-label="Key metrics" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Spent this month"
          value={formatCurrency(spent, user.currency)}
          change={percentChange(spent, sumAmount(lastMonth))}
          hint="vs last month"
        />
        <StatCard
          label="Budget remaining"
          value={formatCurrency(Math.max(user.monthlyBudget - spent, 0), user.currency)}
          hint={`of ${formatCurrency(user.monthlyBudget, user.currency)}`}
        />
        <StatCard label="Tax captured" value={formatCurrency(sumTax(thisMonth), user.currency)} hint="deductible records" />
        <StatCard label="Needs review" value={String(pending)} hint="pending or flagged" />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending trend</CardTitle>
            <CardAction>
              <Link href="/analytics" className="text-sm font-medium text-primary hover:underline">
                View analytics
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <SpendingTrendChart data={monthlyTotals(expenses, REFERENCE_DATE)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>This month by category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryChart data={totalsByCategory(thisMonth)} height={180} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent expenses</CardTitle>
            <CardAction>
              <Link href="/expenses" className="text-sm font-medium text-primary hover:underline">
                See all
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="-mx-3 px-3">
            <ul>
              {expenses.slice(0, 5).map((e) => (
                <li key={e.id}>
                  <ExpenseCard expense={e} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardAction>
              <Link href="/alerts" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {alerts
              .filter((a) => !a.read)
              .slice(0, 3)
              .map((a) => (
                <AlertCard key={a.id} alert={a} now={REFERENCE_DATE} compact />
              ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
