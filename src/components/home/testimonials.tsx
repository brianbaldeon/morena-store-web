import { Star } from "lucide-react"

const TESTIMONIALS = [
  { name: "Lucía F.", city: "CABA", text: "Le regalé a mi novio un muñeco de él mismo y lloró. Quedó igualito, hasta el lunar." },
  { name: "Tomás R.", city: "Córdoba", text: "La remera de Diego es de muy buena calidad, el estampado no se cuarteó con los lavados." },
  { name: "Camila S.", city: "Rosario", text: "El almohadón de mi gata es lo más. Me mandaron el diseño antes para aprobar. ¡Súper atentas!" },
]

export function Testimonials() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TESTIMONIALS.map((t) => (
        <figure key={t.name} className="rounded-lg border p-6">
          <div className="flex gap-0.5 text-primary" aria-label="5 de 5 estrellas">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="size-4 fill-current" />
            ))}
          </div>
          <blockquote className="mt-3 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</blockquote>
          <figcaption className="mt-4 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{t.name}</span> · {t.city}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
