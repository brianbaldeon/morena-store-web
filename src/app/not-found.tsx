import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LuckyCat } from "@/components/brand/lucky-cat"

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-6 size-32">
        <LuckyCat />
      </div>
      <p className="text-sm font-medium text-primary">Error 404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Esta página se fue de paseo</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">No encontramos lo que buscabas. Probá desde el inicio o el catálogo.</p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/">Ir al inicio</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/productos">Ver productos</Link>
        </Button>
      </div>
    </main>
  )
}
