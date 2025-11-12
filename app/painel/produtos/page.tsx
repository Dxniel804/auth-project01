import Link from "next/link"

export default function ProdutosPage() {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <p className="text-sm text-muted-foreground">Gerencie seus produtos aqui.</p>
      </header>

      <div className="space-y-4">
        <p>Em breve: CRUD de produtos.</p>
        <Link href="/painel" className="underline">Voltar ao painel</Link>
      </div>
    </div>
  )
}
