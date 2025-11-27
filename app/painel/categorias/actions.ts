'use server'

import { prisma } from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { criarCategoriaSchema, editarCategoriaSchema } from './validation'
import { ZodError } from 'zod'
import { generateSlug } from '@/lib/slug'

export async function criarCategoria(prevState: { success: boolean; error?: string } | { error: string; success?: undefined }, formData: FormData) {
  try {
    // Validar dados com Zod
    const validatedData = criarCategoriaSchema.parse({
      nome: formData.get('nome'),
      cor: formData.get('cor'),
      imagemUrl: formData.get('imagemUrl')
    })

    const { nome, cor, imagemUrl } = validatedData

    const baseSlug = generateSlug(nome)
    let slug = baseSlug
    let counter = 1

    while (await prisma.categoria.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    await prisma.categoria.create({
      data: {
        nome: nome.trim(),
        slug,
        cor: cor || "bg-blue-500",
        imagemUrl: imagemUrl || null,
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
      nome: formData.get('nome'),
      cor: formData.get('cor'),
      imagemUrl: formData.get('imagemUrl')
    })

    const { nome, cor, imagemUrl } = validatedData

    const baseSlug = generateSlug(nome)
    let slug = baseSlug
    let counter = 1

    while (
      await prisma.categoria.findFirst({
        where: {
          slug,
          NOT: {
            id,
          },
        },
      })
    ) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    await prisma.categoria.update({
      where: { id },
      data: {
        nome: nome.trim(),
        slug,
        cor: cor || "bg-blue-500",
        imagemUrl: imagemUrl || null,
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