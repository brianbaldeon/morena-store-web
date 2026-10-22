import { deleteShowcaseWork, getShowcaseWorkById, updateShowcaseWork } from "@/lib/services/showcase"
import { showcaseWorkSchema } from "@/lib/validations/admin"
import { notFound, parseBody } from "@/lib/http"

export async function GET(_request: Request, ctx: RouteContext<"/api/showcase/[id]">) {
  const { id } = await ctx.params
  const work = await getShowcaseWorkById(id)
  return work ? Response.json(work) : notFound("Trabajo no encontrado")
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/showcase/[id]">) {
  const { id } = await ctx.params
  const { data, error } = await parseBody(request, showcaseWorkSchema)
  if (error) return error
  const work = await updateShowcaseWork(id, data)
  return work ? Response.json(work) : notFound("Trabajo no encontrado")
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/showcase/[id]">) {
  const { id } = await ctx.params
  return (await deleteShowcaseWork(id)) ? new Response(null, { status: 204 }) : notFound("Trabajo no encontrado")
}
