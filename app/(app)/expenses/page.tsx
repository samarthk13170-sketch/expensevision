import type { Metadata } from 'next'
import Link from 'next/link'
import { ScanLine } from 'lucide-react'
import { ExpenseList } from '@/components/expense-list'
import { PageHeader } from '@/components/page-header'
import { buttonVariants } from '@/components/ui/button'
import { getExpenses } from '@/lib/data'

export const metadata: Metadata = { title: 'Expenses' }

export default async function ExpensesPage() {
  const expenses = await getExpenses()

  return (
    <>
      <PageHeader
        title="Expenses"
        description="Every receipt you have captured, verified and categorized."
        actions={
          <Link href="/scan" className={buttonVariants({ size: 'lg', className: 'h-10 px-4' })}>
            <ScanLine data-icon="inline-start" />
            Add expense
          </Link>
        }
      />
      <ExpenseList expenses={expenses} />
    </>
  )
}
