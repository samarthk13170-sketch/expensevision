import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ReceiptText } from 'lucide-react'
import { AuditTimeline } from '@/components/audit-timeline'
import { CategoryIcon } from '@/components/category-icon'
import { SourceBadge, StatusBadge } from '@/components/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategory } from '@/lib/categories'
import { getAuditLogs, getExpenseById } from '@/lib/data'
import { formatCurrency, formatDate } from '@/lib/format'

const PAYMENT_LABELS = { card: 'Card', cash: 'Cash', upi: 'UPI', bank_transfer: 'Bank transfer' } as const

export async function generateMetadata({ params }: PageProps<'/expenses/[id]'>): Promise<Metadata> {
  const { id } = await params
  const expense = await getExpenseById(id)
  return { title: expense ? expense.merchant : 'Expense not found' }
}

export default async function ExpenseDetailPage({ params }: PageProps<'/expenses/[id]'>) {
  const { id } = await params
  const [expense, logs] = await Promise.all([getExpenseById(id), getAuditLogs(id)])
  if (!expense) notFound()

  const subtotal = expense.amount - expense.taxAmount
  const fields = [
    { label: 'Date', value: formatDate(expense.date) },
    { label: 'Category', value: getCategory(expense.category).label },
    { label: 'Payment', value: PAYMENT_LABELS[expense.paymentMethod] },
    { label: 'Confidence', value: `${Math.round(expense.confidence * 100)}%` },
  ]

  return (
    <>
      <Link href="/expenses" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to expenses
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <CategoryIcon category={expense.category} className="size-12" />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{expense.merchant}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StatusBadge status={expense.status} />
            <SourceBadge source={expense.source} />
          </div>
        </div>
        <p className="font-mono text-3xl font-semibold tracking-tight tabular-nums">
          {formatCurrency(expense.amount, expense.currency)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {fields.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs text-muted-foreground">{f.label}</dt>
                    <dd className="mt-0.5 text-sm font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
              {expense.notes && (
                <div>
                  <h3 className="text-xs text-muted-foreground">Notes</h3>
                  <p className="mt-0.5 text-sm">{expense.notes}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium">Line items</h3>
                <ul className="mt-2 divide-y rounded-xl border text-sm">
                  {expense.items.map((item, i) => (
                    <li key={i} className="flex justify-between gap-3 px-3 py-2.5">
                      <span>
                        {item.quantity > 1 && <span className="text-muted-foreground">{item.quantity}× </span>}
                        {item.description}
                      </span>
                      <span className="font-mono tabular-nums">{formatCurrency(item.amount, expense.currency)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between px-3 py-2.5 text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">{formatCurrency(subtotal, expense.currency)}</span>
                  </li>
                  <li className="flex justify-between px-3 py-2.5 text-muted-foreground">
                    <span>Tax</span>
                    <span className="font-mono tabular-nums">{formatCurrency(expense.taxAmount, expense.currency)}</span>
                  </li>
                  <li className="flex justify-between px-3 py-2.5 font-semibold">
                    <span>Total</span>
                    <span className="font-mono tabular-nums">{formatCurrency(expense.amount, expense.currency)}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit log</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditTimeline logs={logs} />
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            {expense.receiptUrl ? (
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border bg-muted">
                <Image src={expense.receiptUrl} alt={`Receipt from ${expense.merchant}`} fill className="object-cover" sizes="(min-width: 1024px) 400px, 100vw" />
              </div>
            ) : (
              <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/40 text-center text-sm text-muted-foreground">
                <ReceiptText className="size-8" aria-hidden="true" />
                Receipt image will appear here once storage is connected.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
