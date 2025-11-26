import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma-client'
import AddPedidos from './_components/add-pedidos'
import EditPedido from './_components/edit-pedido'
import DeletePedido from './_components/delete-pedido'

interface PedidoComCliente {
  id: string
  valorTotal: number
  status: string
  dataCriacao: Date
  cliente: {
    nome: string
  } | undefined
}

export default async function PedidosPage() {
  // Busca todos os pedidos, ordenando pelo mais recente, e inclui o nome do cliente associado
  const pedidos: PedidoComCliente[] = await prisma.pedido.findMany({
    orderBy: {
      dataCriacao: 'desc' // Ordena do mais novo para o mais antigo
    },
    include: {
      cliente: { 
        select: {
          nome: true // CORREÇÃO: Utilizando 'nome' conforme o seu schema.prisma
        }
      }
    }
  })

  // Função utilitária para formatar valores monetários
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor)
  }

  // Função utilitária para formatar a data
  const formatarData = (data: Date) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Pedidos</h1>
        <AddPedidos />
      </div>

      {pedidos.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center text-muted-foreground'>
          <p>Nenhum pedido cadastrado</p>
          <p className="text-sm">Clique em "Adicionar Pedido" para criar seu primeiro pedido.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Itera sobre os pedidos diretamente */}
          {pedidos.map((pedido: PedidoComCliente) => (
            <Card key={pedido.id} className="transition-shadow hover:shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1 text-lg">
                  Pedido #{pedido.id.slice(0, 8)}...
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 pb-3 text-sm">
                <p className="font-medium text-primary">
                  Valor: {formatarValor(pedido.valorTotal)}
                </p>

                <p className="text-muted-foreground">
                  Status: {pedido.status}
                </p>

                {/* Exibe o nome do cliente usando pedido.cliente.nome */}
                {pedido.cliente ? (
                  <p className="text-muted-foreground">Cliente: {pedido.cliente.nome}</p>
                ) : (
                  <p className="text-muted-foreground italic">Cliente não associado</p>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Data: {formatarData(pedido.dataCriacao)}
                </p>
              </CardContent>
              <CardFooter className='flex items-center justify-end gap-2'>
                {/* O componente EditPedido requer o objeto pedido completo */}
                <EditPedido pedido={pedido} /> 
                <DeletePedido pedido={pedido} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}