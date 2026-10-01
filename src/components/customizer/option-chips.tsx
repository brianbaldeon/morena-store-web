"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { COLORS, OPTION_SURCHARGES } from "@/lib/constants"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

interface OptionChipsProps {
  label: string
  options: string[]
  value: string | undefined
  onChange: (value: string) => void
  invalid?: boolean
}

/** Chips de opción única. Si el grupo es de colores, muestra un círculo con el color. */
export function OptionChips({ label, options, value, onChange, invalid }: OptionChipsProps) {
  return (
    <ToggleGroup
      type="single"
      spacing={2}
      value={value ?? ""}
      onValueChange={(v) => v && onChange(v)}
      aria-label={label}
      className="flex w-full flex-wrap"
    >
      {options.map((option) => {
        const color = COLORS.find((c) => c.name === option)
        const surcharge = OPTION_SURCHARGES[option]
        return (
          <ToggleGroupItem
            key={option}
            value={option}
            className={cn(
              "h-auto min-h-9 rounded-md border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted data-[state=on]:border-primary data-[state=on]:bg-primary/5 data-[state=on]:text-primary",
              invalid && "border-destructive/50",
            )}
          >
            {color && <span className="size-3.5 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />}
            {option}
            {surcharge && <span className="font-normal text-muted-foreground">+{formatPrice(surcharge)}</span>}
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}
