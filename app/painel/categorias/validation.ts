import { z } from 'zod'

export const criarCategoriaSchema = z.object({
  nome: z.string().nullable().refine((val) => val !== null && val.trim().length >= 2, 'Nome da categoria deve ter pelo menos 2 caracteres').transform(val => val?.trim() || ''),
  cor: z.string().nullable().optional(),
  imagemUrl: z.string().nullable().optional().refine((val) => {
    if (val === null || val === undefined || val === '') return true
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  }, 'URL da imagem inválida').transform(val => val || null)
})

export const editarCategoriaSchema = z.object({
  nome: z.string().nullable().refine((val) => val !== null && val.trim().length >= 2, 'Nome da categoria deve ter pelo menos 2 caracteres').transform(val => val?.trim() || ''),
  cor: z.string().nullable().optional(),
  imagemUrl: z.string().nullable().optional().refine((val) => {
    if (val === null || val === undefined || val === '') return true
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  }, 'URL da imagem inválida').transform(val => val || null)
})

export type CriarCategoriaFormData = z.infer<typeof criarCategoriaSchema>
export type EditarCategoriaFormData = z.infer<typeof editarCategoriaSchema>
