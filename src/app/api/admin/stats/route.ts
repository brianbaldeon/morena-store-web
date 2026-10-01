import { getDashboard } from "@/lib/services/account"

export async function GET() {
  return Response.json(await getDashboard())
}
