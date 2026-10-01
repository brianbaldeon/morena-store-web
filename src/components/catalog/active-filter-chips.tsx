"use client"

import { X } from "lucide-react"
import type { Facets, FilterState } from "@/types"
import { formatPrice } from "@/lib/format"

interface Chip {
  key: string
  label: string
  remove: () => void
}

export function ActiveFilterChips({
  filters,
  facets,
  onChange,
}: {
  filters: FilterState
  facets: Facets
  onChange: (patch: Partial<FilterState>) => void
}) {
  const chips: Chip[] = [
    ...filters.brands.map((id) => ({
      key: `b-${id}`,
      label: facets.brands.find((b) => b.brand.id === id)?.brand.name ?? id,
      remove: () => onChange({ brands: filters.brands.filter((v) => v !== id) }),
    })),
    ...filters.categories.map((id) => ({
      key: `c-${id}`,
      label: facets.categories.find((c) => c.category.id === id)?.category.name ?? id,
      remove: () => onChange({ categories: filters.categories.filter((v) => v !== id) }),
    })),
    ...filters.sizes.map((size) => ({
      key: `s-${size}`,
      label: `Talle ${size}`,
      remove: () => onChange({ sizes: filters.sizes.filter((v) => v !== size) }),
    })),
    ...filters.colors.map((color) => ({
      key: `col-${color}`,
      label: color,
      remove: () => onChange({ colors: filters.colors.filter((v) => v !== color) }),
    })),
  ]
  const [min, max] = facets.priceRange
  if (filters.price[0] !== min || filters.price[1] !== max) {
    chips.push({
      key: "price",
      label: `${formatPrice(filters.price[0])} – ${formatPrice(filters.price[1])}`,
      remove: () => onChange({ price: [min, max] }),
    })
  }
  if (filters.customizable) {
    chips.push({ key: "custom", label: "Personalizables", remove: () => onChange({ customizable: false }) })
  }

  if (chips.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Filtros activos">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={chip.remove}
            className="flex items-center gap-1.5 rounded-full border bg-background py-1 pr-2 pl-3 text-xs hover:border-primary hover:text-primary"
            aria-label={`Quitar filtro ${chip.label}`}
          >
            {chip.label}
            <X className="size-3" />
          </button>
        </li>
      ))}
    </ul>
  )
}
