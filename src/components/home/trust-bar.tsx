import { CreditCard, HandHeart, Sparkles, Truck } from "lucide-react"

const ITEMS = [
  { icon: HandHeart, title: "Hecho a mano", text: "Cada pieza es única" },
  { icon: Sparkles, title: "Personalizable", text: "Con tus fotos o diseños" },
  { icon: Truck, title: "Envíos a todo el país", text: "Gratis desde $60.000" },
  { icon: CreditCard, title: "Mercado Pago", text: "Hasta 3 cuotas sin interés" },
]

export function TrustBar() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border lg:grid-cols-4">
      {ITEMS.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex items-center gap-3 bg-background p-4">
          <Icon className="size-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
