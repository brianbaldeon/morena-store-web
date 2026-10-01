import { HeroBanner } from "@/components/catalog/hero-banner"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeading } from "@/components/shared/section-heading"
import { ProductRail } from "@/components/product/product-rail"
import { ProductCard } from "@/components/product/product-card"
import { CategoryTiles } from "@/components/home/category-tiles"
import { CustomizeCta } from "@/components/home/customize-cta"
import { Testimonials } from "@/components/home/testimonials"
import { TrustBar } from "@/components/home/trust-bar"
import { getFeaturedProducts, getNewProducts, listCategories, listProducts } from "@/lib/services/catalog"
import { IMG } from "@/data/mock-products"

export default async function HomePage() {
  const [categories, newProducts, featured, dolls] = await Promise.all([
    listCategories(),
    getNewProducts(8),
    getFeaturedProducts(6),
    listProducts({ category: "munecos" }),
  ])

  return (
    <>
      <HeroBanner
        lines={["Hecho a mano", "para vos"]}
        eyebrow="Muñecos · Llaveros · Remeras DTF"
        image={IMG.hoodieGirl}
        imagePosition="center 25%"
        targetId="novedades"
        size="lg"
      />

      <PageContainer className="space-y-16 py-10">
        <TrustBar />

        <section>
          <SectionHeading title="Explorá por categoría" href="/productos" />
          <CategoryTiles categories={categories} />
        </section>

        <section id="novedades" className="scroll-mt-32">
          <SectionHeading title="Recién salidos del taller" description="Lo último que cosimos y estampamos." href="/productos" />
          <ProductRail products={newProducts} />
        </section>

        <CustomizeCta />

        <section>
          <SectionHeading title="Los más elegidos" href="/productos" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading title="Muñecos de tus ídolos" href="/categoria/munecos" />
          <ProductRail products={dolls} />
        </section>

        <section>
          <SectionHeading title="Lo que dicen de Morena" />
          <Testimonials />
        </section>
      </PageContainer>
    </>
  )
}
