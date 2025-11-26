import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BannerDisplay } from "@/components/banner-display";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Banner Principal - Dinâmico */}
      <BannerDisplay />

      {/* Seção de Destaques */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">⏱️</span>
            </div>
            <h3 className="text-xl font-semibold">Entrega Rápida</h3>
            <p className="text-gray-600">Receba seu pedido em até 30 minutos</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">🍕</span>
            </div>
            <h3 className="text-xl font-semibold">Comida Fresca</h3>
            <p className="text-gray-600">Ingredientes frescos e preparo na hora</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-xl font-semibold">Pagamento Seguro</h3>
            <p className="text-gray-600">Múltiplas formas de pagamento</p>
          </div>
        </div>
      </section>
    </div>
  );
}
