import { register } from "@/lib/services/account"
import { registerSchema } from "@/lib/validations/auth"
import { parseBody } from "@/lib/http"

/** Registro simulado. Etapa 2: Auth.js + Prisma. */
export async function POST(request: Request) {
  const { data, error } = await parseBody(request, registerSchema)
  if (error) return error
  return Response.json({ user: await register(data) }, { status: 201 })
}
