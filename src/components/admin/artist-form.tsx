"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Brand } from "@/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { api } from "@/lib/api-client"
import { brandSchema, type BrandInput } from "@/lib/validations/admin"
import { cn } from "@/lib/utils"

export function ArtistForm({ artist }: { artist?: Brand }) {
  const router = useRouter()
  const form = useForm<BrandInput>({
    resolver: zodResolver(brandSchema),
    defaultValues: artist
      ? { name: artist.name, avatar: artist.avatar, kind: artist.kind }
      : { name: "", avatar: "", kind: "ARTISTA" },
  })
  const avatar = useWatch({ control: form.control, name: "avatar" })

  async function onSubmit(values: BrandInput) {
    try {
      if (artist) await api.artists.update(artist.id, values)
      else await api.artists.create(values)
      toast.success(artist ? "Artista actualizado" : "Artista creado")
      router.push("/admin/artistas")
      router.refresh()
    } catch {
      toast.error("No pudimos guardar el artista")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-4 rounded-lg border p-5" noValidate>
        <div className="flex items-center gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full border bg-muted">
            {avatar && (avatar.startsWith("/") || avatar.startsWith("https://images.unsplash.com")) && (
              <Image src={avatar} alt="" fill sizes="64px" className="object-cover" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">Así se ve en el filtro &quot;Artista / Personaje&quot; del catálogo.</p>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Diego Maradona" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar"
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
        <FormField
          control={form.control}
          name="kind"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-3">
                  {[
                    { value: "ARTISTA", label: "Artista / persona" },
                    { value: "PERSONAJE", label: "Personaje" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm",
                        field.value === option.value && "border-primary bg-primary/5",
                      )}
                    >
                      <RadioGroupItem value={option.value} /> {option.label}
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
            {artist ? "Guardar cambios" : "Crear artista"}
          </Button>
          <Button type="button" variant="ghost" asChild>
            <Link href="/admin/artistas">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
