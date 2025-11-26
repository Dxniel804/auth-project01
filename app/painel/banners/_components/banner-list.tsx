"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getBanners, deletarBanner, alternarStatusBanner } from "../actions"
import { AddBanner } from "./add-banner"
import { EditBanner } from "./edit-banner"
import { ArrowUpDown, Edit, Trash2, Power, PowerOff, Plus, Image } from "lucide-react"

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

export function BannerList() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingBanner, setEditingBanner] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState<string | null>(null)

  const loadBanners = async () => {
    setIsLoading(true)
    try {
      const result = await getBanners()
      if (result.success) {
        setBanners(result.data || [])
      } else {
        toast.error(result.error || "Erro ao carregar banners")
      }
    } catch (error) {
      toast.error("Erro ao carregar banners")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
  }, [])

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      const result = await deletarBanner(id)
      if (result.success) {
        toast.success(result.message || "Banner deletado com sucesso!")
        loadBanners()
      } else {
        toast.error(result.error || "Erro ao deletar banner")
      }
    } catch (error) {
      toast.error("Erro ao deletar banner")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleStatus = async (id: string) => {
    setIsToggling(id)
    try {
      const result = await alternarStatusBanner(id)
      if (result.success) {
        toast.success(result.message || "Status atualizado com sucesso!")
        loadBanners()
      } else {
        toast.error(result.error || "Erro ao atualizar status")
      }
    } catch (error) {
      toast.error("Erro ao atualizar status")
    } finally {
      setIsToggling(null)
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner.id)
    setShowEditDialog(true)
  }

  const handleAddSuccess = () => {
    loadBanners()
    setShowAddDialog(false)
  }

  const handleEditSuccess = () => {
    loadBanners()
    setShowEditDialog(false)
    setEditingBanner(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Banners</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Banners</h2>
          <p className="text-muted-foreground">
            Gerencie os banners exibidos na página inicial
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Banner
        </Button>
      </div>

      {banners.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum banner encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro banner para começar a exibir conteúdo na página inicial.
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Banner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {banners.map((banner) => (
            <Card key={banner.id} className={`${!banner.ativo ? "opacity-60" : ""}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{banner.titulo}</CardTitle>
                      <Badge variant={banner.ativo ? "default" : "secondary"}>
                        {banner.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <ArrowUpDown className="h-3 w-3" />
                        Ordem {banner.ordem}
                      </Badge>
                    </div>
                    {banner.subtitulo && (
                      <CardDescription>{banner.subtitulo}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(banner.id)}
                      disabled={isToggling === banner.id}
                    >
                      {isToggling === banner.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : banner.ativo ? (
                        <PowerOff className="h-4 w-4" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(banner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isDeleting === banner.id}
                        >
                          {isDeleting === banner.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o banner "{banner.titulo}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(banner.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              {banner.descricao && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{banner.descricao}</p>
                </CardContent>
              )}
              {(banner.imagemUrl || banner.linkUrl || banner.textoBotao) && (
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {banner.imagemUrl && (
                      <span>🖼️ Imagem configurada</span>
                    )}
                    {banner.linkUrl && (
                      <span>🔗 Link configurado</span>
                    )}
                    {banner.textoBotao && (
                      <span>🔘 Botão: "{banner.textoBotao}"</span>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AddBanner
            onClose={() => setShowAddDialog(false)}
            onSuccess={handleAddSuccess}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {editingBanner && (
            <EditBanner
              bannerId={editingBanner}
              onClose={() => {
                setShowEditDialog(false)
                setEditingBanner(null)
              }}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
