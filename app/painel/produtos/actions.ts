'use server'

import { prisma } from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'

export async function criarProduto(formData: FormData) {
  const nome = formData.get('nome')
  const descricao = formData.get('descricao')
  const preco = formData.get('preco')
  const estoque = formData.get('estoque')
  const categoriaId = formData.get('categoriaId')

  const nomeStr = typeof nome === 'string' ? nome.trim() : ''
  const descricaoStr = typeof descricao === 'string' ? descricao.trim() : ''
  const precoNum = typeof preco === 'string' ? parseFloat(preco) : 0
  const estoqueNum = typeof estoque === 'string' ? parseInt(estoque) : 0
  const categoriaIdStr = typeof categoriaId === 'string' ? categoriaId.trim() : ''
  const categoriaIdFinal = categoriaIdStr === 'none' ? '' : categoriaIdStr

  if (!nomeStr || nomeStr === '') {
    return { error: 'Nome do produto é obrigatório' }
  }

  if (!precoNum || precoNum <= 0) {
    return { error: 'Preço deve ser maior que 0' }
  }

  if (estoqueNum < 0) {
    return { error: 'Estoque não pode ser negativo' }
  }

  try {
    await prisma.produto.create({
      data: {
        nome: nomeStr,
        descricao: descricaoStr || null,
        preco: precoNum,
        estoque: estoqueNum,
        categoriaId: categoriaIdFinal || null,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return { error: 'Erro ao criar produto' }
  }
}

export async function editarProduto(id: string, formData: FormData) {
  const nome = formData.get('nome')
  const descricao = formData.get('descricao')
  const preco = formData.get('preco')
  const estoque = formData.get('estoque')
  const categoriaId = formData.get('categoriaId')

  const nomeStr = typeof nome === 'string' ? nome.trim() : ''
  const descricaoStr = typeof descricao === 'string' ? descricao.trim() : ''
  const precoNum = typeof preco === 'string' ? parseFloat(preco) : 0
  const estoqueNum = typeof estoque === 'string' ? parseInt(estoque) : 0
  const categoriaIdStr = typeof categoriaId === 'string' ? categoriaId.trim() : ''
  const categoriaIdFinal = categoriaIdStr === 'none' ? '' : categoriaIdStr

  if (!nomeStr || nomeStr === '') {
    return { error: 'Nome do produto é obrigatório' }
  }

  if (!precoNum || precoNum <= 0) {
    return { error: 'Preço deve ser maior que 0' }
  }

  if (estoqueNum < 0) {
    return { error: 'Estoque não pode ser negativo' }
  }

  try {
    await prisma.produto.update({
      where: { id },
      data: {
        nome: nomeStr,
        descricao: descricaoStr || null,
        preco: precoNum,
        estoque: estoqueNum,
        categoriaId: categoriaIdFinal || null,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
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
        categoria: true,
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