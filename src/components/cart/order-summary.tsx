import { Truck } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/format"

export interface ShippingRules {
  shippingCost: number
  freeShippingFrom: number
}

interface OrderSummaryProps extends ShippingRules {
  subtotal: number
  /** null = todavía no se eligió método de envío. */
  shippingMethod?: "DOMICILIO" | "RETIRO" | null
  children?: React.ReactNode
}

export function computeShipping(subtotal: number, rules: ShippingRules, method: "DOMICILIO" | "RETIRO" | null = "DOMICILIO") {
  if (method === "RETIRO" || subtotal >= rules.freeShippingFrom) return 0
  return rules.shippingCost
}

export function OrderSummary({ subtotal, shippingCost, freeShippingFrom, shippingMethod = null, children }: OrderSummaryProps) {
  const shipping = computeShipping(subtotal, { shippingCost, freeShippingFrom }, shippingMethod ?? "DOMICILIO")
  const missing = freeShippingFrom - subtotal
  const total = subtotal + (shippingMethod ? shipping : 0)

  return (
    <div className="space-y-4">
      {shippingMethod !== "RETIRO" && (
        <div className="space-y-2 rounded-lg bg-muted p-3">
          <p className="flex items-center gap-2 text-xs">
            <Truck className="size-4 text-primary" />
            {missing > 0 ? (
              <span>
                Te faltan <strong>{formatPrice(missing)}</strong> para el envío gratis
              </span>
            ) : (
              <span className="font-medium">¡Tenés envío gratis!</span>
            )}
          </p>
          <Progress value={Math.min(100, (subtotal / freeShippingFrom) * 100)} className="h-1.5" />
        </div>
      )}
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Envío</dt>
          <dd>
            {shippingMethod === null
              ? "Se calcula en el checkout"
              : shipping === 0
                ? <span className="font-medium text-primary">Gratis</span>
                : formatPrice(shipping)}
          </dd>
        </div>
        <Separator />
        <div className="flex justify-between text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  )
}
