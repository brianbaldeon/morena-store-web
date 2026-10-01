"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: "sm" | "md"
  className?: string
}

export function QuantityStepper({ value, onChange, min = 1, max = 99, size = "md", className }: QuantityStepperProps) {
  const button = cn(
    "flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
    size === "sm" ? "size-7" : "size-10",
  )
  return (
    <div className={cn("inline-flex items-center rounded-lg border", className)}>
      <button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Restar uno">
        <Minus className="size-3.5" />
      </button>
      <span className={cn("min-w-8 text-center font-medium tabular-nums", size === "sm" ? "text-xs" : "text-sm")} aria-live="polite">
        {value}
      </span>
      <button type="button" className={button} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Sumar uno">
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}
