import { z } from 'zod'

// Calendar event validation schema
export const eventSchema = z
  .object({
    title: z
      .string({
        required_error: 'Titel ist erforderlich',
      })
      .min(1, 'Titel ist erforderlich')
      .max(200, 'Titel ist zu lang'),
    description: z.string().max(1000, 'Beschreibung ist zu lang').optional(),
    category: z.enum(['uni', 'work', 'personal', 'health', 'social', 'other'], {
      required_error: 'Bitte wähle eine Kategorie aus',
    }),
    startDate: z.string({
      required_error: 'Startdatum ist erforderlich',
    }),
    endDate: z.string({
      required_error: 'Enddatum ist erforderlich',
    }),
    isAllDay: z.boolean(),
    location: z.string().max(200, 'Ort ist zu lang').optional(),
    reminder: z.enum(['none', '5min', '15min', '30min', '1hour', '1day']),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'Enddatum muss nach dem Startdatum liegen',
    path: ['endDate'],
  })

export type EventFormData = z.infer<typeof eventSchema>
