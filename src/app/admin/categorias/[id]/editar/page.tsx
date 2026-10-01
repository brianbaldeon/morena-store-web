import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AdminPageHeader } from "@/components/admin/page-header"
import { CategoryForm } from "@/components/admin/category-form"
import { getCategoryById } from "@/lib/services/catalog"

export const metadata: Metadata = { title: "Editar categoría" }

export default async function EditCategoryPage(props: PageProps<"/admin/categorias/[id]/editar">) {
  const { id } = await props.params
  const category = await getCategoryById(id)
  if (!category) notFound()
  return (
    <>
      <AdminPageHeader title={`Editar "${category.name}"`} backHref="/admin/categorias" backLabel="Categorías" />
      <CategoryForm category={category} />
    </>
  )
}
