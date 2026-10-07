import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReceiptPreviewProps {
  src: string
  fileName?: string
  scanning?: boolean
  progress?: number
  status?: string
  onReset?: () => void
}

export function ReceiptPreview({ src, fileName, scanning = false, progress = 0, status, onReset }: ReceiptPreviewProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-xl border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element -- local object URLs are not supported by next/image */}
        <img src={src} alt={fileName ? `Receipt preview: ${fileName}` : 'Receipt preview'} className="max-h-[520px] w-full object-contain" />
        {scanning && (
          <div className="absolute inset-0 bg-foreground/10">
            <div
              className="absolute inset-x-0 h-0.5 bg-primary shadow-[0_0_16px_4px] shadow-primary/50 transition-[top] duration-300"
              style={{ top: `${Math.max(4, Math.round(progress * 100))}%` }}
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1" aria-live="polite">
          <p className="truncate text-sm font-medium">{fileName ?? 'Receipt image'}</p>
          {scanning ? (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
              <span className="text-xs text-muted-foreground capitalize">{status ?? 'Scanning'}</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Ready</p>
          )}
        </div>
        {onReset && (
          <Button variant="outline" onClick={onReset} disabled={scanning}>
            <RotateCcw data-icon="inline-start" />
            Retake
          </Button>
        )}
      </div>
    </div>
  )
}
