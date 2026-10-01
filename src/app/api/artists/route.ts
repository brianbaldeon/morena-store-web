import { createBrand, listBrands } from "@/lib/services/catalog"
import { brandSchema } from "@/lib/validations/admin"
import { parseBody } from "@/lib/http"

export async function GET() {
  return Response.json(await listBrands())
}

export async function POST(request: Request) {
  const { data, error } = await parseBody(request, brandSchema)
  if (error) return error
  return Response.json(await createBrand(data), { status: 201 })
}
