'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Loader2, Trash2 } from 'lucide-react'

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
import { useToast } from '@/lib/hooks/use-toast'
import { savingsGoalSchema, type SavingsGoalFormData } from '@/lib/validations/budget'
import type { SavingsGoal } from '@/lib/types'
import { budgetService } from '@/lib/services/budget.service'
import { useAuthStore } from '@/lib/store'

interface SavingsGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal?: SavingsGoal | null
  onSuccess?: () => void
}

export function SavingsGoalDialog({ open, onOpenChange, goal, onSuccess }: SavingsGoalDialogProps) {
  const { toast } = useToast()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SavingsGoalFormData>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (goal) {
        reset({
          name: goal.name,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          targetDate: goal.targetDate ? format(new Date(goal.targetDate), 'yyyy-MM-dd') : '',
        })
      } else {
        reset({
          name: '',
          targetAmount: 0,
          currentAmount: 0,
          targetDate: '',
        })
      }
    }
  }, [open, goal, reset])

  const onSubmit = async (data: SavingsGoalFormData) => {
    if (!user) {
      toast({
        title: 'Fehler',
        description: 'Du musst angemeldet sein.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)

      if (goal) {
        await budgetService.updateSavingsGoal(goal.id, {
          name: data.name,
          targetAmount: data.targetAmount,
          currentAmount: data.currentAmount,
          targetDate: data.targetDate,
        })
        toast({
          title: 'Sparziel aktualisiert',
          description: 'Dein Sparziel wurde erfolgreich aktualisiert.',
        })
      } else {
        await budgetService.createSavingsGoal({
          userId: user.id,
          name: data.name,
          targetAmount: data.targetAmount,
          currentAmount: data.currentAmount,
          targetDate: data.targetDate,
        })
        toast({
          title: 'Sparziel erstellt',
          description: 'Dein Sparziel wurde erfolgreich erstellt.',
        })
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      logger.error('Error saving savings goal:', error)
      toast({
        title: 'Fehler',
        description: 'Das Sparziel konnte nicht gespeichert werden.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!goal) return

    if (!confirm('Möchtest du dieses Sparziel wirklich löschen?')) return

    try {
      setIsDeleting(true)
      await budgetService.deleteSavingsGoal(goal.id)
      toast({
        title: 'Sparziel gelöscht',
        description: 'Dein Sparziel wurde erfolgreich gelöscht.',
      })
      onOpenChange(false)
      onSuccess?.()
    } catch {
      toast({
        title: 'Fehler',
        description: 'Das Sparziel konnte nicht gelöscht werden.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit as any)}>
          <DialogHeader>
            <DialogTitle>{goal ? 'Sparziel bearbeiten' : 'Neues Sparziel'}</DialogTitle>
            <DialogDescription>
              {goal
                ? 'Bearbeite die Details deines Sparziels.'
                : 'Erstelle ein neues Sparziel und verfolge deinen Fortschritt.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="z.B. Neues Auto"
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Target Amount */}
            <div className="grid gap-2">
              <Label htmlFor="targetAmount">
                Zielbetrag (€) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                placeholder="5000.00"
                {...register('targetAmount')}
                disabled={isLoading}
              />
              {errors.targetAmount && (
                <p className="text-sm text-destructive">{errors.targetAmount.message}</p>
              )}
            </div>

            {/* Current Amount */}
            <div className="grid gap-2">
              <Label htmlFor="currentAmount">Aktueller Betrag (€)</Label>
              <Input
                id="currentAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('currentAmount')}
                disabled={isLoading}
              />
              {errors.currentAmount && (
                <p className="text-sm text-destructive">{errors.currentAmount.message}</p>
              )}
            </div>

            {/* Target Date */}
            <div className="grid gap-2">
              <Label htmlFor="targetDate">Zieldatum (optional)</Label>
              <Input
                id="targetDate"
                type="date"
                {...register('targetDate')}
                disabled={isLoading}
              />
              {errors.targetDate && (
                <p className="text-sm text-destructive">{errors.targetDate.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            {goal && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Wird gelöscht...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Löschen
                  </>
                )}
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Wird gespeichert...
                  </>
                ) : (
                  <>{goal ? 'Aktualisieren' : 'Erstellen'}</>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
