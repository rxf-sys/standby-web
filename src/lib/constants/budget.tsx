import {
  ShoppingCart,
  Car,
  Home,
  Film,
  Heart,
  GraduationCap,
  ShoppingBag,
  MoreHorizontal,
  Wallet,
  Briefcase,
  Gift,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type { ExpenseCategory, IncomeSource } from '@/lib/types/budget'

export interface CategoryInfo {
  value: string
  label: string
  icon: LucideIcon
  color: string
}

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, CategoryInfo> = {
  food: {
    value: 'food',
    label: 'Essen & Trinken',
    icon: ShoppingCart,
    color: 'text-orange-500',
  },
  transport: {
    value: 'transport',
    label: 'Transport',
    icon: Car,
    color: 'text-blue-500',
  },
  housing: {
    value: 'housing',
    label: 'Wohnen',
    icon: Home,
    color: 'text-green-500',
  },
  entertainment: {
    value: 'entertainment',
    label: 'Unterhaltung',
    icon: Film,
    color: 'text-purple-500',
  },
  health: {
    value: 'health',
    label: 'Gesundheit',
    icon: Heart,
    color: 'text-red-500',
  },
  education: {
    value: 'education',
    label: 'Bildung',
    icon: GraduationCap,
    color: 'text-indigo-500',
  },
  shopping: {
    value: 'shopping',
    label: 'Shopping',
    icon: ShoppingBag,
    color: 'text-pink-500',
  },
  other: {
    value: 'other',
    label: 'Sonstiges',
    icon: MoreHorizontal,
    color: 'text-gray-500',
  },
}

export const INCOME_SOURCES: Record<IncomeSource, CategoryInfo> = {
  salary: {
    value: 'salary',
    label: 'Gehalt',
    icon: Wallet,
    color: 'text-emerald-500',
  },
  freelance: {
    value: 'freelance',
    label: 'Freelance',
    icon: Briefcase,
    color: 'text-cyan-500',
  },
  allowance: {
    value: 'allowance',
    label: 'Taschengeld',
    icon: Gift,
    color: 'text-yellow-500',
  },
  investment: {
    value: 'investment',
    label: 'Investition',
    icon: TrendingUp,
    color: 'text-green-600',
  },
  other: {
    value: 'other',
    label: 'Sonstiges',
    icon: MoreHorizontal,
    color: 'text-gray-500',
  },
}

export function getCategoryInfo(category: string, type: 'income' | 'expense'): CategoryInfo {
  if (type === 'expense') {
    return EXPENSE_CATEGORIES[category as ExpenseCategory] || EXPENSE_CATEGORIES.other
  } else {
    return INCOME_SOURCES[category as IncomeSource] || INCOME_SOURCES.other
  }
}

export const EXPENSE_CATEGORY_OPTIONS = Object.values(EXPENSE_CATEGORIES)
export const INCOME_SOURCE_OPTIONS = Object.values(INCOME_SOURCES)
