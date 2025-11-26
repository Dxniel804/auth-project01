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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { criarPedido } from '../actions'
import { getProdutos } from '../../produtos/actions'
import { Trash2, Plus } from 'lucide-react'

interface ItemPedido {
  produtoId: string
  quantidade: number
}

export default function AddPedidos() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [produtos, setProdutos] = useState<any[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [itens, setItens] = useState<ItemPedido[]>([{ produtoId: '', quantidade: 1 }])

  useEffect(() => {
    async function loadProdutos() {
      const prods = await getProdutos()
      setProdutos(prods)
    }
    loadProdutos()
  }, [])

  function adicionarItem() {
    setItens([...itens, { produtoId: '', quantidade: 1 }])
  }

  function removerItem(index: number) {
    if (itens.length > 1) {
      const novosItens = itens.filter((_, i) => i !== index)
      setItens(novosItens)
    }
  }

  function atualizarItem(index: number, campo: keyof ItemPedido, valor: string | number) {
    const novosItens = [...itens]
    if (campo === 'quantidade') {
      novosItens[index][campo] = Number(valor)
    } else {
      novosItens[index][campo] = valor as string
    }
    setItens(novosItens)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log('=== FORMULÁRIO ENVIADO ===')
    
    startTransition(async () => {
      console.log('=== INÍCIO DA TRANSITION ===')
      setFieldErrors({})
      
      // Criar FormData com os dados do formulário
      const formData = new FormData(event.currentTarget)
      
      // Filtrar itens válidos
      const itensValidos = itens.filter(item => item.produtoId && item.quantidade > 0)
      console.log('Itens válidos:', itensValidos)
      console.log('Todos os itens:', itens)
      
      // Verificar se há itens válidos
      if (itensValidos.length === 0) {
        toast.error('Adicione pelo menos um produto ao pedido')
        return
      }
      
      // Adicionar os itens ao FormData
      formData.set('itens', JSON.stringify(itensValidos))
      
      console.log('Enviando para o servidor...')
      const result = await criarPedido({ success: false, error: undefined }, formData)
      
      console.log('Resposta do servidor:', result)
      
      if (result.success) {
        toast.success('Pedido criado com sucesso!')
        setOpen(false)
        setItens([{ produtoId: '', quantidade: 1 }])
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
          toast.error(result.error || 'Erro ao criar pedido')
        }
      }
      
      console.log('=== FIM DA TRANSITION ===')
    })
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) {
        setFieldErrors({})
        setItens([{ produtoId: '', quantidade: 1 }])
      }
    }}>
      <DialogTrigger asChild>
        <Button>Adicionar Pedido</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Pedido</DialogTitle>
          <DialogDescription>
            Crie um novo pedido para registrar suas vendas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Dados do Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dados do Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clienteNome">Nome do Cliente</Label>
                  <Input
                    id="clienteNome"
                    name="clienteNome"
                    placeholder="Ex: João Silva"
                    disabled={isPending}
                  />
                  {fieldErrors['cliente.nome'] && (
                    <p className="text-sm text-red-500">{fieldErrors['cliente.nome']}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clienteTelefone">Telefone</Label>
                  <Input
                    id="clienteTelefone"
                    name="clienteTelefone"
                    placeholder="Ex: (11) 98765-4321"
                    disabled={isPending}
                  />
                  {fieldErrors['cliente.telefone'] && (
                    <p className="text-sm text-red-500">{fieldErrors['cliente.telefone']}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clienteEndereco">Endereço</Label>
                <Input
                  id="clienteEndereco"
                  name="clienteEndereco"
                  placeholder="Ex: Rua das Flores, 123 - Bairro Centro"
                  disabled={isPending}
                />
                {fieldErrors['cliente.endereco'] && (
                  <p className="text-sm text-red-500">{fieldErrors['cliente.endereco']}</p>
                )}
              </div>
            </div>

            {/* Produtos do Pedido */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Produtos do Pedido</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarItem}
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>

              {itens.map((item, index) => (
                <div key={index} className="flex gap-2 items-end p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`produto-${index}`}>Produto</Label>
                    <Select
                      value={item.produtoId}
                      onValueChange={(value) => atualizarItem(index, 'produtoId', value)}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {produtos.map((produto) => (
                          <SelectItem key={produto.id} value={produto.id}>
                            {produto.nome} - R$ {produto.preco.toFixed(2)}
                            {produto.categoria?.cliente && ` - Cliente: ${produto.categoria.cliente.nome}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-32 space-y-2">
                    <Label htmlFor={`quantidade-${index}`}>Quantidade</Label>
                    <Input
                      id={`quantidade-${index}`}
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => atualizarItem(index, 'quantidade', e.target.value)}
                      disabled={isPending}
                    />
                  </div>

                  {itens.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removerItem(index)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {fieldErrors.itens && (
                <p className="text-sm text-red-500">{fieldErrors.itens}</p>
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
              {isPending ? 'Criando...' : 'Criar Pedido'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
