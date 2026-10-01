import { deleteCategory, getCategoryById, updateCategory } from "@/lib/services/catalog"
import { categorySchema } from "@/lib/validations/admin"
import { notFound, parseBody } from "@/lib/http"

export async function GET(_request: Request, ctx: RouteContext<"/api/categories/[id]">) {
  const { id } = await ctx.params
  const category = await getCategoryById(id)
  return category ? Response.json(category) : notFound("Categoría no encontrada")
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/categories/[id]">) {
  const { id } = await ctx.params
  const { data, error } = await parseBody(request, categorySchema)
  if (error) return error
  const category = await updateCategory(id, data)
  return category ? Response.json(category) : notFound("Categoría no encontrada")
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/categories/[id]">) {
  const { id } = await ctx.params
  return (await deleteCategory(id)) ? new Response(null, { status: 204 }) : notFound("Categoría no encontrada")
}
