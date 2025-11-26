'use server'

import { prisma } from '@/lib/prisma-client'

export async function getCategorias() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nome: 'asc'
      },
      include: {
        produtos: {
          select: {
            id: true
          }
        }
      }
    })

    // Adicionar cores dinâmicas baseadas no hash do nome
    const categoriasComCor = categorias.map(categoria => {
      // Gerar cor baseada no hash do nome para consistência
      const hash = categoria.nome.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const colors = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
        'bg-teal-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-rose-500'
      ]
      const color = colors[hash % colors.length]

      return {
        ...categoria,
        cor: color,
        totalProdutos: categoria.produtos.length
      }
    })

    return {
      success: true,
      data: categoriasComCor
    }
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return {
      success: false,
      error: 'Erro ao buscar categorias'
    }
  }
}
