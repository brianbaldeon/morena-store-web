"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Link2, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/**
 * Etapa 1: acepta URLs (rutas de /public o images.unsplash.com) o archivos locales como preview.
 * Etapa 2: los archivos se suben a un CDN (Cloudinary/UploadThing) desde un Route Handler.
 */
export function ImageUploader({
  value,
  onChange,
  invalid,
}: {
  value: string[]
  onChange: (images: string[]) => void
  invalid?: boolean
}) {
  const [url, setUrl] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  function addUrl() {
    const trimmed = url.trim()
    if (!trimmed) return
    onChange([...value, trimmed])
    setUrl("")
  }

  function addFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => onChange([...value, String(reader.result)])
      reader.readAsDataURL(file)
    })
  }

  function makeCover(index: number) {
    const next = [...value]
    const [img] = next.splice(index, 1)
    onChange([img, ...next])
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((src, i) => (
          <div key={src + i} className="group relative aspect-3/4 overflow-hidden rounded-md border bg-muted">
            <Image src={src} alt={`Imagen ${i + 1}`} fill sizes="160px" className="object-cover" unoptimized={src.startsWith("data:")} />
            {i === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                Portada
              </span>
            )}
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => makeCover(i)}
                  className="flex size-6 items-center justify-center rounded-full bg-background/90 shadow-sm hover:text-primary"
                  aria-label="Usar como portada"
                >
                  <Star className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="flex size-6 items-center justify-center rounded-full bg-background/90 shadow-sm hover:text-destructive"
                aria-label="Quitar imagen"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex aspect-3/4 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed text-xs text-muted-foreground hover:border-primary/60 hover:text-primary",
            invalid && "border-destructive/60",
          )}
        >
          <ImagePlus className="size-5" /> Subir
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addUrl()
              }
            }}
            placeholder="/products/... o https://images.unsplash.com/..."
            className="pl-9"
          />
        </div>
        <Button type="button" variant="outline" onClick={addUrl}>
          Agregar URL
        </Button>
      </div>
    </div>
  )
}
