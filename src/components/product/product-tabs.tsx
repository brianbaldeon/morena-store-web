import { Clock, HandHeart, RotateCcw, Truck } from "lucide-react"
import type { ProductWithRelations } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CARE: Record<string, string[]> = {
  REMERA: ["Lavar del revés con agua fría.", "No usar lavandina.", "No planchar sobre el estampado.", "Secar a la sombra."],
  BUZO: ["Lavar del revés con agua fría.", "No usar lavandina.", "No planchar sobre el estampado.", "Secar a la sombra."],
  default: ["Limpiar con paño húmedo.", "Si hace falta, lavar a mano con jabón neutro.", "Secar a la sombra.", "No usar secarropas."],
}

export function ProductTabs({ product }: { product: ProductWithRelations }) {
  const care = CARE[product.productType] ?? CARE.default
  return (
    <Tabs defaultValue="descripcion" className="mt-12">
      <TabsList>
        <TabsTrigger value="descripcion">Descripción</TabsTrigger>
        <TabsTrigger value="cuidados">Cuidados</TabsTrigger>
        <TabsTrigger value="envios">Envíos</TabsTrigger>
      </TabsList>
      <TabsContent value="descripcion" className="max-w-3xl space-y-3 pt-4 text-sm leading-relaxed text-muted-foreground">
        <p>{product.description}</p>
        <p className="flex items-center gap-2">
          <HandHeart className="size-4 text-primary" /> Hecho a mano en Buenos Aires. Cada pieza puede tener pequeñas
          diferencias: eso la hace única.
        </p>
      </TabsContent>
      <TabsContent value="cuidados" className="pt-4">
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {care.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </TabsContent>
      <TabsContent value="envios" className="grid gap-3 pt-4 sm:grid-cols-3">
        {[
          { icon: Truck, title: "Envíos a todo el país", text: "Gratis desde $60.000. Llega en 3 a 6 días hábiles." },
          { icon: Clock, title: "Personalizados", text: "Se producen en 5 a 15 días hábiles según el producto." },
          { icon: RotateCcw, title: "Cambios", text: "Tenés 30 días para cambiar productos sin personalizar." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-lg border p-4">
            <Icon className="size-5 text-primary" />
            <p className="mt-2 text-sm font-medium">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{text}</p>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  )
}
