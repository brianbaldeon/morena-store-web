import type { Metadata } from "next"
import { HeroBanner } from "@/components/catalog/hero-banner"
import { PageContainer } from "@/components/shared/page-container"
import { CustomizeTypeCard } from "@/components/customizer/customize-type-card"
import { CustomizeCta } from "@/components/home/customize-cta"
import { CUSTOMIZERS } from "@/lib/constants"
import { IMG } from "@/data/mock-products"

export const metadata: Metadata = { title: "Personalizá" }

export default function CustomizePage() {
  return (
    <>
      <HeroBanner lines={["Hacelo", "tuyo"]} eyebrow="Personalizados" image={IMG.potro} imagePosition="center 20%" targetId="tipos" />
      <PageContainer className="space-y-14 py-10">
        <section id="tipos" className="scroll-mt-32">
          <h2 className="text-2xl font-semibold tracking-tight">¿Qué querés personalizar?</h2>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">Elegí el producto y seguí los pasos. Toma menos de 2 minutos.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.values(CUSTOMIZERS).map((config) => (
              <CustomizeTypeCard key={config.type} config={config} />
            ))}
          </div>
        </section>
        <CustomizeCta />
      </PageContainer>
    </>
  )
}
