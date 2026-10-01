"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAV_LINKS } from "./nav-links"

export function MainNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Categorías" className="hidden border-t md:block">
      <ul className="mx-auto flex h-11 max-w-7xl items-center gap-6 px-4 text-sm lg:px-6">
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href || (link.href !== "/productos" && pathname.startsWith(link.href))
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "relative py-3 text-muted-foreground transition-colors hover:text-foreground",
                  active && "font-medium text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-primary",
                )}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
