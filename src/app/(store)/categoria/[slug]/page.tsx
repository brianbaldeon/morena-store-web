import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HeroBanner } from "@/components/catalog/hero-banner"
import { CatalogView } from "@/components/catalog/catalog-view"
import { PageContainer } from "@/components/shared/page-container"
import { getCategoryBySlug, listCategories, listProducts } from "@/lib/services/catalog"

const HERO_LINES: Record<string, [string, string]> = {
  munecos: ["Tus ídolos", "en tela"],
  llaveros: ["Pequeños", "y fieles"],
  remeras: ["Estampá", "tu historia"],
  buzos: ["Abrigo", "con onda"],
  almohadones: ["Tu michi", "en versión XL"],
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
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const products = await listProducts({ category: slug })

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
          hideCategories
          resultsLabel={category.name.toLowerCase()}
          breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Productos", href: "/productos" }, { label: category.name }]}
        />
      </PageContainer>
    </>
  )
}
