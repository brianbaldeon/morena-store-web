"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import { toast } from "sonner"
import type { Brand, Category } from "@/types"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"
import { api } from "@/lib/api-client"
import { PRODUCT_TYPE_LABELS } from "@/lib/constants"
import { DataTable } from "./data-table"

type WithCount<T> = T & { productCount: number }

export function CategoriesTable({ categories }: { categories: WithCount<Category>[] }) {
  const router = useRouter()
  return (
    <DataTable
      rows={categories}
      getRowId={(c) => c.id}
      getSearchText={(c) => c.name}
      searchPlaceholder="Buscar categoría"
      columns={[
        {
          header: "Categoría",
          cell: (c) => (
            <div className="flex items-center gap-3">
              <div className="relative size-10 shrink-0 overflow-hidden rounded bg-muted">
                <Image src={c.image} alt="" fill sizes="40px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <Link href={`/admin/categorias/${c.id}/editar`} className="font-medium hover:text-primary">
                  {c.name}
                </Link>
                <p className="truncate text-xs text-muted-foreground">/categoria/{c.slug}</p>
              </div>
            </div>
          ),
        },
        { header: "Tipo", cell: (c) => PRODUCT_TYPE_LABELS[c.productType], className: "hidden md:table-cell" },
        { header: "Productos", cell: (c) => c.productCount },
        {
          header: "Acciones",
          className: "w-24 text-right",
          cell: (c) => (
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" asChild aria-label={`Editar ${c.name}`}>
                <Link href={`/admin/categorias/${c.id}/editar`}>
                  <Pencil />
                </Link>
              </Button>
              <ConfirmDeleteDialog
                title="¿Eliminar categoría?"
                description={`"${c.name}" tiene ${c.productCount} productos. Esta acción no se puede deshacer.`}
                onConfirm={async () => {
                  await api.categories.remove(c.id)
                  toast.success("Categoría eliminada")
                  router.refresh()
                }}
              />
            </div>
          ),
        },
      ]}
    />
  )
}

export function ArtistsTable({ artists }: { artists: WithCount<Brand>[] }) {
  const router = useRouter()
  return (
    <DataTable
      rows={artists}
      getRowId={(a) => a.id}
      getSearchText={(a) => a.name}
      searchPlaceholder="Buscar artista o personaje"
      filter={{
        label: "Tipo",
        options: [
          { value: "ARTISTA", label: "Artistas" },
          { value: "PERSONAJE", label: "Personajes" },
        ],
        predicate: (a, v) => a.kind === v,
      }}
      columns={[
        {
          header: "Nombre",
          cell: (a) => (
            <div className="flex items-center gap-3">
              <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-muted">
                <Image src={a.avatar} alt="" fill sizes="36px" className="object-cover" />
              </div>
              <Link href={`/admin/artistas/${a.id}/editar`} className="font-medium hover:text-primary">
                {a.name}
              </Link>
            </div>
          ),
        },
        { header: "Tipo", cell: (a) => (a.kind === "ARTISTA" ? "Artista" : "Personaje") },
        { header: "Productos", cell: (a) => a.productCount },
        {
          header: "Acciones",
          className: "w-24 text-right",
          cell: (a) => (
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" asChild aria-label={`Editar ${a.name}`}>
                <Link href={`/admin/artistas/${a.id}/editar`}>
                  <Pencil />
                </Link>
              </Button>
              <ConfirmDeleteDialog
                title="¿Eliminar artista?"
                description={`"${a.name}" se va a quitar del filtro del catálogo.`}
                onConfirm={async () => {
                  await api.artists.remove(a.id)
                  toast.success("Artista eliminado")
                  router.refresh()
                }}
              />
            </div>
          ),
        },
      ]}
    />
  )
}
