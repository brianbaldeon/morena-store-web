import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { CustomizableType } from "@/types"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { PageContainer } from "@/components/shared/page-container"
import { CustomizerForm } from "@/components/customizer/customizer-form"
import { CUSTOMIZERS } from "@/lib/constants"
import { getProductBySlug } from "@/lib/services/catalog"

function getConfig(tipo: string) {
  return tipo in CUSTOMIZERS ? CUSTOMIZERS[tipo as CustomizableType] : null
}

export function generateStaticParams() {
  return Object.keys(CUSTOMIZERS).map((tipo) => ({ tipo }))
}

export async function generateMetadata(props: PageProps<"/personalizar/[tipo]">): Promise<Metadata> {
  const { tipo } = await props.params
  return { title: getConfig(tipo)?.title ?? "Personalizá" }
}

export default async function CustomizerPage(props: PageProps<"/personalizar/[tipo]">) {
  const { tipo } = await props.params
  const config = getConfig(tipo)
  if (!config) notFound()

  const product = await getProductBySlug(config.productSlug)

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
              <Link href="/personalizar">Personalizá</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{config.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-3 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{config.title}</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">{config.description}</p>
      </div>
      <CustomizerForm config={config} product={product} />
    </PageContainer>
  )
}
