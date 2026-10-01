import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import type { CustomizerConfig } from "@/lib/constants"
import { formatPrice } from "@/lib/format"

export function CustomizeTypeCard({ config }: { config: CustomizerConfig }) {
  return (
    <Link
      href={`/personalizar/${config.type}`}
      className="group flex flex-col overflow-hidden rounded-lg border transition-colors hover:border-primary/50"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <Image
          src={config.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 300px, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-muted-foreground">{config.subtitle}</p>
        <h2 className="font-semibold">{config.title}</h2>
        <p className="text-sm text-muted-foreground">{config.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-sm">
          <span>
            desde <span className="font-semibold text-primary">{formatPrice(config.basePrice)}</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" /> {config.productionDays}
          </span>
        </div>
        <span className="mt-2 flex items-center gap-1 text-sm font-medium text-primary">
          Empezar <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
