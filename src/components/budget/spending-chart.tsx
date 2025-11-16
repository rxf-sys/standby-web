'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { Transaction } from '@/lib/types'
import { EXPENSE_CATEGORY_OPTIONS } from '@/lib/constants/budget'

interface SpendingChartProps {
  transactions: Transaction[]
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  // Calculate expenses by category
  const expenses = transactions.filter((t) => t.type === 'expense')

  const categoryTotals = expenses.reduce((acc, transaction) => {
    const category = transaction.category
    acc[category] = (acc[category] || 0) + transaction.amount
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => {
    const categoryOption = EXPENSE_CATEGORY_OPTIONS.find((opt) => opt.value === category)
    return {
      name: categoryOption?.label || category,
      value: amount,
      color: categoryOption?.color || '#888888',
    }
  })

  // Sort by value descending
  chartData.sort((a, b) => b.value - a.value)

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0)

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ausgaben nach Kategorie</CardTitle>
          <CardDescription>Verteilung deiner Ausgaben</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Noch keine Ausgaben vorhanden
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ausgaben nach Kategorie</CardTitle>
        <CardDescription>Gesamt: {totalExpenses.toFixed(2)} €</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)} €`}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
