import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { OrdersTable } from "@/components/account/orders-table"
import { listOrders } from "@/lib/services/orders"

export const metadata: Metadata = { title: "Mis pedidos" }

export default async function OrdersPage() {
  // Etapa 2: el userId sale de la sesión de Auth.js
  const orders = await listOrders({ userId: "usr-001" })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mis pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Seguí el estado de tus compras y personalizados.</p>
      </div>
      {orders.length === 0 ? (
        <EmptyState
          title="Todavía no hiciste pedidos"
          action={
            <Button asChild>
              <Link href="/productos">Ver productos</Link>
            </Button>
          }
        />
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  )
}
