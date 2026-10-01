"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface Column<T> {
  header: string
  cell: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  rows: T[]
  columns: Column<T>[]
  getRowId: (row: T) => string
  searchPlaceholder?: string
  getSearchText?: (row: T) => string
  filter?: {
    label: string
    options: { value: string; label: string }[]
    predicate: (row: T, value: string) => boolean
  }
  pageSize?: number
  emptyMessage?: string
}

/** Tabla genérica del admin: búsqueda + un filtro + paginación (useState + useMemo). */
export function DataTable<T>({
  rows,
  columns,
  getRowId,
  searchPlaceholder = "Buscar…",
  getSearchText,
  filter,
  pageSize = 10,
  emptyMessage = "No hay resultados",
}: DataTableProps<T>) {
  const [query, setQuery] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (q && getSearchText && !getSearchText(row).toLowerCase().includes(q)) return false
      if (filter && filterValue !== "all" && !filter.predicate(row, filterValue)) return false
      return true
    })
  }, [rows, query, filter, filterValue, getSearchText])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, totalPages)
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        {getSearchText && (
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-9 w-full rounded-md border bg-background pr-3 pl-9 text-sm outline-none focus:border-primary"
            />
          </div>
        )}
        {filter && (
          <Select
            value={filterValue}
            onValueChange={(v) => {
              setFilterValue(v)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-52" aria-label={filter.label}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{filter.label}: todos</SelectItem>
              {filter.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.header} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              visible.map((row) => (
                <TableRow key={getRowId(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.header} className={cn(col.className)}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
        </span>
        <div className="flex items-center gap-2">
          <span>
            Página {current} de {totalPages}
          </span>
          <Button variant="outline" size="icon" className="size-8" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Página anterior">
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={current === totalPages}
            onClick={() => setPage(current + 1)}
            aria-label="Página siguiente"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
