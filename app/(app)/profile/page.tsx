import type { Metadata } from 'next'
import { AuditTimeline } from '@/components/audit-timeline'
import { CategoryIcon } from '@/components/category-icon'
import { PageHeader } from '@/components/page-header'
import { ProfileForm } from '@/components/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategory } from '@/lib/categories'
import { getAuditLogs, getCurrentUser } from '@/lib/data'
import { formatCurrency, formatDate } from '@/lib/format'
import type { CategoryId } from '@/lib/types'

export const metadata: Metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const [user, logs] = await Promise.all([getCurrentUser(), getAuditLogs()])
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')

  return (
    <>
      <PageHeader title="Profile" description="Your account, business details, budgets and activity history." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                  {initials}
                </span>
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>
                    {user.occupation} · Member since {formatDate(user.joinedAt, { day: undefined })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={user} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category budgets</CardTitle>
              <CardDescription>Monthly limits used to trigger budget alerts.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 sm:grid-cols-2">
                {(Object.entries(user.categoryBudgets) as [CategoryId, number][]).map(([id, amount]) => (
                  <li key={id} className="flex items-center gap-3 rounded-xl border p-3">
                    <CategoryIcon category={id} className="size-9" />
                    <span className="flex-1 text-sm font-medium">{getCategory(id).label}</span>
                    <span className="font-mono text-sm tabular-nums">{formatCurrency(amount, user.currency)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Account activity</CardTitle>
            <CardDescription>Audit log of every change to your data.</CardDescription>
          </CardHeader>
          <CardContent>
            <AuditTimeline logs={logs} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
