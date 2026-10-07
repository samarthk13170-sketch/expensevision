'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, FileImage, ImageUp, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SAMPLE_RECEIPT = '/images/receipt-hero.png'

export function ReceiptUpload({ onFileSelected }: { onFileSelected: (file: File) => void }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [dragging, setDragging] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), [])

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (file && file.type.startsWith('image/')) onFileSelected(file)
  }

  async function startCamera() {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setCameraOn(true)
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream
      })
    } catch {
      setCameraError('Camera unavailable. Allow camera access or upload a photo instead.')
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  function capture() {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    canvas.toBlob(
      (blob) => {
        if (!blob) return
        stopCamera()
        onFileSelected(new File([blob], `receipt-${Date.now()}.jpg`, { type: 'image/jpeg' }))
      },
      'image/jpeg',
      0.92,
    )
  }

  async function useSample() {
    const res = await fetch(SAMPLE_RECEIPT)
    const blob = await res.blob()
    onFileSelected(new File([blob], 'sample-receipt.png', { type: blob.type }))
  }

  if (cameraOn) {
    return (
      <div className="flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-xl bg-foreground">
          <video ref={videoRef} autoPlay playsInline muted className="aspect-[3/4] w-full object-cover sm:aspect-video" />
          <div className="pointer-events-none absolute inset-6 rounded-lg border-2 border-dashed border-white/60" />
        </div>
        <div className="flex gap-2">
          <Button size="lg" className="flex-1" onClick={capture}>
            <Camera data-icon="inline-start" />
            Capture receipt
          </Button>
          <Button size="lg" variant="outline" onClick={stopCamera}>
            <X data-icon="inline-start" />
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
          dragging ? 'border-primary bg-accent' : 'border-border bg-muted/40',
        )}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <ImageUp className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="font-medium">Drop a receipt image here</p>
          <p className="mt-1 text-sm text-muted-foreground">PNG, JPG or HEIC · photos of paper receipts work best</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button size="lg" onClick={() => fileInput.current?.click()}>
            <FileImage data-icon="inline-start" />
            Upload image
          </Button>
          <Button size="lg" variant="outline" onClick={startCamera}>
            <Camera data-icon="inline-start" />
            Use camera
          </Button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          aria-label="Upload receipt image"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {cameraError && (
        <p role="alert" className="text-sm text-destructive">
          {cameraError}
        </p>
      )}
      <button
        type="button"
        onClick={useSample}
        className="inline-flex items-center gap-1.5 self-center text-sm font-medium text-primary hover:underline"
      >
        <Sparkles className="size-4" aria-hidden="true" />
        Try with a sample receipt
      </button>
    </div>
  )
}
