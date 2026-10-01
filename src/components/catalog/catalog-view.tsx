"use client"

import { Fragment, useMemo, useState } from "react"
import Link from "next/link"
import { SlidersHorizontal } from "lucide-react"
import type { FilterState, ProductWithRelations } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ProductCard } from "@/components/product/product-card"
import { ProductRow } from "@/components/product/product-row"
import { EmptyState } from "@/components/shared/empty-state"
import { useUiStore } from "@/store/ui"
import { useMounted } from "@/hooks/use-mounted"
import { computeFacets, countActiveFilters, createInitialFilters, filterProducts, sortProducts } from "@/lib/filters"
import { PAGE_SIZE } from "@/lib/constants"
import { FilterPanel } from "./filter-panel"
import { CatalogToolbar } from "./catalog-toolbar"
import { ActiveFilterChips } from "./active-filter-chips"
import { CatalogPagination } from "./catalog-pagination"

interface CatalogViewProps {
  products: ProductWithRelations[]
  /** Texto de "N resultados para ___". */
  resultsLabel: string
  breadcrumb: { label: string; href?: string }[]
  hideCategories?: boolean
  initialFilters?: Partial<FilterState>
}

export function CatalogView({ products, resultsLabel, breadcrumb, hideCategories, initialFilters }: CatalogViewProps) {
  const mounted = useMounted()
  const storedView = useUiStore((s) => s.catalogView)
  const setView = useUiStore((s) => s.setCatalogView)
  const view = mounted ? storedView : "grid"

  // Estado local: filtros y página. Calculados: resultados, facetas.
  const [filters, setFilters] = useState<FilterState>(() => createInitialFilters(products, initialFilters))
  const [page, setPage] = useState(1)
  const [sheetOpen, setSheetOpen] = useState(false)

  const results = useMemo(() => sortProducts(filterProducts(products, filters), filters.sort), [products, filters])
  const facets = useMemo(() => computeFacets(products, filters), [products, filters])
  const activeCount = useMemo(() => countActiveFilters(filters, facets.priceRange), [filters, facets.priceRange])

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function update(patch: Partial<FilterState>) {
    setFilters((prev) => ({ ...prev, ...patch }))
    setPage(1)
  }

  function reset() {
    setFilters(createInitialFilters(products, { sort: filters.sort }))
    setPage(1)
  }

  const panel = (
    <FilterPanel
      filters={filters}
      facets={facets}
      activeCount={activeCount}
      hideCategories={hideCategories}
      onChange={update}
      onReset={reset}
    />
  )

  return (
    <div id="resultados" className="scroll-mt-32">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumb.map((item, i) => (
            <Fragment key={item.label}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild className="text-primary hover:text-primary/80">
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {i < breadcrumb.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight" aria-live="polite">
        {results.length} {results.length === 1 ? "resultado" : "resultados"} para {resultsLabel}
      </h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtros">
          {panel}
        </aside>

        <div className="min-w-0 space-y-5">
          <CatalogToolbar
            view={view}
            sort={filters.sort}
            onViewChange={setView}
            onSortChange={(sort) => update({ sort })}
            mobileFilters={
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-10 lg:hidden">
                    <SlidersHorizontal /> Filtros
                    {activeCount > 0 && (
                      <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{activeCount}</span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full gap-0 overflow-y-auto sm:max-w-sm">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                    <SheetDescription>{results.length} resultados</SheetDescription>
                  </SheetHeader>
                  <div className="px-4 pb-24">{panel}</div>
                  <div className="fixed bottom-0 w-full border-t bg-background p-4 sm:max-w-sm">
                    <Button className="w-full" onClick={() => setSheetOpen(false)}>
                      Ver {results.length} resultados
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            }
          />

          <ActiveFilterChips filters={filters} facets={facets} onChange={update} />

          {results.length === 0 ? (
            <EmptyState
              title="No encontramos productos"
              description="Probá quitando algún filtro o buscá otra cosa."
              action={<Button onClick={reset}>Limpiar filtros</Button>}
            />
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
              {visible.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </div>
          )}

          <CatalogPagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
