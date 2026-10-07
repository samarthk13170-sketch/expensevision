import type { Metadata } from 'next'
import { AlertList } from '@/components/alert-list'
import { PageHeader } from '@/components/page-header'
import { getAlerts, REFERENCE_DATE } from '@/lib/data'

export const metadata: Metadata = { title: 'Alerts' }

export default async function AlertsPage() {
  const alerts = await getAlerts()

  return (
    <>
      <PageHeader
        title="Alerts"
        description="Duplicate receipts, low-confidence scans, budget limits and unusual spending."
      />
      <AlertList alerts={alerts} now={REFERENCE_DATE.toISOString()} />
    </>
  )
}
