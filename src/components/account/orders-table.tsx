import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { Order } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate, formatPrice } from "@/lib/format"
import { OrderStatusBadge } from "./order-status-badge"

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <>
      {/* Mobile: tarjetas */}
      <ul className="space-y-3 md:hidden">
        {orders.map((order) => (
          <li key={order.id}>
            <Link href={`/cuenta/pedidos/${order.number}`} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image src={order.items[0].image} alt="" fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">#{order.number}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(order.createdAt)} · {formatPrice(order.total)}
                </p>
                <OrderStatusBadge status={order.status} />
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop: tabla */}
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.number}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="relative size-8 overflow-hidden rounded-full border-2 border-background bg-muted">
                        <Image src={item.image} alt={item.name} fill sizes="32px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right font-medium">{formatPrice(order.total)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/cuenta/pedidos/${order.number}`} className="text-sm text-primary hover:underline">
                    Ver detalle
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
