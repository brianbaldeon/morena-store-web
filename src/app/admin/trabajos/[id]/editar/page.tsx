import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AdminPageHeader } from "@/components/admin/page-header"
import { ShowcaseForm } from "@/components/admin/showcase-form"
import { getShowcaseWorkById } from "@/lib/services/showcase"

export const metadata: Metadata = { title: "Editar trabajo" }

export default async function EditShowcaseWorkPage(props: PageProps<"/admin/trabajos/[id]/editar">) {
  const { id } = await props.params
  const work = await getShowcaseWorkById(id)
  if (!work) notFound()
  return (
    <>
      <AdminPageHeader title={`Editar "${work.title}"`} backHref="/admin/trabajos" backLabel="Trabajos" />
      <ShowcaseForm work={work} />
    </>
  )
}
