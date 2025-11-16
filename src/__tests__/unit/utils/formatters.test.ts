import { describe, it, expect } from 'vitest'

// Example utility tests
describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format numbers as currency', () => {
      const formatCurrency = (amount: number) => `${amount.toFixed(2)} €`

      expect(formatCurrency(1000)).toBe('1000.00 €')
      expect(formatCurrency(1.5)).toBe('1.50 €')
      expect(formatCurrency(0)).toBe('0.00 €')
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15')
      expect(date.getFullYear()).toBe(2024)
      expect(date.getMonth()).toBe(0) // January
      expect(date.getDate()).toBe(15)
    })
  })
})
