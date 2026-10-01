"use client"

import type { Facets, FilterState } from "@/types"
import { FilterSection } from "./filter-section"
import { ArtistFilter, CategoryFilter, ColorFilter, CustomizableFilter, PriceFilter, SizeFilter } from "./filters"

export interface FilterPanelProps {
  filters: FilterState
  facets: Facets
  activeCount: number
  hideCategories?: boolean
  onChange: (patch: Partial<FilterState>) => void
  onReset: () => void
}

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

/** Contenido del sidebar de filtros. Se usa en el aside (desktop) y en el Sheet (mobile). */
export function FilterPanel({ filters, facets, activeCount, hideCategories, onChange, onReset }: FilterPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3.5">
        <h2 className="text-sm font-semibold">Filtros</h2>
        <button
          type="button"
          onClick={onReset}
          disabled={activeCount === 0}
          className="text-xs font-medium text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
        >
          {activeCount > 0 ? `Limpiar (${activeCount})` : "Sin filtros"}
        </button>
      </div>

      <FilterSection title="Artista / Personaje">
        <ArtistFilter
          options={facets.brands}
          selected={filters.brands}
          onToggle={(id) => onChange({ brands: toggle(filters.brands, id) })}
        />
      </FilterSection>

      {!hideCategories && (
        <FilterSection title="Tipo de producto">
          <CategoryFilter
            options={facets.categories}
            selected={filters.categories}
            onToggle={(id) => onChange({ categories: toggle(filters.categories, id) })}
          />
        </FilterSection>
      )}

      <FilterSection title="Precio">
        <PriceFilter
          bounds={facets.priceRange}
          value={filters.price}
          histogram={facets.priceHistogram}
          onChange={(price) => onChange({ price })}
        />
      </FilterSection>

      {facets.sizes.length > 0 && (
        <FilterSection title="Talle">
          <SizeFilter sizes={facets.sizes} selected={filters.sizes} onChange={(sizes) => onChange({ sizes })} />
        </FilterSection>
      )}

      {facets.colors.length > 0 && (
        <FilterSection title="Color">
          <ColorFilter colors={facets.colors} selected={filters.colors} onChange={(colors) => onChange({ colors })} />
        </FilterSection>
      )}

      <FilterSection title="Personalizable">
        <CustomizableFilter checked={filters.customizable} onChange={(customizable) => onChange({ customizable })} />
      </FilterSection>
    </div>
  )
}
