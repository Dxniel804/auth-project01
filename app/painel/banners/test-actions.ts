"use server"

export async function testServerAction() {
  console.log("[TEST DEBUG] Server action test iniciado")
  try {
    console.log("[TEST DEBUG] Server action está funcionando!")
    return { success: true, message: "Server action funcionando" }
  } catch (error) {
    console.error("[TEST DEBUG] Erro no server action test:", error)
    return { success: false, error: "Erro no server action test" }
  }
}

export async function testDatabaseConnection() {
  console.log("[DB TEST DEBUG] Testando conexão com banco...")
  try {
    // Test basic database connection
    const { prisma } = await import("@/lib/prisma-client")
    console.log("[DB TEST DEBUG] Prisma client importado")
    
    await prisma.$connect()
    console.log("[DB TEST DEBUG] Conectado ao banco")
    
    await prisma.$disconnect()
    console.log("[DB TEST DEBUG] Desconectado do banco")
    
    return { success: true, message: "Conexão com banco funcionando" }
  } catch (error) {
    console.error("[DB TEST DEBUG] Erro na conexão:", error)
    console.error("[DB TEST DEBUG] Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : 'No stack'
    })
    return { success: false, error: "Erro na conexão com banco" }
  }
}
