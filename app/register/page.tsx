import RegisterForm from '@/components/register-form'
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
    <div className="max-w-md mx-auto p-4">
      <RegisterForm />
    </div>
  )
}