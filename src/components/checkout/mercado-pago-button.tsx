import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Botón de pago. Etapa 1: dispara la simulación. Etapa 2: redirige al init_point de Checkout Pro. */
export function MercadoPagoButton({ loading, className }: { loading?: boolean; className?: string }) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={loading}
      className={cn("h-12 w-full bg-mercadopago text-base text-white hover:bg-mercadopago/90", className)}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" /> Redirigiendo a Mercado Pago…
        </>
      ) : (
        <>Pagar con Mercado Pago</>
      )}
    </Button>
  )
}
