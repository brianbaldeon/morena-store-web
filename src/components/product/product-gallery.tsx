"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/types"
import { cn } from "@/lib/utils"
import { ProductBadges } from "./product-badge"

/** Miniaturas verticales a la izquierda + imagen principal. En mobile las miniaturas van abajo. */
export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0)
  const images = product.images

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col" role="tablist" aria-label="Fotos del producto">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Foto ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-3/4 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-muted sm:w-20",
                i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-3/4 flex-1 overflow-hidden rounded-lg bg-muted">
        <Image
          src={images[active]}
          alt={product.name}
          fill
          priority
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
        <ProductBadges product={product} className="absolute top-3 left-3" />
      </div>
    </div>
  )
}
