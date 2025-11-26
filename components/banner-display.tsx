"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getBannersAtivos } from "@/app/painel/banners/actions"

interface Banner {
  id: string
  titulo: string
  subtitulo: string | null
  descricao: string | null
  imagemUrl: string | null
  linkUrl: string | null
  textoBotao: string | null
  ativo: boolean
  ordem: number
  createdAt: Date
  updatedAt: Date
}

interface BannerDisplayProps {
  className?: string
}

export function BannerDisplay({ className = "" }: BannerDisplayProps) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const result = await getBannersAtivos()
        if (result.success) {
          setBanners(result.data || [])
        }
      } catch (error) {
        console.error("Erro ao carregar banners:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBanners()
  }, [])

  if (isLoading) {
    return (
      <section className={`relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white ${className}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-32 mb-6"></div>
            <div className="h-12 lg:h-16 bg-white/20 rounded w-3/4 mb-4"></div>
            <div className="h-6 lg:h-8 bg-white/20 rounded w-1/2 mb-8"></div>
            <div className="flex gap-4">
              <div className="h-12 w-40 bg-white/20 rounded"></div>
              <div className="h-12 w-32 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (banners.length === 0) {
    // Retorna o banner padrão caso não existam banners cadastrados
    return (
      <section className={`relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white ${className}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Badge className="bg-white/20 text-white border-white/30 w-fit">
                🚸 Entrega Rápida
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Seu Pedido
                <br />
                <span className="text-orange-200">Sai na Hora!</span>
              </h1>
              <p className="text-lg lg:text-xl text-white/90 max-w-lg">
                Peça online e receba no conforto da sua casa. Entrega em até 30 minutos
                para pedidos confirmados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-orange-500 hover:bg-orange-50">
                  Fazer Pedido Agora
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-orange-500"
                >
                  Ver Cardápio
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🛵</div>
                  <div className="text-2xl font-bold">Entrega Grátis</div>
                  <div className="text-white/80">Para pedidos acima de R$ 50,00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-orange-400 rounded-full opacity-20 animate-pulse delay-75"></div>
      </section>
    )
  }

  // Exibe o primeiro banner ativo (ordenado por ordem)
  const banner = banners[0]

  const BannerContent = () => (
    <>
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          {banner.subtitulo && (
            <Badge className="bg-white/20 text-white border-white/30 w-fit">
              {banner.subtitulo}
            </Badge>
          )}
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            {banner.titulo}
          </h1>
          {banner.descricao && (
            <p className="text-lg lg:text-xl text-white/90 max-w-lg">
              {banner.descricao}
            </p>
          )}
          {banner.textoBotao && (
            <div className="flex flex-col sm:flex-row gap-4">
              {banner.linkUrl ? (
                <Link href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-orange-500 hover:bg-orange-50">
                    {banner.textoBotao}
                  </Button>
                </Link>
              ) : (
                <Button size="lg" className="bg-white text-orange-500 hover:bg-orange-50">
                  {banner.textoBotao}
                </Button>
              )}
            </div>
          )}
        </div>
        {banner.imagemUrl && (
          <div className="relative">
            <div className="relative w-full h-64 lg:h-96 rounded-2xl overflow-hidden">
              <Image
                src={banner.imagemUrl}
                alt={banner.titulo}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </>
  )

  return (
    <section className={`relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white ${className}`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        {banner.linkUrl ? (
          <Link href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
            <BannerContent />
          </Link>
        ) : (
          <BannerContent />
        )}
      </div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-orange-400 rounded-full opacity-20 animate-pulse delay-75"></div>
    </section>
  )
}
