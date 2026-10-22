import type { Metadata } from "next"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import type { CustomizableType } from "@/types"
import { HeroBanner } from "@/components/catalog/hero-banner"
import { PageContainer } from "@/components/shared/page-container"
import { ShowcaseCard } from "@/components/showcase/showcase-card"
import { Button } from "@/components/ui/button"
import { CUSTOMIZABLE_TYPE_LABELS } from "@/lib/constants"
import { listShowcaseWorks } from "@/lib/services/showcase"
import { IMG } from "@/data/mock-products"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Personalizados",
  description: "Muñecos, remeras, llaveros y almohadones que hicimos a partir de las fotos de nuestros clientes.",
}

const chip = "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors hover:border-primary/50"

export default async function ShowcasePage(props: PageProps<"/personalizados">) {
  const sp = await props.searchParams
  const all = await listShowcaseWorks()
  const type =
    typeof sp.tipo === "string" && sp.tipo in CUSTOMIZABLE_TYPE_LABELS ? (sp.tipo as CustomizableType) : undefined
  const works = type ? all.filter((w) => w.type === type) : all
  // Solo se ofrecen los filtros que tienen al menos un trabajo publicado.
  const types = (Object.keys(CUSTOMIZABLE_TYPE_LABELS) as CustomizableType[]).filter((t) =>
    all.some((w) => w.type === t),
  )

  return (
    <>
      <HeroBanner
        lines={["Hechos", "a pedido"]}
        eyebrow="Personalizados"
        image={IMG.mjCollection}
        imagePosition="center 20%"
        targetId="trabajos"
      />
      <PageContainer className="space-y-6 py-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Trabajos que ya hicimos</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cada uno salió de las fotos que nos mandó un cliente. Tocá uno para ver más fotos.
            </p>
          </div>
          <Button asChild className="self-start sm:self-auto">
            <Link href="/personalizar">
              <Sparkles /> Personalizá el tuyo
            </Link>
          </Button>
        </div>

        {types.length > 1 && (
          <nav aria-label="Filtrar por tipo" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            <Link
              href="/personalizados"
              scroll={false}
              className={cn(chip, !type && "border-primary bg-primary/5 font-medium text-primary")}
            >
              Todos
            </Link>
            {types.map((t) => (
              <Link
                key={t}
                href={`/personalizados?tipo=${t}`}
                scroll={false}
                className={cn(chip, type === t && "border-primary bg-primary/5 font-medium text-primary")}
              >
                {CUSTOMIZABLE_TYPE_LABELS[t]}
              </Link>
            ))}
          </nav>
        )}

        <section id="trabajos" className="scroll-mt-32">
          {works.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {works.map((work, i) => (
                <ShowcaseCard key={work.id} work={work} preload={i < 2} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
              Pronto vamos a sumar trabajos de este tipo.{" "}
              <Link href="/personalizados" className="font-medium text-primary hover:underline">
                Ver todos
              </Link>
            </div>
          )}
        </section>
      </PageContainer>
    </>
  )
}
