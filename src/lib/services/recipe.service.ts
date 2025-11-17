import { supabase } from './supabase'
import type { Recipe, RecipeFilter, ShoppingListItem, Ingredient } from '@/lib/types/recipe'

export const recipeService = {
  // Get all recipes with optional filters
  async getRecipes(filters?: RecipeFilter) {
    let query = supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters if provided
    if (filters?.mealType && filters.mealType.length > 0) {
      query = query.overlaps('meal_types', filters.mealType)
    }

    if (filters?.dietary && filters.dietary.length > 0) {
      query = query.overlaps('dietary', filters.dietary)
    }

    if (filters?.maxPrepTime) {
      query = query.lte('prep_time', filters.maxPrepTime)
    }

    if (filters?.maxCost) {
      query = query.lte('estimated_cost', filters.maxCost)
    }

    if (filters?.difficulty && filters.difficulty.length > 0) {
      query = query.in('difficulty', filters.difficulty)
    }

    const { data, error } = await query

    if (error) throw error

    // Map database fields to camelCase
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image_url,
      prepTime: item.prep_time,
      cookTime: item.cook_time,
      servings: item.servings,
      difficulty: item.difficulty,
      estimatedCost: parseFloat(item.estimated_cost),
      mealType: item.meal_types || [],
      dietary: item.dietary || [],
      ingredients: item.ingredients || [],
      instructions: item.instructions || [],
      nutrition: item.nutrition,
      tags: item.tags || [],
      isFavorite: false, // Will be set by checking user favorites
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })) as Recipe[]
  },

  // Get a single recipe by ID
  async getRecipeById(id: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url,
      prepTime: data.prep_time,
      cookTime: data.cook_time,
      servings: data.servings,
      difficulty: data.difficulty,
      estimatedCost: parseFloat(data.estimated_cost),
      mealType: data.meal_types || [],
      dietary: data.dietary || [],
      ingredients: data.ingredients || [],
      instructions: data.instructions || [],
      nutrition: data.nutrition,
      tags: data.tags || [],
      isFavorite: false,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Recipe
  },

  // Get user's favorite recipes
  async getFavoriteRecipes(userId: string) {
    const { data, error } = await supabase
      .from('user_favorite_recipes')
      .select('recipe_id, recipes(*)')
      .eq('user_id', userId)

    if (error) throw error

    return (data || []).map((item: any) => ({
      id: item.recipes.id,
      title: item.recipes.title,
      description: item.recipes.description,
      imageUrl: item.recipes.image_url,
      prepTime: item.recipes.prep_time,
      cookTime: item.recipes.cook_time,
      servings: item.recipes.servings,
      difficulty: item.recipes.difficulty,
      estimatedCost: parseFloat(item.recipes.estimated_cost),
      mealType: item.recipes.meal_types || [],
      dietary: item.recipes.dietary || [],
      ingredients: item.recipes.ingredients || [],
      instructions: item.recipes.instructions || [],
      nutrition: item.recipes.nutrition,
      tags: item.recipes.tags || [],
      isFavorite: true,
      createdAt: item.recipes.created_at,
      updatedAt: item.recipes.updated_at,
    })) as Recipe[]
  },

  // Check if recipe is favorited by user
  async isFavorite(userId: string, recipeId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_favorite_recipes')
      .select('id')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return !!data
  },

  // Add recipe to favorites
  async addToFavorites(userId: string, recipeId: string) {
    const { error } = await supabase
      .from('user_favorite_recipes')
      .insert({
        user_id: userId,
        recipe_id: recipeId,
      })

    if (error) throw error
  },

  // Remove recipe from favorites
  async removeFromFavorites(userId: string, recipeId: string) {
    const { error } = await supabase
      .from('user_favorite_recipes')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)

    if (error) throw error
  },

  // Toggle favorite status
  async toggleFavorite(userId: string, recipeId: string): Promise<boolean> {
    const isFav = await this.isFavorite(userId, recipeId)

    if (isFav) {
      await this.removeFromFavorites(userId, recipeId)
      return false
    } else {
      await this.addToFavorites(userId, recipeId)
      return true
    }
  },

  // Shopping List
  async getShoppingList(userId: string) {
    const { data, error } = await supabase
      .from('shopping_list_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      recipeId: item.recipe_id,
      name: item.name,
      amount: parseFloat(item.amount),
      unit: item.unit,
      checked: item.checked,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })) as ShoppingListItem[]
  },

  async addToShoppingList(userId: string, item: Omit<ShoppingListItem, 'id' | 'userId' | 'checked' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('shopping_list_items')
      .insert({
        user_id: userId,
        recipe_id: item.recipeId || null,
        name: item.name,
        amount: item.amount,
        unit: item.unit,
        checked: false,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      recipeId: data.recipe_id,
      name: data.name,
      amount: parseFloat(data.amount),
      unit: data.unit,
      checked: data.checked,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as ShoppingListItem
  },

  async addRecipeToShoppingList(userId: string, recipeId: string) {
    // Get the recipe
    const recipe = await this.getRecipeById(recipeId)

    // Add each ingredient to shopping list
    const promises = recipe.ingredients.map((ingredient: Ingredient) =>
      this.addToShoppingList(userId, {
        recipeId,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      })
    )

    await Promise.all(promises)
  },

  async toggleShoppingListItem(id: string, checked: boolean) {
    const { error } = await supabase
      .from('shopping_list_items')
      .update({ checked })
      .eq('id', id)

    if (error) throw error
  },

  async deleteShoppingListItem(id: string) {
    const { error } = await supabase
      .from('shopping_list_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async clearShoppingList(userId: string) {
    const { error } = await supabase
      .from('shopping_list_items')
      .delete()
      .eq('user_id', userId)
      .eq('checked', true)

    if (error) throw error
  },
}
