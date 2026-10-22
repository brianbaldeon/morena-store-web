import type { Metadata } from "next"
import { AdminPageHeader } from "@/components/admin/page-header"
import { ShowcaseForm } from "@/components/admin/showcase-form"

export const metadata: Metadata = { title: "Nuevo trabajo" }

export default function NewShowcaseWorkPage() {
  return (
    <>
      <AdminPageHeader title="Nuevo trabajo" backHref="/admin/trabajos" backLabel="Trabajos" />
      <ShowcaseForm />
    </>
  )
}
