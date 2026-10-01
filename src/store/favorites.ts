import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FavoritesState {
  ids: string[]
  toggle: (productId: string) => boolean
  has: (productId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const added = !get().ids.includes(productId)
        set((state) => ({
          ids: added ? [...state.ids, productId] : state.ids.filter((id) => id !== productId),
        }))
        return added
      },
      has: (productId) => get().ids.includes(productId),
    }),
    { name: "morena-favorites" },
  ),
)
