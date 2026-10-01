"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function CatalogPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  function go(event: React.MouseEvent, target: number) {
    event.preventDefault()
    if (target < 1 || target > totalPages) return
    onPageChange(target)
    document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => go(e, page - 1)}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-40" : undefined}
          >
            Anterior
          </PaginationPrevious>
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <PaginationItem key={n}>
            <PaginationLink href="#" isActive={n === page} onClick={(e) => go(e, n)}>
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => go(e, page + 1)}
            aria-disabled={page === totalPages}
            className={page === totalPages ? "pointer-events-none opacity-40" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
