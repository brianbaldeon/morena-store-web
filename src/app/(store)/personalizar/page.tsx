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
      <HeroBanner
        lines={["Hacelo", "tuyo"]}
        eyebrow="Personalizados"
        image={IMG.personalizado}
        imagePosition="center 20%"
        targetId="tipos"
      />
      <PageContainer className="space-y-10 py-8 sm:space-y-14 sm:py-10">
        <CustomizeCta hideCta hideGallery />
        <section id="tipos" className="scroll-mt-32">
          <h2 className="text-2xl font-semibold tracking-tight">¿Qué querés personalizar?</h2>
          <p className="mt-1 mb-5 text-sm text-muted-foreground sm:mb-6">
            Elegí el producto y seguí los pasos. Toma menos de 2 minutos.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {Object.values(CUSTOMIZERS).map((config) => (
              <CustomizeTypeCard key={config.type} config={config} />
            ))}
          </div>
        </section>
      </PageContainer>
    </>
  )
}
