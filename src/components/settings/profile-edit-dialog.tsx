'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/lib/hooks/use-toast'
import { authService } from '@/lib/services/auth.service'
import { useAuthStore } from '@/lib/store'
import type { User } from '@/lib/types'

const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name ist erforderlich')
    .max(100, 'Name ist zu lang'),
  avatarUrl: z
    .string()
    .url('Ungültige URL')
    .optional()
    .or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

export function ProfileEditDialog({ open, onOpenChange, user }: ProfileEditDialogProps) {
  const { toast } = useToast()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      avatarUrl: user.avatarUrl || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)

      const updatedUser = await authService.updateProfile(user.id, {
        name: data.name,
        avatarUrl: data.avatarUrl || undefined,
      })

      // Update local state
      login(updatedUser)

      toast({
        title: 'Profil aktualisiert',
        description: 'Deine Änderungen wurden erfolgreich gespeichert.',
        variant: 'success',
      })

      onOpenChange(false)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Fehler',
        description: error.message || 'Profil konnte nicht aktualisiert werden.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Profil bearbeiten</DialogTitle>
            <DialogDescription>
              Aktualisiere deine persönlichen Informationen
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Dein Name"
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Avatar URL */}
            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
              <Input
                id="avatarUrl"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                {...register('avatarUrl')}
                disabled={isLoading}
              />
              {errors.avatarUrl && (
                <p className="text-sm text-destructive">{errors.avatarUrl.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Gib die URL zu einem Profilbild ein
              </p>
            </div>

            {/* Email (read-only) */}
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                E-Mail kann derzeit nicht geändert werden
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Wird gespeichert...
                </>
              ) : (
                'Speichern'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
