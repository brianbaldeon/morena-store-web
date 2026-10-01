import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { PageContainer } from "@/components/shared/page-container"
import { SectionHeading } from "@/components/shared/section-heading"
import { ProductGallery } from "@/components/product/product-gallery"
import { PurchasePanel } from "@/components/product/purchase-panel"
import { ProductTabs } from "@/components/product/product-tabs"
import { ProductRail } from "@/components/product/product-rail"
import { getProductBySlug, getRelatedProducts, listProducts } from "@/lib/services/catalog"

export async function generateStaticParams() {
  const products = await listProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const product = await getProductBySlug(slug)
  return product ? { title: product.name, description: product.description } : { title: "Producto" }
}

export default async function ProductPage(props: PageProps<"/productos/[slug]">) {
  const { slug } = await props.params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product, 8)

  return (
    <PageContainer className="py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-primary hover:text-primary/80">
              <Link href="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-primary hover:text-primary/80">
              <Link href={`/categoria/${product.category.slug}`}>{product.category.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
        <ProductGallery product={product} />
        <PurchasePanel product={product} />
      </div>

      <ProductTabs product={product} />

      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading title="También te puede gustar" href={`/categoria/${product.category.slug}`} />
          <ProductRail products={related} />
        </section>
      )}
    </PageContainer>
  )
}
