import type { Metadata } from "next"
import { AdminPageHeader } from "@/components/admin/page-header"
import { ArtistForm } from "@/components/admin/artist-form"

export const metadata: Metadata = { title: "Nuevo artista" }

export default function NewArtistPage() {
  return (
    <>
      <AdminPageHeader title="Nuevo artista o personaje" backHref="/admin/artistas" backLabel="Artistas" />
      <ArtistForm />
    </>
  )
}
