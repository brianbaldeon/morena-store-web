import { describe, expect, it } from "vitest"
import { buildCustomizerSchema, type CustomizerInput } from "./customizer"
import type { CustomizerConfig } from "@/lib/constants"

/** Config mínima de tipo "con preview" (como remera/buzo): tiene ubicación de estampado. */
function printPreviewConfig(overrides: Partial<CustomizerConfig> = {}): CustomizerConfig {
  return {
    type: "remera",
    productSlug: "remera-test",
    title: "Remera test",
    subtitle: "",
    description: "",
    image: "/img.jpg",
    basePrice: 18500,
    productionDays: "5 a 7 días hábiles",
    maxPhotos: 2,
    photoHint: "",
    optionGroups: [
      { key: "talle", label: "Talle", options: ["S", "M", "L"] },
      { key: "color", label: "Color de la prenda", options: ["Negro", "Blanco"] },
      { key: "ubicacion", label: "Ubicación del estampado", options: ["Frente", "Espalda", "Frente y espalda"] },
      { key: "tamano", label: "Tamaño del estampado", options: ["20x20 cm", "40x40 cm"] },
    ],
    hasPrintPreview: true,
    ...overrides,
  }
}

/** Config mínima de tipo "sin preview" (como muñeco/llavero): una sola foto cualquiera. */
function noPreviewConfig(overrides: Partial<CustomizerConfig> = {}): CustomizerConfig {
  return {
    type: "muneco",
    productSlug: "muneco-test",
    title: "Muñeco test",
    subtitle: "",
    description: "",
    image: "/img.jpg",
    basePrice: 32000,
    productionDays: "10 a 15 días hábiles",
    maxPhotos: 4,
    photoHint: "",
    optionGroups: [{ key: "tamano", label: "Tamaño", options: ["20 cm", "30 cm"] }],
    hasPrintPreview: false,
    ...overrides,
  }
}

function baseInput(overrides: Partial<CustomizerInput> = {}): CustomizerInput {
  return { photos: [], options: {}, notes: "", quantity: 1, ...overrides }
}

describe("buildCustomizerSchema — tipos con preview (remera/buzo)", () => {
  const schema = buildCustomizerSchema(printPreviewConfig())

  it("rechaza sin ninguna foto y pide la del frente por default", () => {
    const result = schema.safeParse(
      baseInput({ options: { talle: "M", color: "Negro", ubicacion: "Frente", tamano: "20x20 cm" } }),
    )
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "Subí la foto para el frente")).toBe(true)
    }
  })

  it('si la ubicación es "Espalda", el mensaje de falta de foto dice "espalda" (no "frente")', () => {
    const result = schema.safeParse(
      baseInput({ options: { talle: "M", color: "Negro", ubicacion: "Espalda", tamano: "20x20 cm" } }),
    )
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "Subí la foto para la espalda")).toBe(true)
    }
  })

  it('con una sola foto alcanza para "Frente" o "Espalda" (no exige una segunda)', () => {
    const result = schema.safeParse(
      baseInput({
        photos: ["foto-frente.png"],
        options: { talle: "M", color: "Negro", ubicacion: "Frente", tamano: "20x20 cm" },
      }),
    )
    expect(result.success).toBe(true)
  })

  it('"Frente y espalda" con una sola foto pide también la de la espalda (regresión: antes se repetía sin avisar)', () => {
    const result = schema.safeParse(
      baseInput({
        photos: ["foto-frente.png"],
        options: { talle: "M", color: "Negro", ubicacion: "Frente y espalda", tamano: "20x20 cm" },
      }),
    )
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.map((i) => i.message)).toContain("Subí la foto para la espalda")
    }
  })

  it('"Frente y espalda" con las 2 fotos pasa', () => {
    const result = schema.safeParse(
      baseInput({
        photos: ["foto-frente.png", "foto-espalda.png"],
        options: { talle: "M", color: "Negro", ubicacion: "Frente y espalda", tamano: "20x20 cm" },
      }),
    )
    expect(result.success).toBe(true)
  })

  it("rechaza si falta alguna opción del Paso 2 (no solo ubicación)", () => {
    const result = schema.safeParse(
      baseInput({ photos: ["foto.png"], options: { talle: "M", ubicacion: "Frente" } }),
    )
    expect(result.success).toBe(false)
  })

  it("respeta el límite de maxPhotos del config", () => {
    const result = schema.safeParse(
      baseInput({
        photos: ["1.png", "2.png", "3.png"],
        options: { talle: "M", color: "Negro", ubicacion: "Frente", tamano: "20x20 cm" },
      }),
    )
    expect(result.success).toBe(false)
  })
})

describe("buildCustomizerSchema — tipos sin preview (muñeco/llavero)", () => {
  const schema = buildCustomizerSchema(noPreviewConfig())

  it("rechaza sin ninguna foto", () => {
    const result = schema.safeParse(baseInput({ options: { tamano: "20 cm" } }))
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "Subí al menos una foto")).toBe(true)
    }
  })

  it("con 1 foto en cualquier posición alcanza (no hay concepto de frente/espalda)", () => {
    const result = schema.safeParse(baseInput({ photos: ["foto.png"], options: { tamano: "20 cm" } }))
    expect(result.success).toBe(true)
  })
})

describe("buildCustomizerSchema — notas y cantidad", () => {
  const schema = buildCustomizerSchema(noPreviewConfig())

  it("rechaza notas de más de 500 caracteres", () => {
    const result = schema.safeParse(
      baseInput({ photos: ["foto.png"], options: { tamano: "20 cm" }, notes: "a".repeat(501) }),
    )
    expect(result.success).toBe(false)
  })

  it("rechaza cantidad fuera de rango (1-10)", () => {
    const result = schema.safeParse(baseInput({ photos: ["foto.png"], options: { tamano: "20 cm" }, quantity: 11 }))
    expect(result.success).toBe(false)
  })
})
