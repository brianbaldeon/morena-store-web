import type { Address, Brand, Category, CustomOrder, Order, ProductWithRelations, StoreSettings, User } from "@/types"
import type {
  BrandInput,
  CategoryInput,
  CustomOrderUpdateInput,
  OrderStatusInput,
  ProductInput,
  SettingsInput,
} from "@/lib/validations/admin"
import type { LoginInput, RegisterInput } from "@/lib/validations/auth"
import type { AddressInput, CheckoutRequest, ProfileInput } from "@/lib/validations/checkout"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message)
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiError(body.message ?? "Ocurrió un error", response.status, body.errors)
  }
  return response.status === 204 ? (undefined as T) : response.json()
}

const send = <T>(method: "POST" | "PATCH", path: string, body: unknown) =>
  request<T>(path, { method, body: JSON.stringify(body) })
const remove = (path: string) => request<void>(path, { method: "DELETE" })

/** Cliente tipado para los Route Handlers. Sin Server Actions. */
export const api = {
  products: {
    list: (params: { q?: string; ids?: string[] } = {}) => {
      const search = new URLSearchParams()
      if (params.q) search.set("q", params.q)
      if (params.ids) search.set("ids", params.ids.join(","))
      return request<ProductWithRelations[]>(`/products?${search}`)
    },
    create: (input: ProductInput) => send<ProductWithRelations>("POST", "/products", input),
    update: (id: string, input: ProductInput) => send<ProductWithRelations>("PATCH", `/products/${id}`, input),
    remove: (id: string) => remove(`/products/${id}`),
  },
  categories: {
    create: (input: CategoryInput) => send<Category>("POST", "/categories", input),
    update: (id: string, input: CategoryInput) => send<Category>("PATCH", `/categories/${id}`, input),
    remove: (id: string) => remove(`/categories/${id}`),
  },
  artists: {
    create: (input: BrandInput) => send<Brand>("POST", "/artists", input),
    update: (id: string, input: BrandInput) => send<Brand>("PATCH", `/artists/${id}`, input),
    remove: (id: string) => remove(`/artists/${id}`),
  },
  orders: {
    updateStatus: (id: string, input: OrderStatusInput) => send<Order>("PATCH", `/orders/${id}`, input),
  },
  customOrders: {
    update: (id: string, input: CustomOrderUpdateInput) => send<CustomOrder>("PATCH", `/custom-orders/${id}`, input),
  },
  checkout: {
    create: (input: CheckoutRequest) =>
      send<{ orderNumber: string; redirectUrl: string }>("POST", "/checkout", input),
  },
  auth: {
    login: (input: LoginInput) => send<{ user: User }>("POST", "/auth/login", input),
    register: (input: RegisterInput) => send<{ user: User }>("POST", "/auth/register", input),
  },
  account: {
    updateProfile: (input: ProfileInput) => send<User>("PATCH", "/account/profile", input),
    createAddress: (input: AddressInput) => send<Address>("POST", "/account/addresses", input),
    updateAddress: (id: string, input: AddressInput) => send<Address>("PATCH", `/account/addresses/${id}`, input),
    removeAddress: (id: string) => remove(`/account/addresses/${id}`),
  },
  settings: {
    update: (input: SettingsInput) => send<StoreSettings>("PATCH", "/settings", input),
  },
}
