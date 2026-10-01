"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import type { CustomOrder } from "@/types"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"
import { CustomStatusBadge } from "./order-status-badge"

/** El cliente aprueba el diseño de su personalizado antes de que pase a producción. */
export function DesignApprovalCard({ customOrder }: { customOrder: CustomOrder }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const awaiting = customOrder.status === "APROBACION" && customOrder.designPreview

  async function approve() {
    setLoading(true)
    try {
      await api.customOrders.update(customOrder.id, { status: "PRODUCCION" })
      toast.success("¡Diseño aprobado! Ya lo empezamos a producir.")
      router.refresh()
    } catch {
      toast.error("No pudimos registrar la aprobación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold">{customOrder.title}</h2>
        <CustomStatusBadge status={customOrder.status} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <figure>
          <div className="relative aspect-3/4 overflow-hidden rounded-md bg-muted">
            <Image src={customOrder.photos[0]} alt="Tu foto" fill sizes="200px" className="object-cover" />
          </div>
          <figcaption className="mt-1 text-xs text-muted-foreground">Tu foto</figcaption>
        </figure>
        <figure>
          <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-md bg-muted">
            {customOrder.designPreview ? (
              <Image src={customOrder.designPreview} alt="Diseño propuesto" fill sizes="200px" className="object-cover" />
            ) : (
              <p className="px-3 text-center text-xs text-muted-foreground">Estamos preparando tu diseño</p>
            )}
          </div>
          <figcaption className="mt-1 text-xs text-muted-foreground">Diseño propuesto</figcaption>
        </figure>
      </div>
      <p className="text-xs text-muted-foreground">{Object.values(customOrder.options).join(" · ")}</p>
      {awaiting ? (
        <div className="flex flex-wrap gap-2">
          <Button onClick={approve} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Aprobar diseño
          </Button>
          <Button variant="outline" onClick={() => toast.info("Te contactamos por WhatsApp para ajustar el diseño.")}>
            <MessageSquare /> Pedir cambios
          </Button>
        </div>
      ) : null}
    </div>
  )
}
