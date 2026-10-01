"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export interface SearchItem {
  slug: string
  name: string
  image: string
  price: number
  brand: string | null
}

export function SearchCommand({ items, className }: { items: SearchItem[]; className?: string }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return items
      .filter((item) => item.name.toLowerCase().includes(q) || item.brand?.toLowerCase().includes(q))
      .slice(0, 6)
  }, [items, query])

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const q = query.trim()
    setOpen(false)
    router.push(q ? `/productos?q=${encodeURIComponent(q)}` : "/productos")
  }

  function go(slug: string) {
    setOpen(false)
    setQuery("")
    router.push(`/productos/${slug}`)
  }

  return (
    <Popover open={open && results.length > 0} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <form onSubmit={submit} role="search" className={cn("relative w-full", className)}>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder="¿Qué estás buscando?"
            aria-label="Buscar productos"
            className="h-10 w-full rounded-lg border bg-background pr-3 pl-10 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </form>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-1.5"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <ul>
          {results.map((item) => (
            <li key={item.slug}>
              <button
                type="button"
                onClick={() => go(item.slug)}
                className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-muted"
              >
                <Image
                  src={item.image}
                  alt=""
                  width={36}
                  height={48}
                  className="h-12 w-9 rounded object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.name}</span>
                  <span className="block text-xs text-muted-foreground">{item.brand ?? "Store Morena"}</span>
                </span>
                <span className="text-sm font-medium text-primary">{formatPrice(item.price)}</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={submit}
          className="mt-1 w-full rounded-md p-2 text-left text-xs text-primary hover:bg-muted"
        >
          Ver todos los resultados para &quot;{query}&quot;
        </button>
      </PopoverContent>
    </Popover>
  )
}
