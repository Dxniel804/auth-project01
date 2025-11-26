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
import { Edit } from 'lucide-react'
import { useState, useTransition } from 'react'
import { editarPedido } from '../actions' // Importa a Server Action de Pedidos
import { toast } from 'sonner'

// 💡 Se você estiver usando um componente Select para o status, ajuste esta importação.
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Define a estrutura mínima do objeto Pedido
interface Pedido {
  id: string
  valorTotal: number
  status: string // Exemplo: PENDENTE, CONCLUIDO, CANCELADO
  // Adicione outros campos necessários aqui (ex: clienteId, dataCriacao)
}

interface EditPedidoProps {
  pedido: Pedido
}

export default function EditPedido({ pedido }: EditPedidoProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(pedido.status) // Estado para o select de status

  async function handleSubmit(formData: FormData) {
    // Adiciona o status selecionado de volta ao FormData, pois Selects podem ser complicados em formulários nativos
    formData.append('status', status)

    startTransition(async () => {
      // Chama a Server Action, passando o ID e o FormData
      const result = await editarPedido(pedido.id, formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Pedido #${pedido.id.slice(0, 8)} atualizado com sucesso!`)
        setOpen(false)
      }
    })
  }

  // Lista de status disponíveis (ajuste conforme o seu schema.prisma)
  const statusOptions = ['PENDENTE', 'EM_PREPARACAO', 'CONCLUIDO', 'CANCELADO']
  
  // Função para formatar o valor para exibição no input (sem R$)
  const formatarValorInput = (valor: number) => valor.toFixed(2);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Pedido #{pedido.id.slice(0, 8)}...</DialogTitle>
          <DialogDescription>
            Altere o valor e o status do pedido.
          </DialogDescription>
        </DialogHeader>
        {/* Usa a Server Action diretamente no atributo action do formulário */}
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            
            {/* Campo Valor Total */}
            <div className="space-y-2">
              <Label htmlFor="valorTotal">Valor Total (R$)</Label>
              <Input
                id="valorTotal"
                name="valorTotal"
                type="number"
                step="0.01" // Permite decimais
                defaultValue={formatarValorInput(pedido.valorTotal)}
                placeholder="0.00"
                required
                disabled={isPending}
              />
            </div>

            {/* Campo Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                onValueChange={setStatus} 
                defaultValue={pedido.status}
                disabled={isPending}
              >
                <SelectTrigger id="status" name="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}