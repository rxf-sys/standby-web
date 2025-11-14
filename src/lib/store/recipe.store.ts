import { create } from 'zustand'
import type { Recipe, RecipeFilter, ShoppingListItem } from '@/lib/types/recipe'

interface RecipeStore {
  recipes: Recipe[]
  favoriteRecipes: Recipe[]
  selectedRecipe: Recipe | null
  filters: RecipeFilter
  shoppingList: ShoppingListItem[]

  // Recipes
  setRecipes: (recipes: Recipe[]) => void
  setSelectedRecipe: (recipe: Recipe | null) => void
  updateRecipeFavorite: (recipeId: string, isFavorite: boolean) => void

  // Favorites
  setFavoriteRecipes: (recipes: Recipe[]) => void
  addFavorite: (recipe: Recipe) => void
  removeFavorite: (recipeId: string) => void

  // Filters
  setFilters: (filters: RecipeFilter) => void
  resetFilters: () => void

  // Shopping List
  setShoppingList: (items: ShoppingListItem[]) => void
  addShoppingListItem: (item: ShoppingListItem) => void
  updateShoppingListItem: (id: string, checked: boolean) => void
  removeShoppingListItem: (id: string) => void
  clearCheckedItems: () => void
}

const initialFilters: RecipeFilter = {
  mealType: [],
  dietary: [],
  maxPrepTime: undefined,
  maxCost: undefined,
  difficulty: [],
  ingredients: [],
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  recipes: [],
  favoriteRecipes: [],
  selectedRecipe: null,
  filters: initialFilters,
  shoppingList: [],

  // Recipes
  setRecipes: (recipes) => set({ recipes }),

  setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),

  updateRecipeFavorite: (recipeId, isFavorite) =>
    set((state) => ({
      recipes: state.recipes.map((r) =>
        r.id === recipeId ? { ...r, isFavorite } : r
      ),
    })),

  // Favorites
  setFavoriteRecipes: (recipes) => set({ favoriteRecipes: recipes }),

  addFavorite: (recipe) =>
    set((state) => ({
      favoriteRecipes: [...state.favoriteRecipes, { ...recipe, isFavorite: true }],
    })),

  removeFavorite: (recipeId) =>
    set((state) => ({
      favoriteRecipes: state.favoriteRecipes.filter((r) => r.id !== recipeId),
    })),

  // Filters
  setFilters: (filters) => set({ filters }),

  resetFilters: () => set({ filters: initialFilters }),

  // Shopping List
  setShoppingList: (items) => set({ shoppingList: items }),

  addShoppingListItem: (item) =>
    set((state) => ({
      shoppingList: [...state.shoppingList, item],
    })),

  updateShoppingListItem: (id, checked) =>
    set((state) => ({
      shoppingList: state.shoppingList.map((item) =>
        item.id === id ? { ...item, checked } : item
      ),
    })),

  removeShoppingListItem: (id) =>
    set((state) => ({
      shoppingList: state.shoppingList.filter((item) => item.id !== id),
    })),

  clearCheckedItems: () =>
    set((state) => ({
      shoppingList: state.shoppingList.filter((item) => !item.checked),
    })),
}))
