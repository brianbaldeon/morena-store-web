import { z } from "zod"

export const addressSchema = z.object({
  label: z.string().min(2, "Ej: Casa, Trabajo"),
  recipient: z.string().min(2, "Ingresá quién recibe"),
  street: z.string().min(2, "Ingresá la calle"),
  number: z.string().min(1, "Ingresá la altura"),
  apartment: z.string().optional(),
  city: z.string().min(2, "Ingresá la ciudad"),
  province: z.string().min(2, "Elegí la provincia"),
  postalCode: z.string().min(4, "Código postal inválido"),
  phone: z.string().min(8, "Teléfono inválido"),
  isDefault: z.boolean(),
})
export type AddressInput = z.infer<typeof addressSchema>

export const checkoutSchema = z
  .object({
    name: z.string().min(2, "Ingresá tu nombre"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(8, "Teléfono inválido"),
    shippingMethod: z.enum(["DOMICILIO", "RETIRO"]),
    street: z.string().optional(),
    number: z.string().optional(),
    apartment: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    postalCode: z.string().optional(),
    notes: z.string().max(300).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.shippingMethod !== "DOMICILIO") return
    const required: [keyof typeof data, string][] = [
      ["street", "Ingresá la calle"],
      ["number", "Ingresá la altura"],
      ["city", "Ingresá la ciudad"],
      ["province", "Elegí la provincia"],
      ["postalCode", "Ingresá el código postal"],
    ]
    for (const [field, message] of required) {
      if (!data[field]) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message })
    }
  })
export type CheckoutInput = z.infer<typeof checkoutSchema>

/** Body que el navegador manda a POST /api/checkout. */
export const checkoutRequestSchema = z.object({
  customer: checkoutSchema,
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
        unitPrice: z.number().positive(),
        size: z.string().nullable(),
        color: z.string().nullable(),
        hasCustomization: z.boolean(),
      }),
    )
    .min(1, "El carrito está vacío"),
})
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>

export const profileSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono inválido").or(z.literal("")),
})
export type ProfileInput = z.infer<typeof profileSchema>

export const PROVINCES = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
]
