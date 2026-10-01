import type { Metadata } from "next"
import { AdminPageHeader } from "@/components/admin/page-header"
import { CustomOrderBoard } from "@/components/admin/custom-order-board"
import { listCustomOrders } from "@/lib/services/orders"

export const metadata: Metadata = { title: "Personalizados" }

export default async function AdminCustomOrdersPage() {
  const orders = await listCustomOrders()
  return (
    <>
      <AdminPageHeader
        title="Personalizados"
        description="Seguí cada muñeco, llavero y prenda personalizada desde que llega hasta que sale."
      />
      <CustomOrderBoard orders={orders} />
    </>
  )
}
