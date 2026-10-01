import { deleteBrand, getBrandById, updateBrand } from "@/lib/services/catalog"
import { brandSchema } from "@/lib/validations/admin"
import { notFound, parseBody } from "@/lib/http"

export async function GET(_request: Request, ctx: RouteContext<"/api/artists/[id]">) {
  const { id } = await ctx.params
  const brand = await getBrandById(id)
  return brand ? Response.json(brand) : notFound("Artista no encontrado")
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/artists/[id]">) {
  const { id } = await ctx.params
  const { data, error } = await parseBody(request, brandSchema)
  if (error) return error
  const brand = await updateBrand(id, data)
  return brand ? Response.json(brand) : notFound("Artista no encontrado")
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/artists/[id]">) {
  const { id } = await ctx.params
  return (await deleteBrand(id)) ? new Response(null, { status: 204 }) : notFound("Artista no encontrado")
}
