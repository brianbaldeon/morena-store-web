import { connection } from "next/server"
import { PageContainer } from "@/components/shared/page-container"
import { AccountShell } from "@/components/account/account-shell"

export default async function AccountLayout({ children }: LayoutProps<"/cuenta">) {
  // Datos por usuario: siempre en el momento del request, nunca prerenderizados.
  await connection()
  return (
    <PageContainer className="py-10">
      <AccountShell>{children}</AccountShell>
    </PageContainer>
  )
}
