'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const CART_STORAGE_KEY = 'app-cart'
const ORDERS_STORAGE_KEY = 'app-orders'

const checkoutSchema = z.object({
  nome: z.string().min(1, 'Informe seu nome completo'),
  email: z.string().email('Informe um e-mail válido'),
  telefone: z
    .string()
    .min(10, 'Informe um telefone válido com DDD')
    .max(20, 'Telefone muito longo'),
})

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

type CartItem = {
  id: string
  nome: string
  preco: number
  imagemUrl?: string | null
  quantity: number
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
    },
  })

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

  const onSubmit = handleSubmit(async (data) => {
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio. Adicione itens antes de finalizar.')
      return
    }

    try {
      const order = {
        id: crypto.randomUUID?.() ?? Date.now().toString(),
        cliente: data,
        total,
        itens: items,
        criadoEm: new Date().toISOString(),
      }

      const rawOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY)
      const orders = rawOrders ? JSON.parse(rawOrders) : []
      orders.push(order)
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))

      window.localStorage.removeItem(CART_STORAGE_KEY)
      setItems([])
      reset()
      toast.success('Pedido registrado! Em breve entraremos em contato.')
    } catch (error) {
      console.error('Erro ao registrar pedido:', error)
      toast.error('Não foi possível registrar o pedido. Tente novamente.')
    }
  })

  return (
    <div className="container mx-auto max-w-5xl space-y-10 px-4 py-10">
      <div className="flex flex-col gap-3 text-center">
        <Link
          href="/carrinho"
          className="mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          ← Voltar para o carrinho
        </Link>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Checkout</p>
          <h1 className="text-3xl font-bold">Finalize seu pedido</h1>
          <p className="text-muted-foreground">Informe seus dados e confirme as informações para concluir a compra.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Informações do cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" placeholder="Ex.: Maria Silva" {...register('nome')} disabled={isSubmitting} />
                {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(11) 99999-9999" {...register('telefone')} disabled={isSubmitting} />
                {errors.telefone && <p className="text-sm text-destructive">{errors.telefone.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || items.length === 0}>
                {isSubmitting ? 'Registrando pedido...' : 'Confirmar pedido'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Os dados serão usados apenas para contato sobre este pedido.
          </CardFooter>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Resumo do pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Seu carrinho está vazio. Adicione itens para continuar.</p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.nome}</p>
                        <p className="text-muted-foreground">Qtd: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">
                        {currencyFormatter.format(item.preco * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Total de itens</span>
                    <span>{totalItens}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{currencyFormatter.format(total)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
