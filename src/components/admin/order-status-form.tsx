"use client"

import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Order } from "@/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api-client"
import { ORDER_STATUS_LABELS } from "@/lib/constants"
import { orderStatusSchema, type OrderStatusInput } from "@/lib/validations/admin"

export function OrderStatusForm({ order }: { order: Order }) {
  const router = useRouter()
  const form = useForm<OrderStatusInput>({
    resolver: zodResolver(orderStatusSchema),
    defaultValues: { status: order.status, trackingNumber: order.trackingNumber ?? "" },
  })
  const status = useWatch({ control: form.control, name: "status" })

  async function onSubmit(values: OrderStatusInput) {
    try {
      await api.orders.updateStatus(order.id, values)
      toast.success("Estado actualizado", { description: "Le avisamos al cliente por email (etapa 2)." })
      form.reset(values)
      router.refresh()
    } catch {
      toast.error("No pudimos actualizar el pedido")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado del pedido</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {(status === "ENVIADO" || status === "ENTREGADO") && order.shippingMethod === "DOMICILIO" && (
          <FormField
            control={form.control}
            name="trackingNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de seguimiento</FormLabel>
                <FormControl>
                  <Input placeholder="AR123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />} Guardar
        </Button>
      </form>
    </Form>
  )
}
