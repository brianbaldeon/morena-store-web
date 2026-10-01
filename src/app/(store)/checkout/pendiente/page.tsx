import type { Metadata } from "next"
import { PageContainer } from "@/components/shared/page-container"
import { PaymentResult } from "@/components/checkout/payment-result"

export const metadata: Metadata = { title: "Pago pendiente" }

export default async function CheckoutPendingPage(props: PageProps<"/checkout/pendiente">) {
  const { pedido } = await props.searchParams
  return (
    <PageContainer>
      <PaymentResult variant="pending" orderNumber={typeof pedido === "string" ? pedido : undefined} />
    </PageContainer>
  )
}
