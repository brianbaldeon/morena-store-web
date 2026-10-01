import { deleteProduct, getProductById, updateProduct } from "@/lib/services/catalog"
import { productSchema } from "@/lib/validations/admin"
import { notFound, parseBody } from "@/lib/http"

export async function GET(_request: Request, ctx: RouteContext<"/api/products/[id]">) {
  const { id } = await ctx.params
  const product = await getProductById(id)
  return product ? Response.json(product) : notFound("Producto no encontrado")
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/products/[id]">) {
  const { id } = await ctx.params
  const { data, error } = await parseBody(request, productSchema)
  if (error) return error
  const product = await updateProduct(id, data)
  return product ? Response.json(product) : notFound("Producto no encontrado")
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/products/[id]">) {
  const { id } = await ctx.params
  return (await deleteProduct(id)) ? new Response(null, { status: 204 }) : notFound("Producto no encontrado")
}
