import { LoginForm } from "@/components/login-form"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page() {
  // Verificar se usuário já está autenticado
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Se já estiver autenticado, redirecionar para o painel
  if (session?.user) {
    redirect("/painel")
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
