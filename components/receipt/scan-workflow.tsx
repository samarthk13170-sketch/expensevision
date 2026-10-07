'use client'

import { useEffect, useState } from 'react'
import { Check, Cpu, Save, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExtractedFields, type ExpenseDraft } from '@/components/receipt/extracted-fields'
import { ReceiptPreview } from '@/components/receipt/receipt-preview'
import { ReceiptUpload } from '@/components/receipt/receipt-upload'
import { extractWithTesseract } from '@/lib/ocr'
import { cn } from '@/lib/utils'

type Engine = 'tesseract' | 'gemini'
type Phase = 'idle' | 'scanning' | 'review' | 'error'

const STEPS = ['Capture', 'Extract', 'Review'] as const

export function ScanWorkflow() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [engine, setEngine] = useState<Engine>('tesseract')
  const [phase, setPhase] = useState<Phase>('idle')
  const [progress, setProgress] = useState({ status: 'Preparing', progress: 0 })
  const [draft, setDraft] = useState<ExpenseDraft | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  async function runExtraction(target: File) {
    setPhase('scanning')
    setSaveMessage(null)
    setProgress({ status: 'Loading OCR engine', progress: 0.02 })
    try {
      const parsed = await extractWithTesseract(target, (p) =>
        setProgress({ status: p.status, progress: p.status === 'recognizing text' ? p.progress : 0.05 }),
      )
      setDraft({ ...parsed, paymentMethod: 'card', notes: '' })
      setPhase('review')
    } catch (err) {
      console.error('[v0] OCR failed:', err)
      setPhase('error')
    }
  }

  function handleFile(next: File) {
    setFile(next)
    setDraft(null)
    runExtraction(next)
  }

  function reset() {
    setFile(null)
    setPreviewUrl(null)
    setDraft(null)
    setPhase('idle')
    setSaveMessage(null)
  }

  const stepIndex = phase === 'idle' ? 0 : phase === 'review' ? 2 : 1

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex items-center gap-2 text-sm" aria-label="Scan progress">
        {STEPS.map((step, i) => (
          <li key={step} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                i < stepIndex && 'bg-primary text-primary-foreground',
                i === stepIndex && 'bg-accent text-accent-foreground ring-2 ring-primary',
                i > stepIndex && 'bg-muted text-muted-foreground',
              )}
            >
              {i < stepIndex ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
            </span>
            <span className={cn('font-medium', i > stepIndex && 'text-muted-foreground')}>{step}</span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receipt</CardTitle>
            <CardDescription>Capture with your camera or upload a photo.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <fieldset className="grid grid-cols-2 gap-2" disabled={phase === 'scanning'}>
              <legend className="sr-only">Extraction engine</legend>
              <EngineOption
                active={engine === 'tesseract'}
                onSelect={() => setEngine('tesseract')}
                icon={<Cpu className="size-4" aria-hidden="true" />}
                title="Tesseract OCR"
                subtitle="On-device · private"
              />
              <EngineOption
                active={engine === 'gemini'}
                onSelect={() => setEngine('gemini')}
                icon={<Sparkles className="size-4" aria-hidden="true" />}
                title="Gemini Vision"
                subtitle="AI · connecting next"
                disabled
              />
            </fieldset>

            {previewUrl && file ? (
              <ReceiptPreview
                src={previewUrl}
                fileName={file.name}
                scanning={phase === 'scanning'}
                progress={progress.progress}
                status={progress.status}
                onReset={reset}
              />
            ) : (
              <ReceiptUpload onFileSelected={handleFile} />
            )}

            {phase === 'error' && file && (
              <div role="alert" className="flex items-center justify-between gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                Text extraction failed. Try a clearer, well-lit photo.
                <Button variant="outline" onClick={() => runExtraction(file)}>
                  Retry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extracted details</CardTitle>
            <CardDescription>Review and correct fields before saving the expense.</CardDescription>
          </CardHeader>
          <CardContent>
            {draft ? (
              <div className="flex flex-col gap-5">
                <ExtractedFields draft={draft} onChange={setDraft} />
                <Button size="lg" className="h-10" onClick={() => setSaveMessage('Expense validated. Saving will persist to PostgreSQL once the database is connected.')}>
                  <Save data-icon="inline-start" />
                  Save expense
                </Button>
                {saveMessage && (
                  <p role="status" className="rounded-lg bg-accent p-3 text-sm text-accent-foreground">
                    {saveMessage}
                  </p>
                )}
              </div>
            ) : (
              <EmptyExtraction scanning={phase === 'scanning'} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function EngineOption({
  active,
  onSelect,
  icon,
  title,
  subtitle,
  disabled,
}: {
  active: boolean
  onSelect: () => void
  icon: React.ReactNode
  title: string
  subtitle: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        'flex items-start gap-2 rounded-lg border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        active ? 'border-primary bg-accent' : 'hover:bg-muted',
      )}
    >
      <span className={cn('mt-0.5', active ? 'text-primary' : 'text-muted-foreground')}>{icon}</span>
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted-foreground">{subtitle}</span>
      </span>
    </button>
  )
}

function EmptyExtraction({ scanning }: { scanning: boolean }) {
  return (
    <div className="flex flex-col gap-3" aria-busy={scanning}>
      {['Merchant', 'Total', 'Date', 'Category'].map((label) => (
        <div key={label} className="flex flex-col gap-1.5">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className={cn('h-9 rounded-lg bg-muted', scanning && 'animate-pulse')} />
        </div>
      ))}
      <p className="pt-2 text-center text-sm text-muted-foreground">
        {scanning ? 'Reading your receipt…' : 'Fields will appear here after scanning.'}
      </p>
    </div>
  )
}
