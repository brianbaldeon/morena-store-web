import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronRight, Clock } from "lucide-react"
import type { CustomizerConfig } from "@/lib/constants"
import { formatPrice } from "@/lib/format"

/** En mobile es una fila compacta (miniatura + datos clave) para comparar las opciones de un vistazo; desde sm, card completa. */
export function CustomizeTypeCard({ config }: { config: CustomizerConfig }) {
  return (
    <Link
      href={`/personalizar/${config.type}`}
      className="group flex items-center gap-3 overflow-hidden rounded-lg border p-2.5 transition-colors hover:border-primary/50 sm:flex-col sm:items-stretch sm:gap-0 sm:p-0"
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted sm:aspect-4/3 sm:size-auto sm:w-full sm:rounded-none">
        <Image
          src={config.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 80px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-2 sm:p-4">
        <p className="hidden text-xs text-muted-foreground sm:block">{config.subtitle}</p>
        <h3 className="font-semibold">{config.title}</h3>
        <p className="hidden text-sm text-muted-foreground sm:block">{config.description}</p>
        <div className="flex flex-col gap-0.5 text-sm sm:mt-auto sm:gap-1 sm:pt-3">
          <span>
            desde <span className="font-semibold text-primary">{formatPrice(config.basePrice)}</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" /> {config.productionDays}
          </span>
        </div>
        <span className="mt-2 hidden items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90 sm:flex">
          Empezar <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary sm:hidden" />
    </Link>
  )
}
