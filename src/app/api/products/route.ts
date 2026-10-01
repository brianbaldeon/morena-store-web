import type { NextRequest } from "next/server"
import { createProduct, listProducts } from "@/lib/services/catalog"
import { productSchema } from "@/lib/validations/admin"
import { parseBody } from "@/lib/http"

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const products = await listProducts({
    category: params.get("category") ?? undefined,
    q: params.get("q") ?? undefined,
    ids: params.get("ids")?.split(",").filter(Boolean),
  })
  return Response.json(products)
}

export async function POST(request: Request) {
  const { data, error } = await parseBody(request, productSchema)
  if (error) return error
  return Response.json(await createProduct(data), { status: 201 })
}
