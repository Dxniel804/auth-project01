import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"
import UserMenu from "@/components/user-menu"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function PainelLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Verificar autenticação
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    // In development, avoid forcing a redirect so you can debug the painel UI
    // without having an authenticated session. In production the redirect
    // will still occur.
    if (process.env.NODE_ENV !== "development") {
      redirect("/login")
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <SidebarTrigger />
          <UserMenu />
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}