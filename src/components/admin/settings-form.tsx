"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { StoreSettings } from "@/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api-client"
import { settingsSchema, type SettingsInput } from "@/lib/validations/admin"

type TextKey = "storeName" | "email" | "phone" | "instagram"
type NumberKey = "shippingCost" | "freeShippingFrom" | "productionDays"

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const form = useForm<SettingsInput>({ resolver: zodResolver(settingsSchema), defaultValues: settings })

  async function onSubmit(values: SettingsInput) {
    try {
      await api.settings.update(values)
      toast.success("Ajustes guardados")
      form.reset(values)
    } catch {
      toast.error("No pudimos guardar los ajustes")
    }
  }

  const text = (name: TextKey, label: string, type = "text") => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const number = (name: NumberKey, label: string, description?: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={0}
              value={Number.isNaN(field.value) ? "" : field.value}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-6" noValidate>
        <section className="space-y-4 rounded-lg border p-5">
          <h2 className="font-semibold">Datos de la tienda</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {text("storeName", "Nombre")}
            {text("email", "Email de contacto", "email")}
            {text("phone", "WhatsApp", "tel")}
            {text("instagram", "Instagram")}
          </div>
        </section>
        <section className="space-y-4 rounded-lg border p-5">
          <h2 className="font-semibold">Envíos y producción</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {number("shippingCost", "Costo de envío (ARS)")}
            {number("freeShippingFrom", "Envío gratis desde (ARS)", "Se muestra la barra de progreso en el carrito.")}
            {number("productionDays", "Días de producción", "Para personalizados.")}
          </div>
        </section>
        <section className="space-y-2 rounded-lg border p-5">
          <h2 className="font-semibold">Mercado Pago</h2>
          <p className="text-sm text-muted-foreground">
            La conexión con Checkout Pro (access token, webhooks y URLs de retorno a /checkout/exito, /pendiente y /error)
            se configura en la etapa 2 desde variables de entorno.
          </p>
        </section>
        <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />} Guardar ajustes
        </Button>
      </form>
    </Form>
  )
}
