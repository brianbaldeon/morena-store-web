"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { ShowcaseWork } from "@/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api-client"
import { CUSTOMIZABLE_TYPE_LABELS } from "@/lib/constants"
import { showcaseWorkSchema, type ShowcaseWorkInput } from "@/lib/validations/admin"
import { cn } from "@/lib/utils"
import { ImageUploader } from "./image-uploader"

export function ShowcaseForm({ work }: { work?: ShowcaseWork }) {
  const router = useRouter()
  const form = useForm<ShowcaseWorkInput>({
    resolver: zodResolver(showcaseWorkSchema),
    defaultValues: work
      ? {
          title: work.title,
          description: work.description ?? "",
          type: work.type,
          images: work.images,
          published: work.published,
        }
      : { title: "", description: "", type: "muneco", images: [], published: true },
  })

  async function onSubmit(values: ShowcaseWorkInput) {
    try {
      if (work) await api.showcase.update(work.id, values)
      else await api.showcase.create(values)
      toast.success(work ? "Trabajo actualizado" : "Trabajo agregado a la galería")
      router.push("/admin/trabajos")
      router.refresh()
    } catch {
      toast.error("No pudimos guardar el trabajo")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-4 rounded-lg border p-5" noValidate>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Muñeco de Lucía y su perro" {...field} />
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
              <FormLabel>Descripción (opcional)</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="Un detalle del trabajo, en una línea." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                >
                  {Object.entries(CUSTOMIZABLE_TYPE_LABELS).map(([value, label]) => (
                    <label
                      key={value}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm",
                        field.value === value && "border-primary bg-primary/5",
                      )}
                    >
                      <RadioGroupItem value={value} /> {label}
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Define el filtro de la galería y a qué personalizador lleva el botón &quot;Quiero uno así&quot;.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Fotos</FormLabel>
              <ImageUploader value={field.value} onChange={field.onChange} invalid={!!fieldState.error} />
              <FormDescription>La primera foto es la portada en la galería.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between gap-3 rounded-md border p-3">
              <div>
                <FormLabel>Visible en la tienda</FormLabel>
                <FormDescription className="text-xs">Si lo apagás, queda guardado pero no se muestra.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
            {work ? "Guardar cambios" : "Agregar trabajo"}
          </Button>
          <Button type="button" variant="ghost" asChild>
            <Link href="/admin/trabajos">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
