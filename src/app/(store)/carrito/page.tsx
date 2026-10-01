import type { Metadata } from "next"
import { PageContainer } from "@/components/shared/page-container"
import { CartPageView } from "@/components/cart/cart-page-view"
import { getSettings } from "@/lib/services/account"

export const metadata: Metadata = { title: "Carrito" }

export default async function CartPage() {
  const settings = await getSettings()
  return (
    <PageContainer className="py-10">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Tu carrito</h1>
      <CartPageView shippingCost={settings.shippingCost} freeShippingFrom={settings.freeShippingFrom} />
    </PageContainer>
  )
}
