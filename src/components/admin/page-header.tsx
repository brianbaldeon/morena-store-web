import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface AdminPageHeaderProps {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  actions?: React.ReactNode
}

export function AdminPageHeader({ title, description, backHref, backLabel, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 space-y-3">
      {backHref && (
        <Link href={backHref} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="size-4" /> {backLabel ?? "Volver"}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  )
}
