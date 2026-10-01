import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { ArtistsTable } from "@/components/admin/catalog-tables"
import { listBrands } from "@/lib/services/catalog"

export const metadata: Metadata = { title: "Artistas" }

export default async function AdminArtistsPage() {
  const artists = await listBrands()
  return (
    <>
      <AdminPageHeader
        title="Artistas y personajes"
        description="Aparecen en el filtro “Artista / Personaje” del catálogo."
        actions={
          <Button asChild>
            <Link href="/admin/artistas/nuevo">
              <Plus /> Nuevo artista
            </Link>
          </Button>
        }
      />
      <ArtistsTable artists={artists} />
    </>
  )
}
