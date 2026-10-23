"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, Moon, Sparkles, Sun } from "lucide-react"
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
          <MobileThemeSelector />
        </nav>
      </SheetContent>
    </Sheet>
  )
}

const THEME_OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
] as const

function MobileThemeSelector() {
  // resolvedTheme: si el tema guardado es "system", resalta el que se está viendo.
  const { resolvedTheme: theme, setTheme } = useTheme()
  // El tema solo se conoce en el cliente; evitamos mismatch de hidratación.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  return (
    <div className="mt-6 border-t pt-4">
      <p className="mb-2 px-3 text-xs font-medium text-muted-foreground">Tema</p>
      <div className="grid grid-cols-2 gap-1 rounded-lg border p-1">
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={mounted && theme === value}
            className={cn(
              "flex flex-col items-center gap-1 rounded-md px-2 py-2 text-xs hover:bg-muted",
              mounted && theme === value && "bg-muted font-medium text-primary",
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
