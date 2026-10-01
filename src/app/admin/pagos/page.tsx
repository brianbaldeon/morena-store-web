import type { Metadata } from "next"
import { AdminPageHeader } from "@/components/admin/page-header"
import { PaymentsTable } from "@/components/admin/people-tables"
import { getDashboard } from "@/lib/services/account"

export const metadata: Metadata = { title: "Pagos" }

export default async function AdminPaymentsPage() {
  const { payments } = await getDashboard()
  return (
    <>
      <AdminPageHeader title="Pagos" description="Pagos recibidos por Mercado Pago (datos de prueba)." />
      <PaymentsTable payments={payments} />
    </>
  )
}
