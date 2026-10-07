'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { UserProfile } from '@/lib/types'

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const [message, setMessage] = useState<string | null>(null)

  const fields = [
    { name: 'name', label: 'Full name', value: profile.name, type: 'text', autoComplete: 'name' },
    { name: 'email', label: 'Email', value: profile.email, type: 'email', autoComplete: 'email' },
    { name: 'businessName', label: 'Business name', value: profile.businessName, type: 'text', autoComplete: 'organization' },
    { name: 'occupation', label: 'Occupation', value: profile.occupation, type: 'text', autoComplete: 'organization-title' },
    { name: 'monthlyBudget', label: `Monthly budget (${profile.currency})`, value: String(profile.monthlyBudget), type: 'number', autoComplete: 'off' },
  ]

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        setMessage('Changes validated. They will be saved to your PostgreSQL profile once the database is connected.')
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className="flex flex-col gap-1.5">
            <Label htmlFor={`profile-${f.name}`}>{f.label}</Label>
            <Input
              id={`profile-${f.name}`}
              name={f.name}
              type={f.type}
              defaultValue={f.value}
              autoComplete={f.autoComplete}
              required
              className="h-9"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" className="h-10 px-4">
          Save changes
        </Button>
        {message && (
          <p role="status" className="text-sm text-muted-foreground">
            {message}
          </p>
        )}
      </div>
    </form>
  )
}
