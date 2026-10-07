export type CategoryId =
  | 'food'
  | 'travel'
  | 'office'
  | 'software'
  | 'utilities'
  | 'marketing'
  | 'other'

export type ExpenseStatus = 'verified' | 'pending' | 'flagged'

export type ExtractionSource = 'tesseract' | 'gemini' | 'manual'

export type PaymentMethod = 'card' | 'cash' | 'upi' | 'bank_transfer'

export interface LineItem {
  description: string
  quantity: number
  amount: number
}

export interface Expense {
  id: string
  userId: string
  merchant: string
  amount: number
  taxAmount: number
  currency: string
  date: string
  category: CategoryId
  paymentMethod: PaymentMethod
  status: ExpenseStatus
  source: ExtractionSource
  confidence: number
  notes?: string
  receiptUrl?: string | null
  items: LineItem[]
  createdAt: string
}

export type AlertSeverity = 'info' | 'warning' | 'critical'

export type AlertType = 'budget' | 'duplicate' | 'anomaly' | 'low_confidence' | 'reminder'

export interface ExpenseAlert {
  id: string
  userId: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  expenseId?: string
  read: boolean
  createdAt: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  businessName: string
  occupation: string
  currency: string
  monthlyBudget: number
  categoryBudgets: Partial<Record<CategoryId, number>>
  joinedAt: string
}

export type AuditAction =
  | 'expense.created'
  | 'expense.updated'
  | 'expense.deleted'
  | 'receipt.scanned'
  | 'user.login'
  | 'profile.updated'

export interface AuditLog {
  id: string
  userId: string
  action: AuditAction
  entityType: 'expense' | 'receipt' | 'user' | 'profile'
  entityId: string
  detail: string
  createdAt: string
}

export interface ParsedReceipt {
  merchant: string
  date: string
  total: number
  tax: number
  currency: string
  category: CategoryId
  items: LineItem[]
  confidence: number
  rawText: string
  source: ExtractionSource
}
