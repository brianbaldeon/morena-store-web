import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  description?: string
  href?: string
  linkLabel?: string
  className?: string
}

export function SectionHeading({ title, description, href, linkLabel = "Ver todo", className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline">
          {linkLabel} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}
