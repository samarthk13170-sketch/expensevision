'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [pending, setPending] = useState(false)
  const isRegister = mode === 'register'

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        setPending(true)
      }}
    >
      {isRegister && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" autoComplete="name" required className="h-10" />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@business.com" required className="h-10" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          minLength={8}
          required
          className="h-10"
        />
        {isRegister && <p className="text-xs text-muted-foreground">At least 8 characters.</p>}
      </div>
      <Button type="submit" size="lg" className="h-10">
        {isRegister ? 'Create account' : 'Sign in'}
      </Button>
      {pending && (
        <div role="status" className="rounded-lg bg-accent p-3 text-sm text-accent-foreground">
          Secure authentication activates once PostgreSQL is connected.{' '}
          <Link href="/dashboard" className="font-medium underline">
            Continue to the demo dashboard
          </Link>
        </div>
      )}
    </form>
  )
}
