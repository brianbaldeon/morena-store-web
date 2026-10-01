import Image from "next/image"
import Link from "next/link"
import { DollarSign, ShoppingBag, Sparkles, Users } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { SalesChart } from "@/components/admin/sales-chart"
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/account/order-status-badge"
import { getDashboard } from "@/lib/services/account"
import { listOrders } from "@/lib/services/orders"
import { listProducts } from "@/lib/services/catalog"
import { formatDate, formatNumber, formatPrice } from "@/lib/format"

export default async function AdminDashboardPage() {
  const [{ stats, sales, payments }, orders, products] = await Promise.all([
    getDashboard(),
    listOrders(),
    listProducts(),
  ])
  const lowStock = products.filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock).slice(0, 5)

  return (
    <>
      <AdminPageHeader title="Dashboard" description="Cómo viene la tienda este mes." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ventas del mes" value={formatPrice(stats.revenue)} icon={DollarSign} change={stats.revenueChange} />
        <StatCard label="Pedidos" value={formatNumber(stats.orders)} icon={ShoppingBag} change={stats.ordersChange} />
        <StatCard label="Clientes nuevos" value={formatNumber(stats.customers)} icon={Users} change={stats.customersChange} />
        <StatCard
          label="Personalizados pendientes"
          value={String(stats.pendingCustom)}
          icon={Sparkles}
          hint="Esperando diseño o aprobación"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border p-5">
          <h2 className="font-semibold">Ventas de los últimos 6 meses</h2>
          <p className="mb-4 text-xs text-muted-foreground">En pesos, pagos aprobados por Mercado Pago</p>
          <SalesChart data={sales} />
        </section>
        <section className="rounded-lg border p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Stock bajo</h2>
            <Link href="/admin/productos" className="text-xs text-primary hover:underline">
              Ver productos
            </Link>
          </div>
          <ul className="space-y-3">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-muted">
                  <Image src={p.images[0]} alt="" fill sizes="36px" className="object-cover" />
                </div>
                <Link href={`/admin/productos/${p.id}`} className="min-w-0 flex-1 truncate text-sm hover:text-primary">
                  {p.name}
                </Link>
                <span className="text-xs font-medium text-destructive">{p.stock} u.</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Últimos pedidos</h2>
            <Link href="/admin/pedidos" className="text-xs text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <ul className="divide-y">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <Link href={`/admin/pedidos/${order.id}`} className="font-medium hover:text-primary">
                    #{order.number}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {order.customerName} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <span className="w-20 text-right font-medium">{formatPrice(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Pagos recientes</h2>
            <Link href="/admin/pagos" className="text-xs text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <ul className="divide-y">
            {payments.slice(0, 5).map((payment) => (
              <li key={payment.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">#{payment.orderNumber}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {payment.customerName} · Mercado Pago
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <PaymentStatusBadge status={payment.status} />
                  <span className="w-20 text-right font-medium">{formatPrice(payment.amount)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
