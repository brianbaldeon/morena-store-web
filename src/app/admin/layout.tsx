import type { Metadata } from "next"
import { connection } from "next/server"
import { AdminShell } from "@/components/admin/admin-shell"
import { listCustomOrders } from "@/lib/services/orders"

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel Morena" },
  robots: { index: false },
}

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // El panel siempre muestra datos al momento del request.
  await connection()
  const pendingCustom = (await listCustomOrders()).filter((o) => o.status === "RECIBIDO" || o.status === "APROBACION").length
  return <AdminShell pendingCustom={pendingCustom}>{children}</AdminShell>
}
