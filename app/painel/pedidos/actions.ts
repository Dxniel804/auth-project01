'use server'

import { prisma } from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { StatusPedido } from '@/generated/prisma/client'

export async function criarPedido(formData: FormData) {
  const cliente = formData.get('cliente')
  const produto = formData.get('produto')
  const quantidade = formData.get('quantidade')
  const valor = formData.get('valor')

  const clienteStr = typeof cliente === 'string' ? cliente.trim() : ''
  const produtoStr = typeof produto === 'string' ? produto.trim() : ''
  const quantidadeNum = typeof quantidade === 'string' ? parseInt(quantidade) : 1
  const valorNum = typeof valor === 'string' ? parseFloat(valor) : 0

  if (!clienteStr || clienteStr === '') {
    return { error: 'Nome do cliente é obrigatório' }
  }

  if (!produtoStr || produtoStr === '') {
    return { error: 'Nome do produto é obrigatório' }
  }

  if (!quantidadeNum || quantidadeNum < 1) {
    return { error: 'Quantidade deve ser maior que 0' }
  }

  if (!valorNum || valorNum <= 0) {
    return { error: 'Valor deve ser maior que 0' }
  }

  try {
    // Primeiro, criar ou encontrar o cliente
    let clienteRecord = await prisma.cliente.findFirst({
      where: { nome: clienteStr }
    })

    if (!clienteRecord) {
      clienteRecord = await prisma.cliente.create({
        data: { nome: clienteStr }
      })
    }

    // Calcular valor total
    const valorTotal = valorNum * quantidadeNum

    // Criar o pedido
    await prisma.pedido.create({
      data: {
        clienteId: clienteRecord.id,
        valorTotal: valorTotal,
        status: 'PENDENTE',
        dataCriacao: new Date(),
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return { error: 'Erro ao criar pedido' }
  }
}

export async function editarPedido(id: string, formData: FormData) {
  const valorTotal = formData.get('valorTotal')
  const valorTotalStr = typeof valorTotal === 'string' ? valorTotal : ''
  const statusValue = formData.get('status')
  const status = typeof statusValue === 'string' ? statusValue.trim() as StatusPedido : undefined

  if (!valorTotalStr || valorTotalStr.trim() === '') {
    return { error: 'Valor total é obrigatório' }
  }

  if (!status) {
    return { error: 'Status é obrigatório' }
  }

  try {
    await prisma.pedido.update({
      where: { id },
      data: {
        valorTotal: parseFloat(valorTotalStr),
        status: status,
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
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