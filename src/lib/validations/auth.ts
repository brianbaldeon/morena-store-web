import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Ingresá tu email").email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})
export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z.string().min(2, "Ingresá tu nombre"),
    email: z.string().min(1, "Ingresá tu email").email("Email inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v, "Tenés que aceptar los términos"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
export type RegisterInput = z.infer<typeof registerSchema>
