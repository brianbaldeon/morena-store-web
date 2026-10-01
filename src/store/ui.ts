import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ViewMode } from "@/types"

/** Preferencias de UI que se comparten entre páginas. */
interface UiState {
  catalogView: ViewMode
  setCatalogView: (view: ViewMode) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      catalogView: "grid",
      setCatalogView: (catalogView) => set({ catalogView }),
    }),
    { name: "morena-ui" },
  ),
)
