import Image from 'next/image'
import { Logo } from '@/components/logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 md:px-12">
        <Logo />
        <main className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
      <aside className="relative hidden flex-col justify-end overflow-hidden bg-sidebar p-12 lg:flex">
        <Image src="/images/receipt-hero.png" alt="" fill className="object-cover opacity-30" sizes="50vw" priority />
        <div className="relative">
          <blockquote className="text-2xl font-medium leading-snug text-balance text-sidebar-accent-foreground">
            {'"I used to lose a shoebox of receipts every tax season. Now I snap them and I am done."'}
          </blockquote>
          <p className="mt-4 text-sm text-sidebar-foreground">Priya S. · Freelance photographer</p>
        </div>
      </aside>
    </div>
  )
}
