"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, Pencil } from "lucide-react"
import { toast } from "sonner"
import type { Address } from "@/types"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"
import { api } from "@/lib/api-client"

export function AddressCard({ address }: { address: Address }) {
  const router = useRouter()

  async function remove() {
    await api.account.removeAddress(address.id)
    toast.success("Dirección eliminada")
    router.refresh()
  }

  return (
    <div className="flex gap-4 rounded-lg border p-4">
      <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1 text-sm">
        <p className="flex items-center gap-2 font-medium">
          {address.label}
          {address.isDefault && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Principal</span>
          )}
        </p>
        <p className="mt-1 text-muted-foreground">
          {address.street} {address.number}
          {address.apartment && `, ${address.apartment}`} · {address.city}, {address.province} ({address.postalCode})
        </p>
        <p className="text-muted-foreground">
          {address.recipient} · {address.phone}
        </p>
      </div>
      <div className="flex shrink-0 items-start gap-1">
        <Button variant="ghost" size="icon" asChild aria-label={`Editar ${address.label}`}>
          <Link href={`/cuenta/direcciones/${address.id}/editar`}>
            <Pencil />
          </Link>
        </Button>
        <ConfirmDeleteDialog
          title="¿Eliminar dirección?"
          description={`Vas a eliminar "${address.label}". Esta acción no se puede deshacer.`}
          onConfirm={remove}
        />
      </div>
    </div>
  )
}
