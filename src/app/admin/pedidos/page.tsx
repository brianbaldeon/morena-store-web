import type { Metadata } from "next"
import { AdminPageHeader } from "@/components/admin/page-header"
import { OrdersAdminTable } from "@/components/admin/orders-admin-table"
import { listOrders } from "@/lib/services/orders"

export const metadata: Metadata = { title: "Pedidos" }

export default async function AdminOrdersPage() {
  const orders = await listOrders()
  return (
    <>
      <AdminPageHeader title="Pedidos" description="Todos los pedidos pagados con Mercado Pago." />
      <OrdersAdminTable orders={orders} />
    </>
  )
}
