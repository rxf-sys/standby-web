import { z } from 'zod'

// Transaction validation schema
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'Bitte wähle einen Typ aus',
  }),
  amount: z.coerce
    .number({
      required_error: 'Betrag ist erforderlich',
      invalid_type_error: 'Bitte gib eine gültige Zahl ein',
    })
    .positive('Betrag muss größer als 0 sein')
    .max(1000000, 'Betrag ist zu hoch'),
  category: z.enum(['food', 'transport', 'housing', 'entertainment', 'health', 'education', 'shopping', 'other', 'salary', 'freelance', 'allowance', 'investment'], {
    required_error: 'Bitte wähle eine Kategorie aus',
  }),
  description: z
    .string({
      required_error: 'Beschreibung ist erforderlich',
    })
    .min(1, 'Beschreibung ist erforderlich')
    .max(500, 'Beschreibung ist zu lang'),
  date: z.string({
    required_error: 'Datum ist erforderlich',
  }),
})

export type TransactionFormData = z.infer<typeof transactionSchema>

// Savings goal validation schema
export const savingsGoalSchema = z.object({
  name: z
    .string({
      required_error: 'Name ist erforderlich',
    })
    .min(1, 'Name ist erforderlich')
    .max(100, 'Name ist zu lang'),
  targetAmount: z.coerce
    .number({
      required_error: 'Zielbetrag ist erforderlich',
      invalid_type_error: 'Bitte gib eine gültige Zahl ein',
    })
    .positive('Zielbetrag muss größer als 0 sein')
    .max(10000000, 'Zielbetrag ist zu hoch'),
  currentAmount: z.coerce
    .number({
      invalid_type_error: 'Bitte gib eine gültige Zahl ein',
    })
    .nonnegative('Betrag kann nicht negativ sein')
    .max(10000000, 'Betrag ist zu hoch'),
  targetDate: z.string().optional(),
})

export type SavingsGoalFormData = z.infer<typeof savingsGoalSchema>

// Budget limit validation schema
export const budgetSchema = z.object({
  category: z.string({
    required_error: 'Bitte wähle eine Kategorie aus',
  }),
  limitAmount: z.coerce
    .number({
      required_error: 'Limit ist erforderlich',
      invalid_type_error: 'Bitte gib eine gültige Zahl ein',
    })
    .positive('Limit muss größer als 0 sein')
    .max(1000000, 'Limit ist zu hoch'),
  period: z.enum(['weekly', 'monthly'], {
    required_error: 'Bitte wähle einen Zeitraum aus',
  }),
})

export type BudgetFormData = z.infer<typeof budgetSchema>
