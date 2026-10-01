"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { CustomOrder } from "@/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api-client"
import { CUSTOM_ORDER_STATUSES } from "@/lib/constants"
import { customOrderUpdateSchema, type CustomOrderUpdateInput } from "@/lib/validations/admin"
import { cn } from "@/lib/utils"

export function CustomOrderForm({ order }: { order: CustomOrder }) {
  const router = useRouter()
  const form = useForm<CustomOrderUpdateInput>({
    resolver: zodResolver(customOrderUpdateSchema),
    defaultValues: { status: order.status, designPreview: order.designPreview ?? "", internalNote: "" },
  })

  async function onSubmit(values: CustomOrderUpdateInput) {
    try {
      await api.customOrders.update(order.id, values)
      toast.success("Pedido personalizado actualizado")
      form.reset(values)
      router.refresh()
    } catch {
      toast.error("No pudimos guardar los cambios")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etapa</FormLabel>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-1.5">
                  {CUSTOM_ORDER_STATUSES.map((s, i) => (
                    <label
                      key={s.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm",
                        field.value === s.value && "border-primary bg-primary/5 font-medium",
                      )}
                    >
                      <RadioGroupItem value={s.value} />
                      <span className="text-xs text-muted-foreground">{i + 1}.</span> {s.label}
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="designPreview"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL del diseño para aprobar</FormLabel>
              <FormControl>
                <Input placeholder="/products/... o https://..." {...field} />
              </FormControl>
              <FormDescription>Al pasar a &quot;Aprobación&quot;, el cliente lo ve en su pedido.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="internalNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nota interna</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Solo la ve el equipo" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />} Guardar cambios
        </Button>
      </form>
    </Form>
  )
}
