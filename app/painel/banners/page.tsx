import { BannerList } from "./_components/banner-list"

export default function BannersPage() {
  return (
    <div className="container mx-auto py-6">
      <BannerList />
    </div>
  )
}

export const metadata = {
  title: "Banners | Painel Administrativo",
  description: "Gerencie os banners da página inicial",
}
