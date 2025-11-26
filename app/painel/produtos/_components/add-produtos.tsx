'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { criarProduto, getCategorias } from '../actions'

export default function AddProdutos() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [categorias, setCategorias] = useState<any[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      setFieldErrors({})
      const result = await criarProduto({ success: false, error: undefined }, formData)
      
      if (result.success) {
        toast.success('Produto criado com sucesso!')
        setOpen(false)
      } else {
        // Parse field errors from the error message
        const errors: Record<string, string> = {}
        if (result.error) {
          const errorParts = result.error.split(', ')
          errorParts.forEach(part => {
            if (part.includes(': ')) {
              const [field, message] = part.split(': ')
              errors[field] = message
            } else {
              // General error
              toast.error(part)
            }
          })
        }
        
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors)
        } else {
          toast.error(result.error || 'Erro ao criar produto')
        }
      }
    })
  }

  useEffect(() => {
    async function loadCategorias() {
      const cats = await getCategorias()
      setCategorias(cats)
    }
    loadCategorias()
  }, [])

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) {
        setFieldErrors({})
      }
    }}>
      <DialogTrigger asChild>
        <Button>Adicionar Produto</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
          <DialogDescription>
            Crie um novo produto para seu catálogo.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Ex: Pizza Calabresa"
        
                disabled={isPending}
              />
              {fieldErrors.nome && (
                <p className="text-sm text-red-500">{fieldErrors.nome}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                placeholder="Ex: Pizza tradicional com calabresa, queijo e tomate"
                disabled={isPending}
              />
              {fieldErrors.descricao && (
                <p className="text-sm text-red-500">{fieldErrors.descricao}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 35.90"

                disabled={isPending}
              />
              {fieldErrors.preco && (
                <p className="text-sm text-red-500">{fieldErrors.preco}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque</Label>
              <Input
                id="estoque"
                name="estoque"
                type="number"
                min="0"
                placeholder="Ex: 100"
        
                disabled={isPending}
              />
              {fieldErrors.estoque && (
                <p className="text-sm text-red-500">{fieldErrors.estoque}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoriaId">Categoria</Label>
              <Select name="categoriaId" disabled={isPending}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem categoria</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.categoriaId && (
                <p className="text-sm text-red-500">{fieldErrors.categoriaId}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Criando...' : 'Criar Produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}