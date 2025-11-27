'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const CART_STORAGE_KEY = 'app-cart'

interface CartItem {
  id: string
  nome: string
  preco: number
  imagemUrl?: string | null
  quantity: number
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

export default function CarrinhoPage() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    function loadCart() {
      try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY)
        if (!raw) {
          setItems([])
          return
        }
        const parsed: CartItem[] = JSON.parse(raw)
        setItems(parsed)
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
        setItems([])
      }
    }

    loadCart()

    function handleStorage(event: StorageEvent) {
      if (event.key === CART_STORAGE_KEY) {
        loadCart()
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.preco * item.quantity, 0)
  }, [items])

  const totalItens = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="flex flex-col items-center gap-4 text-center">
        <Link
          href="/painel"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          ← Voltar para o painel
        </Link>
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Carrinho</p>
          <h1 className="text-3xl font-bold">
            {totalItens > 0 ? `${totalItens} item${totalItens > 1 ? 's' : ''} no carrinho` : 'Seu carrinho está vazio'}
          </h1>
        </div>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-10 text-center text-muted-foreground">
            <p>Adicione produtos a partir das categorias ou página de detalhes para vê-los aqui.</p>
            <Button asChild>
              <Link href="/painel/categorias">Explorar categorias</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4">
                  {item.imagemUrl ? (
                    <img
                      src={item.imagemUrl}
                      alt={item.nome}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-xl">{item.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Quantidade: <span className="font-semibold text-foreground">{item.quantity}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Preço unitário: {currencyFormatter.format(item.preco)}
                    </p>
                  </div>
                  <div className="text-right text-lg font-semibold">
                    {currencyFormatter.format(item.preco * item.quantity)}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total de itens</span>
                <span>{totalItens}</span>
              </div>
              <div className="flex items-center justify-between text-xl font-semibold">
                <span>Total</span>
                <span>{currencyFormatter.format(total)}</span>
              </div>

              <Button asChild disabled={items.length === 0} className="w-full mt-4">
                <Link href="/checkout">Finalizar pedido</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
