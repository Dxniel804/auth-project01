"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const senha = form.get("senha") as string
    setError("")
    setLoading(true)
    try {
      await authClient.signUp.email({ email, password: senha }, {
        onSuccess: () => router.push("/login"),
        onResponse: () => setLoading(false),
        onError: (ctx: any) => setError(ctx?.error?.message || "Erro ao registrar"),
      })
    } catch (err) {
      setError(String(err))
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="senha">Senha</label>
        <input id="senha" name="senha" type="password" required minLength={6} />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <button type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Registrar'}</button>
    </form>
  )
}
