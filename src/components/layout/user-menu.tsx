"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, Heart, LayoutDashboard, LogOut, MapPin, Package, User as UserIcon } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSessionStore } from "@/store/session"
import { useMounted } from "@/hooks/use-mounted"
import { initials } from "@/lib/utils"

/** Invitado: "Ingresar". Con sesión: avatar + saludo + nombre, como en la referencia. */
export function UserMenu() {
  const mounted = useMounted()
  const user = useSessionStore((s) => s.user)
  const signOut = useSessionStore((s) => s.signOut)
  const router = useRouter()

  if (!mounted || !user) {
    return (
      <Link
        href="/login"
        className="flex h-10 items-center gap-2 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <UserIcon className="size-5" />
        <span className="hidden lg:inline">Ingresar</span>
      </Link>
    )
  }

  const firstName = user.name.split(" ")[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg p-1 pr-2 text-left outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-9 border">
          <AvatarFallback className="bg-muted text-xs font-medium">{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden flex-col leading-tight lg:flex">
          <span className="text-[11px] text-muted-foreground">¡Hola de nuevo!</span>
          <span className="text-sm font-semibold">{firstName}</span>
        </span>
        <ChevronDown className="hidden size-4 text-muted-foreground lg:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/cuenta">
            <UserIcon /> Mi cuenta
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/cuenta/pedidos">
            <Package /> Mis pedidos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/cuenta/direcciones">
            <MapPin /> Direcciones
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favoritos">
            <Heart /> Favoritos
          </Link>
        </DropdownMenuItem>
        {user.role === "ADMIN" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <LayoutDashboard /> Panel admin
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut()
            toast.success("Cerraste sesión")
            router.push("/")
          }}
        >
          <LogOut /> Salir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
