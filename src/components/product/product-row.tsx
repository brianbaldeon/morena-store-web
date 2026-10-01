import Image from "next/image"
import Link from "next/link"
import type { ProductWithRelations } from "@/types"
import { ProductBadges } from "./product-badge"
import { FavoriteButton } from "./favorite-button"
import { PriceTag, StockHint } from "./price-tag"

/** Vista lista del catálogo: misma información que la card, en horizontal. */
export function ProductRow({ product }: { product: ProductWithRelations }) {
  return (
    <article className="group flex gap-4 rounded-lg border p-3 transition-colors hover:border-primary/40 sm:gap-5">
      <Link href={`/productos/${product.slug}`} className="relative aspect-3/4 w-28 shrink-0 overflow-hidden rounded-md bg-muted sm:w-36">
        <Image src={product.images[0]} alt={product.name} fill sizes="144px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col py-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <ProductBadges product={product} />
            <p className="text-xs text-muted-foreground">{product.brand?.name ?? product.category.name}</p>
            <h3 className="font-semibold">
              <Link href={`/productos/${product.slug}`} className="hover:text-primary">
                {product.name}
              </Link>
            </h3>
          </div>
          <FavoriteButton productId={product.id} productName={product.name} />
        </div>
        <p className="mt-2 line-clamp-2 hidden text-sm text-muted-foreground sm:block">{product.description}</p>
        {product.sizes.length > 0 && (
          <p className="mt-2 hidden text-xs text-muted-foreground sm:block">Talles: {product.sizes.join(" · ")}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
          <StockHint stock={product.stock} />
        </div>
      </div>
    </article>
  )
}
