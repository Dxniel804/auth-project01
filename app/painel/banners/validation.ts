import { z } from "zod"

export const BannerSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório").max(100, "O título deve ter no máximo 100 caracteres"),
  subtitulo: z.string().max(150, "O subtítulo deve ter no máximo 150 caracteres").optional(),
  descricao: z.string().max(500, "A descrição deve ter no máximo 500 caracteres").optional(),
  imagemUrl: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
  linkUrl: z.string().url("URL do link inválida").optional().or(z.literal("")),
  textoBotao: z.string().max(50, "O texto do botão deve ter no máximo 50 caracteres").optional(),
  ativo: z.boolean().default(true),
  ordem: z.number().int().min(0, "A ordem deve ser um número positivo").default(0),
})

export type BannerFormData = z.infer<typeof BannerSchema>

export const EditarBannerSchema = BannerSchema.partial({
  titulo: true,
}).extend({
  id: z.string().min(1, "ID do banner é obrigatório"),
})

export type EditarBannerFormData = z.infer<typeof EditarBannerSchema>
