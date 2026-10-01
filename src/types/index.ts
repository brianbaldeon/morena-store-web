// ─── Catálogo ──────────────────────────────────────────────────

export type ProductType = "MUNECO" | "LLAVERO" | "REMERA" | "BUZO" | "OTRO"

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productType: ProductType
}

/** "Brand" = artista o personaje (equivale al filtro "Brand" de la referencia). */
export interface Brand {
  id: string
  name: string
  slug: string
  avatar: string
  kind: "ARTISTA" | "PERSONAJE"
}

export interface ColorOption {
  name: string
  hex: string
}

export interface ProductVariant {
  id: string
  sku: string
  size: string | null
  color: string | null
  stock: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice: number | null
  images: string[]
  categoryId: string
  brandId: string | null
  productType: ProductType
  sizes: string[]
  colors: ColorOption[]
  variants: ProductVariant[]
  stock: number
  isNew: boolean
  isFeatured: boolean
  isCustomizable: boolean
  rating: number
  sales: number
  createdAt: string
}

/** Producto con su categoría y marca resueltas, listo para la UI. */
export interface ProductWithRelations extends Product {
  category: Category
  brand: Brand | null
}

// ─── Filtros ───────────────────────────────────────────────────

export type SortOption = "popular" | "newest" | "price-asc" | "price-desc"
export type ViewMode = "grid" | "list"

export interface FilterState {
  brands: string[]
  categories: string[]
  productTypes: ProductType[]
  price: [number, number]
  sizes: string[]
  colors: string[]
  customizable: boolean
  sort: SortOption
}

export interface Facets {
  brands: { brand: Brand; count: number }[]
  categories: { category: Category; count: number }[]
  priceRange: [number, number]
  /** Cantidad de productos por tramo de precio, para el histograma. */
  priceHistogram: number[]
  sizes: string[]
  colors: ColorOption[]
}

// ─── Personalización ───────────────────────────────────────────

export type CustomizableType = "muneco" | "remera" | "buzo" | "llavero"

export interface Customization {
  type: CustomizableType
  photos: string[]
  options: Record<string, string>
  notes: string
}

// ─── Carrito ───────────────────────────────────────────────────

export interface CartItem {
  /** Clave única de la línea: producto + variante + personalización. */
  id: string
  productId: string
  slug: string
  name: string
  image: string
  unitPrice: number
  quantity: number
  maxStock: number
  size: string | null
  color: string | null
  customization: Customization | null
}

// ─── Usuario y pedidos ─────────────────────────────────────────

export type UserRole = "CUSTOMER" | "ADMIN"

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  role: UserRole
  createdAt: string
}

export interface Address {
  id: string
  label: string
  recipient: string
  street: string
  number: string
  apartment: string | null
  city: string
  province: string
  postalCode: string
  phone: string
  isDefault: boolean
}

export type ShippingMethod = "DOMICILIO" | "RETIRO"

export type OrderStatus = "PENDIENTE" | "PAGADO" | "EN_PRODUCCION" | "ENVIADO" | "ENTREGADO" | "CANCELADO"

export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "IN_PROCESS" | "REFUNDED"

export interface OrderItem {
  id: string
  productId: string
  name: string
  image: string
  size: string | null
  color: string | null
  quantity: number
  unitPrice: number
  customization: Customization | null
}

export interface Order {
  id: string
  number: string
  userId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  shippingMethod: ShippingMethod
  shippingAddress: Omit<Address, "id" | "label" | "isDefault"> | null
  subtotal: number
  shippingCost: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  mpPaymentId: string | null
  trackingNumber: string | null
  createdAt: string
  timeline: { status: OrderStatus; date: string }[]
}

export type CustomOrderStatus = "RECIBIDO" | "DISENO" | "APROBACION" | "PRODUCCION" | "ENVIADO"

export interface CustomOrder {
  id: string
  orderNumber: string
  customerName: string
  type: CustomizableType
  title: string
  photos: string[]
  options: Record<string, string>
  notes: string
  status: CustomOrderStatus
  designPreview: string | null
  dueDate: string
  createdAt: string
}

// ─── Admin ─────────────────────────────────────────────────────

export interface DashboardStats {
  revenue: number
  revenueChange: number
  orders: number
  ordersChange: number
  customers: number
  customersChange: number
  pendingCustom: number
}

export interface SalesPoint {
  date: string
  ventas: number
  pedidos: number
}

export interface Payment {
  id: string
  orderNumber: string
  customerName: string
  amount: number
  method: "MERCADO_PAGO"
  status: PaymentStatus
  date: string
}

export interface StoreSettings {
  storeName: string
  email: string
  phone: string
  instagram: string
  shippingCost: number
  freeShippingFrom: number
  productionDays: number
}
