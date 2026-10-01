"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Clock, ShieldCheck, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import type { ProductWithRelations } from "@/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { QuantityStepper } from "@/components/shared/quantity-stepper"
import { useCartStore } from "@/store/cart"
import { type CustomizerConfig, estimateCustomPrice } from "@/lib/constants"
import { buildCustomizerSchema, type CustomizerInput } from "@/lib/validations/customizer"
import { formatPrice } from "@/lib/format"
import { StepCard } from "./step-card"
import { PhotoDropzone } from "./photo-dropzone"
import { OptionChips } from "./option-chips"
import { PrintMockup } from "./print-mockup"
import { PhotoPreview } from "./photo-preview"

type Step = 1 | 2 | 3

export function CustomizerForm({ config, product }: { config: CustomizerConfig; product: ProductWithRelations | null }) {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.open)
  const [openStep, setOpenStep] = useState<Step | null>(1)

  const schema = useMemo(() => buildCustomizerSchema(config), [config])
  const form = useForm<CustomizerInput>({
    resolver: zodResolver(schema),
    defaultValues: { photos: [], options: {}, notes: "", quantity: 1 },
  })

  const photos = useWatch({ control: form.control, name: "photos" })
  const options = useWatch({ control: form.control, name: "options" })
  const quantity = useWatch({ control: form.control, name: "quantity" })
  const { errors } = form.formState

  const unitPrice = estimateCustomPrice(config, options ?? {})
  const optionsComplete = config.optionGroups.every((g) => options?.[g.key])

  function onSubmit(values: CustomizerInput) {
    addItem({
      productId: product?.id ?? `custom-${config.type}`,
      slug: product?.slug ?? config.productSlug,
      name: config.title,
      image: product?.images[0] ?? config.image,
      unitPrice,
      maxStock: 10,
      size: values.options.talle ?? null,
      color: values.options.color ?? null,
      quantity: values.quantity,
      customization: { type: config.type, photos: values.photos, options: values.options, notes: values.notes },
    })
    toast.success("¡Personalizado agregado al carrito!", { description: "Lo vas a poder revisar antes de pagar." })
    openCart()
    router.push("/carrito")
  }

  function onInvalid() {
    if (form.formState.errors.photos) setOpenStep(1)
    else if (form.formState.errors.options) setOpenStep(2)
    toast.error("Te falta completar algunos pasos")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-3">
          <StepCard
            number={1}
            title="Subí tus fotos"
            description={photos.length ? `${photos.length} foto(s) cargadas` : config.photoHint}
            open={openStep === 1}
            complete={photos.length > 0}
            hasError={!!errors.photos}
            onOpenChange={(o) => setOpenStep(o ? 1 : null)}
          >
            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <FormItem>
                  <PhotoDropzone
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      if (value.length > photos.length && !optionsComplete) setOpenStep(2)
                    }}
                    maxPhotos={config.maxPhotos}
                    hint={config.photoHint}
                    invalid={!!errors.photos}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </StepCard>

          <StepCard
            number={2}
            title="Elegí los detalles"
            description={
              optionsComplete ? Object.values(options).join(" · ") : `${config.optionGroups.length} opciones para elegir`
            }
            open={openStep === 2}
            complete={optionsComplete}
            hasError={!!errors.options}
            onOpenChange={(o) => setOpenStep(o ? 2 : null)}
          >
            <div className="space-y-5">
              {config.optionGroups.map((group) => (
                <FormField
                  key={group.key}
                  control={form.control}
                  name={`options.${group.key}`}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{group.label}</FormLabel>
                      <FormControl>
                        <OptionChips
                          label={group.label}
                          options={group.options}
                          value={field.value}
                          onChange={field.onChange}
                          invalid={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setOpenStep(3)}>
                Siguiente paso
              </Button>
            </div>
          </StepCard>

          <StepCard
            number={3}
            title="Contanos lo que quieras"
            description="Detalles, nombres, fechas, colores…"
            open={openStep === 3}
            complete={!!form.getValues("notes")}
            onOpenChange={(o) => setOpenStep(o ? 3 : null)}
          >
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas para el taller (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Ej: que tenga el lunar en la mejilla, la camiseta de Boca y la frase 'Feliz cumple, pa'."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <QuantityStepper value={field.value} onChange={field.onChange} max={10} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </StepCard>
        </div>

        <aside className="h-fit space-y-5 rounded-lg border p-5 lg:sticky lg:top-32">
          {config.hasPrintPreview ? (
            <PrintMockup
              garment={config.type === "buzo" ? "buzo" : "remera"}
              color={options?.color}
              placement={options?.ubicacion}
              size={options?.tamano}
              image={photos[0]}
            />
          ) : (
            <PhotoPreview photo={photos[0]} example={config.image} />
          )}
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio estimado</span>
              <span className="font-semibold text-primary">{formatPrice(unitPrice)}</span>
            </div>
            {quantity > 1 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total x{quantity}</span>
                <span className="font-semibold">{formatPrice(unitPrice * quantity)}</span>
              </div>
            )}
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" /> Producción: {config.productionDays}
            </p>
          </div>
          <Button type="submit" size="lg" className="w-full">
            <ShoppingCart /> Agregar al carrito
          </Button>
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            No producimos nada hasta que apruebes el diseño. Si no te gusta, lo ajustamos.
          </p>
        </aside>
      </form>
    </Form>
  )
}
