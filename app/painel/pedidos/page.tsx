import Link from "next/link"

export default function PedidosPage() {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">Lista de pedidos</p>
      </header>

      <div className="space-y-4">
        <p>Em breve: interface para visualizar e gerenciar pedidos.</p>
        <Link href="/painel" className="underline">Voltar ao painel</Link>
      </div>
    </div>
  )
}
