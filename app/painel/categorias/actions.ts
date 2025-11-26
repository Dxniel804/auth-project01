'use server'

import { prisma } from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { criarCategoriaSchema, editarCategoriaSchema } from './validation'
import { ZodError } from 'zod'

export async function criarCategoria(prevState: { success: boolean; error?: string } | { error: string; success?: undefined }, formData: FormData) {
  try {
    // Validar dados com Zod
    const validatedData = criarCategoriaSchema.parse({
      nome: formData.get('nome')
    })

    const { nome } = validatedData

    await prisma.categoria.create({
      data: {
        nome: nome.trim(),
      },
    })

    revalidatePath('/painel/categorias')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.issues.map((err: any) => err.message).join(', ')
      return { error: fieldErrors }
    }
    
    console.error('Erro ao criar categoria:', error)
    return { error: 'Erro ao criar categoria' }
  }
}

export async function editarCategoria(id: string, formData: FormData) {
  try {
    // Validar dados com Zod
    const validatedData = editarCategoriaSchema.parse({
      nome: formData.get('nome')
    })

    const { nome } = validatedData

    await prisma.categoria.update({
      where: { id },
      data: {
        nome: nome.trim(),
      },
    })

    revalidatePath('/painel/categorias')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.issues.map((err: any) => err.message).join(', ')
      return { error: fieldErrors }
    }
    
    console.error('Erro ao editar categoria:', error)
    return { error: 'Erro ao editar categoria' }
  }
}

export async function excluirCategoria(id: string) {
  try {
  await prisma.categoria.delete({
      where: { id },
    })

    revalidatePath('/painel/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    return { error: 'Erro ao excluir categoria' }
  }
}