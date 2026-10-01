import { listCustomOrders } from "@/lib/services/orders"

export async function GET() {
  return Response.json(await listCustomOrders())
}
