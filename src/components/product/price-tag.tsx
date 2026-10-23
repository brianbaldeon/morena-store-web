import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export function PriceTag({
  price,
  compareAtPrice,
  className,
}: {
  price: number
  compareAtPrice?: number | null
  className?: string
}) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span className="font-semibold text-primary">{formatPrice(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-[0.85em] text-muted-foreground line-through">{formatPrice(compareAtPrice)}</span>
      )}
    </span>
  )
}
