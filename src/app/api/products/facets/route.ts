import { listProducts } from "@/lib/services/catalog"
import { computeFacets, createInitialFilters } from "@/lib/filters"

export async function GET() {
  const products = await listProducts()
  return Response.json(computeFacets(products, createInitialFilters(products)))
}
