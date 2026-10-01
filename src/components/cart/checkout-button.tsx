"use client"

import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart"
import { useSessionStore } from "@/store/session"

/**
 * "Ir a pagar". Única puerta de entrada al login en la tienda:
 * si es invitado, va a /login?next=/checkout y vuelve con el carrito intacto.
 */
export function CheckoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const user = useSessionStore((s) => s.user)
  const setOpen = useCartStore((s) => s.setOpen)
  const isEmpty = useCartStore((s) => s.items.length === 0)

  function goToCheckout() {
    setOpen(false)
    router.push(user ? "/checkout" : "/login?next=/checkout")
  }

  return (
    <Button size="lg" className={className} onClick={goToCheckout} disabled={isEmpty}>
      <Lock /> Ir a pagar
    </Button>
  )
}
