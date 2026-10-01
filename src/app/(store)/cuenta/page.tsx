import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProfileForm } from "@/components/account/profile-form"
import { OrderStatusBadge } from "@/components/account/order-status-badge"
import { listOrders } from "@/lib/services/orders"
import { formatDate, formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Mi cuenta" }

export default async function AccountPage() {
  const orders = await listOrders({ userId: "usr-001" })
  const last = orders[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mi perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tus datos para los envíos y el contacto.</p>
      </div>

      {last && (
        <Link
          href={`/cuenta/pedidos/${last.number}`}
          className="flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:border-primary/40"
        >
          <div>
            <p className="text-xs text-muted-foreground">Último pedido · {formatDate(last.createdAt)}</p>
            <p className="mt-1 font-medium">
              #{last.number} · {formatPrice(last.total)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <OrderStatusBadge status={last.status} />
            <ArrowRight className="size-4 text-muted-foreground" />
          </div>
        </Link>
      )}

      <section className="rounded-lg border p-5">
        <h2 className="mb-4 font-semibold">Datos personales</h2>
        <ProfileForm />
      </section>
    </div>
  )
}
