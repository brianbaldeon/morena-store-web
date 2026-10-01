"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CreditCard,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Tags,
  UserRound,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/brand/logo"

const GROUPS = [
  {
    label: "General",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Ventas",
    items: [
      { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
      { href: "/admin/personalizados", label: "Personalizados", icon: Sparkles, badgeKey: "custom" as const },
      { href: "/admin/pagos", label: "Pagos", icon: CreditCard },
      { href: "/admin/clientes", label: "Clientes", icon: UserRound },
    ],
  },
  {
    label: "Catálogo",
    items: [
      { href: "/admin/productos", label: "Productos", icon: Package },
      { href: "/admin/categorias", label: "Categorías", icon: Tags },
      { href: "/admin/artistas", label: "Artistas", icon: Users },
    ],
  },
  {
    label: "Tienda",
    items: [{ href: "/admin/ajustes", label: "Ajustes", icon: Settings }],
  },
]

export function AdminSidebar({ pendingCustom }: { pendingCustom: number }) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader className="h-16 justify-center border-b px-4">
        <Logo href="/admin" />
      </SidebarHeader>
      <SidebarContent>
        {GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href)
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} className="data-[active=true]:text-primary">
                        <Link href={item.href} onClick={() => setOpenMobile(false)}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                      {"badgeKey" in item && pendingCustom > 0 && (
                        <SidebarMenuBadge className="bg-primary text-primary-foreground">{pendingCustom}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Store />
                <span>Ver tienda</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
