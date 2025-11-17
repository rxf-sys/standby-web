'use client'

import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { RecipeFilter, MealType, DietaryRestriction, Difficulty } from '@/lib/types/recipe'

interface RecipeFiltersProps {
  filters: RecipeFilter
  onFiltersChange: (filters: RecipeFilter) => void
}

const mealTypes: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Frühstück' },
  { value: 'lunch', label: 'Mittag' },
  { value: 'dinner', label: 'Abendessen' },
  { value: 'snack', label: 'Snack' },
  { value: 'dessert', label: 'Dessert' },
]

const dietaryOptions: { value: DietaryRestriction; label: string; emoji: string }[] = [
  { value: 'vegetarian', label: 'Vegetarisch', emoji: '🥬' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'gluten-free', label: 'Glutenfrei', emoji: '🌾' },
  { value: 'lactose-free', label: 'Laktosefrei', emoji: '🥛' },
]

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Einfach' },
  { value: 'medium', label: 'Mittel' },
  { value: 'hard', label: 'Schwer' },
]

export function RecipeFilters({ filters, onFiltersChange }: RecipeFiltersProps) {
  const toggleMealType = (type: MealType) => {
    const current = filters.mealType || []
    const updated = current.includes(type) ? current.filter((t) => t !== type) : [...current, type]
    onFiltersChange({ ...filters, mealType: updated })
  }

  const toggleDietary = (diet: DietaryRestriction) => {
    const current = filters.dietary || []
    const updated = current.includes(diet) ? current.filter((d) => d !== diet) : [...current, diet]
    onFiltersChange({ ...filters, dietary: updated })
  }

  const toggleDifficulty = (difficulty: Difficulty) => {
    const current = filters.difficulty || []
    const updated = current.includes(difficulty) ? current.filter((d) => d !== difficulty) : [...current, difficulty]
    onFiltersChange({ ...filters, difficulty: updated })
  }

  const hasActiveFilters =
    (filters.mealType && filters.mealType.length > 0) ||
    (filters.dietary && filters.dietary.length > 0) ||
    (filters.difficulty && filters.difficulty.length > 0) ||
    filters.maxPrepTime !== undefined ||
    filters.maxCost !== undefined

  const resetFilters = () => {
    onFiltersChange({
      mealType: [],
      dietary: [],
      difficulty: [],
      maxPrepTime: undefined,
      maxCost: undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter
            </CardTitle>
            <CardDescription>Finde das perfekte Rezept</CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="mr-2 h-4 w-4" />
              Zurücksetzen
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Meal Type */}
        <div className="space-y-3">
          <Label>Mahlzeit</Label>
          <div className="flex flex-wrap gap-2">
            {mealTypes.map((type) => (
              <Button
                key={type.value}
                variant={filters.mealType?.includes(type.value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleMealType(type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Dietary */}
        <div className="space-y-3">
          <Label>Ernährung</Label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((diet) => (
              <Button
                key={diet.value}
                variant={filters.dietary?.includes(diet.value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleDietary(diet.value)}
              >
                <span className="mr-1">{diet.emoji}</span>
                {diet.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-3">
          <Label>Schwierigkeit</Label>
          <div className="flex flex-wrap gap-2">
            {difficultyOptions.map((diff) => (
              <Button
                key={diff.value}
                variant={filters.difficulty?.includes(diff.value) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleDifficulty(diff.value)}
              >
                {diff.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Max Prep Time */}
        <div className="space-y-3">
          <Label htmlFor="maxPrepTime">Max. Zubereitungszeit</Label>
          <Select
            value={filters.maxPrepTime?.toString() || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                maxPrepTime: value === 'all' ? undefined : parseInt(value),
              })
            }
          >
            <SelectTrigger id="maxPrepTime">
              <SelectValue placeholder="Alle Zeiten" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Zeiten</SelectItem>
              <SelectItem value="15">Bis 15 Min</SelectItem>
              <SelectItem value="30">Bis 30 Min</SelectItem>
              <SelectItem value="45">Bis 45 Min</SelectItem>
              <SelectItem value="60">Bis 60 Min</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Max Cost */}
        <div className="space-y-3">
          <Label htmlFor="maxCost">Max. Kosten</Label>
          <Select
            value={filters.maxCost?.toString() || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                maxCost: value === 'all' ? undefined : parseFloat(value),
              })
            }
          >
            <SelectTrigger id="maxCost">
              <SelectValue placeholder="Alle Preise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Preise</SelectItem>
              <SelectItem value="3">Bis 3€</SelectItem>
              <SelectItem value="5">Bis 5€</SelectItem>
              <SelectItem value="7">Bis 7€</SelectItem>
              <SelectItem value="10">Bis 10€</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
