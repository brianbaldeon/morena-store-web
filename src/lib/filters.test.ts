import { describe, expect, it } from "vitest"
import {
  buildHistogram,
  computeFacets,
  countActiveFilters,
  createInitialFilters,
  filterProducts,
  filtersToSearchParams,
  getPriceBounds,
  sortProducts,
} from "./filters"
import { DEFAULT_FILTERS } from "@/lib/constants"
import type { FilterState } from "@/types"
import { BRANDS, CATEGORIES, makeColor, makeProduct } from "@/lib/test-utils/product-factory"

function baseFilters(overrides: Partial<FilterState> = {}): FilterState {
  return { ...DEFAULT_FILTERS, price: [0, 999999], ...overrides }
}

describe("getPriceBounds", () => {
  it("devuelve [0, 0] para una lista vacía (categoría sin productos todavía)", () => {
    expect(getPriceBounds([])).toEqual([0, 0])
  })

  it("devuelve el precio mínimo y máximo del listado", () => {
    const products = [makeProduct({ price: 5000 }), makeProduct({ price: 20000 }), makeProduct({ price: 12000 })]
    expect(getPriceBounds(products)).toEqual([5000, 20000])
  })
})

describe("filterProducts", () => {
  const munecoCerati = makeProduct({ category: CATEGORIES.munecos, brand: BRANDS.cerati, price: 28000 })
  const remeraSinMarca = makeProduct({
    category: CATEGORIES.remeras,
    price: 15000,
    sizes: ["M", "L"],
    colors: [makeColor("Negro"), makeColor("Blanco")],
  })
  const products = [munecoCerati, remeraSinMarca]

  it("sin filtros activos, devuelve todo", () => {
    expect(filterProducts(products, baseFilters())).toHaveLength(2)
  })

  it("filtra por marca", () => {
    const result = filterProducts(products, baseFilters({ brands: [BRANDS.cerati.id] }))
    expect(result).toEqual([munecoCerati])
  })

  it("filtra por categoría", () => {
    const result = filterProducts(products, baseFilters({ categories: [CATEGORIES.remeras.id] }))
    expect(result).toEqual([remeraSinMarca])
  })

  it("filtra por rango de precio (inclusive en los bordes)", () => {
    expect(filterProducts(products, baseFilters({ price: [28000, 28000] }))).toEqual([munecoCerati])
    // remeraSinMarca cuesta 15000: entra en este rango, munecoCerati (28000) queda afuera.
    expect(filterProducts(products, baseFilters({ price: [0, 27999] }))).toEqual([remeraSinMarca])
  })

  it("filtra por talle: un producto sin ese talle queda afuera", () => {
    const result = filterProducts(products, baseFilters({ sizes: ["M"] }))
    expect(result).toEqual([remeraSinMarca])
  })

  it("filtra por color por nombre exacto", () => {
    expect(filterProducts(products, baseFilters({ colors: ["Negro"] }))).toEqual([remeraSinMarca])
    expect(filterProducts(products, baseFilters({ colors: ["Verde"] }))).toEqual([])
  })

  it("combina varios filtros con AND (todos deben cumplirse)", () => {
    const result = filterProducts(
      products,
      baseFilters({ categories: [CATEGORIES.remeras.id], colors: ["Negro"] }),
    )
    expect(result).toEqual([remeraSinMarca])
    expect(filterProducts(products, baseFilters({ categories: [CATEGORIES.remeras.id], colors: ["Rosa"] }))).toEqual(
      [],
    )
  })

  it("un producto sin marca nunca matchea un filtro de marca (regresión: brandId null)", () => {
    const result = filterProducts([remeraSinMarca], baseFilters({ brands: [BRANDS.cerati.id] }))
    expect(result).toEqual([])
  })
})

describe("sortProducts", () => {
  const barato = makeProduct({ price: 1000, sales: 5, createdAt: "2026-01-01T00:00:00.000Z" })
  const medio = makeProduct({ price: 5000, sales: 50, createdAt: "2026-03-01T00:00:00.000Z" })
  const caro = makeProduct({ price: 9000, sales: 1, createdAt: "2026-02-01T00:00:00.000Z" })
  const products = [caro, barato, medio]

  it("no muta el array original", () => {
    const copy = [...products]
    sortProducts(products, "price-asc")
    expect(products).toEqual(copy)
  })

  it("price-asc ordena de menor a mayor precio", () => {
    expect(sortProducts(products, "price-asc").map((p) => p.price)).toEqual([1000, 5000, 9000])
  })

  it("price-desc ordena de mayor a menor precio", () => {
    expect(sortProducts(products, "price-desc").map((p) => p.price)).toEqual([9000, 5000, 1000])
  })

  it("newest ordena por fecha de creación descendente", () => {
    expect(sortProducts(products, "newest").map((p) => p.createdAt)).toEqual([
      "2026-03-01T00:00:00.000Z",
      "2026-02-01T00:00:00.000Z",
      "2026-01-01T00:00:00.000Z",
    ])
  })

  it("popular (default) ordena por ventas descendente", () => {
    expect(sortProducts(products, "popular").map((p) => p.sales)).toEqual([50, 5, 1])
  })
})

describe("computeFacets", () => {
  const munecoCerati = makeProduct({ category: CATEGORIES.munecos, brand: BRANDS.cerati, price: 28000 })
  const munecoMichi = makeProduct({ category: CATEGORIES.munecos, brand: BRANDS.michi, price: 32000 })
  const remeraSinMarca = makeProduct({
    category: CATEGORIES.remeras,
    price: 15000,
    sizes: ["M"],
    colors: [makeColor("Negro")],
  })
  const products = [munecoCerati, munecoMichi, remeraSinMarca]

  it("cuenta cada marca ignorando el propio filtro de marca (para que el sidebar muestre el conteo si se tildara)", () => {
    const facets = computeFacets(products, baseFilters({ brands: [BRANDS.cerati.id] }))
    const michi = facets.brands.find((b) => b.brand.id === BRANDS.michi.id)
    expect(michi?.count).toBe(1)
  })

  it("respeta otros filtros activos al contar (solo ignora su propia dimensión)", () => {
    const facets = computeFacets(products, baseFilters({ categories: [CATEGORIES.remeras.id] }))
    const cerati = facets.brands.find((b) => b.brand.id === BRANDS.cerati.id)
    expect(cerati?.count).toBe(0)
  })

  it("priceRange es el rango completo del universo recibido, no el ya filtrado", () => {
    const facets = computeFacets(products, baseFilters({ price: [0, 16000] }))
    expect(facets.priceRange).toEqual([15000, 32000])
  })

  it("solo lista talles/colores que efectivamente tiene algún producto del universo", () => {
    const facets = computeFacets(products, baseFilters())
    expect(facets.sizes).toContain("M")
    expect(facets.sizes).not.toContain("XXL")
    expect(facets.colors.map((c) => c.name)).toEqual(["Negro"])
  })
})

describe("buildHistogram", () => {
  it("reparte los precios en buckets proporcionales al rango", () => {
    // bounds [0,100] en 2 buckets de ancho 50: bucket 0 = [0,50), bucket 1 = [50,100]
    const hist = buildHistogram([0, 50, 99], [0, 100], 2)
    expect(hist).toEqual([1, 2])
  })

  it("no se rompe con min === max (span 0)", () => {
    expect(() => buildHistogram([100, 100], [100, 100], 4)).not.toThrow()
  })
})

describe("countActiveFilters", () => {
  const bounds: [number, number] = [0, 10000]

  it("devuelve 0 sin ningún filtro activo", () => {
    expect(countActiveFilters(baseFilters({ price: bounds }), bounds)).toBe(0)
  })

  it("suma la cantidad de valores elegidos por dimensión, más 1 si el precio no es el default", () => {
    const filters = baseFilters({ brands: ["a"], colors: ["Negro", "Blanco"], price: [100, 9000] })
    // brands: 1 valor + colors: 2 valores + price fuera de bounds: +1 = 4
    expect(countActiveFilters(filters, bounds)).toBe(1 + 2 + 1)
  })

  it("el precio en los bordes exactos no cuenta como filtro activo", () => {
    expect(countActiveFilters(baseFilters({ price: bounds }), bounds)).toBe(0)
  })
})

describe("filtersToSearchParams", () => {
  const bounds: [number, number] = [0, 10000]

  it("no agrega ningún param con los filtros default", () => {
    const params = filtersToSearchParams(baseFilters({ price: bounds }), bounds)
    expect(params.toString()).toBe("")
  })

  it("serializa arrays como csv", () => {
    const params = filtersToSearchParams(baseFilters({ brands: ["a", "b"], price: bounds }), bounds)
    expect(params.get("brands")).toBe("a,b")
  })

  it("solo agrega priceMin/priceMax si difieren de los bounds (evita URLs ruidosas)", () => {
    const params = filtersToSearchParams(baseFilters({ price: [500, 9000] }), bounds)
    expect(params.get("priceMin")).toBe("500")
    expect(params.get("priceMax")).toBe("9000")
  })

  it("no agrega sort si es el default (popular)", () => {
    const params = filtersToSearchParams(baseFilters({ price: bounds, sort: "popular" }), bounds)
    expect(params.has("sort")).toBe(false)
  })

  it("agrega sort si no es el default", () => {
    const params = filtersToSearchParams(baseFilters({ price: bounds, sort: "price-asc" }), bounds)
    expect(params.get("sort")).toBe("price-asc")
  })
})

describe("createInitialFilters", () => {
  it("usa el rango de precios real del listado como default", () => {
    const products = [makeProduct({ price: 1000 }), makeProduct({ price: 9000 })]
    expect(createInitialFilters(products).price).toEqual([1000, 9000])
  })

  it("permite overrides puntuales sin perder el resto de los defaults", () => {
    const filters = createInitialFilters([], { sort: "newest" })
    expect(filters.sort).toBe("newest")
    expect(filters.brands).toEqual([])
  })
})
