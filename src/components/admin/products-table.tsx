"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import { toast } from "sonner"
import type { ProductWithRelations } from "@/types"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"
import { ProductBadges } from "@/components/product/product-badge"
import { api } from "@/lib/api-client"
import { PRODUCT_TYPE_LABELS } from "@/lib/constants"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { DataTable, type Column } from "./data-table"

export function ProductsTable({ products }: { products: ProductWithRelations[] }) {
  const router = useRouter()

  const columns: Column<ProductWithRelations>[] = [
    {
      header: "Producto",
      cell: (p) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-muted">
            <Image src={p.images[0]} alt="" fill sizes="36px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <Link href={`/admin/productos/${p.id}`} className="block truncate font-medium hover:text-primary">
              {p.name}
            </Link>
            <span className="text-xs text-muted-foreground">{p.brand?.name ?? "Sin artista"}</span>
          </div>
        </div>
      ),
    },
    { header: "Tipo", cell: (p) => PRODUCT_TYPE_LABELS[p.productType], className: "hidden md:table-cell" },
    { header: "Etiquetas", cell: (p) => <ProductBadges product={p} />, className: "hidden lg:table-cell" },
    {
      header: "Stock",
      cell: (p) => <span className={cn(p.stock <= 10 && "font-medium text-destructive")}>{p.stock}</span>,
    },
    { header: "Precio", cell: (p) => formatPrice(p.price), className: "text-right" },
    {
      header: "Acciones",
      className: "w-24 text-right",
      cell: (p) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" asChild aria-label={`Editar ${p.name}`}>
            <Link href={`/admin/productos/${p.id}`}>
              <Pencil />
            </Link>
          </Button>
          <ConfirmDeleteDialog
            title="¿Eliminar producto?"
            description={`"${p.name}" se va a quitar de la tienda. Esta acción no se puede deshacer.`}
            onConfirm={async () => {
              await api.products.remove(p.id)
              toast.success("Producto eliminado")
              router.refresh()
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      rows={products}
      columns={columns}
      getRowId={(p) => p.id}
      searchPlaceholder="Buscar por nombre o artista"
      getSearchText={(p) => `${p.name} ${p.brand?.name ?? ""}`}
      filter={{
        label: "Tipo",
        options: Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => ({ value, label })),
        predicate: (p, value) => p.productType === value,
      }}
    />
  )
}
