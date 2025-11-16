'use client'

import { useState } from 'react'
import { Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ShoppingListItem } from '@/lib/types/recipe'
import { cn } from '@/lib/utils'

interface ShoppingListItemProps {
  item: ShoppingListItem
  onToggle: (id: string, checked: boolean) => void
  onDelete: (id: string) => void
}

export function ShoppingListItemComponent({ item, onToggle, onDelete }: ShoppingListItemProps) {
  const [isChecked, setIsChecked] = useState(item.checked)

  const handleToggle = () => {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    onToggle(item.id, newChecked)
  }

  return (
    <Card className={cn('group transition-all', isChecked && 'opacity-60')}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
              isChecked
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input hover:border-primary'
            )}
          >
            {isChecked && <Check className="h-3 w-3" />}
          </button>

          {/* Item Info */}
          <div className="flex-1 min-w-0">
            <p className={cn('font-medium', isChecked && 'line-through text-muted-foreground')}>
              {item.amount} {item.unit} {item.name}
            </p>
          </div>

          {/* Delete Button */}
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
