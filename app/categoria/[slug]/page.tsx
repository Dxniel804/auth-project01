import Link from 'next/link'
import { prisma } from '@/lib/prisma-client'
import { notFound } from 'next/navigation'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

async function getCategoriaComProdutos(slug: string) {
  const categoria = await prisma.categoria.findUnique({
    where: { slug },
    include: {
      produtos: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!categoria) {
    return null
  }

  return categoria
}

interface CategoriaPageProps {
  params: Promise<{ slug: string | string[] }>
}

export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const resolvedParams = await params
  const slugParam = typeof resolvedParams?.slug === 'string'
    ? resolvedParams.slug
    : Array.isArray(resolvedParams?.slug)
      ? resolvedParams.slug[0]
      : undefined

  if (!slugParam) {
    notFound()
  }

  const categoria = await getCategoriaComProdutos(decodeURIComponent(slugParam))

  if (!categoria) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Categoria</p>
        <h1 className="text-3xl font-bold">{categoria.nome}</h1>
        <p className="text-sm text-muted-foreground">/{categoria.slug}</p>
      </div>

      {categoria.produtos.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          Nenhum produto cadastrado para esta categoria ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoria.produtos.map((produto: (typeof categoria.produtos)[number]) => (
            <Link
              key={produto.id}
              href={`/produto/${produto.id}`}
              className="overflow-hidden rounded-lg border bg-background shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {produto.imagemUrl ? (
                <div className="relative aspect-video">
                  <img
                    src={produto.imagemUrl}
                    alt={produto.nome}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-muted text-sm text-muted-foreground">
                  Sem imagem
                </div>
              )}

              <div className="space-y-3 p-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold leading-tight">{produto.nome}</h3>
                  {produto.descricao && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{produto.descricao}</p>
                  )}
                </div>

                <p className="text-base font-semibold text-primary">
                  {currencyFormatter.format(produto.preco)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
