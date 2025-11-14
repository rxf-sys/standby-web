import { create } from 'zustand'
import type { CalendarEvent, EventFilter, EventCategory } from '@/lib/types/calendar'

interface CalendarStore {
  events: CalendarEvent[]
  selectedEvent: CalendarEvent | null
  selectedDate: Date
  filters: EventFilter
  viewMode: 'month' | 'week' | 'day'

  // Events
  setEvents: (events: CalendarEvent[]) => void
  addEvent: (event: CalendarEvent) => void
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void
  removeEvent: (id: string) => void
  setSelectedEvent: (event: CalendarEvent | null) => void

  // Date navigation
  setSelectedDate: (date: Date) => void
  goToToday: () => void
  goToNextMonth: () => void
  goToPrevMonth: () => void

  // Filters
  setFilters: (filters: EventFilter) => void
  resetFilters: () => void
  toggleCategoryFilter: (category: EventCategory) => void

  // View mode
  setViewMode: (mode: 'month' | 'week' | 'day') => void
}

const initialFilters: EventFilter = {
  categories: [],
  startDate: undefined,
  endDate: undefined,
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  events: [],
  selectedEvent: null,
  selectedDate: new Date(),
  filters: initialFilters,
  viewMode: 'month',

  // Events
  setEvents: (events) => set({ events }),

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ),
    })),

  updateEvent: (id, eventUpdate) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...eventUpdate } : e
      ),
    })),

  removeEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
      selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent,
    })),

  setSelectedEvent: (event) => set({ selectedEvent: event }),

  // Date navigation
  setSelectedDate: (date) => set({ selectedDate: date }),

  goToToday: () => set({ selectedDate: new Date() }),

  goToNextMonth: () =>
    set((state) => {
      const newDate = new Date(state.selectedDate)
      newDate.setMonth(newDate.getMonth() + 1)
      return { selectedDate: newDate }
    }),

  goToPrevMonth: () =>
    set((state) => {
      const newDate = new Date(state.selectedDate)
      newDate.setMonth(newDate.getMonth() - 1)
      return { selectedDate: newDate }
    }),

  // Filters
  setFilters: (filters) => set({ filters }),

  resetFilters: () => set({ filters: initialFilters }),

  toggleCategoryFilter: (category) =>
    set((state) => {
      const categories = state.filters.categories || []
      const updated = categories.includes(category)
        ? categories.filter((c) => c !== category)
        : [...categories, category]

      return {
        filters: {
          ...state.filters,
          categories: updated,
        },
      }
    }),

  // View mode
  setViewMode: (mode) => set({ viewMode: mode }),
}))
