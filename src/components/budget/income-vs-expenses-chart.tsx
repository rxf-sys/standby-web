'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Transaction } from '@/lib/types'
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'
import { de } from 'date-fns/locale'

interface IncomeVsExpensesChartProps {
  transactions: Transaction[]
}

export function IncomeVsExpensesChart({ transactions }: IncomeVsExpensesChartProps) {
  // Get last 6 months
  const endDate = endOfMonth(new Date())
  const startDate = startOfMonth(subMonths(endDate, 5))

  const months = eachMonthOfInterval({ start: startDate, end: endDate })

  const chartData = months.map((month) => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return transactionDate >= monthStart && transactionDate <= monthEnd
    })

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      month: format(month, 'MMM yy', { locale: de }),
      Einnahmen: income,
      Ausgaben: expenses,
      Differenz: income - expenses,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Einnahmen vs. Ausgaben</CardTitle>
        <CardDescription>Letzte 6 Monate</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value}€`}
            />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)} €`}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Bar dataKey="Einnahmen" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Ausgaben" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
