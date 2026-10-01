"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Check, Search } from "lucide-react"
import type { Brand, Category, ColorOption } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

// ─── Artista / Personaje ───────────────────────────────────────

export function ArtistFilter({
  options,
  selected,
  onToggle,
}: {
  options: { brand: Brand; count: number }[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  const [query, setQuery] = useState("")
  const visible = useMemo(
    () => options.filter((o) => o.brand.name.toLowerCase().includes(query.trim().toLowerCase())),
    [options, query],
  )

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar artista..."
          aria-label="Buscar artista o personaje"
          className="h-9 w-full rounded-md bg-muted pr-3 pl-8 text-xs outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
        />
      </div>
      <ul className="space-y-0.5">
        {visible.map(({ brand, count }) => {
          const active = selected.includes(brand.id)
          return (
            <li key={brand.id}>
              <button
                type="button"
                onClick={() => onToggle(brand.id)}
                aria-pressed={active}
                className="flex w-full items-center gap-2.5 rounded-md px-1 py-2 text-left text-sm hover:bg-muted"
              >
                <Image src={brand.avatar} alt="" width={24} height={24} className="size-6 rounded-full object-cover" />
                <span className={cn("min-w-0 flex-1 truncate", active && "font-medium")}>
                  {brand.name} <span className="text-[11px] text-muted-foreground">{count}</span>
                </span>
                {active && <Check className="size-4 text-primary" />}
              </button>
            </li>
          )
        })}
        {visible.length === 0 && <li className="py-2 text-xs text-muted-foreground">Sin resultados</li>}
      </ul>
    </div>
  )
}

// ─── Categoría ─────────────────────────────────────────────────

export function CategoryFilter({
  options,
  selected,
  onToggle,
}: {
  options: { category: Category; count: number }[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <ul className="space-y-2.5">
      {options.map(({ category, count }) => (
        <li key={category.id} className="flex items-center gap-2.5">
          <Checkbox
            id={`cat-${category.id}`}
            checked={selected.includes(category.id)}
            onCheckedChange={() => onToggle(category.id)}
          />
          <Label htmlFor={`cat-${category.id}`} className="flex-1 cursor-pointer font-normal">
            {category.name}
          </Label>
          <span className="text-[11px] text-muted-foreground">{count}</span>
        </li>
      ))}
    </ul>
  )
}

// ─── Precio ────────────────────────────────────────────────────

export function PriceFilter({
  bounds,
  value,
  histogram,
  onChange,
}: {
  bounds: [number, number]
  value: [number, number]
  histogram: number[]
  onChange: (value: [number, number]) => void
}) {
  const [min, max] = bounds
  const span = max - min || 1
  const peak = Math.max(1, ...histogram)
  const step = 500

  function clamp(n: number) {
    return Math.min(max, Math.max(min, Number.isNaN(n) ? min : n))
  }

  return (
    <div className="space-y-3">
      <div className="flex h-14 items-end gap-0.5" aria-hidden>
        {histogram.map((count, i) => {
          const bucketStart = min + (span / histogram.length) * i
          const inRange = bucketStart >= value[0] - span / histogram.length && bucketStart <= value[1]
          return (
            <div
              key={i}
              className={cn("flex-1 rounded-t-[2px] transition-colors", inRange ? "bg-primary/30" : "bg-muted")}
              style={{ height: `${Math.max(6, (count / peak) * 100)}%` }}
            />
          )
        })}
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(v) => onChange([v[0], v[1]] as [number, number])}
        aria-label="Rango de precio"
        className="-mt-1.5"
      />
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{formatPrice(value[0])}</span>
        <span>{formatPrice(value[1])}</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          aria-label="Precio mínimo"
          value={value[0]}
          min={min}
          max={value[1]}
          step={step}
          onChange={(e) => onChange([Math.min(clamp(e.target.valueAsNumber), value[1]), value[1]])}
          className="h-9 w-full min-w-0 rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
        />
        <span className="text-muted-foreground">—</span>
        <input
          type="number"
          inputMode="numeric"
          aria-label="Precio máximo"
          value={value[1]}
          min={value[0]}
          max={max}
          step={step}
          onChange={(e) => onChange([value[0], Math.max(clamp(e.target.valueAsNumber), value[0])])}
          className="h-9 w-full min-w-0 rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
        />
      </div>
    </div>
  )
}

// ─── Talle ─────────────────────────────────────────────────────

export const chipClass =
  "h-9 rounded-md border bg-background px-0 text-xs font-medium text-foreground hover:bg-muted hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary/5 data-[state=on]:text-primary"

export function SizeFilter({
  sizes,
  selected,
  onChange,
}: {
  sizes: readonly string[]
  selected: string[]
  onChange: (sizes: string[]) => void
}) {
  return (
    <ToggleGroup type="multiple" spacing={2} value={selected} onValueChange={onChange} className="grid w-full grid-cols-4">
      {sizes.map((size) => (
        <ToggleGroupItem key={size} value={size} className={chipClass} aria-label={`Talle ${size}`}>
          {size}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

// ─── Color ─────────────────────────────────────────────────────

export function ColorFilter({
  colors,
  selected,
  onChange,
}: {
  colors: ColorOption[]
  selected: string[]
  onChange: (colors: string[]) => void
}) {
  return (
    <ToggleGroup type="multiple" spacing={2} value={selected} onValueChange={onChange} className="flex w-full flex-wrap">
      {colors.map((color) => (
        <ToggleGroupItem
          key={color.name}
          value={color.name}
          aria-label={color.name}
          title={color.name}
          className="size-7 min-w-0 rounded-full p-0 hover:bg-transparent data-[state=on]:bg-transparent data-[state=on]:ring-2 data-[state=on]:ring-primary data-[state=on]:ring-offset-2 data-[state=on]:ring-offset-background"
        >
          <span className="size-6 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

// ─── Personalizable ────────────────────────────────────────────

export function CustomizableFilter({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor="filter-customizable" className="font-normal">
        Solo personalizables
      </Label>
      <Switch id="filter-customizable" checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
