"use client"

import { useMemo } from "react"
import Link from "next/link"
import type { ProductWithRelations } from "@/types"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { useFavoritesStore } from "@/store/favorites"
import { useMounted } from "@/hooks/use-mounted"
import { ProductCard } from "./product-card"

/** Los favoritos viven en el navegador (Zustand), así funcionan sin cuenta. */
export function FavoritesGrid({ products }: { products: ProductWithRelations[] }) {
  const mounted = useMounted()
  const ids = useFavoritesStore((s) => s.ids)
  const favorites = useMemo(() => products.filter((p) => ids.includes(p.id)), [products, ids])

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="aspect-3/4" />
        ))}
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="Todavía no tenés favoritos"
        description="Tocá el corazón en cualquier producto para guardarlo acá."
        action={
          <Button asChild>
            <Link href="/productos">Explorar productos</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {favorites.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
