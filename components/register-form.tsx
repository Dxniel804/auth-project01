'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Loader2 } from 'lucide-react'

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nome = formData.get('name') as string
    const email = formData.get('email') as string
    const senha = formData.get('senha') as string

    setError('')
    setLoading(true)

    authClient.signUp.email(
      {
        name: nome,
        email,
        password: senha
      },
      {
        onSuccess: () => {
          router.push('/login')
        },
        onError: (ctx) => {
          setError(ctx.error.message ?? 'Erro ao registrar. Tente novamente.')
        },
        onResponse: () => {
          setLoading(false)
        }
      }
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-semibold">Criar conta</CardTitle>
        <CardDescription>Preencha seus dados para acessar o painel.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" name="name" placeholder="Maria Silva" disabled={loading} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="seu@email.com" disabled={loading} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input id="senha" name="senha" type="password" placeholder="••••••••" disabled={loading} required />
          </div>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Registrando...
              </div>
            ) : (
              'Criar conta'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground text-center justify-center">
        Já possui uma conta? <a href="/login" className="ml-1 underline">Entrar</a>
      </CardFooter>
    </Card>
  )
}