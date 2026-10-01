import { createOrder } from "@/lib/services/orders"
import { checkoutRequestSchema } from "@/lib/validations/checkout"
import { parseBody } from "@/lib/http"

/**
 * Crea el pedido y devuelve a dónde redirigir.
 * Etapa 1: simula Mercado Pago y redirige directo a /checkout/exito.
 * Etapa 2: crear la preferencia con el SDK de Mercado Pago y devolver su init_point (Checkout Pro).
 */
export async function POST(request: Request) {
  const { data, error } = await parseBody(request, checkoutRequestSchema)
  if (error) return error
  const order = await createOrder(data, "usr-001")
  return Response.json(
    { orderNumber: order.number, redirectUrl: `/checkout/exito?pedido=${order.number}` },
    { status: 201 },
  )
}
