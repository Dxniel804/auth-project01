import { BannerList } from "./_components/banner-list"
import { CategoriaDisplay } from "./_components/categoria-display"

export default function BannersPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <BannerList />
      <CategoriaDisplay />
    </div>
  )
}

export const metadata = {
  title: "Banners e Categorias | Painel Administrativo",
  description: "Gerencie os banners e visualize as categorias da página inicial",
}
