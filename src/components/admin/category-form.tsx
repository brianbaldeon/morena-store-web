"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Category } from "@/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api-client"
import { PRODUCT_TYPE_LABELS } from "@/lib/constants"
import { categorySchema, type CategoryInput } from "@/lib/validations/admin"

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter()
  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? { name: category.name, description: category.description, image: category.image, productType: category.productType }
      : { name: "", description: "", image: "", productType: "MUNECO" },
  })
  const image = useWatch({ control: form.control, name: "image" })

  async function onSubmit(values: CategoryInput) {
    try {
      if (category) await api.categories.update(category.id, values)
      else await api.categories.create(values)
      toast.success(category ? "Categoría actualizada" : "Categoría creada")
      router.push("/admin/categorias")
      router.refresh()
    } catch {
      toast.error("No pudimos guardar la categoría")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-4xl gap-6 md:grid-cols-[1fr_220px]" noValidate>
        <div className="space-y-4 rounded-lg border p-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Muñecos" {...field} />
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
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de producto</FormLabel>
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="/products/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              {category ? "Guardar cambios" : "Crear categoría"}
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link href="/admin/categorias">Cancelar</Link>
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Vista previa</p>
          <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-muted">
            {image && (image.startsWith("/") || image.startsWith("https://images.unsplash.com")) && (
              <Image src={image} alt="" fill sizes="220px" className="object-cover" />
            )}
          </div>
        </div>
      </form>
    </Form>
  )
}
