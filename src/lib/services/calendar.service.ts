import { supabase } from './supabase'
import type { CalendarEvent, EventFilter } from '@/lib/types/calendar'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns'

export const calendarService = {
  // Get all events for a user
  async getEvents(userId: string, filter?: EventFilter) {
    let query = supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true })

    // Apply filters
    if (filter?.categories && filter.categories.length > 0) {
      query = query.in('category', filter.categories)
    }

    if (filter?.startDate) {
      query = query.gte('start_date', filter.startDate)
    }

    if (filter?.endDate) {
      query = query.lte('start_date', filter.endDate)
    }

    const { data, error } = await query

    if (error) throw error

    return (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      title: item.title,
      description: item.description,
      category: item.category,
      startDate: item.start_date,
      endDate: item.end_date,
      location: item.location,
      reminder: item.reminder,
      isAllDay: item.is_all_day,
      recurring: item.recurring,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })) as CalendarEvent[]
  },

  // Get events for a specific month
  async getMonthEvents(userId: string, date: Date) {
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)

    // Get week boundaries to include partial weeks
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    return this.getEvents(userId, {
      startDate: calendarStart.toISOString(),
      endDate: calendarEnd.toISOString(),
    })
  },

  // Get a single event by ID
  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      category: data.category,
      startDate: data.start_date,
      endDate: data.end_date,
      location: data.location,
      reminder: data.reminder,
      isAllDay: data.is_all_day,
      recurring: data.recurring,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as CalendarEvent
  },

  // Create a new event
  async createEvent(userId: string, event: Omit<CalendarEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        user_id: userId,
        title: event.title,
        description: event.description,
        category: event.category,
        start_date: event.startDate,
        end_date: event.endDate,
        location: event.location,
        reminder: event.reminder,
        is_all_day: event.isAllDay,
        recurring: event.recurring,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      category: data.category,
      startDate: data.start_date,
      endDate: data.end_date,
      location: data.location,
      reminder: data.reminder,
      isAllDay: data.is_all_day,
      recurring: data.recurring,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as CalendarEvent
  },

  // Update an event
  async updateEvent(id: string, event: Partial<Omit<CalendarEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) {
    const updateData: any = {}

    if (event.title !== undefined) updateData.title = event.title
    if (event.description !== undefined) updateData.description = event.description
    if (event.category !== undefined) updateData.category = event.category
    if (event.startDate !== undefined) updateData.start_date = event.startDate
    if (event.endDate !== undefined) updateData.end_date = event.endDate
    if (event.location !== undefined) updateData.location = event.location
    if (event.reminder !== undefined) updateData.reminder = event.reminder
    if (event.isAllDay !== undefined) updateData.is_all_day = event.isAllDay
    if (event.recurring !== undefined) updateData.recurring = event.recurring

    const { data, error } = await supabase
      .from('calendar_events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      category: data.category,
      startDate: data.start_date,
      endDate: data.end_date,
      location: data.location,
      reminder: data.reminder,
      isAllDay: data.is_all_day,
      recurring: data.recurring,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as CalendarEvent
  },

  // Delete an event
  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get upcoming events (next 7 days)
  async getUpcomingEvents(userId: string, days: number = 7) {
    const startDate = new Date().toISOString()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    return this.getEvents(userId, {
      startDate,
      endDate: endDate.toISOString(),
    })
  },
}
