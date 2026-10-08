import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ImageUp, Scissors, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IMG } from "@/data/mock-products"

const STEPS = [
  { icon: ImageUp, title: "Subí tus fotos", text: "De vos, tu pareja, tu amigo o tu mascota." },
  { icon: SlidersHorizontal, title: "Elegí los detalles", text: "Tamaño, ropa, accesorios o dónde va el estampado." },
  { icon: Scissors, title: "Lo hacemos a mano", text: "Te mandamos el diseño para aprobar antes de producir." },
]

/** Bloque "Personalizá tu muñeco" en 3 pasos (también se usa como "Cómo funciona"). */
export function CustomizeCta() {
  return (
    <section className="overflow-hidden rounded-xl border bg-secondary">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-6 p-6 sm:p-10">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">Personalizados</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Tu muñeco, tu remera,
              <br />
              tu idea.
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Convertimos tus fotos en muñecos, llaveros y prendas con estampado DTF. Un regalo que nadie más tiene.
            </p>
          </div>
          <ol className="space-y-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-background text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {i + 1}. {title}
                  </p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Button asChild size="lg">
            <Link href="/personalizar">
              Empezar a personalizar <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="relative grid h-full min-h-80 grid-cols-2 gap-3 p-6 sm:p-10 lg:pl-0">
          <div className="relative overflow-hidden rounded-lg bg-background">
            <Image src={IMG.personalizado} alt="Muñeco personalizado" fill sizes="300px" className="object-cover" />
          </div>
          <div className="grid gap-3">
            <div className="relative overflow-hidden rounded-lg bg-background">
              <Image src={IMG.diegoTelefono} alt="Remera con estampado DTF" fill sizes="300px" className="object-cover" />
            </div>
            <div className="relative overflow-hidden rounded-lg bg-background">
              <Image src={IMG.michi} alt="Almohadón de mascota" fill sizes="300px" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
