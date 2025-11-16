'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authService } from '@/lib/services/auth.service'
import { toast } from '@/lib/hooks/use-toast'
import { ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authService.resetPassword(email)
      setEmailSent(true)
      toast({
        title: 'E-Mail gesendet!',
        description: 'Bitte überprüfe dein E-Mail-Postfach für weitere Anweisungen.',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message || 'E-Mail konnte nicht gesendet werden.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">E-Mail gesendet! ✉️</CardTitle>
            <CardDescription>
              Wir haben dir eine E-Mail mit Anweisungen zum Zurücksetzen deines Passworts gesendet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bitte überprüfe dein E-Mail-Postfach (auch den Spam-Ordner) und folge den Anweisungen.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zur Anmeldung
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Passwort zurücksetzen</CardTitle>
          <CardDescription>
            Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen zu erhalten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Wird gesendet...' : 'Link zum Zurücksetzen senden'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="text-primary hover:underline font-medium inline-flex items-center">
              <ArrowLeft className="h-3 w-3 mr-1" />
              Zurück zur Anmeldung
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
