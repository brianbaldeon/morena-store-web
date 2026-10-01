"use client"

import { Heart } from "lucide-react"
import { toast } from "sonner"
import { useFavoritesStore } from "@/store/favorites"
import { useMounted } from "@/hooks/use-mounted"
import { cn } from "@/lib/utils"

export function FavoriteButton({
  productId,
  productName,
  className,
  size = "sm",
}: {
  productId: string
  productName: string
  className?: string
  size?: "sm" | "lg"
}) {
  const mounted = useMounted()
  const isFavorite = useFavoritesStore((s) => s.ids.includes(productId))
  const toggle = useFavoritesStore((s) => s.toggle)
  const active = mounted && isFavorite

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const added = toggle(productId)
        toast(added ? "Agregado a favoritos" : "Quitado de favoritos", { description: productName })
      }}
      aria-pressed={active}
      aria-label={active ? `Quitar ${productName} de favoritos` : `Agregar ${productName} a favoritos`}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary",
        size === "sm" ? "size-7" : "size-11 border",
        active && "text-primary",
        className,
      )}
    >
      <Heart className={cn(size === "sm" ? "size-4" : "size-5", active && "fill-current")} />
    </button>
  )
}
