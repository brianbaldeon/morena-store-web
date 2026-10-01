import type { Metadata } from "next"
import { PageContainer } from "@/components/shared/page-container"
import { PaymentResult } from "@/components/checkout/payment-result"

export const metadata: Metadata = { title: "¡Compra confirmada!" }

export default async function CheckoutSuccessPage(props: PageProps<"/checkout/exito">) {
  const { pedido } = await props.searchParams
  return (
    <PageContainer>
      <PaymentResult variant="success" orderNumber={typeof pedido === "string" ? pedido : undefined} />
    </PageContainer>
  )
}
