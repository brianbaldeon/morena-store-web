"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Menu, Package, User } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { cn, initials } from "@/lib/utils"

const LINKS = [
  { href: "/cuenta", label: "Mi perfil", icon: User },
  { href: "/cuenta/pedidos", label: "Mis pedidos", icon: Package },
  { href: "/cuenta/direcciones", label: "Direcciones", icon: MapPin },
]

function AccountNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="space-y-1">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === "/cuenta" ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted",
              active && "bg-muted font-medium text-primary",
            )}
          >
            <Icon className="size-4" /> {label}
          </Link>
        )
      })}
    </nav>
  )
}

/** Layout anidado de /cuenta: menú lateral en desktop, Sheet en mobile. Requiere sesión. */
export function AccountShell({ children }: { children: React.ReactNode }) {
  const { user, ready } = useRequireAuth()
  const [open, setOpen] = useState(false)

  if (!ready || !user) {
    return (
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <Skeleton className="hidden h-48 lg:block" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  const header = (
    <div className="flex items-center gap-3 border-b pb-4">
      <Avatar className="size-11 border">
        <AvatarFallback className="bg-muted text-sm">{initials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-semibold">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="hidden h-fit space-y-4 rounded-lg border p-4 lg:block">
        {header}
        <AccountNav />
      </aside>
      <div className="min-w-0">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="mb-4 flex items-center gap-2 rounded-md border px-3 py-2 text-sm lg:hidden">
            <Menu className="size-4" /> Mi cuenta
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Mi cuenta</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-4">
              {header}
              <AccountNav onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        {children}
      </div>
    </div>
  )
}
