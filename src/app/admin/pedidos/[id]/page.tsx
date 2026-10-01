import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Mail, Phone, Sparkles } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { AdminPageHeader } from "@/components/admin/page-header"
import { OrderStatusForm } from "@/components/admin/order-status-form"
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/account/order-status-badge"
import { OrderTimeline } from "@/components/account/order-timeline"
import { getOrderById, listCustomOrders } from "@/lib/services/orders"
import { formatDateTime, formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Pedido" }

export default async function AdminOrderPage(props: PageProps<"/admin/pedidos/[id]">) {
  const { id } = await props.params
  const order = await getOrderById(id)
  if (!order) notFound()
  const customOrders = (await listCustomOrders()).filter((c) => c.orderNumber === order.number)

  return (
    <>
      <AdminPageHeader
        title={`Pedido #${order.number}`}
        description={formatDateTime(order.createdAt)}
        backHref="/admin/pedidos"
        backLabel="Pedidos"
        actions={
          <div className="flex items-center gap-2">
            <PaymentStatusBadge status={order.paymentStatus} />
            <OrderStatusBadge status={order.status} />
          </div>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-lg border p-5">
            <h2 className="mb-2 font-semibold">Productos</h2>
            <ul className="divide-y">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3 py-3">
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-muted">
                    <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[item.size && `Talle ${item.size}`, item.color, `x${item.quantity}`].filter(Boolean).join(" · ")}
                    </p>
                    {item.customization && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                        <Sparkles className="size-3" /> Personalizado · {Object.values(item.customization.options).join(" · ")}
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
              {order.mpPaymentId && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <dt>ID de pago Mercado Pago</dt>
                  <dd className="font-mono">{order.mpPaymentId}</dd>
                </div>
              )}
            </dl>
          </section>

          {customOrders.length > 0 && (
            <section className="rounded-lg border p-5">
              <h2 className="mb-3 font-semibold">Personalizados de este pedido</h2>
              <ul className="space-y-2">
                {customOrders.map((c) => (
                  <li key={c.id}>
                    <Link href={`/admin/personalizados/${c.id}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Sparkles className="size-4" /> {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-lg border p-5">
            <h2 className="mb-4 font-semibold">Historial</h2>
            <OrderTimeline order={order} />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border p-5">
            <h2 className="mb-4 font-semibold">Actualizar estado</h2>
            <OrderStatusForm order={order} />
          </section>
          <section className="space-y-2 rounded-lg border p-5 text-sm">
            <h2 className="font-semibold">Cliente</h2>
            <p>{order.customerName}</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-3.5" /> {order.customerEmail}
            </p>
            {order.shippingAddress?.phone && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3.5" /> {order.shippingAddress.phone}
              </p>
            )}
          </section>
          <section className="space-y-2 rounded-lg border p-5 text-sm">
            <h2 className="font-semibold">Envío</h2>
            {order.shippingAddress ? (
              <p className="text-muted-foreground">
                {order.shippingAddress.street} {order.shippingAddress.number}
                {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.province} ({order.shippingAddress.postalCode})
              </p>
            ) : (
              <p className="text-muted-foreground">Retira por el taller</p>
            )}
          </section>
        </aside>
      </div>
    </>
  )
}
