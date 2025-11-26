'use server'

import { prisma } from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { StatusPedido } from '@/generated/prisma/client'

export async function criarPedido(formData: FormData) {
  const clienteId = formData.get('clienteId')
  const valorTotal = formData.get('valorTotal')
  const statusValue = formData.get('status')

  const clienteIdStr = typeof clienteId === 'string' ? clienteId : ''
  const valorTotalStr = typeof valorTotal === 'string' ? valorTotal : ''
  const status = typeof statusValue === 'string' ? statusValue.trim() as StatusPedido : undefined

  if (!clienteIdStr || clienteIdStr.trim() === '') {
    return { error: 'ID do cliente é obrigatório' }
  }

  if (!valorTotalStr || valorTotalStr.trim() === '') {
    return { error: 'Valor total é obrigatório' }
  }

  if (!status) {
    return { error: 'Status é obrigatório' }
  }

  try {
    await prisma.pedido.create({
      data: {
        clienteId: clienteIdStr.trim(),
        valorTotal: parseFloat(valorTotalStr),
        status: status,
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