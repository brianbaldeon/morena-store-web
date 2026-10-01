import Link from "next/link"
import { cn } from "@/lib/utils"
import { LuckyCat } from "./lucky-cat"

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-1.5", className)} aria-label="Store Morena, ir al inicio">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 p-0.5">
        <LuckyCat />
      </span>
      <span className="text-xl leading-none font-semibold tracking-tight">
        morena<span className="text-primary">.</span>
      </span>
    </Link>
  )
}
