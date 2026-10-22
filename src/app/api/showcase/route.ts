import { createShowcaseWork, listShowcaseWorks } from "@/lib/services/showcase"
import { showcaseWorkSchema } from "@/lib/validations/admin"
import { parseBody } from "@/lib/http"

export async function GET() {
  return Response.json(await listShowcaseWorks())
}

export async function POST(request: Request) {
  const { data, error } = await parseBody(request, showcaseWorkSchema)
  if (error) return error
  return Response.json(await createShowcaseWork(data), { status: 201 })
}
