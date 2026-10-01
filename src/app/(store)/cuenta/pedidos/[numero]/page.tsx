import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Sparkles, Truck } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/account/order-status-badge"
import { OrderTimeline } from "@/components/account/order-timeline"
import { DesignApprovalCard } from "@/components/account/design-approval-card"
import { getOrderByNumber, listCustomOrders } from "@/lib/services/orders"
import { formatDate, formatPrice } from "@/lib/format"

export async function generateMetadata(props: PageProps<"/cuenta/pedidos/[numero]">): Promise<Metadata> {
  const { numero } = await props.params
  return { title: `Pedido #${numero}` }
}

export default async function OrderDetailPage(props: PageProps<"/cuenta/pedidos/[numero]">) {
  const { numero } = await props.params
  const order = await getOrderByNumber(numero)
  if (!order) notFound()
  const customOrders = (await listCustomOrders()).filter((c) => c.orderNumber === order.number)

  return (
    <div className="space-y-6">
      <Link href="/cuenta/pedidos" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="size-4" /> Mis pedidos
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pedido #{order.number}</h1>
          <p className="text-sm text-muted-foreground">Hecho el {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <section className="rounded-lg border p-5">
            <h2 className="mb-2 font-semibold">Productos</h2>
            <ul className="divide-y">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3 py-3">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[item.size && `Talle ${item.size}`, item.color, `x${item.quantity}`].filter(Boolean).join(" · ")}
                    </p>
                    {item.customization && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                        <Sparkles className="size-3" /> Personalizado
                        {item.customization.notes && ` · “${item.customization.notes}”`}
                      </p>
                    )}
                  </div>
                  <span className="text-sm">{formatPrice(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <Separator className="my-3" />
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Envío</dt>
                <dd>{order.shippingCost === 0 ? "Gratis" : formatPrice(order.shippingCost)}</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </section>

          {customOrders.map((custom) => (
            <DesignApprovalCard key={custom.id} customOrder={custom} />
          ))}
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border p-5">
            <h2 className="mb-4 font-semibold">Seguimiento</h2>
            <OrderTimeline order={order} />
          </section>
          <section className="space-y-2 rounded-lg border p-5 text-sm">
            <h2 className="flex items-center gap-2 font-semibold">
              <Truck className="size-4 text-primary" /> Envío
            </h2>
            {order.shippingAddress ? (
              <p className="text-muted-foreground">
                {order.shippingAddress.street} {order.shippingAddress.number}
                {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.province} ({order.shippingAddress.postalCode})
              </p>
            ) : (
              <p className="text-muted-foreground">Retiro por el taller (Palermo, CABA)</p>
            )}
            {order.trackingNumber && (
              <p>
                Código de seguimiento: <span className="font-mono font-medium">{order.trackingNumber}</span>
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
