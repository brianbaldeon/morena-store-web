import Link from "next/link"
import { CircleCheck, CircleX, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LuckyCat } from "@/components/brand/lucky-cat"
import { cn } from "@/lib/utils"

const VARIANTS = {
  success: {
    icon: CircleCheck,
    tone: "text-primary bg-primary/10",
    title: "¡Gracias por tu compra!",
    text: "Mercado Pago aprobó el pago. Te mandamos un email con el detalle. Si pediste un personalizado, en 48 h te enviamos el diseño para aprobar.",
  },
  pending: {
    icon: Clock,
    tone: "text-warning bg-warning/10",
    title: "Tu pago está pendiente",
    text: "Mercado Pago todavía está procesando el pago (por ejemplo, si elegiste pagar en efectivo). Te avisamos por email apenas se acredite.",
  },
  error: {
    icon: CircleX,
    tone: "text-destructive bg-destructive/10",
    title: "No se pudo completar el pago",
    text: "Mercado Pago rechazó el pago o lo cancelaste. No se te cobró nada. Podés intentarlo de nuevo con otro medio.",
  },
} as const

export function PaymentResult({ variant, orderNumber }: { variant: keyof typeof VARIANTS; orderNumber?: string }) {
  const { icon: Icon, tone, title, text } = VARIANTS[variant]
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-12 text-center">
      <div className="relative mb-6">
        <div className="size-28">
          <LuckyCat variant={variant === "success" ? "coral" : "cream"} />
        </div>
        <span className={cn("absolute -right-2 -bottom-1 flex size-10 items-center justify-center rounded-full", tone)}>
          <Icon className="size-6" />
        </span>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {orderNumber && (
        <p className="mt-2 text-sm">
          Pedido <span className="font-semibold">#{orderNumber}</span>
        </p>
      )}
      <p className="mt-3 text-muted-foreground">{text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {variant === "error" ? (
          <Button asChild>
            <Link href="/carrito">Volver al carrito</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href={orderNumber ? `/cuenta/pedidos/${orderNumber}` : "/cuenta/pedidos"}>Ver mi pedido</Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/productos">Seguir comprando</Link>
        </Button>
      </div>
    </div>
  )
}
