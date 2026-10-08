"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Brand, Category, ProductWithRelations } from "@/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ProductCard } from "@/components/product/product-card"
import { api } from "@/lib/api-client"
import { COLORS, PRODUCT_TYPE_LABELS, SIZES } from "@/lib/constants"
import { productSchema, type ProductInput } from "@/lib/validations/admin"
import { slugify } from "@/lib/utils"
import { ImageUploader } from "./image-uploader"

const NONE = "__none__"

function toInput(product?: ProductWithRelations): ProductInput {
  if (!product) {
    return {
      name: "",
      description: "",
      price: 0,
      compareAtPrice: null,
      categoryId: "",
      brandId: "",
      productType: "MUNECO",
      images: [],
      stock: 0,
      variants: [],
      isNew: true,
      isFeatured: false,
      isCustomizable: false,
    }
  }
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    categoryId: product.categoryId,
    brandId: product.brandId ?? "",
    productType: product.productType,
    images: product.images,
    stock: product.stock,
    variants: product.variants.map((v) => ({ sku: v.sku, size: v.size ?? "", color: v.color ?? "", stock: v.stock })),
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    isCustomizable: product.isCustomizable,
  }
}

const numberInput = (onChange: (v: number | null) => void, nullable = false) => (e: React.ChangeEvent<HTMLInputElement>) =>
  onChange(e.target.value === "" && nullable ? null : e.target.valueAsNumber)

/** Formulario de página dedicada (alta y edición de productos). Sin modales. */
export function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: ProductWithRelations
  categories: Category[]
  brands: Brand[]
}) {
  const router = useRouter()
  const form = useForm<ProductInput>({ resolver: zodResolver(productSchema), defaultValues: toInput(product) })
  const variants = useFieldArray({ control: form.control, name: "variants" })
  const values = useWatch({ control: form.control }) as ProductInput

  async function onSubmit(input: ProductInput) {
    try {
      if (product) await api.products.update(product.id, input)
      else await api.products.create(input)
      toast.success(product ? "Producto actualizado" : "Producto creado")
      router.push("/admin/productos")
      router.refresh()
    } catch {
      toast.error("No pudimos guardar el producto")
    }
  }

  const category = categories.find((c) => c.id === values.categoryId) ?? categories[0]
  const preview: ProductWithRelations = {
    id: product?.id ?? "preview",
    slug: product?.slug ?? slugify(values.name || "nuevo"),
    name: values.name || "Nombre del producto",
    description: values.description,
    price: Number.isFinite(values.price) ? values.price : 0,
    compareAtPrice: values.compareAtPrice ?? null,
    images: values.images?.length ? values.images : ["/products/peluches/peluche-michael-jackson-coleccion-01.jpeg"],
    categoryId: values.categoryId,
    brandId: values.brandId || null,
    productType: values.productType,
    sizes: [],
    colors: [],
    variants: [],
    stock: values.variants?.length ? values.variants.reduce((acc, v) => acc + (v.stock || 0), 0) : values.stock,
    isNew: values.isNew,
    isFeatured: values.isFeatured,
    isCustomizable: values.isCustomizable,
    rating: 5,
    sales: 0,
    createdAt: "",
    category,
    brand: brands.find((b) => b.id === values.brandId) ?? null,
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-[1fr_300px]" noValidate>
        <div className="space-y-6">
          <section className="space-y-4 rounded-lg border p-5">
            <h2 className="font-semibold">Información</h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Muñeco Rodrigo “El Potro”" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => (
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
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Elegí" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
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
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artista / Personaje</FormLabel>
                    <Select value={field.value || NONE} onValueChange={(v) => field.onChange(v === NONE ? "" : v)}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE}>Sin artista</SelectItem>
                        {brands.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border p-5">
            <h2 className="font-semibold">Imágenes</h2>
            <FormField
              control={form.control}
              name="images"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ImageUploader value={field.value} onChange={field.onChange} invalid={!!fieldState.error} />
                  <FormDescription>La primera imagen es la portada de la card.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-4 rounded-lg border p-5">
            <h2 className="font-semibold">Precio</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (ARS)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={100} value={Number.isNaN(field.value) ? "" : field.value} onChange={numberInput(field.onChange)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="compareAtPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio anterior (opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={100} value={field.value ?? ""} onChange={numberInput(field.onChange, true)} />
                    </FormControl>
                    <FormDescription>Si es mayor al precio, se muestra el % de descuento.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Variantes y stock</h2>
                <p className="text-xs text-muted-foreground">Agregá filas por talle y color. Sin variantes, se usa el stock general.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  variants.append({ sku: `${slugify(values.name || "sku").toUpperCase()}-${variants.fields.length + 1}`, size: "", color: "", stock: 0 })
                }
              >
                <Plus /> Agregar variante
              </Button>
            </div>

            {variants.fields.length === 0 ? (
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className="max-w-40">
                    <FormLabel>Stock general</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} value={Number.isNaN(field.value) ? "" : field.value} onChange={numberInput(field.onChange)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="space-y-2">
                <div className="hidden grid-cols-[1fr_100px_140px_90px_36px] gap-2 text-xs text-muted-foreground sm:grid">
                  <span>SKU</span>
                  <span>Talle</span>
                  <span>Color</span>
                  <span>Stock</span>
                  <span />
                </div>
                {variants.fields.map((row, index) => (
                  <div key={row.id} className="grid grid-cols-2 gap-2 rounded-md border p-2 sm:grid-cols-[1fr_100px_140px_90px_36px] sm:border-0 sm:p-0">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.sku`}
                      render={({ field }) => (
                        <FormItem className="col-span-2 sm:col-span-1">
                          <FormControl>
                            <Input aria-label="SKU" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variants.${index}.size`}
                      render={({ field }) => (
                        <FormItem>
                          <Select value={field.value || NONE} onValueChange={(v) => field.onChange(v === NONE ? "" : v)}>
                            <FormControl>
                              <SelectTrigger className="w-full" aria-label="Talle">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={NONE}>—</SelectItem>
                              {SIZES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variants.${index}.color`}
                      render={({ field }) => (
                        <FormItem>
                          <Select value={field.value || NONE} onValueChange={(v) => field.onChange(v === NONE ? "" : v)}>
                            <FormControl>
                              <SelectTrigger className="w-full" aria-label="Color">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={NONE}>—</SelectItem>
                              {COLORS.map((c) => (
                                <SelectItem key={c.name} value={c.name}>
                                  <span className="size-3 rounded-full border" style={{ backgroundColor: c.hex }} /> {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variants.${index}.stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" min={0} aria-label="Stock" value={Number.isNaN(field.value) ? "" : field.value} onChange={numberInput(field.onChange)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => variants.remove(index)}
                      aria-label="Quitar variante"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="space-y-4 rounded-lg border p-5">
            <h2 className="font-semibold">Visibilidad</h2>
            {(
              [
                { name: "isNew", label: "Nuevo", hint: "Muestra el badge \"• Nuevo\"" },
                { name: "isFeatured", label: "Destacado", hint: "Aparece en \"Los más elegidos\"" },
                { name: "isCustomizable", label: "Personalizable", hint: "Ofrece el personalizador" },
              ] as const
            ).map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between gap-3">
                    <div>
                      <FormLabel>{item.label}</FormLabel>
                      <FormDescription className="text-xs">{item.hint}</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </section>

          <section className="rounded-lg border p-5">
            <h2 className="mb-4 font-semibold">Vista previa</h2>
            <div className="pointer-events-none mx-auto max-w-56">
              <ProductCard product={preview} />
            </div>
          </section>

          <div className="flex flex-col gap-2">
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              {product ? "Guardar cambios" : "Crear producto"}
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link href="/admin/productos">Cancelar</Link>
            </Button>
          </div>
        </aside>
      </form>
    </Form>
  )
}
