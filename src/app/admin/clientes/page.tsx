import type { Metadata } from "next"
import { AdminPageHeader } from "@/components/admin/page-header"
import { CustomersTable } from "@/components/admin/people-tables"
import { listUsers } from "@/lib/services/account"

export const metadata: Metadata = { title: "Clientes" }

export default async function AdminCustomersPage() {
  const users = await listUsers()
  return (
    <>
      <AdminPageHeader title="Clientes" description="Personas que crearon su cuenta para comprar." />
      <CustomersTable users={users} />
    </>
  )
}
