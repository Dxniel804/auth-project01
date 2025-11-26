import { z } from 'zod'

export const criarCategoriaSchema = z.object({
  nome: z.string().min(2, 'Nome da categoria deve ter pelo menos 2 caracteres').max(50, 'Nome muito longo').trim()
})

export const editarCategoriaSchema = z.object({
  nome: z.string().min(2, 'Nome da categoria deve ter pelo menos 2 caracteres').max(50, 'Nome muito longo').trim()
})

export type CriarCategoriaFormData = z.infer<typeof criarCategoriaSchema>
export type EditarCategoriaFormData = z.infer<typeof editarCategoriaSchema>
