import type { ZodType, ZodTypeDef } from "zod"

/** Valida el body JSON contra el mismo esquema zod que usa el formulario. */
export async function parseBody<T>(request: Request, schema: ZodType<T, ZodTypeDef, unknown>) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return { data: null, error: badRequest("El body no es un JSON válido") }
  }
  const result = schema.safeParse(raw)
  if (!result.success) {
    return {
      data: null,
      error: Response.json(
        { message: "Datos inválidos", errors: result.error.flatten().fieldErrors },
        { status: 422 },
      ),
    }
  }
  return { data: result.data, error: null }
}

export const badRequest = (message: string) => Response.json({ message }, { status: 400 })
export const notFound = (message = "No encontrado") => Response.json({ message }, { status: 404 })
