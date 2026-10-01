"use client"

import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserMenu } from "@/components/layout/user-menu"
import { EmptyState } from "@/components/shared/empty-state"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { AdminSidebar } from "./admin-sidebar"

/** Layout anidado del admin. Requiere sesión con rol ADMIN (etapa 2: verificación real en proxy.ts). */
export function AdminShell({ pendingCustom, children }: { pendingCustom: number; children: React.ReactNode }) {
  const { ready, forbidden } = useRequireAuth({ role: "ADMIN" })

  if (forbidden) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          title="No tenés acceso al panel"
          description="Esta sección es solo para administradores de la tienda."
          action={
            <Button asChild>
              <Link href="/">
                <ShieldAlert /> Volver a la tienda
              </Link>
            </Button>
          }
        />
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="flex flex-1">
        <Skeleton className="hidden w-64 rounded-none md:block" />
        <div className="flex-1 space-y-4 p-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AdminSidebar pendingCustom={pendingCustom} />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-1 h-5!" />
          <span className="text-sm font-medium text-muted-foreground">Panel de Store Morena</span>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
