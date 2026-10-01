"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"
import { NAV_LINKS } from "./nav-links"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="flex size-10 items-center justify-center rounded-lg hover:bg-muted md:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle asChild>
            <div onClick={() => setOpen(false)}>
              <Logo />
            </div>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm hover:bg-muted",
                pathname === link.href && "bg-muted font-medium text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/personalizar"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <Sparkles className="size-4" /> Personalizá el tuyo
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
