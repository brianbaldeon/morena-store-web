"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import { toast } from "sonner"
import type { ShowcaseWork } from "@/types"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"
import { api } from "@/lib/api-client"
import { CUSTOMIZABLE_TYPE_LABELS } from "@/lib/constants"
import { DataTable } from "./data-table"

export function ShowcaseTable({ works }: { works: ShowcaseWork[] }) {
  const router = useRouter()

  async function setPublished(work: ShowcaseWork, published: boolean) {
    try {
      const { title, description, type, images } = work
      await api.showcase.update(work.id, { title, description: description ?? "", type, images, published })
      toast.success(published ? "Ahora se ve en la tienda" : "Oculto de la tienda")
      router.refresh()
    } catch {
      toast.error("No pudimos cambiar la visibilidad")
    }
  }

  return (
    <DataTable
      rows={works}
      getRowId={(w) => w.id}
      getSearchText={(w) => w.title}
      searchPlaceholder="Buscar trabajo"
      emptyMessage="Todavía no cargaste trabajos"
      filter={{
        label: "Tipo",
        options: Object.entries(CUSTOMIZABLE_TYPE_LABELS).map(([value, label]) => ({ value, label })),
        predicate: (w, v) => w.type === v,
      }}
      columns={[
        {
          header: "Trabajo",
          cell: (w) => (
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-muted">
                <Image
                  src={w.images[0]}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover"
                  unoptimized={w.images[0].startsWith("data:")}
                />
              </div>
              <Link href={`/admin/trabajos/${w.id}/editar`} className="font-medium hover:text-primary">
                {w.title}
              </Link>
            </div>
          ),
        },
        { header: "Tipo", cell: (w) => CUSTOMIZABLE_TYPE_LABELS[w.type] },
        { header: "Fotos", cell: (w) => w.images.length },
        {
          header: "Visible",
          cell: (w) => (
            <Switch
              checked={w.published}
              onCheckedChange={(checked) => setPublished(w, checked)}
              aria-label={`Mostrar "${w.title}" en la tienda`}
            />
          ),
        },
        {
          header: "Acciones",
          className: "w-24 text-right",
          cell: (w) => (
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" asChild aria-label={`Editar ${w.title}`}>
                <Link href={`/admin/trabajos/${w.id}/editar`}>
                  <Pencil />
                </Link>
              </Button>
              <ConfirmDeleteDialog
                title="¿Eliminar trabajo?"
                description={`"${w.title}" se va a quitar de la galería. Si solo querés ocultarlo, apagá "Visible".`}
                onConfirm={async () => {
                  await api.showcase.remove(w.id)
                  toast.success("Trabajo eliminado")
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
