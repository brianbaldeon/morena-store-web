import Image from "next/image"
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroBannerProps {
  lines: [string, string]
  image: string
  imagePosition?: string
  eyebrow?: string
  targetId?: string
  size?: "md" | "lg"
  className?: string
}

/** Banner de la referencia: foto de ancho completo, título light enorme y escalonado, botón circular ↓. */
export function HeroBanner({
  lines,
  image,
  imagePosition = "center 30%",
  eyebrow,
  targetId = "resultados",
  size = "md",
  className,
}: HeroBannerProps) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-[oklch(0.55_0.02_250)]", className)}>
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-[oklch(0.35_0.03_255/0.85)] via-[oklch(0.40_0.03_255/0.55)] to-transparent" />
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-10 lg:px-6",
          size === "md" ? "min-h-56 sm:min-h-64 lg:min-h-72" : "min-h-80 lg:min-h-105",
        )}
      >
        <div className="text-white">
          {eyebrow && <p className="mb-3 text-xs font-medium tracking-[0.2em] uppercase opacity-80">{eyebrow}</p>}
          <h1 className="text-5xl leading-[1.05] font-light tracking-tight sm:text-7xl lg:text-8xl">
            <span className="block">{lines[0]}</span>
            <span className="block pl-[1.2em]">{lines[1]}</span>
          </h1>
        </div>
        <a
          href={`#${targetId}`}
          aria-label="Ir a los productos"
          className="hidden size-14 shrink-0 items-center justify-center rounded-full border border-white/70 text-white transition-colors hover:bg-white/15 sm:flex"
        >
          <ArrowDown className="size-5" />
        </a>
      </div>
    </section>
  )
}
