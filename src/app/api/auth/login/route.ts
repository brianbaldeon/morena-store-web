import { login } from "@/lib/services/account"
import { loginSchema } from "@/lib/validations/auth"
import { parseBody } from "@/lib/http"

/** Sesión simulada. Etapa 2: Auth.js. */
export async function POST(request: Request) {
  const { data, error } = await parseBody(request, loginSchema)
  if (error) return error
  return Response.json({ user: await login(data) })
}
