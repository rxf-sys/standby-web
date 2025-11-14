import {
  GraduationCap,
  Briefcase,
  User,
  Heart,
  Users,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react'
import type { EventCategory, ReminderType } from '@/lib/types/calendar'

export interface CategoryInfo {
  value: EventCategory
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
}

export const EVENT_CATEGORIES: Record<EventCategory, CategoryInfo> = {
  uni: {
    value: 'uni',
    label: 'Uni',
    icon: GraduationCap,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  work: {
    value: 'work',
    label: 'Arbeit',
    icon: Briefcase,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  personal: {
    value: 'personal',
    label: 'Privat',
    icon: User,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  health: {
    value: 'health',
    label: 'Gesundheit',
    icon: Heart,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  social: {
    value: 'social',
    label: 'Sozial',
    icon: Users,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  other: {
    value: 'other',
    label: 'Sonstiges',
    icon: MoreHorizontal,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
  },
}

export interface ReminderInfo {
  value: ReminderType
  label: string
}

export const REMINDER_OPTIONS: ReminderInfo[] = [
  { value: 'none', label: 'Keine Erinnerung' },
  { value: '5min', label: '5 Minuten vorher' },
  { value: '15min', label: '15 Minuten vorher' },
  { value: '30min', label: '30 Minuten vorher' },
  { value: '1hour', label: '1 Stunde vorher' },
  { value: '1day', label: '1 Tag vorher' },
]

export function getCategoryInfo(category: EventCategory): CategoryInfo {
  return EVENT_CATEGORIES[category] || EVENT_CATEGORIES.other
}

export const EVENT_CATEGORY_OPTIONS = Object.values(EVENT_CATEGORIES)
