import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BarChart3, Bell, Camera, FileSearch, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/logo'
import { buttonVariants } from '@/components/ui/button'

const FEATURES = [
  { icon: Camera, title: 'Capture anywhere', body: 'Snap a receipt with your phone camera or upload a photo from your files.' },
  { icon: FileSearch, title: 'OCR + AI extraction', body: 'Tesseract reads the text on-device; Gemini Vision understands messy layouts.' },
  { icon: BarChart3, title: 'Live analytics', body: 'See monthly trends, category splits and budget usage the moment you save.' },
  { icon: Bell, title: 'Smart alerts', body: 'Catch duplicate receipts, low-confidence scans and budget overruns early.' },
  { icon: ShieldCheck, title: 'Audit-ready', body: 'Every create, edit and scan is logged so your records hold up at tax time.' },
]

const STEPS = [
  { n: '01', title: 'Scan', body: 'Point your camera at any paper receipt.' },
  { n: '02', title: 'Extract', body: 'Merchant, total, tax, date and items are parsed for you.' },
  { n: '03', title: 'Review', body: 'Confirm or correct fields with confidence scores.' },
  { n: '04', title: 'Track', body: 'Expenses flow straight into dashboards and alerts.' },
]

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Logo />
        <nav aria-label="Account" className="flex items-center gap-2">
          <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'lg', className: 'px-3' })}>
            Sign in
          </Link>
          <Link href="/register" className={buttonVariants({ size: 'lg', className: 'px-3' })}>
            Get started
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 md:px-8 md:py-20 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              For freelancers and small businesses
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              From paper to <span className="text-primary">precision.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground text-pretty">
              Expense Vision turns crumpled receipts into clean, categorized expense records — with OCR, AI extraction and
              analytics in one flow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/scan" className={buttonVariants({ size: 'lg', className: 'h-11 px-5 text-base' })}>
                Scan your first receipt
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link href="/dashboard" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 px-5 text-base' })}>
                View demo dashboard
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border bg-muted">
              <Image src="/images/receipt-hero.png" alt="A paper receipt from Blue Bottle Coffee" fill priority className="object-cover" sizes="(min-width: 1024px) 448px, 100vw" />
            </div>
            <div className="absolute -bottom-6 left-4 right-4 rounded-xl border bg-card p-4 shadow-lg sm:-left-8 sm:right-auto sm:w-72">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Extracted · Gemini Vision</span>
                <span className="font-mono text-primary">97%</span>
              </div>
              <p className="mt-2 font-medium">Blue Bottle Coffee</p>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Food & Dining · Oct 6</span>
                <span className="font-mono text-lg font-semibold tabular-nums">$18.75</span>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="flow-heading" className="border-y bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
            <h2 id="flow-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
              One continuous flow
            </h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <li key={s.n} className="border-t-2 border-primary pt-4">
                  <span className="font-mono text-sm text-primary">{s.n}</span>
                  <h3 className="mt-1 font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="features-heading" className="mx-auto max-w-6xl px-4 py-16 md:px-8">
          <h2 id="features-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
            Everything your books need
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <li key={f.title} className="rounded-xl border bg-card p-5">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <f.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground text-pretty">{f.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between md:px-8">
          <span>Expense Vision — From Paper to Precision</span>
          <span>Built with React, Tesseract.js, Chart.js & PostgreSQL</span>
        </div>
      </footer>
    </div>
  )
}
