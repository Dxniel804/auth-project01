'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

const CART_STORAGE_KEY = 'app-cart'

type CartItem = {
  id: string
  nome: string
  preco: number
  imagemUrl?: string | null
  quantity: number
}

interface AddToCartButtonProps {
  product: {
    id: string
    nome: string
    preco: number
    imagemUrl?: string | null
  }
}

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (error) {
    console.error('Erro ao ler carrinho:', error)
    return []
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [itemQuantityInCart, setItemQuantityInCart] = useState(0)

  useEffect(() => {
    const currentCart = readCart()
    const total = currentCart.reduce((sum, item) => sum + item.quantity, 0)
    setCartCount(total)
    const existing = currentCart.find((item) => item.id === product.id)
    setItemQuantityInCart(existing?.quantity ?? 0)
  }, [])

  function updateCartStates(cart: CartItem[]) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0)
    setCartCount(total)
    const existing = cart.find((item) => item.id === product.id)
    setItemQuantityInCart(existing?.quantity ?? 0)
  }

  function handleAddToCart() {
    setIsAdding(true)
    try {
      const currentCart = readCart()
      const existingItemIndex = currentCart.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        currentCart[existingItemIndex].quantity += 1
        toast.success('Quantidade atualizada no carrinho')
      } else {
        currentCart.push({
          id: product.id,
          nome: product.nome,
          preco: product.preco,
          imagemUrl: product.imagemUrl,
          quantity: 1,
        })
        toast.success('Produto adicionado ao carrinho')
      }

      writeCart(currentCart)

      updateCartStates(currentCart)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      toast.error('Não foi possível adicionar o produto ao carrinho')
    } finally {
      setIsAdding(false)
    }
  }

  function handleRemoveOne() {
    setIsRemoving(true)
    try {
      const currentCart = readCart()
      const existingItemIndex = currentCart.findIndex((item) => item.id === product.id)

      if (existingItemIndex === -1) {
        toast.info('Produto não está no carrinho')
        return
      }

      const existingQuantity = currentCart[existingItemIndex].quantity

      if (existingQuantity <= 1) {
        currentCart.splice(existingItemIndex, 1)
        toast.success('Produto removido do carrinho')
      } else {
        currentCart[existingItemIndex].quantity -= 1
        toast.success('Uma unidade foi removida')
      }

      writeCart(currentCart)
      updateCartStates(currentCart)
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error)
      toast.error('Não foi possível remover o produto do carrinho')
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative inline-flex items-center justify-center">
        <ShoppingCart
          className={`h-10 w-10 text-primary transition-transform ${isAnimating ? 'animate-bounce' : ''}`}
        />
        <span className="absolute -top-1 -right-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
          {cartCount}
        </span>
      </div>
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={isAdding}>
          {isAdding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          onClick={handleRemoveOne}
          disabled={isRemoving || itemQuantityInCart === 0}
        >
          {isRemoving ? 'Removendo...' : 'Remover 1 do Carrinho'}
        </Button>
      </div>
    </div>
  )
}
