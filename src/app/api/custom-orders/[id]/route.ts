import { getCustomOrderById, updateCustomOrder } from "@/lib/services/orders"
import { customOrderUpdateSchema } from "@/lib/validations/admin"
import { notFound, parseBody } from "@/lib/http"

export async function GET(_request: Request, ctx: RouteContext<"/api/custom-orders/[id]">) {
  const { id } = await ctx.params
  const order = await getCustomOrderById(id)
  return order ? Response.json(order) : notFound("Pedido personalizado no encontrado")
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/custom-orders/[id]">) {
  const { id } = await ctx.params
  const { data, error } = await parseBody(request, customOrderUpdateSchema)
  if (error) return error
  const order = await updateCustomOrder(id, data)
  return order ? Response.json(order) : notFound("Pedido personalizado no encontrado")
}
