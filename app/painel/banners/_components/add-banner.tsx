"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { criarBanner } from "../actions"
import { BannerSchema, type BannerFormData } from "../validation"

interface AddBannerProps {
  onClose?: () => void
  onSuccess?: () => void
}

export function AddBanner({ onClose, onSuccess }: AddBannerProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(BannerSchema),
    defaultValues: {
      titulo: "",
      subtitulo: "",
      descricao: "",
      imagemUrl: "",
      linkUrl: "",
      textoBotao: "",
      ativo: true,
      ordem: 0,
    },
  })

  const onSubmit = async (data: BannerFormData) => {
    setIsLoading(true)
    try {
      const result = await criarBanner(data)
      
      if (result.success) {
        toast.success("Banner criado com sucesso!")
        reset()
        onSuccess?.()
        onClose?.()
      } else {
        toast.error(result.error || "Erro ao criar banner")
      }
    } catch (error) {
      toast.error("Erro ao criar banner")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Adicionar Banner</CardTitle>
        <CardDescription>
          Crie um novo banner para exibir na página inicial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                {...register("titulo")}
                placeholder="Digite o título do banner"
              />
              {errors.titulo && (
                <p className="text-sm text-destructive">{errors.titulo.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitulo">Subtítulo</Label>
              <Input
                id="subtitulo"
                {...register("subtitulo")}
                placeholder="Digite o subtítulo (opcional)"
              />
              {errors.subtitulo && (
                <p className="text-sm text-destructive">{errors.subtitulo.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              {...register("descricao")}
              placeholder="Digite a descrição do banner (opcional)"
              rows={3}
            />
            {errors.descricao && (
              <p className="text-sm text-destructive">{errors.descricao.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imagemUrl">URL da Imagem</Label>
              <Input
                id="imagemUrl"
                {...register("imagemUrl")}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              {errors.imagemUrl && (
                <p className="text-sm text-destructive">{errors.imagemUrl.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL do Link</Label>
              <Input
                id="linkUrl"
                {...register("linkUrl")}
                placeholder="https://exemplo.com/destino"
              />
              {errors.linkUrl && (
                <p className="text-sm text-destructive">{errors.linkUrl.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textoBotao">Texto do Botão</Label>
            <Input
              id="textoBotao"
              {...register("textoBotao")}
              placeholder="Ex: Saiba Mais"
            />
            {errors.textoBotao && (
              <p className="text-sm text-destructive">{errors.textoBotao.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ordem">Ordem de Exibição</Label>
              <Input
                id="ordem"
                type="number"
                min="0"
                {...register("ordem", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.ordem && (
                <p className="text-sm text-destructive">{errors.ordem.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Menor número = aparece primeiro
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  {...register("ativo")}
                  checked={!!register("ativo").value}
                  onCheckedChange={(checked: boolean) => {
                    register("ativo").onChange({ target: { value: checked } })
                  }}
                />
                <Label htmlFor="ativo">Banner Ativo</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Apenas banners ativos serão exibidos
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Banner"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
