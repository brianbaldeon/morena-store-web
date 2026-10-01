import { formatPrice } from "@/lib/format"
import { LOW_STOCK_THRESHOLD } from "@/lib/constants"
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

export function StockHint({ stock, className }: { stock: number; className?: string }) {
  if (stock <= 0) return <span className={cn("text-[11px] font-medium text-destructive", className)}>Sin stock</span>
  if (stock > LOW_STOCK_THRESHOLD) return null
  return <span className={cn("text-[11px] whitespace-nowrap text-destructive", className)}>¡Quedan {stock}!</span>
}
