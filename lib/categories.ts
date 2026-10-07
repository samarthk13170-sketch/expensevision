import {
  Briefcase,
  Laptop,
  Megaphone,
  Package,
  Plane,
  UtensilsCrossed,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { CategoryId } from './types'

export interface CategoryMeta {
  id: CategoryId
  label: string
  icon: LucideIcon
  color: string
  keywords: string[]
}

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  food: {
    id: 'food',
    label: 'Food & Dining',
    icon: UtensilsCrossed,
    color: '#0f9d76',
    keywords: ['restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'food', 'kitchen', 'bistro', 'starbucks', 'dine', 'bakery', 'grill'],
  },
  travel: {
    id: 'travel',
    label: 'Travel',
    icon: Plane,
    color: '#2f3e5c',
    keywords: ['uber', 'lyft', 'airline', 'air', 'hotel', 'taxi', 'fuel', 'gas', 'petrol', 'parking', 'train', 'rail', 'inn'],
  },
  office: {
    id: 'office',
    label: 'Office Supplies',
    icon: Briefcase,
    color: '#e0a526',
    keywords: ['office', 'staples', 'paper', 'stationery', 'printer', 'ink', 'depot', 'supplies'],
  },
  software: {
    id: 'software',
    label: 'Software',
    icon: Laptop,
    color: '#3b8fd1',
    keywords: ['software', 'subscription', 'cloud', 'saas', 'adobe', 'figma', 'github', 'notion', 'license', 'hosting'],
  },
  utilities: {
    id: 'utilities',
    label: 'Utilities',
    icon: Zap,
    color: '#8b5cf6',
    keywords: ['electric', 'internet', 'broadband', 'phone', 'mobile', 'water', 'utility', 'telecom', 'wifi'],
  },
  marketing: {
    id: 'marketing',
    label: 'Marketing',
    icon: Megaphone,
    color: '#e5484d',
    keywords: ['ads', 'advertising', 'marketing', 'print', 'promo', 'campaign', 'media'],
  },
  other: {
    id: 'other',
    label: 'Other',
    icon: Package,
    color: '#94a3b8',
    keywords: [],
  },
}

export const CATEGORY_LIST = Object.values(CATEGORIES)

export function getCategory(id: CategoryId): CategoryMeta {
  return CATEGORIES[id] ?? CATEGORIES.other
}
