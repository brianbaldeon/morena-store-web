import "server-only"
import type { CustomizableType, ShowcaseWork } from "@/types"
import { showcaseWorks as seedWorks } from "@/data/mock-showcase"
import type { ShowcaseWorkInput } from "@/lib/validations/admin"

// Etapa 1: copia en memoria (ver catalog.ts). Etapa 2: consultas de Prisma sobre ShowcaseWork.
const globalForDb = globalThis as unknown as { showcaseDb?: { works: ShowcaseWork[] } }
const db = (globalForDb.showcaseDb ??= { works: [...seedWorks] })

const newestFirst = (a: ShowcaseWork, b: ShowcaseWork) => b.createdAt.localeCompare(a.createdAt)

/** Para la tienda: solo publicados. Para el admin: `includeHidden`. */
export async function listShowcaseWorks(params: { type?: CustomizableType; includeHidden?: boolean } = {}) {
  return db.works
    .filter((w) => (params.includeHidden || w.published) && (!params.type || w.type === params.type))
    .sort(newestFirst)
}

export async function getShowcaseWorkById(id: string) {
  return db.works.find((w) => w.id === id) ?? null
}

export async function createShowcaseWork(input: ShowcaseWorkInput) {
  const work: ShowcaseWork = {
    id: `sw-${Date.now()}`,
    ...input,
    description: input.description || null,
    createdAt: new Date().toISOString(),
  }
  db.works.push(work)
  return work
}

export async function updateShowcaseWork(id: string, input: ShowcaseWorkInput) {
  const index = db.works.findIndex((w) => w.id === id)
  if (index === -1) return null
  db.works[index] = { ...db.works[index], ...input, description: input.description || null }
  return db.works[index]
}

export async function deleteShowcaseWork(id: string) {
  const before = db.works.length
  db.works = db.works.filter((w) => w.id !== id)
  return db.works.length < before
}
