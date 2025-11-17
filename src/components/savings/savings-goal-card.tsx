'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Edit, Plus, Minus, Target, Calendar } from 'lucide-react'
import type { SavingsGoal } from '@/lib/types'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { useState } from 'react'
import { budgetService } from '@/lib/services/budget.service'
import { toast } from '@/lib/hooks/use-toast'

interface SavingsGoalCardProps {
  goal: SavingsGoal
  onEdit: () => void
  onUpdate: () => void
}

export function SavingsGoalCard({ goal, onEdit, onUpdate }: SavingsGoalCardProps) {
  const [amount, setAmount] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const progress = (goal.currentAmount / goal.targetAmount) * 100
  const remaining = goal.targetAmount - goal.currentAmount
  const isCompleted = goal.currentAmount >= goal.targetAmount

  const handleAddAmount = async () => {
    const value = parseFloat(amount)
    if (isNaN(value) || value <= 0) {
      toast({
        title: 'Fehler',
        description: 'Bitte gib einen gültigen Betrag ein.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsUpdating(true)
      await budgetService.updateSavingsGoal(goal.id, {
        currentAmount: goal.currentAmount + value,
      })
      toast({
        title: 'Betrag hinzugefügt',
        description: `${value.toFixed(2)} € zu "${goal.name}" hinzugefügt.`,
        variant: 'success',
      })
      setAmount('')
      onUpdate()
    } catch {
      toast({
        title: 'Fehler',
        description: 'Betrag konnte nicht hinzugefügt werden.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSubtractAmount = async () => {
    const value = parseFloat(amount)
    if (isNaN(value) || value <= 0) {
      toast({
        title: 'Fehler',
        description: 'Bitte gib einen gültigen Betrag ein.',
        variant: 'destructive',
      })
      return
    }

    const newAmount = Math.max(0, goal.currentAmount - value)

    try {
      setIsUpdating(true)
      await budgetService.updateSavingsGoal(goal.id, {
        currentAmount: newAmount,
      })
      toast({
        title: 'Betrag abgezogen',
        description: `${value.toFixed(2)} € von "${goal.name}" abgezogen.`,
        variant: 'success',
      })
      setAmount('')
      onUpdate()
    } catch {
      toast({
        title: 'Fehler',
        description: 'Betrag konnte nicht abgezogen werden.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className={isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2">
              <Target className={`h-5 w-5 ${isCompleted ? 'text-green-600' : 'text-primary'}`} />
              {goal.name}
            </CardTitle>
            <CardDescription>
              {goal.targetDate && (
                <span className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  Bis {format(new Date(goal.targetDate), 'dd. MMM yyyy', { locale: de })}
                </span>
              )}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{goal.currentAmount.toFixed(2)} €</span>
            <span className="text-muted-foreground">von {goal.targetAmount.toFixed(2)} €</span>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{progress.toFixed(1)}%</span>
            {!isCompleted && <span>Noch {remaining.toFixed(2)} €</span>}
            {isCompleted && <span className="text-green-600 font-medium">✓ Erreicht!</span>}
          </div>
        </div>

        {/* Quick Actions */}
        {!isCompleted && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Betrag"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isUpdating}
                step="0.01"
                min="0"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddAmount}
                disabled={isUpdating || !amount}
                className="flex-1"
              >
                <Plus className="h-3 w-3 mr-1" />
                Hinzufügen
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSubtractAmount}
                disabled={isUpdating || !amount || goal.currentAmount === 0}
                className="flex-1"
              >
                <Minus className="h-3 w-3 mr-1" />
                Abziehen
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
