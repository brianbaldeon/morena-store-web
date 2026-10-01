import type { Metadata } from "next"
import { connection } from "next/server"
import { PageContainer } from "@/components/shared/page-container"
import { CheckoutView } from "@/components/checkout/checkout-view"
import { getSettings, listAddresses } from "@/lib/services/account"

export const metadata: Metadata = { title: "Checkout" }

/** Requiere login: CheckoutView manda a /login?next=/checkout si es invitado. */
export default async function CheckoutPage() {
  await connection()
  const [settings, addresses] = await Promise.all([getSettings(), listAddresses()])
  return (
    <PageContainer className="py-10">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Finalizar compra</h1>
      <CheckoutView
        addresses={addresses}
        rules={{ shippingCost: settings.shippingCost, freeShippingFrom: settings.freeShippingFrom }}
      />
    </PageContainer>
  )
}
