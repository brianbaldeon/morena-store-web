"use client"

import { Check, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface StepCardProps {
  number: number
  title: string
  description?: string
  open: boolean
  complete?: boolean
  hasError?: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

/** Paso numerado y colapsable, con el mismo estilo de tarjeta que los filtros del catálogo. */
export function StepCard({ number, title, description, open, complete, hasError, onOpenChange, children }: StepCardProps) {
  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      className={cn("rounded-lg border bg-card", hasError && "border-destructive/60", open && "border-primary/40")}
    >
      <CollapsibleTrigger className="flex w-full items-center gap-3 p-4 text-left">
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
            complete ? "border-primary bg-primary text-primary-foreground" : open && "border-primary text-primary",
          )}
        >
          {complete ? <Check className="size-3.5" /> : number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">{title}</span>
          {description && <span className="block truncate text-xs text-muted-foreground">{description}</span>}
        </span>
        <ChevronUp className={cn("size-4 transition-transform", !open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">{children}</CollapsibleContent>
    </Collapsible>
  )
}
