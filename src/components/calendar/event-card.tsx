'use client'

import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Clock, MapPin, Trash2, Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCategoryInfo } from '@/lib/constants/calendar'
import type { CalendarEvent } from '@/lib/types/calendar'
import { cn } from '@/lib/utils'

interface EventCardProps {
  event: CalendarEvent
  onEdit?: (event: CalendarEvent) => void
  onDelete?: (id: string) => void
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const categoryInfo = getCategoryInfo(event.category)
  const CategoryIcon = categoryInfo.icon

  const startTime = format(new Date(event.startDate), 'HH:mm', { locale: de })
  const endTime = format(new Date(event.endDate), 'HH:mm', { locale: de })

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Category Icon */}
          <div className={cn('p-2 rounded-lg shrink-0', categoryInfo.bgColor)}>
            <CategoryIcon className={cn('h-5 w-5', categoryInfo.color)} />
          </div>

          {/* Event Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {event.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <Button size="sm" variant="ghost" onClick={() => onEdit(event)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Event Meta */}
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
              {!event.isAllDay && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {startTime} - {endTime}
                  </span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              )}

              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', categoryInfo.bgColor, categoryInfo.color)}>
                {categoryInfo.label}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
