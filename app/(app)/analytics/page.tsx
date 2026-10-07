import type { Metadata } from 'next'
import { CategoryCard } from '@/components/category-card'
import { CategoryChart } from '@/components/charts/category-chart'
import { SpendingTrendChart } from '@/components/charts/spending-trend-chart'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { expensesInMonth, monthlyTotals, sumAmount, sumTax, totalsByCategory } from '@/lib/analytics'
import { getCurrentUser, getExpenses, REFERENCE_DATE } from '@/lib/data'
import { formatCurrency } from '@/lib/format'

export const metadata: Metadata = { title: 'Analytics' }

export default async function AnalyticsPage() {
  const [user, expenses] = await Promise.all([getCurrentUser(), getExpenses()])
  const months = monthlyTotals(expenses, REFERENCE_DATE)
  const avg = months.reduce((s, m) => s + m.total, 0) / months.length
  const thisMonthCategories = totalsByCategory(expensesInMonth(expenses, REFERENCE_DATE))
  const automated = expenses.filter((e) => e.source !== 'manual').length

  return (
    <>
      <PageHeader title="Analytics" description="Six-month view of where your money goes, against your budgets." />

      <section aria-label="Summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="6-month total" value={formatCurrency(sumAmount(expenses), user.currency)} />
        <StatCard label="Monthly average" value={formatCurrency(avg, user.currency)} />
        <StatCard label="Total tax recorded" value={formatCurrency(sumTax(expenses), user.currency)} />
        <StatCard label="Auto-extracted" value={`${Math.round((automated / expenses.length) * 100)}%`} hint="via OCR or AI" />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly spending vs budget</CardTitle>
            <CardDescription>Dashed line shows your {formatCurrency(user.monthlyBudget, user.currency)} monthly budget.</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingTrendChart data={months} variant="bar" budget={user.monthlyBudget} height={300} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>All-time categories</CardTitle>
            <CardDescription>Share of total spend</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart data={totalsByCategory(expenses)} height={200} />
          </CardContent>
        </Card>
      </div>

      <section className="mt-8" aria-labelledby="budgets-heading">
        <h2 id="budgets-heading" className="text-lg font-semibold">
          Category budgets this month
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {thisMonthCategories.map((c) => (
            <CategoryCard
              key={c.category}
              category={c.category}
              total={c.total}
              count={c.count}
              budget={user.categoryBudgets[c.category]}
              currency={user.currency}
            />
          ))}
        </div>
      </section>
    </>
  )
}
