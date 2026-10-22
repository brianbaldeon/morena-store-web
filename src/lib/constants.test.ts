import { describe, expect, it } from "vitest"
import { CUSTOMIZERS, estimateCustomPrice, OPTION_SURCHARGES } from "./constants"

describe("estimateCustomPrice", () => {
  const config = CUSTOMIZERS.remera

  it("sin opciones con recargo, devuelve el precio base tal cual", () => {
    expect(estimateCustomPrice(config, { talle: "M", color: "Negro" })).toBe(config.basePrice)
  })

  it("suma el recargo de cada opción que lo tiene", () => {
    const price = estimateCustomPrice(config, { ubicacion: "Frente y espalda", tamano: "50x70 cm" })
    expect(price).toBe(
      config.basePrice + OPTION_SURCHARGES["Frente y espalda"] + OPTION_SURCHARGES["50x70 cm"],
    )
  })

  it("una opción desconocida (sin recargo registrado) no suma nada ni rompe", () => {
    expect(estimateCustomPrice(config, { talle: "Opción inventada" })).toBe(config.basePrice)
  })

  it("options vacío devuelve el precio base", () => {
    expect(estimateCustomPrice(config, {})).toBe(config.basePrice)
  })
})
