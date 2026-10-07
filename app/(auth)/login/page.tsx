import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'

export const metadata: Metadata = { title: 'Sign in' }

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">Sign in to manage your receipts and expenses.</p>
      <AuthForm mode="login" />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Expense Vision?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </>
  )
}
