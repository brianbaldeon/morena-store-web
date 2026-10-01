import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/types"

type NewCartItem = Omit<CartItem, "id" | "quantity"> & { quantity?: number }

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: NewCartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clear: () => void
  open: () => void
  setOpen: (open: boolean) => void
}

/** Una misma línea = mismo producto + talle + color. Las personalizaciones siempre van en línea aparte. */
function lineId(item: NewCartItem) {
  if (item.customization) return `${item.productId}-custom-${Date.now()}`
  return [item.productId, item.size ?? "u", item.color ?? "u"].join("-")
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const id = lineId(item)
          const quantity = item.quantity ?? 1
          const existing = state.items.find((i) => i.id === id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: Math.min(i.maxStock, i.quantity + quantity) } : i,
              ),
            }
          }
          return { items: [...state.items, { ...item, id, quantity: Math.min(item.maxStock, quantity) }] }
        }),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, Math.min(i.maxStock, quantity)) } : i,
          ),
        })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "morena-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export const selectCartCount = (state: CartState) => state.items.reduce((acc, i) => acc + i.quantity, 0)
export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0)
