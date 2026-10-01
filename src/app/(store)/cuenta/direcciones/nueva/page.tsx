import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AddressForm } from "@/components/account/address-form"

export const metadata: Metadata = { title: "Nueva dirección" }

export default function NewAddressPage() {
  return (
    <div className="space-y-6">
      <Link href="/cuenta/direcciones" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="size-4" /> Direcciones
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Nueva dirección</h1>
      <AddressForm />
    </div>
  )
}
