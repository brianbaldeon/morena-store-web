import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const CHECKOUT_STEPS = ["Contacto", "Envío", "Revisión"] as const

export function CheckoutSteps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Pasos del checkout">
      {CHECKOUT_STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary text-primary",
              )}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className={cn("hidden sm:inline", active ? "font-medium" : "text-muted-foreground")}>{label}</span>
            {i < CHECKOUT_STEPS.length - 1 && <span className={cn("h-px flex-1 bg-border", done && "bg-primary")} />}
          </li>
        )
      })}
    </ol>
  )
}
