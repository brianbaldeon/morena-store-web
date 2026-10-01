import { getOrderById, updateOrderStatus } from "@/lib/services/orders"
import { orderStatusSchema } from "@/lib/validations/admin"
import { notFound, parseBody } from "@/lib/http"

export async function GET(_request: Request, ctx: RouteContext<"/api/orders/[id]">) {
  const { id } = await ctx.params
  const order = await getOrderById(id)
  return order ? Response.json(order) : notFound("Pedido no encontrado")
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/orders/[id]">) {
  const { id } = await ctx.params
  const { data, error } = await parseBody(request, orderStatusSchema)
  if (error) return error
  const order = await updateOrderStatus(id, data)
  return order ? Response.json(order) : notFound("Pedido no encontrado")
}
