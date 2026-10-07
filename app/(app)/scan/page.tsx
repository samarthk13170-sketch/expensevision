import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ScanWorkflow } from '@/components/receipt/scan-workflow'

export const metadata: Metadata = { title: 'Scan Receipt' }

export default function ScanPage() {
  return (
    <>
      <PageHeader
        title="Scan a receipt"
        description="Capture a paper receipt and we will extract the merchant, total, tax, date and line items for you."
      />
      <ScanWorkflow />
    </>
  )
}
