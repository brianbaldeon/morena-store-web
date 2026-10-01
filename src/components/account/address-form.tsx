"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Address } from "@/types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api-client"
import { addressSchema, PROVINCES, type AddressInput } from "@/lib/validations/checkout"

/** Formulario de página dedicada (alta y edición). Sin modales. */
export function AddressForm({ address }: { address?: Address }) {
  const router = useRouter()
  const form = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: address
      ? { ...address, apartment: address.apartment ?? "" }
      : {
          label: "",
          recipient: "",
          street: "",
          number: "",
          apartment: "",
          city: "",
          province: "",
          postalCode: "",
          phone: "",
          isDefault: false,
        },
  })

  async function onSubmit(values: AddressInput) {
    try {
      if (address) await api.account.updateAddress(address.id, values)
      else await api.account.createAddress(values)
      toast.success(address ? "Dirección actualizada" : "Dirección agregada")
      router.push("/cuenta/direcciones")
      router.refresh()
    } catch {
      toast.error("No pudimos guardar la dirección")
    }
  }

  const text = (name: keyof AddressInput, label: string, className?: string, autoComplete?: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input autoComplete={autoComplete} {...field} value={(field.value as string) ?? ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 rounded-lg border p-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          {text("label", "Nombre de la dirección (ej: Casa)")}
          {text("recipient", "Quién recibe", undefined, "name")}
        </div>
        <div className="grid gap-4 sm:grid-cols-6">
          {text("street", "Calle", "sm:col-span-3", "address-line1")}
          {text("number", "Altura", "sm:col-span-1")}
          {text("apartment", "Piso / Depto", "sm:col-span-2")}
          {text("city", "Ciudad", "sm:col-span-2", "address-level2")}
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Provincia</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Elegí" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {text("postalCode", "Código postal", "sm:col-span-2", "postal-code")}
        </div>
        {text("phone", "Teléfono de contacto", "sm:max-w-xs", "tel")}
        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
              </FormControl>
              <FormLabel className="font-normal">Usar como dirección principal</FormLabel>
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
            {address ? "Guardar cambios" : "Agregar dirección"}
          </Button>
          <Button type="button" variant="ghost" asChild>
            <Link href="/cuenta/direcciones">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
