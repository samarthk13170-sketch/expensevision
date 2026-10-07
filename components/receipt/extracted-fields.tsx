'use client'

import { useId } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CATEGORY_LIST } from '@/lib/categories'
import { formatCurrency } from '@/lib/format'
import type { CategoryId, ParsedReceipt, PaymentMethod } from '@/lib/types'
import { cn } from '@/lib/utils'

export interface ExpenseDraft extends ParsedReceipt {
  paymentMethod: PaymentMethod
  notes: string
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'card', label: 'Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank transfer' },
]

const selectClass =
  'h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function ExtractedFields({
  draft,
  onChange,
}: {
  draft: ExpenseDraft
  onChange: (next: ExpenseDraft) => void
}) {
  const id = useId()
  const set = <K extends keyof ExpenseDraft>(key: K, value: ExpenseDraft[K]) => onChange({ ...draft, [key]: value })
  const pct = Math.round(draft.confidence * 100)
  const level = pct >= 85 ? 'high' : pct >= 65 ? 'medium' : 'low'

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl bg-muted/60 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Extraction confidence</span>
          <span
            className={cn(
              'font-mono font-semibold tabular-nums',
              level === 'high' && 'text-primary',
              level === 'medium' && 'text-[oklch(0.5_0.12_70)]',
              level === 'low' && 'text-destructive',
            )}
          >
            {pct}%
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
          <div
            className={cn(
              'h-full rounded-full',
              level === 'high' && 'bg-primary',
              level === 'medium' && 'bg-warning',
              level === 'low' && 'bg-destructive',
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        {level !== 'high' && (
          <p className="mt-2 text-xs text-muted-foreground">Some fields may be inaccurate — please double-check before saving.</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor={`${id}-merchant`}>Merchant</Label>
          <Input id={`${id}-merchant`} value={draft.merchant} onChange={(e) => set('merchant', e.target.value)} className="h-9" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-total`}>Total ({draft.currency})</Label>
          <Input
            id={`${id}-total`}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={draft.total}
            onChange={(e) => set('total', Number(e.target.value))}
            className="h-9 font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-tax`}>Tax</Label>
          <Input
            id={`${id}-tax`}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={draft.tax}
            onChange={(e) => set('tax', Number(e.target.value))}
            className="h-9 font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-date`}>Date</Label>
          <Input id={`${id}-date`} type="date" value={draft.date} onChange={(e) => set('date', e.target.value)} className="h-9" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-category`}>Category</Label>
          <select
            id={`${id}-category`}
            value={draft.category}
            onChange={(e) => set('category', e.target.value as CategoryId)}
            className={selectClass}
          >
            {CATEGORY_LIST.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor={`${id}-payment`}>Payment method</Label>
          <select
            id={`${id}-payment`}
            value={draft.paymentMethod}
            onChange={(e) => set('paymentMethod', e.target.value as PaymentMethod)}
            className={selectClass}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor={`${id}-notes`}>Notes</Label>
          <Textarea
            id={`${id}-notes`}
            value={draft.notes}
            placeholder="Client, project or purpose of this expense"
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>
      </div>

      {draft.items.length > 0 && (
        <div>
          <h3 className="text-sm font-medium">Line items</h3>
          <ul className="mt-2 divide-y rounded-xl border">
            {draft.items.map((item, i) => (
              <li key={`${item.description}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                <span className="truncate">
                  {item.quantity > 1 && <span className="text-muted-foreground">{item.quantity}× </span>}
                  {item.description}
                </span>
                <span className="font-mono tabular-nums">{formatCurrency(item.amount, draft.currency)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {draft.rawText && (
        <details className="rounded-xl border px-3 py-2 text-sm">
          <summary className="cursor-pointer font-medium">Raw OCR text</summary>
          <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-mono text-xs text-muted-foreground">{draft.rawText}</pre>
        </details>
      )}
    </div>
  )
}
