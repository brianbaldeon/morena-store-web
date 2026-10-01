import { createAddress, listAddresses } from "@/lib/services/account"
import { addressSchema } from "@/lib/validations/checkout"
import { parseBody } from "@/lib/http"

export async function GET() {
  return Response.json(await listAddresses())
}

export async function POST(request: Request) {
  const { data, error } = await parseBody(request, addressSchema)
  if (error) return error
  return Response.json(await createAddress(data), { status: 201 })
}
