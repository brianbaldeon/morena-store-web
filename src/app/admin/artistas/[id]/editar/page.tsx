import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AdminPageHeader } from "@/components/admin/page-header"
import { ArtistForm } from "@/components/admin/artist-form"
import { getBrandById } from "@/lib/services/catalog"

export const metadata: Metadata = { title: "Editar artista" }

export default async function EditArtistPage(props: PageProps<"/admin/artistas/[id]/editar">) {
  const { id } = await props.params
  const artist = await getBrandById(id)
  if (!artist) notFound()
  return (
    <>
      <AdminPageHeader title={`Editar "${artist.name}"`} backHref="/admin/artistas" backLabel="Artistas" />
      <ArtistForm artist={artist} />
    </>
  )
}
