import { z } from 'zod'

const StatusPedidoEnum = z.enum(['PENDENTE', 'EM_PREPARACAO', 'CONCLUIDO', 'CANCELADO'])

// Schema para um item do pedido
const itemPedidoSchema = z.object({
  produtoId: z.string().min(1, 'A seleção de produto é obrigatória.'),
  quantidade: z.coerce.number().int().positive('A quantidade deve ser um número inteiro positivo.').min(1, 'A quantidade é obrigatória.'),
})

// Schema para dados do cliente
const clienteSchema = z.object({
  nome: z.string().min(2, 'O nome do cliente deve ter pelo menos 2 caracteres.').trim().min(1, 'O nome do cliente é obrigatório.'),
  endereco: z.string().min(5, 'O endereço deve ter pelo menos 5 caracteres.').trim().min(1, 'O endereço é obrigatório.'),
  telefone: z.string().min(10, 'O telefone deve ter pelo menos 10 caracteres.').trim().min(1, 'O telefone é obrigatório.'),
})

export const criarPedidoSchema = z.object({
  cliente: clienteSchema,
  itens: z.array(itemPedidoSchema).min(1, 'Adicione pelo menos um produto ao pedido.'),
  status: StatusPedidoEnum.optional(),
})

export const editarPedidoSchema = z.object({
  valorTotal: z.coerce.number().positive('O valor total deve ser positivo.'),
  status: StatusPedidoEnum,
})

export type CriarPedidoFormData = z.infer<typeof criarPedidoSchema>
export type EditarPedidoFormData = z.infer<typeof editarPedidoSchema>

