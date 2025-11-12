import Link from "next/link"

export default function PainelPage() {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Painel</h1>
        <p className="text-sm text-muted-foreground">Área administrativa</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <article className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Categorias</h2>
          <p className="text-sm text-muted-foreground">Gerencie categorias de produtos.</p>
          <div className="mt-4">
            <Link href="/painel/categorias" className="underline">Abrir categorias</Link>
          </div>
        </article>

        <article className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Produtos</h2>
          <p className="text-sm text-muted-foreground">Adicione ou edite produtos.</p>
          <div className="mt-4">
            <Link href="/painel/produtos" className="underline">Abrir produtos</Link>
          </div>
        </article>

        <article className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Pedidos</h2>
          <p className="text-sm text-muted-foreground">Acompanhe pedidos de clientes.</p>
          <div className="mt-4">
            <Link href="/painel/pedidos" className="underline">Abrir pedidos</Link>
          </div>
        </article>
      </section>
    </div>
  )
}
