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
import { cn } from "@/lib/utils"
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
  // El estampado va atado al lado elegido, así que esa opción se contesta antes de subir fotos (Paso 1).
  const detailGroups = config.optionGroups.filter((g) => !(config.hasPrintPreview && g.key === "ubicacion"))
  const ubicacion = options?.ubicacion
  const bothSides = ubicacion === "Frente y espalda"
  const photosUploaded = photos.filter(Boolean)
  const photosStepComplete = config.hasPrintPreview
    ? bothSides
      ? !!photos[0] && !!photos[1]
      : !!photos[0]
    : photosUploaded.length > 0

  function setPhotoSlot(index: 0 | 1, value: string | undefined) {
    const next: [string, string] = [photos[0] ?? "", photos[1] ?? ""]
    next[index] = value ?? ""
    form.setValue("photos", next.filter((v, i) => v || i === 0), { shouldValidate: true })
  }

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
      customization: {
        type: config.type,
        photos: values.photos.filter(Boolean),
        options: values.options,
        notes: values.notes,
      },
    })
    toast.success("¡Personalizado agregado al carrito!", { description: "Lo vas a poder revisar antes de pagar." })
    openCart()
    router.push("/carrito")
  }

  function onInvalid() {
    const optionErrors = form.formState.errors.options
    // Foto y ubicación viven en el Paso 1; el resto de las opciones, en el Paso 2.
    if (form.formState.errors.photos || optionErrors?.ubicacion) setOpenStep(1)
    else if (optionErrors) setOpenStep(2)
    toast.error("Te falta completar algunos pasos")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-3">
          <StepCard
            number={1}
            title={config.hasPrintPreview ? "Ubicación y fotos" : "Subí tus fotos"}
            description={
              config.hasPrintPreview
                ? ubicacion
                  ? `${photosUploaded.length} de ${bothSides ? 2 : 1} foto(s) cargadas`
                  : "Elegí dónde va el estampado"
                : photosUploaded.length
                  ? `${photosUploaded.length} foto(s) cargadas`
                  : config.photoHint
            }
            open={openStep === 1}
            complete={photosStepComplete}
            hasError={!!errors.photos || !!errors.options?.ubicacion}
            onOpenChange={(o) => setOpenStep(o ? 1 : null)}
          >
            {config.hasPrintPreview ? (
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="options.ubicacion"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>¿Dónde va el estampado?</FormLabel>
                      <FormControl>
                        <OptionChips
                          label="Ubicación del estampado"
                          options={config.optionGroups.find((g) => g.key === "ubicacion")?.options ?? []}
                          value={field.value}
                          onChange={field.onChange}
                          invalid={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!ubicacion ? (
                  <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                    Elegí primero dónde va el estampado para subir la foto que corresponde a cada lado.
                  </p>
                ) : (
                  <FormField
                    control={form.control}
                    name="photos"
                    render={() => (
                      <FormItem>
                        <div className={cn("grid gap-4", bothSides && "sm:grid-cols-2")}>
                          <div className="space-y-1.5">
                            <FormLabel>{ubicacion === "Espalda" ? "Foto para la espalda" : "Foto para el frente"}</FormLabel>
                            <PhotoDropzone
                              value={photos[0] ? [photos[0]] : []}
                              onChange={(value) => {
                                setPhotoSlot(0, value[0])
                                if (value[0] && !optionsComplete) setOpenStep(2)
                              }}
                              maxPhotos={1}
                              hint={config.photoHint}
                              invalid={!!errors.photos}
                            />
                          </div>
                          {bothSides && (
                            <div className="space-y-1.5">
                              <FormLabel>Foto para la espalda</FormLabel>
                              <PhotoDropzone
                                value={photos[1] ? [photos[1]] : []}
                                onChange={(value) => {
                                  setPhotoSlot(1, value[0])
                                  if (value[0] && !optionsComplete) setOpenStep(2)
                                }}
                                maxPhotos={1}
                                hint={config.photoHint}
                                invalid={!!errors.photos}
                              />
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ) : (
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
            )}
          </StepCard>

          <StepCard
            number={2}
            title="Elegí los detalles"
            description={
              optionsComplete
                ? detailGroups.map((g) => options?.[g.key]).join(" · ")
                : `${detailGroups.length} opciones para elegir`
            }
            open={openStep === 2}
            complete={detailGroups.every((g) => options?.[g.key])}
            hasError={detailGroups.some((g) => !!errors.options?.[g.key])}
            onOpenChange={(o) => setOpenStep(o ? 2 : null)}
          >
            <div className="space-y-5">
              {detailGroups.map((group) => (
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  const valid = await form.trigger("options")
                  if (valid) setOpenStep(3)
                  else if (form.formState.errors.options?.ubicacion) {
                    setOpenStep(1)
                    toast.error("Te falta elegir dónde va el estampado")
                  } else toast.error("Te falta elegir alguna opción")
                }}
              >
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
                    {options?.tamano === "Personalizado" && (
                      <p className="-mt-1 text-xs text-amber-600">
                        Elegiste un tamaño personalizado: contanos acá el ancho x alto en cm que necesitás. El máximo
                        que podemos estampar es 50x70 cm, así que tiene que ser igual o menor a esa medida.
                      </p>
                    )}
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
              frontImage={photos[0] || undefined}
              backImage={(bothSides ? photos[1] : photos[0]) || undefined}
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
