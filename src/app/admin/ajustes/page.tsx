import type { Metadata } from "next"
import { AdminPageHeader } from "@/components/admin/page-header"
import { SettingsForm } from "@/components/admin/settings-form"
import { getSettings } from "@/lib/services/account"

export const metadata: Metadata = { title: "Ajustes" }

export default async function AdminSettingsPage() {
  const settings = await getSettings()
  return (
    <>
      <AdminPageHeader title="Ajustes" description="Datos de contacto, envíos y pagos." />
      <SettingsForm settings={settings} />
    </>
  )
}
