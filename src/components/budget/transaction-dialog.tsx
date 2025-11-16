'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'

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
import { transactionSchema, type TransactionFormData } from '@/lib/validations/budget'
import { EXPENSE_CATEGORY_OPTIONS, INCOME_SOURCE_OPTIONS } from '@/lib/constants/budget'
import type { Transaction } from '@/lib/types/budget'
import { budgetService } from '@/lib/services/budget.service'
import { useAuthStore } from '@/lib/store'

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
  defaultType?: 'income' | 'expense'
  onSuccess?: () => void
}

export function TransactionDialog({ open, onOpenChange, transaction, defaultType = 'expense', onSuccess }: TransactionDialogProps) {
  const { toast } = useToast()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: defaultType,
      amount: 0,
      category: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const transactionType = watch('type')
  const selectedCategory = watch('category')

  // Reset form when dialog opens/closes or transaction changes
  useEffect(() => {
    if (open) {
      if (transaction) {
        // Edit mode
        reset({
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          date: format(new Date(transaction.date), 'yyyy-MM-dd'),
        })
      } else {
        // Add mode
        reset({
          type: defaultType,
          amount: 0,
          category: '',
          description: '',
          date: format(new Date(), 'yyyy-MM-dd'),
        })
      }
    }
  }, [open, transaction, defaultType, reset])

  // Reset category when type changes
  useEffect(() => {
    if (transactionType && selectedCategory) {
      // Check if current category is valid for the new type
      const categories = transactionType === 'expense' ? EXPENSE_CATEGORY_OPTIONS : INCOME_SOURCE_OPTIONS
      const isValid = categories.some((cat) => cat.value === selectedCategory)
      if (!isValid) {
        setValue('category', '')
      }
    }
  }, [transactionType, selectedCategory, setValue])

  const onSubmit = async (data: TransactionFormData) => {
    if (!user) {
      toast({
        title: 'Fehler',
        description: 'Du musst angemeldet sein, um eine Transaktion zu erstellen.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)

      if (transaction) {
        // Update existing transaction
        await budgetService.updateTransaction(transaction.id, data)
        toast({
          title: 'Transaktion aktualisiert',
          description: 'Die Transaktion wurde erfolgreich aktualisiert.',
        })
      } else {
        // Create new transaction
        await budgetService.createTransaction({
          ...data,
          userId: user.id,
        })
        toast({
          title: 'Transaktion erstellt',
          description: 'Die Transaktion wurde erfolgreich erstellt.',
        })
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error saving transaction:', error)
      toast({
        title: 'Fehler',
        description: 'Die Transaktion konnte nicht gespeichert werden.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const categoryOptions = transactionType === 'expense' ? EXPENSE_CATEGORY_OPTIONS : INCOME_SOURCE_OPTIONS

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{transaction ? 'Transaktion bearbeiten' : 'Neue Transaktion'}</DialogTitle>
            <DialogDescription>
              {transaction
                ? 'Bearbeite die Details deiner Transaktion.'
                : 'Füge eine neue Einnahme oder Ausgabe hinzu.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Type Selection */}
            <div className="grid gap-2">
              <Label htmlFor="type">Typ</Label>
              <Select value={transactionType} onValueChange={(value) => setValue('type', value as 'income' | 'expense')}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Wähle einen Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Einnahme</SelectItem>
                  <SelectItem value="expense">Ausgabe</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
            </div>

            {/* Category Selection */}
            <div className="grid gap-2">
              <Label htmlFor="category">Kategorie</Label>
              <Select value={selectedCategory} onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Wähle eine Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => {
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
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>

            {/* Amount */}
            <div className="grid gap-2">
              <Label htmlFor="amount">Betrag (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount')}
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                placeholder="Wofür war diese Transaktion?"
                {...register('description')}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            {/* Date */}
            <div className="grid gap-2">
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {transaction ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
