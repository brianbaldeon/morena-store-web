import { createCategory, listCategories } from "@/lib/services/catalog"
import { categorySchema } from "@/lib/validations/admin"
import { parseBody } from "@/lib/http"

export async function GET() {
  return Response.json(await listCategories())
}

export async function POST(request: Request) {
  const { data, error } = await parseBody(request, categorySchema)
  if (error) return error
  return Response.json(await createCategory(data), { status: 201 })
}
