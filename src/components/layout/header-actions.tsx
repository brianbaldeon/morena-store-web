"use client"

import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { selectCartCount, useCartStore } from "@/store/cart"
import { useFavoritesStore } from "@/store/favorites"
import { useMounted } from "@/hooks/use-mounted"
import { cn } from "@/lib/utils"

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-none font-semibold text-white">
      {count > 99 ? "99+" : count}
    </span>
  )
}

const iconButton =
  "relative flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"

export function CartButton({ className }: { className?: string }) {
  const mounted = useMounted()
  const count = useCartStore(selectCartCount)
  const open = useCartStore((s) => s.open)
  return (
    <button type="button" onClick={open} className={cn(iconButton, className)} aria-label={`Carrito, ${count} productos`}>
      <ShoppingCart className="size-5" />
      <CountBadge count={mounted ? count : 0} />
    </button>
  )
}

export function FavoritesButton({ className }: { className?: string }) {
  const mounted = useMounted()
  const count = useFavoritesStore((s) => s.ids.length)
  return (
    <Link href="/favoritos" className={cn(iconButton, className)} aria-label={`Favoritos, ${count} productos`}>
      <Heart className="size-5" />
      <CountBadge count={mounted ? count : 0} />
    </Link>
  )
}
