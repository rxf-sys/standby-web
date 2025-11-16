'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { budgetService } from '@/lib/services/budget.service'
import type { SavingsGoal } from '@/lib/types'
import { SavingsGoalCard } from '@/components/savings/savings-goal-card'
import { SavingsGoalDialog } from '@/components/savings/savings-goal-dialog'

export default function SavingsPage() {
  const { user } = useAuthStore()
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)

  const loadSavingsGoals = async () => {
    if (!user) return
    try {
      setIsLoading(true)
      const data = await budgetService.getSavingsGoals(user.id)
      setSavingsGoals(data)
    } catch (error) {
      console.error('Error loading savings goals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSavingsGoals()
  }, [user])

  const handleOpenDialog = (goal?: SavingsGoal) => {
    setSelectedGoal(goal || null)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedGoal(null)
    setDialogOpen(false)
  }

  const handleSuccess = () => {
    loadSavingsGoals()
  }

  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrent = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Sparziele</h1>
          <p className="text-muted-foreground mt-2">Verfolge deine finanziellen Ziele</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Neues Ziel
        </Button>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Gesamtfortschritt</CardTitle>
          <CardDescription>Dein Fortschritt über alle Sparziele hinweg</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Gespart:</span>
              <span className="text-2xl font-bold">{totalCurrent.toFixed(2)} €</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ziel:</span>
              <span className="text-xl">{totalTarget.toFixed(2)} €</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Fortschritt</span>
                <span className="font-medium">{overallProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary rounded-full h-3 transition-all"
                  style={{ width: `${Math.min(overallProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Goals List */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : savingsGoals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center mb-4">
              Du hast noch keine Sparziele erstellt.
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Erstes Ziel erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savingsGoals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => handleOpenDialog(goal)}
              onUpdate={handleSuccess}
            />
          ))}
        </div>
      )}

      <SavingsGoalDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        goal={selectedGoal}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
