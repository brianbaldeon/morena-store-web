"use client"

import { useState } from "react"
import { ImageIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { COLORS } from "@/lib/constants"
import { cn } from "@/lib/utils"

const TEE_PATH =
  "M70 20 L100 8 Q120 28 140 8 L170 20 L222 52 L204 98 L180 86 L180 240 L60 240 L60 86 L36 98 L18 52 Z"
const HOODIE_PATH =
  "M72 30 Q86 2 120 2 Q154 2 168 30 L222 58 L210 236 L186 236 L180 104 L180 246 L60 246 L60 104 L54 236 L30 236 L18 58 Z"

/** Tamaño del estampado en % del ancho del pecho. */
const PRINT_WIDTH: Record<string, number> = { "A5 (pecho)": 26, A4: 40, A3: 52 }

interface PrintMockupProps {
  garment: "remera" | "buzo"
  color?: string
  placement?: string
  size?: string
  image?: string
}

/** Vista previa de la prenda con el diseño superpuesto (frente/espalda). */
export function PrintMockup({ garment, color = "Blanco", placement = "Frente", size = "A4", image }: PrintMockupProps) {
  const [side, setSide] = useState<"frente" | "espalda">("frente")
  const fill = COLORS.find((c) => c.name === color)?.hex ?? "#FFFFFF"
  const showPrint =
    placement === "Frente y espalda" ||
    (placement === "Frente" && side === "frente") ||
    (placement === "Espalda" && side === "espalda")
  const width = PRINT_WIDTH[size] ?? 40
  const smallFrontLogo = side === "frente" && size === "A5 (pecho)"

  return (
    <div className="space-y-3">
      <Tabs value={side} onValueChange={(v) => setSide(v as typeof side)}>
        <TabsList className="w-full">
          <TabsTrigger value="frente">Frente</TabsTrigger>
          <TabsTrigger value="espalda">Espalda</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="relative mx-auto aspect-square w-full max-w-sm rounded-lg bg-muted">
        <svg viewBox="0 0 240 250" className="absolute inset-[8%] size-[84%] drop-shadow-sm" aria-hidden>
          <path
            d={garment === "remera" ? TEE_PATH : HOODIE_PATH}
            fill={fill}
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {garment === "remera" && side === "frente" && (
            <path d="M100 8 Q120 28 140 8" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
          )}
          {garment === "buzo" && side === "frente" && (
            <path d="M88 170 L152 170 L160 206 L80 206 Z" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />
          )}
        </svg>
        {showPrint && (
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-sm",
              !image && "flex items-center justify-center border-2 border-dashed border-primary/60 bg-primary/5",
            )}
            style={{
              top: smallFrontLogo ? "34%" : "32%",
              left: smallFrontLogo ? "58%" : "50%",
              width: `${smallFrontLogo ? 18 : width * 0.84}%`,
              aspectRatio: "3 / 4",
            }}
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL local, sin optimizar
              <img src={image} alt="Tu diseño" className="size-full object-cover" />
            ) : (
              <ImageIcon className="size-1/3 text-primary/60" />
            )}
          </div>
        )}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Vista previa aproximada. Te mandamos el diseño final para aprobar antes de estampar.
      </p>
    </div>
  )
}
