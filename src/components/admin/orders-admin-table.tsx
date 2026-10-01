"use client"

import Link from "next/link"
import type { Order } from "@/types"
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/account/order-status-badge"
import { ORDER_STATUS_LABELS } from "@/lib/constants"
import { formatDate, formatPrice } from "@/lib/format"
import { DataTable, type Column } from "./data-table"

const columns: Column<Order>[] = [
  {
    header: "Pedido",
    cell: (o) => (
      <Link href={`/admin/pedidos/${o.id}`} className="font-medium hover:text-primary">
        #{o.number}
      </Link>
    ),
  },
  {
    header: "Cliente",
    cell: (o) => (
      <div className="min-w-0">
        <p className="truncate">{o.customerName}</p>
        <p className="truncate text-xs text-muted-foreground">{o.customerEmail}</p>
      </div>
    ),
  },
  { header: "Fecha", cell: (o) => formatDate(o.createdAt), className: "hidden md:table-cell" },
  { header: "Pago", cell: (o) => <PaymentStatusBadge status={o.paymentStatus} />, className: "hidden lg:table-cell" },
  { header: "Estado", cell: (o) => <OrderStatusBadge status={o.status} /> },
  { header: "Total", cell: (o) => <span className="font-medium">{formatPrice(o.total)}</span>, className: "text-right" },
]

export function OrdersAdminTable({ orders }: { orders: Order[] }) {
  return (
    <DataTable
      rows={orders}
      columns={columns}
      getRowId={(o) => o.id}
      searchPlaceholder="Buscar por número o cliente"
      getSearchText={(o) => `${o.number} ${o.customerName} ${o.customerEmail}`}
      filter={{
        label: "Estado",
        options: Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label })),
        predicate: (o, value) => o.status === value,
      }}
    />
  )
}
