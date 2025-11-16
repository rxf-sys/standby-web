'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Clock, Euro, ChefHat, Heart, ShoppingCart, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/lib/hooks/use-toast'
import { recipeService } from '@/lib/services/recipe.service'
import { useAuthStore } from '@/lib/store'
import type { Recipe } from '@/lib/types/recipe'

const difficultyLabels = {
  easy: 'Einfach',
  medium: 'Mittel',
  hard: 'Schwer',
}

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const user = useAuthStore((state) => state.user)

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setIsLoading(true)
        const id = params.id as string
        const data = await recipeService.getRecipeById(id)
        setRecipe(data)

        // Check favorite status
        if (user) {
          const favStatus = await recipeService.isFavorite(user.id, id)
          setIsFavorite(favStatus)
        }
      } catch (error) {
        console.error('Error loading recipe:', error)
        toast({
          title: 'Fehler',
          description: 'Rezept konnte nicht geladen werden.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipe()
  }, [params.id, user, toast])

  const handleFavoriteToggle = async () => {
    if (!user || !recipe) {
      toast({
        title: 'Nicht angemeldet',
        description: 'Du musst angemeldet sein, um Favoriten zu speichern.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsTogglingFavorite(true)
      const newStatus = await recipeService.toggleFavorite(user.id, recipe.id)
      setIsFavorite(newStatus)

      toast({
        title: newStatus ? 'Zu Favoriten hinzugefügt' : 'Aus Favoriten entfernt',
        description: newStatus
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

  const handleAddToShoppingList = async () => {
    if (!user || !recipe) {
      toast({
        title: 'Nicht angemeldet',
        description: 'Du musst angemeldet sein, um Artikel zur Einkaufsliste hinzuzufügen.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsAddingToCart(true)
      await recipeService.addRecipeToShoppingList(user.id, recipe.id)

      toast({
        title: 'Zur Einkaufsliste hinzugefügt',
        description: `Alle Zutaten für "${recipe.title}" wurden zur Einkaufsliste hinzugefügt.`,
      })
    } catch (error) {
      console.error('Error adding to shopping list:', error)
      toast({
        title: 'Fehler',
        description: 'Zutaten konnten nicht hinzugefügt werden.',
        variant: 'destructive',
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Lade Rezept...</p>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <ChefHat className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Rezept nicht gefunden</h2>
        <Button onClick={() => router.push('/recipes')}>Zurück zu den Rezepten</Button>
      </div>
    )
  }

  const totalTime = recipe.prepTime + recipe.cookTime

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push('/recipes')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zurück zu den Rezepten
      </Button>

      {/* Hero Image & Title */}
      <div className="relative aspect-[21/9] overflow-hidden rounded-lg bg-muted">
        {recipe.imageUrl ? (
          <Image src={recipe.imageUrl} alt={recipe.title} fill className="object-cover" priority />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ChefHat className="h-32 w-32 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold tracking-tight mb-2">{recipe.title}</h1>
          <p className="text-lg opacity-90">{recipe.description}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleFavoriteToggle} disabled={isTogglingFavorite}>
          <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          {isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten'}
        </Button>
        <Button onClick={handleAddToShoppingList} disabled={isAddingToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Zur Einkaufsliste
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Info & Ingredients */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Gesamt</span>
                </div>
                <span className="font-medium">{totalTime} Min</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ChefHat className="h-4 w-4" />
                  <span className="text-sm">Schwierigkeit</span>
                </div>
                <span className="font-medium">{difficultyLabels[recipe.difficulty]}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Euro className="h-4 w-4" />
                  <span className="text-sm">Kosten</span>
                </div>
                <span className="font-medium">€{recipe.estimatedCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Portionen</span>
                </div>
                <span className="font-medium">{recipe.servings}</span>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Zutaten</CardTitle>
              <CardDescription>Für {recipe.servings} Portionen</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      <strong>
                        {ingredient.amount} {ingredient.unit}
                      </strong>{' '}
                      {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Nutrition */}
          {recipe.nutrition && (
            <Card>
              <CardHeader>
                <CardTitle>Nährwerte</CardTitle>
                <CardDescription>Pro Portion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kalorien</span>
                  <span className="font-medium">{recipe.nutrition.calories} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protein</span>
                  <span className="font-medium">{recipe.nutrition.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kohlenhydrate</span>
                  <span className="font-medium">{recipe.nutrition.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fett</span>
                  <span className="font-medium">{recipe.nutrition.fat}g</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Instructions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Zubereitung</CardTitle>
              <CardDescription>Schritt für Schritt</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="pt-1 leading-relaxed">{instruction}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-3 py-1 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
