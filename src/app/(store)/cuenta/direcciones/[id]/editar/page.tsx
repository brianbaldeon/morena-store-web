import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AddressForm } from "@/components/account/address-form"
import { getAddress } from "@/lib/services/account"

export const metadata: Metadata = { title: "Editar dirección" }

export default async function EditAddressPage(props: PageProps<"/cuenta/direcciones/[id]/editar">) {
  const { id } = await props.params
  const address = await getAddress(id)
  if (!address) notFound()

  return (
    <div className="space-y-6">
      <Link href="/cuenta/direcciones" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="size-4" /> Direcciones
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Editar &quot;{address.label}&quot;</h1>
      <AddressForm address={address} />
    </div>
  )
}
