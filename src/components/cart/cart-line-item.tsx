"use client"

import Image from "next/image"
import Link from "next/link"
import { Sparkles, Trash2 } from "lucide-react"
import type { CartItem } from "@/types"
import { useCartStore } from "@/store/cart"
import { QuantityStepper } from "@/components/shared/quantity-stepper"
import { CUSTOMIZERS } from "@/lib/constants"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export function CartLineItem({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const setOpen = useCartStore((s) => s.setOpen)
  const variant = [item.size && `Talle ${item.size}`, item.color].filter(Boolean).join(" · ")

  return (
    <div className="flex gap-3 py-4">
      <Link
        href={`/productos/${item.slug}`}
        onClick={() => setOpen(false)}
        className={cn("relative shrink-0 overflow-hidden rounded-lg bg-muted", compact ? "h-24 w-18" : "h-32 w-24")}
      >
        <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/productos/${item.slug}`}
              onClick={() => setOpen(false)}
              className="line-clamp-2 text-sm font-medium hover:text-primary"
            >
              {item.name}
            </Link>
            {variant && <p className="mt-0.5 text-xs text-muted-foreground">{variant}</p>}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
            aria-label={`Quitar ${item.name}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        {item.customization && (
          <div className="mt-2 rounded-md bg-primary/5 p-2 text-xs">
            <p className="flex items-center gap-1 font-medium text-primary">
              <Sparkles className="size-3" /> {CUSTOMIZERS[item.customization.type].title}
            </p>
            <p className="mt-0.5 text-muted-foreground">
              {Object.values(item.customization.options).join(" · ")} · {item.customization.photos.length} foto(s)
            </p>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            max={item.maxStock}
            onChange={(q) => updateQuantity(item.id, q)}
          />
          <span className="text-sm font-semibold">{formatPrice(item.unitPrice * item.quantity)}</span>
        </div>
      </div>
    </div>
  )
}
