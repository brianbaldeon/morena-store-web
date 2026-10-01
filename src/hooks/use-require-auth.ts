"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSessionStore } from "@/store/session"
import { useMounted } from "@/hooks/use-mounted"

/**
 * Protege una página del lado del navegador: si es invitado, lo manda a
 * /login?next=<ruta actual>. Etapa 2: la protección real va en proxy.ts.
 */
export function useRequireAuth(options: { role?: "ADMIN" } = {}) {
  const mounted = useMounted()
  const user = useSessionStore((s) => s.user)
  const router = useRouter()
  const pathname = usePathname()

  const allowed = !!user && (!options.role || user.role === options.role)

  useEffect(() => {
    if (mounted && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
  }, [mounted, user, router, pathname])

  return { user, ready: mounted && allowed, forbidden: mounted && !!user && !allowed }
}
