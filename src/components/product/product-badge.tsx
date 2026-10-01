import type { Product } from "@/types"
import { cn } from "@/lib/utils"

type BadgeKind = "new" | "custom" | "sale"

const STYLES: Record<BadgeKind, string> = {
  new: "bg-primary text-primary-foreground",
  custom: "bg-foreground text-background",
  sale: "bg-destructive text-white",
}

export function ProductBadge({ kind, children, className }: { kind: BadgeKind; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[10px] leading-none font-medium",
        STYLES[kind],
        className,
      )}
    >
      {kind === "new" && <span className="size-1 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  )
}

export function ProductBadges({ product, className }: { product: Product; className?: string }) {
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0
  if (!product.isNew && !product.isCustomizable && !discount) return null
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {product.isNew && <ProductBadge kind="new">Nuevo</ProductBadge>}
      {product.isCustomizable && <ProductBadge kind="custom">Personalizable</ProductBadge>}
      {discount > 0 && <ProductBadge kind="sale">-{discount}%</ProductBadge>}
    </div>
  )
}
