import type { Metadata } from "next"
import { PageContainer } from "@/components/shared/page-container"
import { FavoritesGrid } from "@/components/product/favorites-grid"
import { listProducts } from "@/lib/services/catalog"

export const metadata: Metadata = { title: "Favoritos" }

export default async function FavoritesPage() {
  const products = await listProducts()
  return (
    <PageContainer className="py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Favoritos</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">Lo que guardaste para después.</p>
      <FavoritesGrid products={products} />
    </PageContainer>
  )
}
