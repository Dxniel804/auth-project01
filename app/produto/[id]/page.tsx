import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma-client'
import { Button } from '@/components/ui/button'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

async function getProdutoById(id: string) {
  const produto = await prisma.produto.findUnique({
    where: { id },
    include: {
      categoria: true
    }
  })

  return produto
}

interface ProdutoPageProps {
  params: Promise<{ id: string | string[] }>
}

export default async function ProdutoPage({ params }: ProdutoPageProps) {
  const resolvedParams = await params
  const idParam = typeof resolvedParams?.id === 'string'
    ? resolvedParams.id
    : Array.isArray(resolvedParams?.id)
      ? resolvedParams.id[0]
      : undefined

  if (!idParam) {
    notFound()
  }

  const produto = await getProdutoById(idParam)

  if (!produto) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="flex w-full justify-center lg:w-auto lg:flex-1">
          <div className="relative aspect-[4/3] w-full max-w-sm sm:max-w-md lg:max-w-lg overflow-hidden rounded-2xl border bg-muted shadow-sm">
            {produto.imagemUrl ? (
              <Image
                src={produto.imagemUrl}
                alt={produto.nome}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                Sem imagem cadastrada
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Produto</p>
            <h1 className="text-4xl font-bold leading-tight">{produto.nome}</h1>
            {produto.categoria && (
              <Link
                href={`/categoria/${produto.categoria.slug ?? ''}`}
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                {produto.categoria.nome}
              </Link>
            )}
          </div>

          <div className="space-y-2 rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Preço</p>
            <p className="text-3xl font-semibold text-primary">
              {currencyFormatter.format(produto.preco)}
            </p>
          </div>

          {produto.descricao && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Descrição</h2>
              <p className="text-base text-muted-foreground whitespace-pre-line">{produto.descricao}</p>
            </div>
          )}

          <Button size="lg" className="w-full sm:w-auto">
            Adicionar ao Carrinho
          </Button>
        </div>
      </div>
    </div>
  )
}
