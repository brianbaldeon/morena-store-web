import Image from "next/image"
import Link from "next/link"
import { CalendarClock } from "lucide-react"
import type { CustomOrder } from "@/types"
import { CUSTOM_ORDER_STATUSES, CUSTOMIZERS } from "@/lib/constants"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

const TODAY = "2026-10-01"

function CustomOrderCard({ order }: { order: CustomOrder }) {
  const overdue = order.status !== "ENVIADO" && order.dueDate < TODAY
  return (
    <Link
      href={`/admin/personalizados/${order.id}`}
      className="block rounded-lg border bg-card p-3 transition-colors hover:border-primary/50"
    >
      <div className="flex gap-3">
        <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded bg-muted">
          <Image src={order.photos[0]} alt="" fill sizes="44px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-medium">{order.title}</p>
          <p className="truncate text-xs text-muted-foreground">{order.customerName}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="rounded bg-muted px-1.5 py-0.5">{CUSTOMIZERS[order.type].title.split(" ")[0]}</span>
        <span className={cn("flex items-center gap-1 text-muted-foreground", overdue && "font-medium text-destructive")}>
          <CalendarClock className="size-3.5" /> {formatDate(order.dueDate)}
        </span>
      </div>
    </Link>
  )
}

/** Kanban de producción: Recibido → Diseño → Aprobación → Producción → Enviado. Cada card lleva a su página. */
export function CustomOrderBoard({ orders }: { orders: CustomOrder[] }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      <div className="grid min-w-[1000px] grid-cols-5 gap-4">
        {CUSTOM_ORDER_STATUSES.map((column) => {
          const items = orders.filter((o) => o.status === column.value)
          return (
            <section key={column.value} className="flex flex-col rounded-lg bg-muted/60 p-3">
              <header className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold">{column.label}</h2>
                <span className="rounded-full bg-background px-2 text-xs text-muted-foreground">{items.length}</span>
              </header>
              <div className="space-y-2">
                {items.map((order) => (
                  <CustomOrderCard key={order.id} order={order} />
                ))}
                {items.length === 0 && (
                  <p className="rounded-md border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">Vacío</p>
                )}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
