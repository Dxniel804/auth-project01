import "./globals.css"
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Root layout is minimal. The sidebar and authenticated UI live under
  // `app/painel/layout.tsx` so public routes like /login render without it.
  return (
    <html lang="pt-BR">
      <body>
        <Toaster richColors closeButton position="top-center" />
        {children}
      </body>
    </html>
  )
}