"use client"

import { useEffect, useState } from "react"
import { ImageIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { COLORS, PRINT_SIZE_CM } from "@/lib/constants"
import { cn } from "@/lib/utils"

const TEE_PATH =
  "M70 20 L100 8 Q120 28 140 8 L170 20 L222 52 L204 98 L180 86 L180 240 L60 240 L60 86 L36 98 L18 52 Z"
const HOODIE_PATH =
  "M72 30 Q86 2 120 2 Q154 2 168 30 L222 58 L210 236 L186 236 L180 104 L180 246 L60 246 L60 104 L54 236 L30 236 L18 58 Z"

// Área imprimible real dentro del dibujo (torso, sin mangas/cuello/ruedo), en % del contenedor.
// El 50x70 cm (máximo soportado) debe calzar justo adentro de esta caja, sin salirse de la prenda.
const PRINT_AREA = { top: 30, widthPct: 36, heightPct: 50 }
// Escala cm → % usando como referencia el lado más limitante de cada medida (ancho o alto).
const SCALE = Math.min(PRINT_AREA.widthPct / 50, PRINT_AREA.heightPct / 70)

interface PrintMockupProps {
  garment: "remera" | "buzo"
  color?: string
  placement?: string
  size?: string
  /** Foto para el diseño de frente. */
  frontImage?: string
  /** Foto para el diseño de espalda (si no se manda, se repite la de frente). */
  backImage?: string
}

/** Vista previa de la prenda con el diseño superpuesto (frente/espalda). */
export function PrintMockup({
  garment,
  color = "Blanco",
  placement = "Frente",
  size = "40x40 cm",
  frontImage,
  backImage,
}: PrintMockupProps) {
  const [side, setSide] = useState<"frente" | "espalda">("frente")

  // Si el estampado va solo en una cara, mostramos esa cara automáticamente
  // para que la vista previa no quede vacía al elegir "Espalda".
  useEffect(() => {
    if (placement === "Frente") setSide("frente")
    else if (placement === "Espalda") setSide("espalda")
  }, [placement])

  const fill = COLORS.find((c) => c.name === color)?.hex ?? "#FFFFFF"
  const showPrint =
    placement === "Frente y espalda" ||
    (placement === "Frente" && side === "frente") ||
    (placement === "Espalda" && side === "espalda")
  const { width: cmWidth, height: cmHeight } = PRINT_SIZE_CM[size] ?? PRINT_SIZE_CM["40x40 cm"]
  const width = cmWidth * SCALE
  const image = side === "frente" ? frontImage : backImage

  return (
    <div className="space-y-3">
      <Tabs value={side} onValueChange={(v) => setSide(v as typeof side)}>
        <TabsList className="w-full">
          <TabsTrigger value="frente">Frente</TabsTrigger>
          <TabsTrigger value="espalda">Espalda</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="relative mx-auto aspect-square w-full max-w-sm rounded-lg bg-muted">
        <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm">
          {side === "frente" ? "Frente" : "Espalda"}
        </span>
        <svg viewBox="0 0 240 250" className="absolute inset-[8%] size-[84%] drop-shadow-sm" aria-hidden>
          <path
            d={garment === "remera" ? TEE_PATH : HOODIE_PATH}
            fill={fill}
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {side === "frente" ? (
            <>
              {/* Cinta de cuello, solo visible de frente */}
              <path d="M94 10 Q120 32 146 10" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="4" strokeLinecap="round" />
              {garment === "buzo" && (
                <path d="M88 170 L152 170 L160 206 L80 206 Z" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />
              )}
            </>
          ) : (
            // Etiqueta de tela, solo visible de espalda
            <rect x="112" y="14" width="16" height="22" rx="2" fill="rgba(0,0,0,0.12)" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
          )}
        </svg>
        {showPrint && (
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-sm",
              !image && "flex items-center justify-center border-2 border-dashed border-primary/60 bg-primary/5",
            )}
            style={{
              top: `${PRINT_AREA.top}%`,
              left: "50%",
              width: `${width}%`,
              aspectRatio: `${cmWidth} / ${cmHeight}`,
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
        Estampado de {cmWidth}x{cmHeight} cm. Vista previa aproximada, te mandamos el diseño final para aprobar antes
        de estampar.
      </p>
    </div>
  )
}
