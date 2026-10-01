import type { Metadata } from "next"
import { AdminPageHeader } from "@/components/admin/page-header"
import { ProductForm } from "@/components/admin/product-form"
import { listBrands, listCategories } from "@/lib/services/catalog"

export const metadata: Metadata = { title: "Nuevo producto" }

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([listCategories(), listBrands()])
  return (
    <>
      <AdminPageHeader title="Nuevo producto" backHref="/admin/productos" backLabel="Productos" />
      <ProductForm categories={categories} brands={brands} />
    </>
  )
}
