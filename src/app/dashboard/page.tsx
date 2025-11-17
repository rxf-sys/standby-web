'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { isToday, parseISO } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, ChefHat, Calendar, TrendingUp, ArrowRight } from 'lucide-react'
import { logger } from '@/lib/services/logger.service'
import { useAuthStore } from '@/lib/store'
import { budgetService } from '@/lib/services/budget.service'
import { recipeService } from '@/lib/services/recipe.service'
import { calendarService } from '@/lib/services/calendar.service'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [stats, setStats] = useState({
    balance: 0,
    totalRecipes: 0,
    todayEvents: 0,
    favoriteRecipes: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardStats = async () => {
      if (!user) return

      try {
        setIsLoading(true)

        // Load all data in parallel
        const [transactions, recipes, events, favorites] = await Promise.all([
          budgetService.getTransactions(user.id),
          recipeService.getRecipes(),
          calendarService.getUpcomingEvents(user.id, 1),
          recipeService.getFavoriteRecipes(user.id),
        ])

        // Calculate balance
        const income = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)
        const expenses = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
        const balance = income - expenses

        // Count today's events
        const todayEvents = events.filter((e) => isToday(parseISO(e.startDate))).length

        setStats({
          balance,
          totalRecipes: recipes.length,
          todayEvents,
          favoriteRecipes: favorites.length,
        })
      } catch (error) {
        logger.error('Error loading dashboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardStats()
  }, [user])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Willkommen zurück, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">
          Hier ist deine Übersicht über dein selbstständiges Leben
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aktueller Saldo</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-24 animate-pulse bg-muted rounded" />
            ) : (
              <>
                <div className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(stats.balance)}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  {stats.balance >= 0 ? 'Positiver Saldo' : 'Negativer Saldo'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rezepte</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse bg-muted rounded" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalRecipes}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.favoriteRecipes} Favoriten
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Termine</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-12 animate-pulse bg-muted rounded" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.todayEvents}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.todayEvents === 0 ? 'Keine Termine heute' : stats.todayEvents === 1 ? 'Heute anstehend' : 'Heute anstehend'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Budget verwalten</CardTitle>
            <CardDescription>
              Tracke deine Einnahmen und Ausgaben und erreiche deine Sparziele
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/budget">
                Zum Budget <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
              <ChefHat className="h-6 w-6 text-success" />
            </div>
            <CardTitle>Rezepte entdecken</CardTitle>
            <CardDescription>
              Finde leckere und günstige Rezepte für jeden Geschmack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="success" className="w-full">
              <Link href="/dashboard/recipes">
                Rezepte ansehen <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-secondary" />
            </div>
            <CardTitle>Termine planen</CardTitle>
            <CardDescription>
              Organisiere Uni, Arbeit und Freizeit an einem Ort
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/dashboard/calendar">
                Zum Kalender <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
