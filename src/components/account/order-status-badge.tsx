import type { CustomOrderStatus, OrderStatus, PaymentStatus } from "@/types"
import { CUSTOM_ORDER_STATUSES, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants"
import { cn } from "@/lib/utils"

const ORDER_TONE: Record<OrderStatus, string> = {
  PENDIENTE: "bg-warning/15 text-warning",
  PAGADO: "bg-primary/10 text-primary",
  EN_PRODUCCION: "bg-chart-4/15 text-chart-4",
  ENVIADO: "bg-chart-3/15 text-chart-3",
  ENTREGADO: "bg-success/15 text-success",
  CANCELADO: "bg-muted text-muted-foreground",
}

const PAYMENT_TONE: Record<PaymentStatus, string> = {
  PENDING: "bg-warning/15 text-warning",
  IN_PROCESS: "bg-warning/15 text-warning",
  APPROVED: "bg-success/15 text-success",
  REJECTED: "bg-destructive/10 text-destructive",
  REFUNDED: "bg-muted text-muted-foreground",
}

const base = "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={cn(base, ORDER_TONE[status])}>{ORDER_STATUS_LABELS[status]}</span>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={cn(base, PAYMENT_TONE[status])}>{PAYMENT_STATUS_LABELS[status]}</span>
}

export function CustomStatusBadge({ status }: { status: CustomOrderStatus }) {
  const label = CUSTOM_ORDER_STATUSES.find((s) => s.value === status)?.label ?? status
  return <span className={cn(base, "bg-primary/10 text-primary")}>{label}</span>
}
