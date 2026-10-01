import type { LucideIcon } from "lucide-react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  change?: number
  hint?: string
}

export function StatCard({ label, value, icon: Icon, change, hint }: StatCardProps) {
  const up = (change ?? 0) >= 0
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      {change !== undefined ? (
        <p className={cn("mt-1 flex items-center gap-1 text-xs", up ? "text-success" : "text-destructive")}>
          {up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
          {up ? "+" : ""}
          {change}% <span className="text-muted-foreground">vs. mes anterior</span>
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
