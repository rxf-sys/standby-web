'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'

import { logger } from '@/lib/services/logger.service'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/lib/hooks/use-toast'
import { eventSchema, type EventFormData } from '@/lib/validations/calendar'
import { EVENT_CATEGORY_OPTIONS, REMINDER_OPTIONS } from '@/lib/constants/calendar'
import type { CalendarEvent } from '@/lib/types/calendar'
import { calendarService } from '@/lib/services/calendar.service'
import { useAuthStore } from '@/lib/store'

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: CalendarEvent | null
  onSuccess?: () => void
}

export function EventDialog({ open, onOpenChange, event, onSuccess }: EventDialogProps) {
  const { toast } = useToast()
  const user = useAuthStore((state) => state.user)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'personal',
      startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      isAllDay: false,
      location: '',
      reminder: 'none',
    },
  })

  const selectedCategory = watch('category')
  const selectedReminder = watch('reminder')
  const isAllDay = watch('isAllDay')

  // Reset form when dialog opens/closes or event changes
  useEffect(() => {
    if (open) {
      if (event) {
        // Edit mode
        reset({
          title: event.title,
          description: event.description || '',
          category: event.category,
          startDate: format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm"),
          endDate: format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm"),
          isAllDay: event.isAllDay,
          location: event.location || '',
          reminder: event.reminder,
        })
      } else {
        // Add mode
        const now = new Date()
        const later = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour later
        reset({
          title: '',
          description: '',
          category: 'personal',
          startDate: format(now, "yyyy-MM-dd'T'HH:mm"),
          endDate: format(later, "yyyy-MM-dd'T'HH:mm"),
          isAllDay: false,
          location: '',
          reminder: 'none',
        })
      }
    }
  }, [open, event, reset])

  const onSubmit = async (data: EventFormData) => {
    if (!user) return

    try {
      setIsLoading(true)

      if (event) {
        // Update existing event
        await calendarService.updateEvent(event.id, {
          title: data.title,
          description: data.description,
          category: data.category,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          isAllDay: data.isAllDay,
          location: data.location,
          reminder: data.reminder,
        })
        toast({
          title: 'Termin aktualisiert',
          description: 'Der Termin wurde erfolgreich aktualisiert.',
        })
      } else {
        // Create new event
        await calendarService.createEvent(user.id, {
          title: data.title,
          description: data.description,
          category: data.category,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          isAllDay: data.isAllDay,
          location: data.location,
          reminder: data.reminder,
        })
        toast({
          title: 'Termin erstellt',
          description: 'Der Termin wurde erfolgreich erstellt.',
        })
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      logger.error('Error saving event:', error)
      toast({
        title: 'Fehler',
        description: 'Der Termin konnte nicht gespeichert werden.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit as any)}>
          <DialogHeader>
            <DialogTitle>{event ? 'Termin bearbeiten' : 'Neuer Termin'}</DialogTitle>
            <DialogDescription>
              {event
                ? 'Bearbeite die Details deines Termins.'
                : 'Füge einen neuen Termin zu deinem Kalender hinzu.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">
                Titel <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="z.B. Vorlesung Informatik"
                {...register('title')}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                placeholder="Zusätzliche Informationen..."
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">
                Kategorie <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedCategory} onValueChange={(value) => setValue('category', value as 'uni' | 'work' | 'personal' | 'health' | 'social' | 'other')}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Wähle eine Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORY_OPTIONS.map((cat) => {
                    const Icon = cat.icon
                    return (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${cat.color}`} />
                          <span>{cat.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            {/* All-day checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAllDay"
                className="h-4 w-4 rounded border-input"
                {...register('isAllDay')}
              />
              <Label htmlFor="isAllDay" className="cursor-pointer">
                Ganztägig
              </Label>
            </div>

            {/* Start Date */}
            <div className="grid gap-2">
              <Label htmlFor="startDate">
                {isAllDay ? 'Datum' : 'Start'} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startDate"
                type={isAllDay ? 'date' : 'datetime-local'}
                {...register('startDate')}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
              )}
            </div>

            {/* End Date */}
            {!isAllDay && (
              <div className="grid gap-2">
                <Label htmlFor="endDate">
                  Ende <span className="text-destructive">*</span>
                </Label>
                <Input id="endDate" type="datetime-local" {...register('endDate')} />
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate.message}</p>
                )}
              </div>
            )}

            {/* Location */}
            <div className="grid gap-2">
              <Label htmlFor="location">Ort</Label>
              <Input id="location" placeholder="z.B. Hörsaal 1" {...register('location')} />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>

            {/* Reminder */}
            <div className="grid gap-2">
              <Label htmlFor="reminder">Erinnerung</Label>
              <Select value={selectedReminder} onValueChange={(value) => setValue('reminder', value as 'none' | '5min' | '15min' | '30min' | '1hour' | '1day')}>
                <SelectTrigger id="reminder">
                  <SelectValue placeholder="Erinnerung wählen" />
                </SelectTrigger>
                <SelectContent>
                  {REMINDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {event ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
