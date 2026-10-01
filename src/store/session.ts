import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"

/**
 * Sesión simulada (etapa 1). Arranca como invitado: el login se pide recién al pagar.
 * Etapa 2: reemplazar por Auth.js.
 */
interface SessionState {
  user: User | null
  signIn: (user: User) => void
  signOut: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    { name: "morena-session" },
  ),
)
