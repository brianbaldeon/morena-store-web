import { getSettings, updateSettings } from "@/lib/services/account"
import { settingsSchema } from "@/lib/validations/admin"
import { parseBody } from "@/lib/http"

export async function GET() {
  return Response.json(await getSettings())
}

export async function PATCH(request: Request) {
  const { data, error } = await parseBody(request, settingsSchema)
  if (error) return error
  return Response.json(await updateSettings(data))
}
