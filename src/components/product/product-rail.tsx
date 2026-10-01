"use client"

import type { ProductWithRelations } from "@/types"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ProductCard } from "./product-card"

/** Tira horizontal de productos (home, relacionados). */
export function ProductRail({ products }: { products: ProductWithRelations[] }) {
  return (
    <Carousel opts={{ align: "start", dragFree: true }} className="relative">
      <CarouselContent className="-ml-4">
        {products.map((product) => (
          <CarouselItem key={product.id} className="basis-1/2 pl-4 sm:basis-1/3 lg:basis-1/4">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="top-[38%] -left-4 hidden bg-background md:flex" />
      <CarouselNext className="top-[38%] -right-4 hidden bg-background md:flex" />
    </Carousel>
  )
}
