"use client"

import type { Payment, User } from "@/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PaymentStatusBadge } from "@/components/account/order-status-badge"
import { PAYMENT_STATUS_LABELS } from "@/lib/constants"
import { formatDate, formatDateTime, formatPrice } from "@/lib/format"
import { initials } from "@/lib/utils"
import { DataTable } from "./data-table"

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  return (
    <DataTable
      rows={payments}
      getRowId={(p) => p.id}
      getSearchText={(p) => `${p.orderNumber} ${p.customerName}`}
      searchPlaceholder="Buscar por pedido o cliente"
      filter={{
        label: "Estado",
        options: Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => ({ value, label })),
        predicate: (p, v) => p.status === v,
      }}
      columns={[
        { header: "Pedido", cell: (p) => <span className="font-medium">#{p.orderNumber}</span> },
        { header: "Cliente", cell: (p) => p.customerName },
        { header: "Fecha", cell: (p) => formatDateTime(p.date), className: "hidden md:table-cell" },
        { header: "Medio", cell: () => "Mercado Pago", className: "hidden lg:table-cell" },
        { header: "Estado", cell: (p) => <PaymentStatusBadge status={p.status} /> },
        { header: "Monto", cell: (p) => <span className="font-medium">{formatPrice(p.amount)}</span>, className: "text-right" },
      ]}
    />
  )
}

export function CustomersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      rows={users}
      getRowId={(u) => u.id}
      getSearchText={(u) => `${u.name} ${u.email}`}
      searchPlaceholder="Buscar por nombre o email"
      filter={{
        label: "Rol",
        options: [
          { value: "CUSTOMER", label: "Clientes" },
          { value: "ADMIN", label: "Administradores" },
        ],
        predicate: (u, v) => u.role === v,
      }}
      columns={[
        {
          header: "Cliente",
          cell: (u) => (
            <div className="flex items-center gap-3">
              <Avatar className="size-8 border">
                <AvatarFallback className="text-xs">{initials(u.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{u.name}</p>
                <p className="truncate text-xs text-muted-foreground">{u.email}</p>
              </div>
            </div>
          ),
        },
        { header: "Teléfono", cell: (u) => u.phone ?? "—", className: "hidden md:table-cell" },
        { header: "Rol", cell: (u) => (u.role === "ADMIN" ? "Admin" : "Cliente") },
        { header: "Alta", cell: (u) => formatDate(u.createdAt), className: "text-right" },
      ]}
    />
  )
}
