import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { CalendarClock, MessageSquareQuote } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { CustomOrderForm } from "@/components/admin/custom-order-form"
import { CustomStatusBadge } from "@/components/account/order-status-badge"
import { getCustomOrderById } from "@/lib/services/orders"
import { CUSTOMIZERS } from "@/lib/constants"
import { formatDate } from "@/lib/format"

export const metadata: Metadata = { title: "Personalizado" }

export default async function AdminCustomOrderPage(props: PageProps<"/admin/personalizados/[id]">) {
  const { id } = await props.params
  const order = await getCustomOrderById(id)
  if (!order) notFound()
  const config = CUSTOMIZERS[order.type]

  return (
    <>
      <AdminPageHeader
        title={order.title}
        description={`${config.title} · Pedido #${order.orderNumber} · ${order.customerName}`}
        backHref="/admin/personalizados"
        backLabel="Personalizados"
        actions={<CustomStatusBadge status={order.status} />}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-lg border p-5">
            <h2 className="mb-3 font-semibold">Fotos del cliente</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {order.photos.map((src, i) => (
                <div key={i} className="relative aspect-3/4 overflow-hidden rounded-md bg-muted">
                  <Image src={src} alt={`Foto ${i + 1}`} fill sizes="200px" className="object-cover" />
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-lg border p-5">
            <h2 className="mb-3 font-semibold">Opciones elegidas</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              {config.optionGroups.map((group) => (
                <div key={group.key} className="rounded-md bg-muted p-3">
                  <dt className="text-xs text-muted-foreground">{group.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium">{order.options[group.key] ?? "—"}</dd>
                </div>
              ))}
            </dl>
            {order.notes && (
              <blockquote className="mt-4 flex gap-2 rounded-md border-l-2 border-primary bg-primary/5 p-3 text-sm">
                <MessageSquareQuote className="size-4 shrink-0 text-primary" /> {order.notes}
              </blockquote>
            )}
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="size-4" /> Entrega comprometida: {formatDate(order.dueDate)}
            </p>
          </section>
          {order.designPreview && (
            <section className="rounded-lg border p-5">
              <h2 className="mb-3 font-semibold">Diseño enviado al cliente</h2>
              <div className="relative aspect-3/4 max-w-56 overflow-hidden rounded-md bg-muted">
                <Image src={order.designPreview} alt="Diseño" fill sizes="224px" className="object-cover" />
              </div>
            </section>
          )}
        </div>
        <aside>
          <section className="rounded-lg border p-5">
            <h2 className="mb-4 font-semibold">Producción</h2>
            <CustomOrderForm order={order} />
          </section>
        </aside>
      </div>
    </>
  )
}
