import type { Metadata } from "next"
import { HeroBanner } from "@/components/catalog/hero-banner"
import { CatalogView } from "@/components/catalog/catalog-view"
import { PageContainer } from "@/components/shared/page-container"
import { listProducts } from "@/lib/services/catalog"
import { IMG } from "@/data/mock-products"

export const metadata: Metadata = { title: "Productos" }

export default async function ProductsPage(props: PageProps<"/productos">) {
  const { q } = await props.searchParams
  const query = typeof q === "string" ? q.trim() : ""
  const products = await listProducts({ q: query || undefined })

  return (
    <>
      <HeroBanner lines={["Hecho a mano", "para vos"]} image={IMG.hoodieGirl} imagePosition="center 25%" />
      <PageContainer className="py-8">
        <CatalogView
          key={query}
          products={products}
          resultsLabel={query ? `"${query}"` : "todo"}
          breadcrumb={[{ label: "Inicio", href: "/" }, { label: query ? "Búsqueda" : "Productos" }]}
        />
      </PageContainer>
    </>
  )
}
