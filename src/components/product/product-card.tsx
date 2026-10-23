import Image from "next/image"
import Link from "next/link"
import type { ProductWithRelations } from "@/types"
import { cn } from "@/lib/utils"
import { ProductBadges } from "./product-badge"
import { FavoriteButton } from "./favorite-button"
import { PriceTag } from "./price-tag"

interface ProductCardProps {
  product: ProductWithRelations
  className?: string
  priority?: boolean
}

/** Card de la referencia: imagen con badge, artista + ♡, nombre y precio en acento. El stock se ve solo en el detalle. */
export function ProductCard({ product, className, priority }: ProductCardProps) {
  return (
    <article className={cn("group relative", className)}>
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            loading={priority ? "eager" : undefined}
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <ProductBadges product={product} className="absolute top-2.5 left-2.5" />
        </div>
      </Link>
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs text-muted-foreground">{product.brand?.name ?? product.category.name}</p>
          <FavoriteButton productId={product.id} productName={product.name} className="-my-1 -mr-1.5" />
        </div>
        <h3 className="line-clamp-1 text-sm font-semibold">
          <Link href={`/productos/${product.slug}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} className="text-sm" />
      </div>
    </article>
  )
}
