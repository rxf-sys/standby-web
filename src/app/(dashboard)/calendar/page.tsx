'use client'

import { useEffect, useState } from 'react'
import { format, startOfDay, isSameDay, isAfter, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { Calendar as CalendarIcon, Plus, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EventCard } from '@/components/calendar/event-card'
import { EventDialog } from '@/components/calendar/event-dialog'
import { useAuthStore, useCalendarStore } from '@/lib/store'
import { calendarService } from '@/lib/services/calendar.service'
import { EVENT_CATEGORY_OPTIONS } from '@/lib/constants/calendar'
import type { CalendarEvent, EventCategory } from '@/lib/types/calendar'

export default function CalendarPage() {
  const user = useAuthStore((state) => state.user)
  const { events, filters, setEvents, toggleCategoryFilter } = useCalendarStore()
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  const loadEvents = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const data = await calendarService.getEvents(user.id, filters)
      setEvents(data)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [user, filters, setEvents])

  const handleOpenDialog = (event?: CalendarEvent) => {
    setEditingEvent(event || null)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingEvent(null)
  }

  const handleDialogSuccess = () => {
    loadEvents()
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Möchtest du diesen Termin wirklich löschen?')) return

    try {
      await calendarService.deleteEvent(id)
      setEvents(events.filter((e) => e.id !== id))
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  // Group events by date
  const groupedEvents = events.reduce((groups, event) => {
    const date = format(parseISO(event.startDate), 'yyyy-MM-dd')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(event)
    return groups
  }, {} as Record<string, CalendarEvent[]>)

  const sortedDates = Object.keys(groupedEvents).sort()

  // Upcoming events (next 7 days)
  const today = startOfDay(new Date())
  const upcomingEvents = events.filter((event) => {
    const eventDate = startOfDay(parseISO(event.startDate))
    return isAfter(eventDate, today) || isSameDay(eventDate, today)
  }).slice(0, 5)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Lade Termine...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Kalender</h1>
          <p className="text-muted-foreground mt-2">
            {events.length} {events.length === 1 ? 'Termin' : 'Termine'}
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Termin hinzufügen
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar: Filters & Upcoming */}
        <aside className="space-y-6 lg:col-span-1">
          {/* Category Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Kategorien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {EVENT_CATEGORY_OPTIONS.map((category) => {
                const Icon = category.icon
                const isActive = filters.categories?.includes(category.value)

                return (
                  <Button
                    key={category.value}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => toggleCategoryFilter(category.value)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {category.label}
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Demnächst</CardTitle>
                <CardDescription>Die nächsten Termine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="text-sm">
                    <p className="font-medium line-clamp-1">{event.title}</p>
                    <p className="text-muted-foreground">
                      {format(parseISO(event.startDate), 'EEE, dd. MMM', { locale: de })}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>

        {/* Main: Event List */}
        <div className="lg:col-span-3">
          {events.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-2xl mb-2">Keine Termine</CardTitle>
                <CardDescription className="text-center max-w-md mb-6">
                  Du hast noch keine Termine erstellt. Füge deinen ersten Termin hinzu, um loszulegen.
                </CardDescription>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Termin hinzufügen
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {sortedDates.map((date) => {
                const dateEvents = groupedEvents[date]
                const dateObj = parseISO(date)
                const isToday = isSameDay(dateObj, new Date())

                return (
                  <div key={date}>
                    <h2 className="text-lg font-semibold mb-3 sticky top-0 bg-background py-2">
                      {format(dateObj, 'EEEE, dd. MMMM yyyy', { locale: de })}
                      {isToday && (
                        <span className="ml-2 text-sm font-normal text-primary">
                          (Heute)
                        </span>
                      )}
                    </h2>
                    <div className="space-y-2">
                      {dateEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onEdit={handleOpenDialog}
                          onDelete={handleDeleteEvent}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Event Dialog */}
      <EventDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        event={editingEvent}
        onSuccess={handleDialogSuccess}
      />
    </div>
  )
}
