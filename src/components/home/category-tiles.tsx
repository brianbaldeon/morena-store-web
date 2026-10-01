import Image from "next/image"
import Link from "next/link"
import type { Category } from "@/types"

export function CategoryTiles({ categories }: { categories: (Category & { productCount: number })[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((category) => (
        <Link key={category.id} href={`/categoria/${category.slug}`} className="group">
          <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-muted">
            <Image
              src={category.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 240px, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />
            <div className="absolute inset-x-3 bottom-3 text-white">
              <p className="font-semibold">{category.name}</p>
              <p className="text-xs opacity-80">{category.productCount} productos</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
