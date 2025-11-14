'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Heart, Clock, Euro, ChefHat } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/lib/hooks/use-toast'
import { recipeService } from '@/lib/services/recipe.service'
import { useAuthStore } from '@/lib/store'
import type { Recipe } from '@/lib/types/recipe'
import { cn } from '@/lib/utils'

interface RecipeCardProps {
  recipe: Recipe
  onFavoriteToggle?: (recipeId: string, isFavorite: boolean) => void
}

const difficultyLabels = {
  easy: 'Einfach',
  medium: 'Mittel',
  hard: 'Schwer',
}

const difficultyColors = {
  easy: 'text-green-600 dark:text-green-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  hard: 'text-red-600 dark:text-red-400',
}

export function RecipeCard({ recipe, onFavoriteToggle }: RecipeCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const user = useAuthStore((state) => state.user)
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite || false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)

  const totalTime = recipe.prepTime + recipe.cookTime

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click

    if (!user) {
      toast({
        title: 'Nicht angemeldet',
        description: 'Du musst angemeldet sein, um Favoriten zu speichern.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsTogglingFavorite(true)
      const newFavoriteState = await recipeService.toggleFavorite(user.id, recipe.id)
      setIsFavorite(newFavoriteState)
      onFavoriteToggle?.(recipe.id, newFavoriteState)

      toast({
        title: newFavoriteState ? 'Zu Favoriten hinzugefügt' : 'Aus Favoriten entfernt',
        description: newFavoriteState
          ? `${recipe.title} wurde zu deinen Favoriten hinzugefügt.`
          : `${recipe.title} wurde aus deinen Favoriten entfernt.`,
      })
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: 'Fehler',
        description: 'Favorit konnte nicht gespeichert werden.',
        variant: 'destructive',
      })
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  const handleCardClick = () => {
    router.push(`/recipes/${recipe.id}`)
  }

  return (
    <Card className="group overflow-hidden cursor-pointer transition-all hover:shadow-lg" onClick={handleCardClick}>
      {/* Recipe Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ChefHat className="h-16 w-16 text-muted-foreground" />
          </div>
        )}

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            'absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity',
            isFavorite && 'opacity-100'
          )}
          onClick={handleFavoriteClick}
          disabled={isTogglingFavorite}
        >
          <Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500 text-red-500')} />
        </Button>

        {/* Dietary Tags */}
        {recipe.dietary.length > 0 && recipe.dietary[0] !== 'none' && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {recipe.dietary.slice(0, 2).map((diet) => (
              <span key={diet} className="rounded-full bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur">
                {diet === 'vegetarian' && '🥬'}
                {diet === 'vegan' && '🌱'}
                {diet === 'gluten-free' && '🌾'}
                {diet === 'lactose-free' && '🥛'}
              </span>
            ))}
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
        <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {/* Cooking Time */}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{totalTime} Min</span>
          </div>

          {/* Cost */}
          <div className="flex items-center gap-1">
            <Euro className="h-4 w-4" />
            <span>{recipe.estimatedCost.toFixed(2)}</span>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            <span className={difficultyColors[recipe.difficulty]}>{difficultyLabels[recipe.difficulty]}</span>
          </div>
        </div>

        {/* Meal Types */}
        <div className="mt-3 flex flex-wrap gap-1">
          {recipe.mealType.slice(0, 3).map((type) => (
            <span key={type} className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
              {type === 'breakfast' && 'Frühstück'}
              {type === 'lunch' && 'Mittag'}
              {type === 'dinner' && 'Abendessen'}
              {type === 'snack' && 'Snack'}
              {type === 'dessert' && 'Dessert'}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
