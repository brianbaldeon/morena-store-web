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
  return z.object({
    photos: z
      .array(z.string())
      .min(1, "Subí al menos una foto")
      .max(config.maxPhotos, `Máximo ${config.maxPhotos} fotos`),
    options: z.object(options),
    notes: z.string().max(500, "Máximo 500 caracteres"),
    quantity: z.number().int().min(1).max(10),
  })
}

export type CustomizerInput = {
  photos: string[]
  options: Record<string, string>
  notes: string
  quantity: number
}
