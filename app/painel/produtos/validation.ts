import { z } from 'zod'

const imagemUrlSchema = z
  .string()
  .nullable()
  .optional()
  .transform((val) => (val ? val.trim() : null))
  .refine((val) => {
    if (!val || val.length === 0) return true
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  }, 'URL da imagem inválida.')

export const criarProdutoSchema = z.object({
  nome: z.string().min(2, 'Nome do produto deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo').trim(),
  descricao: z.string().max(500, 'Descrição muito longa').optional(),
  preco: z.coerce.number().positive('O preço deve ser positivo.'),
  estoque: z.coerce.number().int().min(0, 'O estoque deve ser um número inteiro não negativo.'),
  categoriaId: z.string().min(1, 'Categoria é obrigatória.'),
  imagemUrl: imagemUrlSchema
})

export const editarProdutoSchema = z.object({
  nome: z.string().min(2, 'Nome do produto deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo').trim(),
  descricao: z.string().max(500, 'Descrição muito longa').optional(),
  preco: z.coerce.number().positive('O preço deve ser positivo.'),
  estoque: z.coerce.number().int().min(0, 'O estoque deve ser um número inteiro não negativo.'),
  categoriaId: z.string().min(1, 'Categoria é obrigatória.'),
  imagemUrl: imagemUrlSchema
})

export type CriarProdutoFormData = z.infer<typeof criarProdutoSchema>
export type EditarProdutoFormData = z.infer<typeof editarProdutoSchema>

export interface Produto {
  id: string
  nome: string
  descricao?: string
  imagemUrl?: string | null
  preco: number
  estoque: number
  categoriaId?: string
  createdAt: Date
  updatedAt: Date
  categoria?: {
    id: string
    nome: string
    createdAt: Date
    updatedAt: Date
    cor?: string | null
    imagemUrl?: string | null
    clienteId?: string | null
    cliente?: {
      id: string
      nome: string
      endereco?: string | null
      telefone?: string | null
    } | null
  }
}