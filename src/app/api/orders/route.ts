import type { NextRequest } from "next/server"
import type { OrderStatus } from "@/types"
import { listOrders } from "@/lib/services/orders"

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const orders = await listOrders({
    userId: params.get("userId") ?? undefined,
    status: (params.get("status") as OrderStatus | null) ?? undefined,
  })
  return Response.json(orders)
}
