import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { FilterPanel } from "./filter-panel"
import type { Facets, FilterState } from "@/types"
import { CATEGORIES, makeColor } from "@/lib/test-utils/product-factory"

function baseFilters(): FilterState {
  return { brands: [], categories: [], productTypes: [], sizes: [], colors: [], price: [0, 1000], sort: "popular" }
}

function baseFacets(): Facets {
  return {
    brands: [],
    categories: [{ category: CATEGORIES.munecos, count: 3 }],
    priceRange: [0, 1000],
    priceHistogram: [1, 2, 3],
    sizes: [],
    colors: [makeColor("Negro")],
  }
}

const noop = () => {}

describe("FilterPanel", () => {
  it("por default muestra el filtro de Tipo de producto y de Color", () => {
    render(<FilterPanel filters={baseFilters()} facets={baseFacets()} activeCount={0} onChange={noop} onReset={noop} />)
    expect(screen.getByText("Tipo de producto")).toBeInTheDocument()
    expect(screen.getByText("Color")).toBeInTheDocument()
  })

  it("hideCategories oculta la sección Tipo de producto (usado en /categoria/[slug])", () => {
    render(
      <FilterPanel
        filters={baseFilters()}
        facets={baseFacets()}
        activeCount={0}
        hideCategories
        onChange={noop}
        onReset={noop}
      />,
    )
    expect(screen.queryByText("Tipo de producto")).not.toBeInTheDocument()
  })

  it("hideColors oculta la sección Color (usado en remeras/buzos/productos)", () => {
    render(
      <FilterPanel
        filters={baseFilters()}
        facets={baseFacets()}
        activeCount={0}
        hideColors
        onChange={noop}
        onReset={noop}
      />,
    )
    expect(screen.queryByText("Color")).not.toBeInTheDocument()
  })

  it("sin colores en los facets, no muestra la sección Color aunque no se pida hideColors", () => {
    render(
      <FilterPanel
        filters={baseFilters()}
        facets={{ ...baseFacets(), colors: [] }}
        activeCount={0}
        onChange={noop}
        onReset={noop}
      />,
    )
    expect(screen.queryByText("Color")).not.toBeInTheDocument()
  })

  it('el botón "Limpiar" muestra la cantidad de filtros activos y llama a onReset', () => {
    const onReset = vi.fn()
    render(<FilterPanel filters={baseFilters()} facets={baseFacets()} activeCount={3} onChange={noop} onReset={onReset} />)
    const button = screen.getByRole("button", { name: "Limpiar (3)" })
    button.click()
    expect(onReset).toHaveBeenCalledOnce()
  })

  it("sin filtros activos, el botón dice Sin filtros y está deshabilitado", () => {
    render(<FilterPanel filters={baseFilters()} facets={baseFacets()} activeCount={0} onChange={noop} onReset={noop} />)
    expect(screen.getByRole("button", { name: "Sin filtros" })).toBeDisabled()
  })
})
