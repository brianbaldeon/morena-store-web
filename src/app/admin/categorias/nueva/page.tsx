import type { Metadata } from "next"
import { AdminPageHeader } from "@/components/admin/page-header"
import { CategoryForm } from "@/components/admin/category-form"

export const metadata: Metadata = { title: "Nueva categoría" }

export default function NewCategoryPage() {
  return (
    <>
      <AdminPageHeader title="Nueva categoría" backHref="/admin/categorias" backLabel="Categorías" />
      <CategoryForm />
    </>
  )
}
