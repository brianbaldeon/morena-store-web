import type {
  ColorOption,
  CustomizableType,
  CustomOrderStatus,
  FilterState,
  OrderStatus,
  PaymentStatus,
  ProductType,
  SortOption,
} from "@/types"

export const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"] as const

export const COLORS: ColorOption[] = [
  { name: "Negro", hex: "#111827" },
  { name: "Blanco", hex: "#FFFFFF" },
  { name: "Rojo", hex: "#EF4444" },
  { name: "Amarillo", hex: "#FACC15" },
  { name: "Verde agua", hex: "#86EFAC" },
  { name: "Celeste", hex: "#93C5FD" },
  { name: "Lila", hex: "#A78BFA" },
  { name: "Azul", hex: "#3B82F6" },
  { name: "Naranja", hex: "#FB923C" },
  { name: "Gris", hex: "#9CA3AF" },
]

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  MUNECO: "Muñecos",
  LLAVERO: "Llaveros",
  REMERA: "Remeras",
  BUZO: "Buzos",
  OTRO: "Otros",
}

export const SORT_LABELS: Record<SortOption, string> = {
  popular: "Populares",
  newest: "Más nuevos",
  "price-asc": "Menor precio",
  "price-desc": "Mayor precio",
}

export const PRICE_BUCKETS = 24

export const DEFAULT_FILTERS: Omit<FilterState, "price"> = {
  brands: [],
  categories: [],
  productTypes: [],
  sizes: [],
  colors: [],
  customizable: false,
  sort: "popular",
}

export const PAGE_SIZE = 9

export const LOW_STOCK_THRESHOLD = 15

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDIENTE: "Pendiente de pago",
  PAGADO: "Pagado",
  EN_PRODUCCION: "En producción",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  IN_PROCESS: "En proceso",
  REFUNDED: "Reintegrado",
}

export const CUSTOM_ORDER_STATUSES: { value: CustomOrderStatus; label: string }[] = [
  { value: "RECIBIDO", label: "Recibido" },
  { value: "DISENO", label: "Diseño" },
  { value: "APROBACION", label: "Aprobación" },
  { value: "PRODUCCION", label: "Producción" },
  { value: "ENVIADO", label: "Enviado" },
]

export interface CustomizerOptionGroup {
  key: string
  label: string
  options: string[]
}

export interface CustomizerConfig {
  type: CustomizableType
  /** Producto base del catálogo al que se asocia la línea del carrito. */
  productSlug: string
  title: string
  subtitle: string
  description: string
  image: string
  basePrice: number
  productionDays: string
  maxPhotos: number
  photoHint: string
  optionGroups: CustomizerOptionGroup[]
  hasPrintPreview: boolean
}

/** Recargos por opción del personalizador (precio estimado, se confirma al aprobar el diseño). */
export const OPTION_SURCHARGES: Record<string, number> = {
  "35 cm": 6000,
  "45 cm": 12000,
  "12 cm": 1500,
  "Caja de regalo": 2500,
  Guitarra: 2000,
  "Frente y espalda": 4500,
  A4: 1500,
  A3: 3500,
  "x3 (mismo diseño)": 9500,
}

export function estimateCustomPrice(config: CustomizerConfig, options: Record<string, string>) {
  return Object.values(options).reduce((acc, value) => acc + (OPTION_SURCHARGES[value] ?? 0), config.basePrice)
}

export const CUSTOMIZERS: Record<CustomizableType, CustomizerConfig> = {
  muneco: {
    type: "muneco",
    productSlug: "muneco-personalizado-de-tu-persona-favorita",
    title: "Muñeco personalizado",
    subtitle: "Vos, tu pareja o tu amigo, en versión muñeco",
    description:
      "Mandanos fotos de la persona y armamos un muñeco cosido a mano con su cara, ropa y accesorios.",
    image: "/products/peluches/Peluches2.jpeg",
    basePrice: 32000,
    productionDays: "10 a 15 días hábiles",
    maxPhotos: 4,
    photoHint: "Subí 2 a 4 fotos: una de frente con buena luz y otras de cuerpo entero.",
    optionGroups: [
      { key: "tamano", label: "Tamaño", options: ["25 cm", "35 cm", "45 cm"] },
      { key: "ropa", label: "Ropa", options: ["Como en la foto", "Remera y jean", "Camiseta de fútbol", "Vestido"] },
      { key: "accesorio", label: "Accesorio", options: ["Ninguno", "Anteojos", "Gorra", "Guitarra", "Mate"] },
      { key: "packaging", label: "Packaging", options: ["Bolsa kraft", "Caja de regalo"] },
    ],
    hasPrintPreview: false,
  },
  remera: {
    type: "remera",
    productSlug: "remera-personalizada-dtf",
    title: "Remera DTF personalizada",
    subtitle: "Tu diseño estampado en DTF",
    description: "Subí tu imagen o idea y la estampamos en DTF, con colores vivos que aguantan los lavados.",
    image: "/products/remeras/Remeras-mod-2.jpeg",
    basePrice: 18500,
    productionDays: "5 a 7 días hábiles",
    maxPhotos: 2,
    photoHint: "Ideal PNG con fondo transparente, 300 dpi. Si no tenés, mandá la mejor foto y la preparamos.",
    optionGroups: [
      { key: "talle", label: "Talle", options: ["XS", "S", "M", "L", "XL", "XXL"] },
      { key: "color", label: "Color de la prenda", options: ["Negro", "Blanco", "Gris", "Azul"] },
      { key: "ubicacion", label: "Ubicación del estampado", options: ["Frente", "Espalda", "Frente y espalda"] },
      { key: "tamano", label: "Tamaño del estampado", options: ["A5 (pecho)", "A4", "A3"] },
    ],
    hasPrintPreview: true,
  },
  buzo: {
    type: "buzo",
    productSlug: "buzo-personalizado-dtf",
    title: "Buzo DTF personalizado",
    subtitle: "Frisa, canguro y tu estampa",
    description: "Buzo de frisa con capucha y bolsillo canguro, con tu diseño en DTF.",
    image: "/products/remeras/Remeras-mod-3.jpeg",
    basePrice: 34000,
    productionDays: "7 a 10 días hábiles",
    maxPhotos: 2,
    photoHint: "Ideal PNG con fondo transparente, 300 dpi.",
    optionGroups: [
      { key: "talle", label: "Talle", options: ["S", "M", "L", "XL", "XXL"] },
      { key: "color", label: "Color de la prenda", options: ["Negro", "Gris", "Azul", "Blanco"] },
      { key: "ubicacion", label: "Ubicación del estampado", options: ["Frente", "Espalda", "Frente y espalda"] },
      { key: "tamano", label: "Tamaño del estampado", options: ["A5 (pecho)", "A4", "A3"] },
    ],
    hasPrintPreview: true,
  },
  llavero: {
    type: "llavero",
    productSlug: "llavero-personalizado",
    title: "Llavero personalizado",
    subtitle: "Tu mascota, tu ídolo o tu cara",
    description: "Llavero de tela acolchado con la imagen que quieras, cosido a mano.",
    image: "/products/peluches/Peluches3.jpeg",
    basePrice: 6500,
    productionDays: "5 a 7 días hábiles",
    maxPhotos: 2,
    photoHint: "Una foto nítida de frente alcanza.",
    optionGroups: [
      { key: "tamano", label: "Tamaño", options: ["8 cm", "12 cm"] },
      { key: "argolla", label: "Argolla", options: ["Plateada", "Dorada", "Mosquetón"] },
      { key: "cantidad", label: "Pack", options: ["x1", "x3 (mismo diseño)"] },
    ],
    hasPrintPreview: false,
  },
}
