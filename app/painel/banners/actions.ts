"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { BannerSchema, EditarBannerSchema, type BannerFormData, type EditarBannerFormData } from "./validation"
import { prisma } from "@/lib/prisma-client"

export async function getBanners() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [
        { ordem: 'asc' },
        { createdAt: 'desc' }
      ]
    })
    return { success: true, data: banners }
  } catch (error) {
    console.error("Erro ao buscar banners:", error)
    return { success: false, error: "Erro ao buscar banners" }
  }
}

export async function getBannerById(id: string) {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id }
    })
    
    if (!banner) {
      return { success: false, error: "Banner não encontrado" }
    }
    
    return { success: true, data: banner }
  } catch (error) {
    console.error("Erro ao buscar banner:", error)
    return { success: false, error: "Erro ao buscar banner" }
  }
}

export async function getBannersAtivos() {
  try {
    const banners = await prisma.banner.findMany({
      where: { ativo: true },
      orderBy: [
        { ordem: 'asc' },
        { createdAt: 'desc' }
      ]
    })
    return { success: true, data: banners }
  } catch (error) {
    console.error("Erro ao buscar banners ativos:", error)
    return { success: false, error: "Erro ao buscar banners ativos" }
  }
}

export async function criarBanner(data: BannerFormData) {
  try {
    const validatedData = BannerSchema.parse(data)
    
    // Verificar se já existe um banner com a mesma ordem
    const existingBanner = await prisma.banner.findFirst({
      where: { ordem: validatedData.ordem }
    })
    
    if (existingBanner) {
      // Incrementar a ordem de todos os banners com ordem >= a nova ordem
      await prisma.banner.updateMany({
        where: { ordem: validatedData.ordem },
        data: { ordem: { increment: 1 } }
      })
    }
    
    const banner = await prisma.banner.create({
      data: validatedData
    })
    
    revalidatePath("/painel/banners")
    return { success: true, data: banner }
  } catch (error) {
    console.error("Erro ao criar banner:", error)
    return { success: false, error: "Erro ao criar banner" }
  }
}

export async function editarBanner(data: EditarBannerFormData) {
  try {
    const validatedData = EditarBannerSchema.parse(data)
    
    const bannerExistente = await prisma.banner.findUnique({
      where: { id: validatedData.id }
    })
    
    if (!bannerExistente) {
      return { success: false, error: "Banner não encontrado" }
    }
    
    // Se a ordem foi alterada, reorganizar os banners
    if (validatedData.ordem !== undefined && validatedData.ordem !== bannerExistente.ordem) {
      // Se a nova ordem for maior, decrementar os banners entre as ordens
      if (validatedData.ordem > bannerExistente.ordem) {
        await prisma.banner.updateMany({
          where: {
            ordem: {
              gte: bannerExistente.ordem + 1,
              lte: validatedData.ordem
            },
            id: { not: validatedData.id }
          },
          data: { ordem: { decrement: 1 } }
        })
      } else {
        // Se a nova ordem for menor, incrementar os banners entre as ordens
        await prisma.banner.updateMany({
          where: {
            ordem: {
              gte: validatedData.ordem,
              lt: bannerExistente.ordem
            },
            id: { not: validatedData.id }
          },
          data: { ordem: { increment: 1 } }
        })
      }
    }
    
    const banner = await prisma.banner.update({
      where: { id: validatedData.id },
      data: validatedData
    })
    
    revalidatePath("/painel/banners")
    return { success: true, data: banner }
  } catch (error) {
    console.error("Erro ao editar banner:", error)
    return { success: false, error: "Erro ao editar banner" }
  }
}

export async function deletarBanner(id: string) {
  try {
    const bannerExistente = await prisma.banner.findUnique({
      where: { id }
    })
    
    if (!bannerExistente) {
      return { success: false, error: "Banner não encontrado" }
    }
    
    // Deletar o banner
    await prisma.banner.delete({
      where: { id }
    })
    
    // Reorganizar as ordens dos banners restantes
    await prisma.banner.updateMany({
      where: { ordem: { gt: bannerExistente.ordem } },
      data: { ordem: { decrement: 1 } }
    })
    
    revalidatePath("/painel/banners")
    return { success: true, message: "Banner deletado com sucesso" }
  } catch (error) {
    console.error("Erro ao deletar banner:", error)
    return { success: false, error: "Erro ao deletar banner" }
  }
}

export async function alternarStatusBanner(id: string) {
  try {
    const bannerExistente = await prisma.banner.findUnique({
      where: { id }
    })
    
    if (!bannerExistente) {
      return { success: false, error: "Banner não encontrado" }
    }
    
    const banner = await prisma.banner.update({
      where: { id },
      data: { ativo: !bannerExistente.ativo }
    })
    
    revalidatePath("/painel/banners")
    return { 
      success: true, 
      data: banner,
      message: `Banner ${banner.ativo ? 'ativado' : 'desativado'} com sucesso`
    }
  } catch (error) {
    console.error("Erro ao alternar status do banner:", error)
    return { success: false, error: "Erro ao alternar status do banner" }
  }
}
