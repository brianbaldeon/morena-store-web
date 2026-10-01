import { z } from "zod"

const PRODUCT_TYPES = ["MUNECO", "LLAVERO", "REMERA", "BUZO", "OTRO"] as const

export const variantSchema = z.object({
  sku: z.string().min(1, "Ingresá el SKU"),
  size: z.string().optional(),
  color: z.string().optional(),
  stock: z.number({ invalid_type_error: "Ingresá un número" }).int().min(0, "No puede ser negativo"),
})

export const productSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres").max(80),
  description: z.string().min(10, "Contá un poco más del producto (mínimo 10 caracteres)"),
  price: z.number({ invalid_type_error: "Ingresá un precio" }).positive("El precio tiene que ser mayor a 0"),
  compareAtPrice: z.number().positive().nullable().optional(),
  categoryId: z.string().min(1, "Elegí una categoría"),
  brandId: z.string().optional(),
  productType: z.enum(PRODUCT_TYPES, { errorMap: () => ({ message: "Elegí un tipo" }) }),
  images: z.array(z.string().min(1)).min(1, "Agregá al menos una imagen"),
  stock: z.number({ invalid_type_error: "Ingresá un número" }).int().min(0),
  variants: z.array(variantSchema),
  isNew: z.boolean(),
  isFeatured: z.boolean(),
  isCustomizable: z.boolean(),
})
export type ProductInput = z.infer<typeof productSchema>

export const categorySchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  description: z.string().min(5, "Mínimo 5 caracteres"),
  image: z.string().min(1, "Ingresá la URL de la imagen"),
  productType: z.enum(PRODUCT_TYPES),
})
export type CategoryInput = z.infer<typeof categorySchema>

export const brandSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  avatar: z.string().min(1, "Ingresá la URL de la imagen"),
  kind: z.enum(["ARTISTA", "PERSONAJE"]),
})
export type BrandInput = z.infer<typeof brandSchema>

export const settingsSchema = z.object({
  storeName: z.string().min(2),
  email: z.string().email("Email inválido"),
  phone: z.string().min(6, "Teléfono inválido"),
  instagram: z.string().min(2),
  shippingCost: z.number().min(0),
  freeShippingFrom: z.number().min(0),
  productionDays: z.number().int().min(1),
})
export type SettingsInput = z.infer<typeof settingsSchema>

export const orderStatusSchema = z.object({
  status: z.enum(["PENDIENTE", "PAGADO", "EN_PRODUCCION", "ENVIADO", "ENTREGADO", "CANCELADO"]),
  trackingNumber: z.string().optional(),
})
export type OrderStatusInput = z.infer<typeof orderStatusSchema>

export const customOrderUpdateSchema = z.object({
  status: z.enum(["RECIBIDO", "DISENO", "APROBACION", "PRODUCCION", "ENVIADO"]),
  designPreview: z.string().optional(),
  internalNote: z.string().optional(),
})
export type CustomOrderUpdateInput = z.infer<typeof customOrderUpdateSchema>
