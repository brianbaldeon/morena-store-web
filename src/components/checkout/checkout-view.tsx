"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Home, Lock, MapPin, Store } from "lucide-react"
import { toast } from "sonner"
import type { Address } from "@/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { EmptyState } from "@/components/shared/empty-state"
import { OrderSummary, computeShipping, type ShippingRules } from "@/components/cart/order-summary"
import { selectCartSubtotal, useCartStore } from "@/store/cart"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { api } from "@/lib/api-client"
import { checkoutSchema, PROVINCES, type CheckoutInput } from "@/lib/validations/checkout"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { CheckoutSteps } from "./checkout-steps"
import { MercadoPagoButton } from "./mercado-pago-button"

const STEP_FIELDS: (keyof CheckoutInput)[][] = [
  ["name", "email", "phone"],
  ["shippingMethod", "street", "number", "city", "province", "postalCode"],
  [],
]

export function CheckoutView({ addresses, rules }: { addresses: Address[]; rules: ShippingRules }) {
  const router = useRouter()
  const { user, ready } = useRequireAuth()
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore(selectCartSubtotal)
  const clearCart = useCartStore((s) => s.clear)
  const [step, setStep] = useState(0)
  const [redirecting, setRedirecting] = useState(false)

  const defaultAddress = addresses.find((a) => a.isDefault)
  const prefill = useMemo<CheckoutInput | undefined>(
    () =>
      user
        ? {
            name: user.name,
            email: user.email,
            phone: user.phone ?? "",
            shippingMethod: "DOMICILIO",
            street: defaultAddress?.street ?? "",
            number: defaultAddress?.number ?? "",
            apartment: defaultAddress?.apartment ?? "",
            city: defaultAddress?.city ?? "",
            province: defaultAddress?.province ?? "",
            postalCode: defaultAddress?.postalCode ?? "",
            notes: "",
          }
        : undefined,
    [user, defaultAddress],
  )
  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    values: prefill,
    resetOptions: { keepDirtyValues: true },
  })
  const shippingMethod = useWatch({
    control: form.control,
    name: "shippingMethod",
  })
  const values = useWatch({ control: form.control })

  if (!ready) return <Skeleton className="h-[480px] w-full" />

  if (items.length === 0 && !redirecting) {
    return (
      <EmptyState
        title="No hay nada para pagar"
        description="Tu carrito está vacío."
        action={
          <Button asChild>
            <Link href="/productos">Ver productos</Link>
          </Button>
        }
      />
    )
  }

  async function next() {
    const ok = await form.trigger(STEP_FIELDS[step])
    if (ok) setStep((s) => s + 1)
  }

  function applyAddress(address: Address) {
    const fields = ["street", "number", "city", "province", "postalCode"] as const
    fields.forEach((f) => form.setValue(f, address[f], { shouldValidate: true }))
    form.setValue("apartment", address.apartment ?? "")
  }

  async function onSubmit(data: CheckoutInput) {
    setRedirecting(true)
    try {
      const { redirectUrl } = await api.checkout.create({
        customer: data,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          size: i.size,
          color: i.color,
          hasCustomization: !!i.customization,
        })),
      })
      // Simulación de la pasarela: en la etapa 2 esto es window.location.href = init_point
      await new Promise((r) => setTimeout(r, 1200))
      clearCart()
      router.push(redirectUrl)
    } catch {
      setRedirecting(false)
      toast.error("No pudimos iniciar el pago. Probá de nuevo.")
    }
  }

  const shipping = computeShipping(subtotal, rules, shippingMethod)

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          // Enter en un paso intermedio avanza de paso; solo el último paso paga.
          if (step < 2) {
            event.preventDefault()
            next()
            return
          }
          form.handleSubmit(onSubmit)(event)
        }}
        className="grid gap-8 lg:grid-cols-[1fr_380px]"
        noValidate
      >
        <div className="space-y-6">
          <CheckoutSteps current={step} />

          {step === 0 && (
            <section className="space-y-4 rounded-lg border p-5">
              <h2 className="font-semibold">Datos de contacto</h2>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre y apellido</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono / WhatsApp</FormLabel>
                      <FormControl>
                        <Input type="tel" autoComplete="tel" placeholder="+54 9 11 ..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-5 rounded-lg border p-5">
              <h2 className="font-semibold">Envío</h2>
              <FormField
                control={form.control}
                name="shippingMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid gap-3 sm:grid-cols-2"
                      >
                        {[
                          {
                            value: "DOMICILIO",
                            icon: Home,
                            title: "Envío a domicilio",
                            text:
                              computeShipping(subtotal, rules, "DOMICILIO") === 0
                                ? "Gratis · 3 a 6 días hábiles"
                                : `${formatPrice(rules.shippingCost)} · 3 a 6 días hábiles`,
                          },
                          {
                            value: "RETIRO",
                            icon: Store,
                            title: "Retiro por el taller",
                            text: "Gratis · Palermo, CABA",
                          },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={cn(
                              "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                              field.value === option.value && "border-primary bg-primary/5",
                            )}
                          >
                            <RadioGroupItem value={option.value} className="mt-0.5" />
                            <option.icon className="text-primary size-5" />
                            <span>
                              <span className="block text-sm font-medium">{option.title}</span>
                              <span className="text-muted-foreground block text-xs">{option.text}</span>
                            </span>
                          </label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              {shippingMethod === "DOMICILIO" && (
                <>
                  {addresses.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {addresses.map((address) => (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => applyAddress(address)}
                          className="hover:border-primary hover:text-primary flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs"
                        >
                          <MapPin className="size-3.5" /> {address.label}: {address.street} {address.number}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-6">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-3">
                          <FormLabel>Calle</FormLabel>
                          <FormControl>
                            <Input autoComplete="address-line1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel>Altura</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="apartment"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Piso / Depto</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Ciudad</FormLabel>
                          <FormControl>
                            <Input autoComplete="address-level2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Código postal</FormLabel>
                          <FormControl>
                            <Input autoComplete="postal-code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas para la entrega (opcional)</FormLabel>
                    <FormControl>
                      <Textarea rows={2} placeholder="Ej: timbre roto, llamar al llegar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4 rounded-lg border p-5">
              <h2 className="font-semibold">Revisá tu pedido</h2>
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div className="bg-muted rounded-md p-3">
                  <dt className="text-muted-foreground text-xs">Contacto</dt>
                  <dd className="mt-1">
                    {values.name}
                    <br />
                    {values.email} · {values.phone}
                  </dd>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <dt className="text-muted-foreground text-xs">Envío</dt>
                  <dd className="mt-1">
                    {values.shippingMethod === "RETIRO"
                      ? "Retiro por el taller (Palermo, CABA)"
                      : `${values.street} ${values.number}${values.apartment ? `, ${values.apartment}` : ""}, ${values.city}, ${values.province} (${values.postalCode})`}
                  </dd>
                </div>
              </dl>
              <p className="text-muted-foreground flex items-start gap-2 text-xs">
                <Lock className="mt-0.5 size-3.5 shrink-0" />
                Al tocar &quot;Pagar con Mercado Pago&quot; te llevamos a su sitio para pagar con tarjeta, dinero en
                cuenta o efectivo. Volvés acá automáticamente.
              </p>
              <MercadoPagoButton loading={redirecting} />
            </section>
          )}

          <div className="flex items-center justify-between">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={redirecting}>
                <ArrowLeft /> Volver
              </Button>
            ) : (
              <Button type="button" variant="ghost" asChild>
                <Link href="/carrito">
                  <ArrowLeft /> Volver al carrito
                </Link>
              </Button>
            )}
            {step < 2 && (
              <Button type="button" onClick={next}>
                Continuar
              </Button>
            )}
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-lg border p-5 lg:sticky lg:top-32">
          <h2 className="font-semibold">Tu pedido</h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="bg-muted relative h-16 w-12 shrink-0 overflow-hidden rounded-md">
                  <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                  <span className="bg-foreground text-background absolute -top-0 -right-0 flex size-5 items-center justify-center rounded-bl-md text-[10px]">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{item.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {[item.size && `Talle ${item.size}`, item.color, item.customization && "Personalizado"]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <span className="text-sm">{formatPrice(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <OrderSummary subtotal={subtotal} {...rules} shippingMethod={step > 0 ? shippingMethod : null} />
          {step > 0 && shipping === 0 && shippingMethod === "DOMICILIO" && (
            <p className="text-primary text-xs">¡Tu pedido tiene envío gratis!</p>
          )}
        </aside>
      </form>
    </Form>
  )
}
