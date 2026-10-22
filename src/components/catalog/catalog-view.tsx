"use client"

import { Fragment, useState, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2, SlidersHorizontal } from "lucide-react"
import type { Facets, FilterState, ProductWithRelations } from "@/types"
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
import { countActiveFilters, filtersToSearchParams } from "@/lib/filters"
import { DEFAULT_FILTERS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { FilterPanel } from "./filter-panel"
import { CatalogToolbar } from "./catalog-toolbar"
import { ActiveFilterChips } from "./active-filter-chips"
import { CatalogPagination } from "./catalog-pagination"

interface CatalogViewProps {
  /** Ya viene recortado a la página actual — el servidor nunca manda el catálogo completo. */
  products: ProductWithRelations[]
  /** Total de resultados que matchean los filtros (para el "X resultados" y la paginación). */
  total: number
  facets: Facets
  filters: FilterState
  page: number
  pageSize: number
  /** Texto de "N resultados para ___". */
  resultsLabel: string
  breadcrumb: { label: string; href?: string }[]
  hideCategories?: boolean
  hideColors?: boolean
}

/**
 * Filtros, orden y paginación viven en la URL (searchParams). Cada cambio navega con router.push
 * dentro de un useTransition, así React Server Components vuelve a resolver la página/categoría
 * correspondiente sin perder el scroll ni parpadear la página entera (eso lo reserva loading.tsx
 * para las navegaciones "de verdad" hacia esta ruta).
 */
export function CatalogView({
  products,
  total,
  facets,
  filters,
  page,
  pageSize,
  resultsLabel,
  breadcrumb,
  hideCategories,
  hideColors,
}: CatalogViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const mounted = useMounted()
  const storedView = useUiStore((s) => s.catalogView)
  const setView = useUiStore((s) => s.setCatalogView)
  const view = mounted ? storedView : "grid"
  const [sheetOpen, setSheetOpen] = useState(false)

  const activeCount = countActiveFilters(filters, facets.priceRange)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  function navigate(nextFilters: FilterState, nextPage: number) {
    const params = filtersToSearchParams(nextFilters, facets.priceRange)
    const q = searchParams.get("q")
    if (q) params.set("q", q)
    if (nextPage > 1) params.set("page", String(nextPage))
    startTransition(() => {
      router.push(params.size ? `${pathname}?${params.toString()}` : pathname, { scroll: false })
    })
  }

  function update(patch: Partial<FilterState>) {
    navigate({ ...filters, ...patch }, 1)
  }

  function reset() {
    navigate({ ...DEFAULT_FILTERS, price: facets.priceRange, sort: filters.sort }, 1)
  }

  const panel = (
    <FilterPanel
      filters={filters}
      facets={facets}
      activeCount={activeCount}
      hideCategories={hideCategories}
      hideColors={hideColors}
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
      <h2 className="mt-3 flex items-center gap-2 text-2xl font-semibold tracking-tight" aria-live="polite">
        {total} {total === 1 ? "resultado" : "resultados"} para {resultsLabel}
        {isPending && <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Actualizando" />}
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
                    <SheetDescription>{total} resultados</SheetDescription>
                  </SheetHeader>
                  <div className="px-4 pb-24">{panel}</div>
                  <div className="fixed bottom-0 w-full border-t bg-background p-4 sm:max-w-sm">
                    <Button className="w-full" onClick={() => setSheetOpen(false)}>
                      Ver {total} resultados
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            }
          />

          <ActiveFilterChips filters={filters} facets={facets} onChange={update} />

          <div className={cn("transition-opacity", isPending && "opacity-60")} aria-busy={isPending}>
            {products.length === 0 ? (
              <EmptyState
                title="No encontramos productos"
                description="Probá quitando algún filtro o buscá otra cosa."
                action={<Button onClick={reset}>Limpiar filtros</Button>}
              />
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 3} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          <CatalogPagination page={page} totalPages={totalPages} onPageChange={(p) => navigate(filters, p)} />
        </div>
      </div>
    </div>
  )
}
