'use client'

import { useEffect, useState } from 'react'
import { ChefHat, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { logger } from '@/lib/services/logger.service'
import { RecipeCard } from '@/components/recipes/recipe-card'
import { RecipeFilters } from '@/components/recipes/recipe-filters'
import { useAuthStore, useRecipeStore } from '@/lib/store'
import { recipeService } from '@/lib/services/recipe.service'
import type { RecipeFilter } from '@/lib/types/recipe'

export default function RecipesPage() {
  const user = useAuthStore((state) => state.user)
  const { recipes, filters, setRecipes, setFilters, updateRecipeFavorite } = useRecipeStore()
  const [isLoading, setIsLoading] = useState(true)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Load recipes
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setIsLoading(true)
        const data = await recipeService.getRecipes(filters)

        // Check favorite status for each recipe if user is logged in
        if (user) {
          const recipesWithFavorites = await Promise.all(
            data.map(async (recipe) => {
              const isFavorite = await recipeService.isFavorite(user.id, recipe.id)
              return { ...recipe, isFavorite }
            })
          )
          setRecipes(recipesWithFavorites)
        } else {
          setRecipes(data)
        }
      } catch (error) {
        logger.error('Error loading recipes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipes()
  }, [filters, user, setRecipes])

  const handleFilterChange = (newFilters: RecipeFilter) => {
    setFilters(newFilters)
  }

  const handleFavoriteToggle = (recipeId: string, isFavorite: boolean) => {
    updateRecipeFavorite(recipeId, isFavorite)
  }

  const displayedRecipes = showFavoritesOnly ? recipes.filter((r) => r.isFavorite) : recipes

  const favoriteCount = recipes.filter((r) => r.isFavorite).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Lade Rezepte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Rezepte</h1>
          <p className="text-muted-foreground mt-2">
            {showFavoritesOnly
              ? `${favoriteCount} Favorit${favoriteCount !== 1 ? 'en' : ''}`
              : `${recipes.length} leckere Rezepte`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={showFavoritesOnly ? 'default' : 'outline'} onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
            <Heart className={`mr-2 h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favoriten {favoriteCount > 0 && `(${favoriteCount})`}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <RecipeFilters filters={filters} onFiltersChange={handleFilterChange} />
        </aside>

        {/* Recipes Grid */}
        <div className="lg:col-span-3">
          {displayedRecipes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <ChefHat className="h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-2xl mb-2">
                  {showFavoritesOnly ? 'Keine Favoriten' : 'Keine Rezepte gefunden'}
                </CardTitle>
                <CardDescription className="text-center max-w-md mb-6">
                  {showFavoritesOnly
                    ? 'Du hast noch keine Rezepte als Favoriten markiert. Klicke auf das Herz-Symbol bei einem Rezept, um es zu speichern.'
                    : 'Versuche, deine Filter anzupassen, um mehr Rezepte zu sehen.'}
                </CardDescription>
                {showFavoritesOnly && (
                  <Button onClick={() => setShowFavoritesOnly(false)}>Alle Rezepte anzeigen</Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {displayedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} onFavoriteToggle={handleFavoriteToggle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
