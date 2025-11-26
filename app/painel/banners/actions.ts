"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { BannerSchema, EditarBannerSchema, type BannerFormData, type EditarBannerFormData } from "./validation"
import { prisma } from "@/lib/prisma-client"

export async function getBanners() {
  console.log("[SERVER DEBUG] getBanners iniciado")
  try {
    console.log("[SERVER DEBUG] Tentando conectar ao banco...")
    await prisma.$connect()
    console.log("[SERVER DEBUG] Conectado ao banco com sucesso")
    
    console.log("[SERVER DEBUG] Buscando banners no banco...")
    const banners = await prisma.banner.findMany({
      orderBy: [
        { ordem: 'asc' },
        { createdAt: 'desc' }
      ]
    })
    console.log("[SERVER DEBUG] Banners encontrados:", banners.length)
    
    await prisma.$disconnect()
    console.log("[SERVER DEBUG] Desconectado do banco")
    
    return { success: true, data: banners }
  } catch (error) {
    console.error("[SERVER DEBUG] Erro ao buscar banners:", error)
    console.error("[SERVER DEBUG] Stack trace:", error instanceof Error ? error.stack : 'No stack')
    console.error("[SERVER DEBUG] Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      cause: error instanceof Error ? error.cause : undefined
    })
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      console.error("[SERVER DEBUG] Erro ao desconectar:", disconnectError)
    }
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
  console.log("=== CRIAR BANNER INICIADO ===")
  console.log("[DEBUG] criarBanner iniciado com dados:", JSON.stringify(data, null, 2))
  
  try {
    // Test database connection
    console.log("[DEBUG] Testando conexão com banco de dados...")
    await prisma.$connect()
    console.log("[DEBUG] Conectado ao banco de dados com sucesso")
    
    console.log("[DEBUG] Validando dados com BannerSchema...")
    const validatedData = BannerSchema.parse(data)
    console.log("[DEBUG] Dados validados:", JSON.stringify(validatedData, null, 2))
    
    // Verificar se já existe um banner com a mesma ordem
    console.log("[DEBUG] Verificando banner existente com ordem:", validatedData.ordem)
    const existingBanner = await prisma.banner.findFirst({
      where: { ordem: validatedData.ordem }
    })
    
    if (existingBanner) {
      console.log("[DEBUG] Banner existente encontrado, reorganizando ordens...")
      // Incrementar a ordem de todos os banners com ordem >= a nova ordem
      await prisma.banner.updateMany({
        where: { ordem: validatedData.ordem },
        data: { ordem: { increment: 1 } }
      })
      console.log("[DEBUG] Ordens reorganizadas")
    }
    
    console.log("[DEBUG] Criando banner no banco de dados...")
    const banner = await prisma.banner.create({
      data: validatedData
    })
    console.log("[DEBUG] Banner criado com sucesso:", JSON.stringify(banner, null, 2))
    
    await prisma.$disconnect()
    console.log("[DEBUG] Desconectado do banco de dados")
    
    revalidatePath("/painel/banners")
    console.log("[DEBUG] Path revalidado")
    console.log("=== CRIAR BANNER CONCLUÍDO COM SUCESSO ===")
    return { success: true, data: banner }
  } catch (error) {
    console.log("=== ERRO AO CRIAR BANNER ===")
    console.error("[DEBUG] Erro ao criar banner:", error)
    console.error("[DEBUG] Stack trace:", error instanceof Error ? error.stack : 'No stack available')
    console.error("[DEBUG] Error type:", typeof error)
    console.error("[DEBUG] Error constructor:", error?.constructor?.name)
    if (error instanceof Error && 'code' in error) {
      console.error("[DEBUG] Error code:", (error as any).code)
    }
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      console.error("[DEBUG] Erro ao desconectar:", disconnectError)
    }
    console.log("=== FIM DO ERRO ===")
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
