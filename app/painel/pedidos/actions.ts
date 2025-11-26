'use server'

import { prisma } from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { StatusPedido } from '@/generated/prisma/client'
import { criarPedidoSchema, editarPedidoSchema } from './validation'
import { ZodError } from 'zod'

export async function criarPedido(prevState: { success: boolean; error?: string } | { error: string; success?: undefined }, formData: FormData) {
  try {
    console.log('=== INÍCIO DA CRIAÇÃO DO PEDIDO ===')
    
    // Obter e validar os itens
    const itensString = formData.get('itens') as string || '[]'
    console.log('Itens string recebido:', itensString)
    
    let itens
    try {
      itens = JSON.parse(itensString)
      console.log('Itens parseados:', itens)
    } catch (parseError) {
      console.error('Erro ao fazer parse dos itens:', parseError)
      return { error: 'Erro ao processar os itens do pedido' }
    }
    
    // Validar dados com Zod
    console.log('Dados do cliente:', {
      nome: formData.get('clienteNome'),
      endereco: formData.get('clienteEndereco'),
      telefone: formData.get('clienteTelefone'),
    })
    
    const validatedData = criarPedidoSchema.parse({
      cliente: {
        nome: formData.get('clienteNome'),
        endereco: formData.get('clienteEndereco'),
        telefone: formData.get('clienteTelefone'),
      },
      itens: itens,
    })

    console.log('Dados validados com sucesso!')
    const { cliente, itens: validatedItens } = validatedData

    // Verificar se há estoque suficiente para todos os produtos e identificar o cliente pela categoria
    let valorTotal = 0
    let categoriaClienteId: string | null = null

    console.log('Iniciando verificação de produtos...')
    for (const item of validatedItens) {
      console.log(`Verificando produto: ${item.produtoId}, quantidade: ${item.quantidade}`)
      
      const produto = await prisma.produto.findUnique({
        where: { id: item.produtoId },
        include: {
          categoria: {
            include: {
              cliente: true
            }
          }
        }
      })

      console.log('Produto encontrado:', produto)

      if (!produto) {
        return { error: `Produto com ID ${item.produtoId} não encontrado` }
      }

      if (produto.estoque < item.quantidade) {
        return { error: `Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.estoque}, Solicitado: ${item.quantidade}` }
      }

      // Identificar o cliente pela categoria (se houver)
      if (!categoriaClienteId && produto.categoria?.cliente) {
        categoriaClienteId = produto.categoria.cliente.id
      }

      valorTotal += produto.preco * item.quantidade
    }

    console.log('Verificação concluída. Valor total:', valorTotal)

    // Criar ou encontrar o cliente com base nos dados fornecidos
    let clienteRecord = await prisma.cliente.findFirst({
      where: {
        OR: [
          { nome: cliente.nome },
          { telefone: cliente.telefone }
        ]
      }
    })

    // Se não encontrar, criar um novo cliente
    if (!clienteRecord) {
      clienteRecord = await prisma.cliente.create({
        data: {
          nome: cliente.nome,
          endereco: cliente.endereco,
          telefone: cliente.telefone,
        }
      })
    } else {
      // Se encontrar, atualizar os dados do cliente
      clienteRecord = await prisma.cliente.update({
        where: { id: clienteRecord.id },
        data: {
          nome: cliente.nome,
          endereco: cliente.endereco,
          telefone: cliente.telefone,
        }
      })
    }

    // Criar o pedido
    const pedido = await prisma.pedido.create({
      data: {
        clienteId: clienteRecord.id,
        valorTotal: valorTotal,
        status: 'PENDENTE',
        dataCriacao: new Date(),
      },
    })

    // Criar os itens do pedido e atualizar o estoque
    for (const item of validatedItens) {
      const produto = await prisma.produto.findUnique({
        where: { id: item.produtoId }
      })

      if (produto) {
        // Criar item do pedido
        await prisma.itemPedido.create({
          data: {
            pedidoId: pedido.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: produto.preco,
            subtotal: produto.preco * item.quantidade,
          },
        })

        // Atualizar o estoque do produto
        await prisma.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: produto.estoque - item.quantidade
          }
        })
      }
    }

    revalidatePath('/painel/pedidos')
    revalidatePath('/painel/produtos')
    console.log('=== PEDIDO CRIADO COM SUCESSO! ===')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { error: fieldErrors }
    }
    
    console.error('Erro ao criar pedido:', error)
    return { error: 'Erro ao criar pedido' }
  }
}

export async function editarPedido(idOrState: string | { success: boolean; error?: string } | { error: string; success?: undefined }, formData: FormData) {
  try {
    // Handle both direct calls (id as string) and form calls (prevState object)
    const id = typeof idOrState === 'string' ? idOrState : formData.get('id') as string
    
    if (!id) {
      return { error: 'ID do pedido não fornecido' }
    }

    // Validar dados com Zod
    const validatedData = editarPedidoSchema.parse({
      valorTotal: formData.get('valorTotal'),
      status: formData.get('status')
    })

    const { valorTotal, status } = validatedData

    await prisma.pedido.update({
      where: { id },
      data: {
        valorTotal: valorTotal,
        status: status,
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { error: fieldErrors }
    }
    
    console.error('Erro ao editar pedido:', error)
    return { error: 'Erro ao editar pedido' }
  }
}

export async function excluirPedido(id: string) {
  try {
    await prisma.pedido.delete({
      where: { id },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir pedido:', error)
    return { error: 'Erro ao excluir pedido' }
  }
}