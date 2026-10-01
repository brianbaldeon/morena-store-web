import { getProfile, updateProfile } from "@/lib/services/account"
import { profileSchema } from "@/lib/validations/checkout"
import { parseBody } from "@/lib/http"

export async function GET() {
  return Response.json(await getProfile())
}

export async function PATCH(request: Request) {
  const { data, error } = await parseBody(request, profileSchema)
  if (error) return error
  return Response.json(await updateProfile(data))
}
