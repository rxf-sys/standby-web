'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, Plus, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { logger } from '@/lib/services/logger.service'
import { ShoppingListItemComponent } from '@/components/recipes/shopping-list-item'
import { useAuthStore, useRecipeStore } from '@/lib/store'
import { recipeService } from '@/lib/services/recipe.service'
import { useToast } from '@/lib/hooks/use-toast'

export default function ShoppingListPage() {
  const { toast } = useToast()
  const user = useAuthStore((state) => state.user)
  const { shoppingList, setShoppingList, updateShoppingListItem, removeShoppingListItem } = useRecipeStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  // New item form
  const [newItemName, setNewItemName] = useState('')
  const [newItemAmount, setNewItemAmount] = useState('1')
  const [newItemUnit, setNewItemUnit] = useState('Stück')

  useEffect(() => {
    const loadShoppingList = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const data = await recipeService.getShoppingList(user.id)
        setShoppingList(data)
      } catch (error) {
        logger.error('Error loading shopping list:', error)
        toast({
          title: 'Fehler',
          description: 'Einkaufsliste konnte nicht geladen werden.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadShoppingList()
  }, [user, setShoppingList, toast])

  const handleToggleItem = async (id: string, checked: boolean) => {
    try {
      await recipeService.toggleShoppingListItem(id, checked)
      updateShoppingListItem(id, checked)
    } catch (error) {
      logger.error('Error toggling item:', error)
      toast({
        title: 'Fehler',
        description: 'Änderung konnte nicht gespeichert werden.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await recipeService.deleteShoppingListItem(id)
      removeShoppingListItem(id)
      toast({
        title: 'Gelöscht',
        description: 'Artikel wurde von der Einkaufsliste entfernt.',
      })
    } catch (error) {
      logger.error('Error deleting item:', error)
      toast({
        title: 'Fehler',
        description: 'Artikel konnte nicht gelöscht werden.',
        variant: 'destructive',
      })
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newItemName.trim()) return

    try {
      setIsAdding(true)
      const item = await recipeService.addToShoppingList(user.id, {
        name: newItemName.trim(),
        amount: parseFloat(newItemAmount) || 1,
        unit: newItemUnit,
      })
      setShoppingList([...shoppingList, item])
      setNewItemName('')
      setNewItemAmount('1')
      setNewItemUnit('Stück')
      toast({
        title: 'Hinzugefügt',
        description: `${item.name} wurde zur Einkaufsliste hinzugefügt.`,
      })
    } catch (error) {
      logger.error('Error adding item:', error)
      toast({
        title: 'Fehler',
        description: 'Artikel konnte nicht hinzugefügt werden.',
        variant: 'destructive',
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleClearChecked = async () => {
    if (!user) return
    if (!confirm('Möchtest du alle erledigten Artikel wirklich löschen?')) return

    try {
      await recipeService.clearShoppingList(user.id)
      setShoppingList(shoppingList.filter((item) => !item.checked))
      toast({
        title: 'Gelöscht',
        description: 'Alle erledigten Artikel wurden entfernt.',
      })
    } catch (error) {
      logger.error('Error clearing list:', error)
      toast({
        title: 'Fehler',
        description: 'Erledigte Artikel konnten nicht entfernt werden.',
        variant: 'destructive',
      })
    }
  }

  const uncheckedItems = shoppingList.filter((item) => !item.checked)
  const checkedItems = shoppingList.filter((item) => item.checked)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Lade Einkaufsliste...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Einkaufsliste</h1>
        <p className="text-muted-foreground mt-2">
          {uncheckedItems.length} {uncheckedItems.length === 1 ? 'Artikel' : 'Artikel'}
          {checkedItems.length > 0 && ` • ${checkedItems.length} erledigt`}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add Item Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Artikel hinzufügen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Artikel</Label>
                <Input
                  id="itemName"
                  placeholder="z.B. Milch"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="itemAmount">Menge</Label>
                  <Input
                    id="itemAmount"
                    type="number"
                    step="0.01"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemUnit">Einheit</Label>
                  <Input
                    id="itemUnit"
                    placeholder="z.B. L, kg, Stück"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isAdding}>
                <Plus className="mr-2 h-4 w-4" />
                Hinzufügen
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Shopping List */}
        <div className="lg:col-span-2 space-y-6">
          {shoppingList.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-2xl mb-2">Leere Einkaufsliste</CardTitle>
                <CardDescription className="text-center max-w-md">
                  Füge Artikel hinzu oder füge ein komplettes Rezept zur Einkaufsliste hinzu.
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Unchecked Items */}
              {uncheckedItems.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Zu kaufen</h2>
                  </div>
                  <div className="space-y-2">
                    {uncheckedItems.map((item) => (
                      <ShoppingListItemComponent
                        key={item.id}
                        item={item}
                        onToggle={handleToggleItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Checked Items */}
              {checkedItems.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-muted-foreground">
                      Erledigt ({checkedItems.length})
                    </h2>
                    <Button variant="ghost" size="sm" onClick={handleClearChecked}>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Alle erledigten löschen
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {checkedItems.map((item) => (
                      <ShoppingListItemComponent
                        key={item.id}
                        item={item}
                        onToggle={handleToggleItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
