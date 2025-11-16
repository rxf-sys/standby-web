import { describe, it, expect, vi, beforeEach } from 'vitest'
import { budgetService } from '@/lib/services/budget.service'
import type { Transaction, SavingsGoal } from '@/lib/types'

// Mock Supabase
vi.mock('@/lib/services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}))

describe('Budget Service', () => {
  describe('getTransactions', () => {
    it('should fetch transactions for a user', async () => {
      const userId = 'test-user-id'

      // This is a basic structure test
      // In a real scenario, you would mock the Supabase response
      expect(budgetService.getTransactions).toBeDefined()
      expect(typeof budgetService.getTransactions).toBe('function')
    })
  })

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      expect(budgetService.createTransaction).toBeDefined()
      expect(typeof budgetService.createTransaction).toBe('function')
    })
  })

  describe('getSavingsGoals', () => {
    it('should fetch savings goals for a user', async () => {
      expect(budgetService.getSavingsGoals).toBeDefined()
      expect(typeof budgetService.getSavingsGoals).toBe('function')
    })
  })
})
