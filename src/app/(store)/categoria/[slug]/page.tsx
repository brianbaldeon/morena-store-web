import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HeroBanner } from "@/components/catalog/hero-banner"
import { CatalogView } from "@/components/catalog/catalog-view"
import { PageContainer } from "@/components/shared/page-container"
import { getCategoryBySlug, listCategories, searchCatalog } from "@/lib/services/catalog"
import { PAGE_SIZE } from "@/lib/constants"
import type { ProductType, SortOption } from "@/types"

const HERO_LINES: Record<string, [string, string]> = {
  munecos: ["Tus ídolos", "en tela"],
  llaveros: ["Pequeños", "y fieles"],
  remeras: ["Estampá", "tu historia"],
  buzos: ["Abrigo", "con onda"],
  almohadones: ["Tu michi", "en versión XL"],
}

function toArray(v: string | string[] | undefined) {
  return typeof v === "string" && v ? v.split(",") : []
}

export async function generateStaticParams() {
  const categories = await listCategories()
  return categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata(props: PageProps<"/categoria/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const category = await getCategoryBySlug(slug)
  return { title: category?.name ?? "Categoría" }
}

export default async function CategoryPage(props: PageProps<"/categoria/[slug]">) {
  const { slug } = await props.params
  const sp = await props.searchParams
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const page = Math.max(1, Number(sp.page) || 1)
  const priceMin = typeof sp.priceMin === "string" ? Number(sp.priceMin) : undefined
  const priceMax = typeof sp.priceMax === "string" ? Number(sp.priceMax) : undefined

  const { products, total, facets, filters } = await searchCatalog({
    category: slug,
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
      <HeroBanner
        lines={HERO_LINES[slug] ?? [category.name, "hecho a mano"]}
        eyebrow={category.name}
        image={category.image}
      />
      <PageContainer className="py-8">
        <CatalogView
          products={products}
          total={total}
          facets={facets}
          filters={filters}
          page={page}
          pageSize={PAGE_SIZE}
          hideCategories
          hideColors={slug === "remeras" || slug === "buzos"}
          resultsLabel={category.name.toLowerCase()}
          breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Productos", href: "/productos" }, { label: category.name }]}
        />
      </PageContainer>
    </>
  )
}
