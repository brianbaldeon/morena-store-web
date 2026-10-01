"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { SalesPoint } from "@/types"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { formatPrice } from "@/lib/format"

const config = {
  ventas: { label: "Ventas", color: "var(--chart-1)" },
} satisfies ChartConfig

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
const monthLabel = (date: string) => MONTHS[Number(date.slice(5, 7)) - 1]

export function SalesChart({ data }: { data: SalesPoint[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-ventas)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-ventas)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={monthLabel} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => monthLabel(String(value))}
              formatter={(value) => (
                <span className="flex w-full justify-between gap-4">
                  <span className="text-muted-foreground">Ventas</span>
                  <span className="font-medium">{formatPrice(Number(value))}</span>
                </span>
              )}
            />
          }
        />
        <Area dataKey="ventas" type="monotone" fill="url(#fillVentas)" stroke="var(--color-ventas)" strokeWidth={2} />
      </AreaChart>
    </ChartContainer>
  )
}
