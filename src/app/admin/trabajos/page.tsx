import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { ShowcaseTable } from "@/components/admin/showcase-table"
import { listShowcaseWorks } from "@/lib/services/showcase"

export const metadata: Metadata = { title: "Trabajos" }

export default async function AdminShowcasePage() {
  const works = await listShowcaseWorks({ includeHidden: true })
  return (
    <>
      <AdminPageHeader
        title="Trabajos personalizados"
        description="Se muestran en la galería “Personalizados” de la tienda. No se venden: son para mostrar lo que hacemos."
        actions={
          <Button asChild>
            <Link href="/admin/trabajos/nuevo">
              <Plus /> Nuevo trabajo
            </Link>
          </Button>
        }
      />
      <ShowcaseTable works={works} />
    </>
  )
}
