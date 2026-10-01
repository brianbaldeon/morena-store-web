import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { ProductsTable } from "@/components/admin/products-table"
import { listProducts } from "@/lib/services/catalog"

export const metadata: Metadata = { title: "Productos" }

export default async function AdminProductsPage() {
  const products = await listProducts()
  return (
    <>
      <AdminPageHeader
        title="Productos"
        description={`${products.length} productos en el catálogo`}
        actions={
          <Button asChild>
            <Link href="/admin/productos/nuevo">
              <Plus /> Nuevo producto
            </Link>
          </Button>
        }
      />
      <ProductsTable products={products} />
    </>
  )
}
