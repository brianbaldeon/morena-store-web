import Link from "next/link"
import { Camera, Mail, MessageCircle, Truck } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { Separator } from "@/components/ui/separator"
import { NAV_LINKS } from "./nav-links"

const HELP_LINKS = [
  { href: "/cuenta/pedidos", label: "Seguí tu pedido" },
  { href: "/personalizar", label: "Cómo personalizar" },
  { href: "/carrito", label: "Mi carrito" },
  { href: "/favoritos", label: "Favoritos" },
]

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Muñecos, llaveros, remeras y buzos hechos a mano en Buenos Aires. Cada pieza es única, como vos.
          </p>
          <div className="flex gap-2">
            <a href="#" aria-label="Instagram" className="flex size-9 items-center justify-center rounded-lg border bg-background hover:text-primary">
              <Camera className="size-4" />
            </a>
            <a href="#" aria-label="WhatsApp" className="flex size-9 items-center justify-center rounded-lg border bg-background hover:text-primary">
              <MessageCircle className="size-4" />
            </a>
            <a href="#" aria-label="Email" className="flex size-9 items-center justify-center rounded-lg border bg-background hover:text-primary">
              <Mail className="size-4" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Tienda</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Ayuda</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {HELP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Envíos y pagos</h3>
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Truck className="mt-0.5 size-4 shrink-0 text-primary" />
            Envíos a todo el país. Gratis desde $60.000.
          </p>
          <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
            <span className="size-2 rounded-full bg-mercadopago" aria-hidden />
            Pagás con <strong className="font-semibold">Mercado Pago</strong>
          </div>
        </div>
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:justify-between lg:px-6">
        <p>© 2026 Store Morena. Hecho a mano con amor.</p>
        <p>Precios en pesos argentinos (ARS).</p>
      </div>
    </footer>
  )
}
