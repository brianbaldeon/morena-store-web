import type { Brand, Category, ColorOption, Facets, FilterState, ProductWithRelations, SortOption } from "@/types"
import { DEFAULT_FILTERS, PRICE_BUCKETS, SIZES } from "@/lib/constants"

export function getPriceBounds(products: ProductWithRelations[]): [number, number] {
  if (products.length === 0) return [0, 0]
  const prices = products.map((p) => p.price)
  return [Math.min(...prices), Math.max(...prices)]
}

export function createInitialFilters(
  products: ProductWithRelations[],
  overrides: Partial<FilterState> = {},
): FilterState {
  return { ...DEFAULT_FILTERS, price: getPriceBounds(products), ...overrides }
}

type FilterKey = Exclude<keyof FilterState, "sort" | "view">

function matches(product: ProductWithRelations, filters: FilterState, skip?: FilterKey) {
  if (skip !== "brands" && filters.brands.length && !filters.brands.includes(product.brandId ?? "")) return false
  if (skip !== "categories" && filters.categories.length && !filters.categories.includes(product.categoryId))
    return false
  if (skip !== "productTypes" && filters.productTypes.length && !filters.productTypes.includes(product.productType))
    return false
  if (skip !== "price" && (product.price < filters.price[0] || product.price > filters.price[1])) return false
  if (skip !== "sizes" && filters.sizes.length && !filters.sizes.some((s) => product.sizes.includes(s))) return false
  if (skip !== "colors" && filters.colors.length && !filters.colors.some((c) => product.colors.some((pc) => pc.name === c)))
    return false
  return true
}

export function filterProducts(products: ProductWithRelations[], filters: FilterState) {
  return products.filter((p) => matches(p, filters))
}

export function sortProducts(products: ProductWithRelations[], sort: SortOption) {
  const sorted = [...products]
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price)
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price)
    default:
      return sorted.sort((a, b) => b.sales - a.sales)
  }
}

/**
 * Contadores para el sidebar. Cada grupo cuenta ignorando su propio filtro,
 * así el usuario ve cuántos resultados sumaría al tildar otra opción.
 */
export function computeFacets(products: ProductWithRelations[], filters: FilterState): Facets {
  const brandMap = new Map<string, { brand: Brand; count: number }>()
  const categoryMap = new Map<string, { category: Category; count: number }>()
  const colorMap = new Map<string, ColorOption>()
  const sizeSet = new Set<string>()

  for (const p of products) {
    if (p.brand) {
      const entry = brandMap.get(p.brand.id) ?? { brand: p.brand, count: 0 }
      if (matches(p, filters, "brands")) entry.count++
      brandMap.set(p.brand.id, entry)
    }
    const cat = categoryMap.get(p.category.id) ?? { category: p.category, count: 0 }
    if (matches(p, filters, "categories")) cat.count++
    categoryMap.set(p.category.id, cat)
    p.colors.forEach((c) => colorMap.set(c.name, c))
    p.sizes.forEach((s) => sizeSet.add(s))
  }

  const priceRange = getPriceBounds(products)
  return {
    brands: [...brandMap.values()].sort((a, b) => b.count - a.count),
    categories: [...categoryMap.values()],
    priceRange,
    priceHistogram: buildHistogram(
      products.filter((p) => matches(p, filters, "price")).map((p) => p.price),
      priceRange,
    ),
    sizes: SIZES.filter((s) => sizeSet.has(s)),
    colors: [...colorMap.values()],
  }
}

export function buildHistogram(prices: number[], [min, max]: [number, number], buckets = PRICE_BUCKETS) {
  const counts = Array<number>(buckets).fill(0)
  const span = max - min || 1
  for (const price of prices) {
    const index = Math.min(buckets - 1, Math.floor(((price - min) / span) * buckets))
    counts[index]++
  }
  return counts
}

/** Serializa los filtros activos a querystring, para navegar (y así pedirle al servidor la página/filtro correcto). */
export function filtersToSearchParams(filters: FilterState, bounds: [number, number]) {
  const params = new URLSearchParams()
  if (filters.brands.length) params.set("brands", filters.brands.join(","))
  if (filters.categories.length) params.set("categories", filters.categories.join(","))
  if (filters.productTypes.length) params.set("productTypes", filters.productTypes.join(","))
  if (filters.sizes.length) params.set("sizes", filters.sizes.join(","))
  if (filters.colors.length) params.set("colors", filters.colors.join(","))
  if (filters.price[0] !== bounds[0]) params.set("priceMin", String(filters.price[0]))
  if (filters.price[1] !== bounds[1]) params.set("priceMax", String(filters.price[1]))
  if (filters.sort !== "popular") params.set("sort", filters.sort)
  return params
}

export function countActiveFilters(filters: FilterState, bounds: [number, number]) {
  return (
    filters.brands.length +
    filters.categories.length +
    filters.productTypes.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.price[0] !== bounds[0] || filters.price[1] !== bounds[1] ? 1 : 0)
  )
}
