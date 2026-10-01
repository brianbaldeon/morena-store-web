import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { CategoriesTable } from "@/components/admin/catalog-tables"
import { listCategories } from "@/lib/services/catalog"

export const metadata: Metadata = { title: "Categorías" }

export default async function AdminCategoriesPage() {
  const categories = await listCategories()
  return (
    <>
      <AdminPageHeader
        title="Categorías"
        description="Organizan el menú y los filtros de la tienda."
        actions={
          <Button asChild>
            <Link href="/admin/categorias/nueva">
              <Plus /> Nueva categoría
            </Link>
          </Button>
        }
      />
      <CategoriesTable categories={categories} />
    </>
  )
}
