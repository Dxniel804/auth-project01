'use server'

import { prisma } from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { criarProdutoSchema, editarProdutoSchema } from './validation'
import { ZodError } from 'zod'

export async function criarProduto(prevState: { success: boolean; error?: string } | { error: string; success?: undefined }, formData: FormData) {
  try {
    // Validar dados com Zod
    const validatedData = criarProdutoSchema.parse({
      nome: formData.get('nome'),
      descricao: formData.get('descricao'),
      preco: formData.get('preco'),
      estoque: formData.get('estoque'),
      categoriaId: formData.get('categoriaId')
    })

    const { nome, descricao, preco, estoque, categoriaId } = validatedData
    const categoriaIdFinal = categoriaId === 'none' ? '' : categoriaId

    await prisma.produto.create({
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        preco: preco,
        estoque: estoque,
        categoriaId: categoriaIdFinal || null,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.issues.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ")
      return { error: fieldErrors }
    }
    
    console.error('Erro ao criar produto:', error)
    return { error: 'Erro ao criar produto' }
  }
}

export async function editarProduto(id: string, formData: FormData) {
  try {
    // Validar dados com Zod
    const validatedData = editarProdutoSchema.parse({
      nome: formData.get('nome'),
      descricao: formData.get('descricao'),
      preco: formData.get('preco'),
      estoque: formData.get('estoque'),
      categoriaId: formData.get('categoriaId')
    })

    const { nome, descricao, preco, estoque, categoriaId } = validatedData
    const categoriaIdFinal = categoriaId === 'none' ? '' : categoriaId

    await prisma.produto.update({
      where: { id },
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        preco: preco,
        estoque: estoque,
        categoriaId: categoriaIdFinal || null,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.issues.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ")
      return { error: fieldErrors }
    }
    
    console.error('Erro ao editar produto:', error)
    return { error: 'Erro ao editar produto' }
  }
}

export async function excluirProduto(id: string) {
  try {
    await prisma.produto.delete({
      where: { id },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return { error: 'Erro ao excluir produto' }
  }
}

export async function getProdutos() {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        categoria: {
          include: {
            cliente: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    // Transform null values to undefined to match component interfaces
    return produtos.map(produto => ({
      ...produto,
      descricao: produto.descricao || undefined,
      categoriaId: produto.categoriaId || undefined,
      categoria: produto.categoria || undefined,
    }))
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }
}

export async function getCategorias() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nome: 'asc',
      },
    })
    return categorias
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }
}
