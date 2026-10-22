import { z } from "zod"
import type { CustomizerConfig } from "@/lib/constants"

/** El esquema depende del tipo: cada grupo de opciones es obligatorio. */
export function buildCustomizerSchema(config: CustomizerConfig) {
  const options = Object.fromEntries(
    config.optionGroups.map((group) => [
      group.key,
      z.string({ required_error: `Elegí ${group.label.toLowerCase()}` }).min(1, `Elegí ${group.label.toLowerCase()}`),
    ]),
  )
  return z
    .object({
      photos: z.array(z.string()).max(config.maxPhotos, `Máximo ${config.maxPhotos} fotos`),
      options: z.object(options),
      notes: z.string().max(500, "Máximo 500 caracteres"),
      quantity: z.number().int().min(1).max(10),
    })
    .superRefine((data, ctx) => {
      // Remera/buzo: la foto va atada al lado del estampado (frente/espalda), no a "subí 1 o 2 fotos sin orden".
      if (config.hasPrintPreview) {
        const ubicacion = data.options.ubicacion
        const bothSides = ubicacion === "Frente y espalda"
        if (!data.photos[0]) {
          const message = ubicacion === "Espalda" ? "Subí la foto para la espalda" : "Subí la foto para el frente"
          ctx.addIssue({ path: ["photos"], code: z.ZodIssueCode.custom, message })
        }
        if (bothSides && !data.photos[1]) {
          ctx.addIssue({ path: ["photos"], code: z.ZodIssueCode.custom, message: "Subí la foto para la espalda" })
        }
      } else if (!data.photos.some(Boolean)) {
        ctx.addIssue({ path: ["photos"], code: z.ZodIssueCode.custom, message: "Subí al menos una foto" })
      }
    })
}

export type CustomizerInput = {
  photos: string[]
  options: Record<string, string>
  notes: string
  quantity: number
}
