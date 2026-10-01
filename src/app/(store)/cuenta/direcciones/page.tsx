import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { AddressCard } from "@/components/account/address-card"
import { listAddresses } from "@/lib/services/account"

export const metadata: Metadata = { title: "Direcciones" }

export default async function AddressesPage() {
  const addresses = await listAddresses()
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Direcciones</h1>
          <p className="mt-1 text-sm text-muted-foreground">Las usamos para completar el checkout más rápido.</p>
        </div>
        <Button asChild>
          <Link href="/cuenta/direcciones/nueva">
            <Plus /> Nueva dirección
          </Link>
        </Button>
      </div>
      {addresses.length === 0 ? (
        <EmptyState title="No tenés direcciones guardadas" />
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}
    </div>
  )
}
