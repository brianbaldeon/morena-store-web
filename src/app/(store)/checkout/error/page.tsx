import type { Metadata } from "next"
import { PageContainer } from "@/components/shared/page-container"
import { PaymentResult } from "@/components/checkout/payment-result"

export const metadata: Metadata = { title: "Pago no completado" }

export default function CheckoutErrorPage() {
  return (
    <PageContainer>
      <PaymentResult variant="error" />
    </PageContainer>
  )
}
