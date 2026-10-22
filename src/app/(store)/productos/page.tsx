import type { Metadata } from "next"
import { HeroBanner } from "@/components/catalog/hero-banner"
import { CatalogView } from "@/components/catalog/catalog-view"
import { PageContainer } from "@/components/shared/page-container"
import { searchCatalog } from "@/lib/services/catalog"
import { PAGE_SIZE } from "@/lib/constants"
import { IMG } from "@/data/mock-products"
import type { ProductType, SortOption } from "@/types"

export const metadata: Metadata = { title: "Productos" }

function toArray(v: string | string[] | undefined) {
  return typeof v === "string" && v ? v.split(",") : []
}

export default async function ProductsPage(props: PageProps<"/productos">) {
  const sp = await props.searchParams
  const query = typeof sp.q === "string" ? sp.q.trim() : ""
  const page = Math.max(1, Number(sp.page) || 1)
  const priceMin = typeof sp.priceMin === "string" ? Number(sp.priceMin) : undefined
  const priceMax = typeof sp.priceMax === "string" ? Number(sp.priceMax) : undefined

  const { products, total, facets, filters } = await searchCatalog({
    q: query || undefined,
    page,
    pageSize: PAGE_SIZE,
    brands: toArray(sp.brands),
    categories: toArray(sp.categories),
    productTypes: toArray(sp.productTypes) as ProductType[],
    sizes: toArray(sp.sizes),
    colors: toArray(sp.colors),
    price: priceMin !== undefined && priceMax !== undefined ? [priceMin, priceMax] : undefined,
    sort: typeof sp.sort === "string" ? (sp.sort as SortOption) : undefined,
  })

  return (
    <>
      <HeroBanner lines={["Hecho a mano", "para vos"]} image={IMG.hoodieGirl} imagePosition="center 25%" />
      <PageContainer className="py-8">
        <CatalogView
          products={products}
          total={total}
          facets={facets}
          filters={filters}
          page={page}
          pageSize={PAGE_SIZE}
          hideColors
          resultsLabel={query ? `"${query}"` : "todo"}
          breadcrumb={[{ label: "Inicio", href: "/" }, { label: query ? "Búsqueda" : "Productos" }]}
        />
      </PageContainer>
    </>
  )
}
