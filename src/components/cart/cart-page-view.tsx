"use client"

import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { selectCartSubtotal, useCartStore } from "@/store/cart"
import { useMounted } from "@/hooks/use-mounted"
import { CartLineItem } from "./cart-line-item"
import { OrderSummary, type ShippingRules } from "./order-summary"
import { CheckoutButton } from "./checkout-button"

export function CartPageView(rules: ShippingRules) {
  const mounted = useMounted()
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore(selectCartSubtotal)
  const clear = useCartStore((s) => s.clear)

  if (!mounted) return <Skeleton className="h-80 w-full" />

  if (items.length === 0) {
    return (
      <EmptyState
        title="Tu carrito está vacío"
        description="Cuando agregues productos, los vas a ver acá. No hace falta tener cuenta para comprar hasta el pago."
        action={
          <Button asChild>
            <Link href="/productos">Ver productos</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="flex items-center justify-between border-b pb-3 text-sm">
          <span className="text-muted-foreground">{items.length} producto(s)</span>
          <button type="button" onClick={clear} className="text-muted-foreground hover:text-destructive">
            Vaciar carrito
          </button>
        </div>
        <div className="divide-y">
          {items.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </div>
        <Link href="/productos" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="size-4" /> Seguir comprando
        </Link>
      </div>

      <aside className="h-fit space-y-4 rounded-lg border p-5 lg:sticky lg:top-32">
        <h2 className="font-semibold">Resumen</h2>
        <OrderSummary subtotal={subtotal} {...rules}>
          <CheckoutButton className="w-full" />
        </OrderSummary>
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          Te vamos a pedir que ingreses a tu cuenta para pagar con Mercado Pago. Tu carrito queda guardado.
        </p>
      </aside>
    </div>
  )
}
