import { Check } from "lucide-react"
import type { Order, OrderStatus } from "@/types"
import { ORDER_STATUS_LABELS } from "@/lib/constants"
import { formatDateTime } from "@/lib/format"
import { cn } from "@/lib/utils"

const FLOW: OrderStatus[] = ["PENDIENTE", "PAGADO", "EN_PRODUCCION", "ENVIADO", "ENTREGADO"]

export function OrderTimeline({ order }: { order: Order }) {
  if (order.status === "CANCELADO") {
    return <p className="text-sm text-muted-foreground">Este pedido fue cancelado.</p>
  }
  const reached = new Map(order.timeline.map((t) => [t.status, t.date]))
  const currentIndex = FLOW.indexOf(order.status)

  return (
    <ol className="relative space-y-5">
      {FLOW.map((status, i) => {
        const date = reached.get(status)
        const done = i <= currentIndex
        return (
          <li key={status} className="relative flex gap-3">
            {i < FLOW.length - 1 && (
              <span
                className={cn("absolute top-7 left-3.5 h-[calc(100%-4px)] w-px -translate-x-1/2 bg-border", i < currentIndex && "bg-primary")}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border bg-background text-xs",
                done && "border-primary bg-primary text-primary-foreground",
                i === currentIndex && "ring-4 ring-primary/15",
              )}
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </span>
            <div className="pt-0.5">
              <p className={cn("text-sm", done ? "font-medium" : "text-muted-foreground")}>{ORDER_STATUS_LABELS[status]}</p>
              {date && <p className="text-xs text-muted-foreground">{formatDateTime(date)}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
