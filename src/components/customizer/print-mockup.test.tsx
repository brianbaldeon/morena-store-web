import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { PrintMockup } from "./print-mockup"

describe("PrintMockup — regresión: ubicación Espalda no mostraba nada", () => {
  it('con placement="Espalda" se sincroniza solo al tab Espalda y muestra la foto de espalda', () => {
    render(<PrintMockup garment="remera" placement="Espalda" backImage="foto-espalda.png" />)

    // El badge del lado actual debe decir "Espalda" sin que el usuario haga click en el tab
    // (no basta con buscar el texto "Espalda": el tab trigger también se llama así).
    expect(screen.getByTestId("mockup-side-badge")).toHaveTextContent("Espalda")
    // El diseño mostrado debe ser el de espalda, no quedar vacío.
    const img = screen.getByAltText("Tu diseño") as HTMLImageElement
    expect(img.src).toContain("foto-espalda.png")
  })

  it('con placement="Frente" (default) se sincroniza al tab Frente y muestra la foto de frente', () => {
    render(<PrintMockup garment="remera" placement="Frente" frontImage="foto-frente.png" />)
    expect(screen.getByTestId("mockup-side-badge")).toHaveTextContent("Frente")
    const img = screen.getByAltText("Tu diseño") as HTMLImageElement
    expect(img.src).toContain("foto-frente.png")
  })

  it('con placement="Frente y espalda" muestra el diseño en cualquiera de los dos tabs', () => {
    render(
      <PrintMockup
        garment="remera"
        placement="Frente y espalda"
        frontImage="foto-frente.png"
        backImage="foto-espalda.png"
      />,
    )
    // Arranca en "frente" por default.
    expect((screen.getByAltText("Tu diseño") as HTMLImageElement).src).toContain("foto-frente.png")
  })

  it("sin ninguna foto cargada, muestra el placeholder en vez de romper", () => {
    render(<PrintMockup garment="remera" placement="Frente" />)
    expect(screen.queryByAltText("Tu diseño")).not.toBeInTheDocument()
  })

  it("muestra la medida real en cm del tamaño elegido", () => {
    render(<PrintMockup garment="remera" placement="Frente" size="50x70 cm" />)
    expect(screen.getByText(/Estampado de 50x70 cm/)).toBeInTheDocument()
  })
})
