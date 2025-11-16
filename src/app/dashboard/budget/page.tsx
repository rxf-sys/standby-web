'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, TrendingDown, Wallet, Pencil, Trash2 } from 'lucide-react'
import { useAuthStore, useBudgetStore } from '@/lib/store'
import { budgetService } from '@/lib/services/budget.service'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TransactionDialog } from '@/components/budget/transaction-dialog'
import { SpendingChart } from '@/components/budget/spending-chart'
import { IncomeVsExpensesChart } from '@/components/budget/income-vs-expenses-chart'
import { getCategoryInfo } from '@/lib/constants/budget'
import type { Transaction } from '@/lib/types/budget'

export default function BudgetPage() {
  const user = useAuthStore((state) => state.user)
  const { transactions, setTransactions } = useBudgetStore()
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'income' | 'expense'>('expense')
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const loadTransactions = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const data = await budgetService.getTransactions(user.id)
      setTransactions(data)
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [user, setTransactions])

  const handleOpenDialog = (type: 'income' | 'expense', transaction?: Transaction) => {
    setDialogType(type)
    setEditingTransaction(transaction || null)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingTransaction(null)
  }

  const handleDialogSuccess = () => {
    loadTransactions()
  }

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Möchtest du diese Transaktion wirklich löschen?')) return

    try {
      await budgetService.deleteTransaction(id)
      loadTransactions()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const calculateStats = () => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      income,
      expenses,
      balance: income - expenses,
    }
  }

  const stats = calculateStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Budget</h1>
          <p className="text-muted-foreground mt-2">
            Verwalte deine Finanzen und erreiche deine Ziele
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenDialog('income')}>
            <Plus className="mr-2 h-4 w-4" />
            Einnahme
          </Button>
          <Button variant="destructive" onClick={() => handleOpenDialog('expense')}>
            <Plus className="mr-2 h-4 w-4" />
            Ausgabe
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aktueller Saldo</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-success' : 'text-destructive'}`}
            >
              {formatCurrency(stats.balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Differenz zwischen Einnahmen und Ausgaben
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Einnahmen</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(stats.income)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Gesamt {transactions.filter((t) => t.type === 'income').length} Transaktionen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ausgaben</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(stats.expenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Gesamt {transactions.filter((t) => t.type === 'expense').length} Transaktionen
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {transactions.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <IncomeVsExpensesChart transactions={transactions} />
          <SpendingChart transactions={transactions} />
        </div>
      )}

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Transaktionen</CardTitle>
          <CardDescription>
            {transactions.length > 0
              ? `Deine letzten ${Math.min(transactions.length, 10)} Transaktionen`
              : 'Noch keine Transaktionen vorhanden'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Keine Transaktionen</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Füge deine erste Einnahme oder Ausgabe hinzu, um zu beginnen.
              </p>
              <div className="mt-6 flex gap-2 justify-center">
                <Button onClick={() => handleOpenDialog('income')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Einnahme hinzufügen
                </Button>
                <Button variant="outline" onClick={() => handleOpenDialog('expense')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ausgabe hinzufügen
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 10).map((transaction) => {
                const categoryInfo = getCategoryInfo(transaction.category, transaction.type)
                const CategoryIcon = categoryInfo.icon

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'}`}
                      >
                        <CategoryIcon className={`h-5 w-5 ${categoryInfo.color}`} />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.date)} • {categoryInfo.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p
                        className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDialog(transaction.type, transaction)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Dialog */}
      <TransactionDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        transaction={editingTransaction}
        defaultType={dialogType}
        onSuccess={handleDialogSuccess}
      />
    </div>
  )
}
