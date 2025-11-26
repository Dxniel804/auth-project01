"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCategorias } from "../../categorias/get-categorias"
import { Folder, Package } from "lucide-react"

interface Categoria {
  id: string
  nome: string
  cor: string
  imagemUrl: string | null
  totalProdutos: number
  createdAt: Date
  updatedAt: Date
}

export function CategoriaDisplay() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadCategorias = async () => {
    setIsLoading(true)
    try {
      const result = await getCategorias()
      if (result.success && result.data) {
        setCategorias(result.data)
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategorias()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Categorias</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (categorias.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Categorias</h3>
        <Card>
          <CardContent className="p-8 text-center">
            <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma categoria encontrada</h3>
            <p className="text-muted-foreground">
              Nenhuma categoria foi cadastrada ainda.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categorias</h3>
        <Badge variant="secondary">
          {categorias.length} {categorias.length === 1 ? "categoria" : "categorias"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categorias.map((categoria) => (
          <Card key={categoria.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {categoria.imagemUrl ? (
                  <img 
                    src={categoria.imagemUrl} 
                    alt={categoria.nome}
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback para ícone se a imagem falhar
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`h-10 w-10 rounded-full ${categoria.cor} flex items-center justify-center ${categoria.imagemUrl ? 'hidden' : ''}`}>
                  <Folder className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{categoria.nome}</h4>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  <span>{categoria.totalProdutos} {categoria.totalProdutos === 1 ? "produto" : "produtos"}</span>
                </div>
                <div className={`h-2 w-2 rounded-full ${categoria.cor}`}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
