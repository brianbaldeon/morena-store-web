"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { selectCartCount, selectCartSubtotal, useCartStore } from "@/store/cart"
import { useMounted } from "@/hooks/use-mounted"
import { EmptyState } from "@/components/shared/empty-state"
import { CartLineItem } from "./cart-line-item"
import { OrderSummary, type ShippingRules } from "./order-summary"
import { CheckoutButton } from "./checkout-button"

export function CartSheet({ shippingCost, freeShippingFrom }: ShippingRules) {
  const mounted = useMounted()
  const isOpen = useCartStore((s) => s.isOpen)
  const setOpen = useCartStore((s) => s.setOpen)
  const items = useCartStore((s) => s.items)
  const count = useCartStore(selectCartCount)
  const subtotal = useCartStore(selectCartSubtotal)

  return (
    <Sheet open={mounted && isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" /> Tu carrito
            <span className="text-sm font-normal text-muted-foreground">({count})</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Productos que agregaste al carrito</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center p-4">
            <EmptyState
              className="w-full"
              title="Tu carrito está vacío"
              description="Sumá algo lindo hecho a mano."
              action={
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/productos">Ver productos</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <ScrollArea className="min-h-0 flex-1 px-4">
              <div className="divide-y">
                {items.map((item) => (
                  <CartLineItem key={item.id} item={item} compact />
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="border-t">
              <OrderSummary subtotal={subtotal} shippingCost={shippingCost} freeShippingFrom={freeShippingFrom}>
                <div className="grid gap-2">
                  <CheckoutButton className="w-full" />
                  <Button variant="outline" asChild onClick={() => setOpen(false)}>
                    <Link href="/carrito">Ver carrito</Link>
                  </Button>
                </div>
              </OrderSummary>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
