import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { ProductForm } from "@/components/admin/product-form"
import { getProductById, listBrands, listCategories } from "@/lib/services/catalog"

export const metadata: Metadata = { title: "Editar producto" }

export default async function EditProductPage(props: PageProps<"/admin/productos/[id]">) {
  const { id } = await props.params
  const [product, categories, brands] = await Promise.all([getProductById(id), listCategories(), listBrands()])
  if (!product) notFound()

  return (
    <>
      <AdminPageHeader
        title={product.name}
        description="Editá la información, las imágenes y el stock."
        backHref="/admin/productos"
        backLabel="Productos"
        actions={
          <Button variant="outline" asChild>
            <Link href={`/productos/${product.slug}`} target="_blank">
              <ExternalLink /> Ver en la tienda
            </Link>
          </Button>
        }
      />
      <ProductForm product={product} categories={categories} brands={brands} />
    </>
  )
}
