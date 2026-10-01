"use client"

import { Grid2X2, List, SlidersHorizontal } from "lucide-react"
import type { SortOption, ViewMode } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SORT_LABELS } from "@/lib/constants"

interface CatalogToolbarProps {
  view: ViewMode
  sort: SortOption
  onViewChange: (view: ViewMode) => void
  onSortChange: (sort: SortOption) => void
  /** Botón "Filtros" que abre el Sheet en mobile. */
  mobileFilters?: React.ReactNode
}

/** Toggle lista/grilla en cajita gris + "Ordenar por", como en la referencia. */
export function CatalogToolbar({ view, sort, onViewChange, onSortChange, mobileFilters }: CatalogToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b pb-4">
      <div className="flex items-center gap-2">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && onViewChange(v as ViewMode)}
          className="rounded-md bg-muted p-1"
          spacing={1}
        >
          <ToggleGroupItem
            value="list"
            aria-label="Vista de lista"
            className="size-8 rounded-sm px-0 data-[state=on]:bg-background data-[state=on]:text-primary data-[state=on]:shadow-xs"
          >
            <List />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="grid"
            aria-label="Vista de grilla"
            className="size-8 rounded-sm px-0 data-[state=on]:bg-background data-[state=on]:text-primary data-[state=on]:shadow-xs"
          >
            <Grid2X2 />
          </ToggleGroupItem>
        </ToggleGroup>
        {mobileFilters}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm whitespace-nowrap outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <span className="hidden text-muted-foreground sm:inline">Ordenar por:</span>
          <span className="font-medium">{SORT_LABELS[sort]}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuRadioGroup value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
              <DropdownMenuRadioItem key={option} value={option}>
                {SORT_LABELS[option]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
