import { deleteAddress, getAddress, updateAddress } from "@/lib/services/account"
import { addressSchema } from "@/lib/validations/checkout"
import { notFound, parseBody } from "@/lib/http"

export async function GET(_request: Request, ctx: RouteContext<"/api/account/addresses/[id]">) {
  const { id } = await ctx.params
  const address = await getAddress(id)
  return address ? Response.json(address) : notFound("Dirección no encontrada")
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/account/addresses/[id]">) {
  const { id } = await ctx.params
  const { data, error } = await parseBody(request, addressSchema)
  if (error) return error
  const address = await updateAddress(id, data)
  return address ? Response.json(address) : notFound("Dirección no encontrada")
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/account/addresses/[id]">) {
  const { id } = await ctx.params
  return (await deleteAddress(id)) ? new Response(null, { status: 204 }) : notFound("Dirección no encontrada")
}
