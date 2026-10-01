"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImageUp, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Achica la imagen en el navegador (máx. 600px) y la devuelve como data URL,
 * así se puede guardar en el carrito sin backend. Etapa 2: subir a un CDN y guardar la URL.
 */
async function toPreviewDataUrl(file: File, maxSize = 600) {
  const objectUrl = URL.createObjectURL(file)
  try {
    const img = document.createElement("img")
    img.src = objectUrl
    await img.decode()
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(img.width * scale)
    canvas.height = Math.round(img.height * scale)
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.82)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

interface PhotoDropzoneProps {
  value: string[]
  onChange: (photos: string[]) => void
  maxPhotos: number
  hint: string
  invalid?: boolean
}

export function PhotoDropzone({ value, onChange, maxPhotos, hint, invalid }: PhotoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const remaining = maxPhotos - value.length

  async function addFiles(files: FileList | null) {
    if (!files?.length) return
    const images = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining)
    if (!images.length) return
    setLoading(true)
    try {
      const previews = await Promise.all(images.map((f) => toPreviewDataUrl(f)))
      onChange([...value, ...previews])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {remaining > 0 && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            addFiles(e.dataTransfer.files)
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors outline-none hover:border-primary/60 hover:bg-primary/5 focus-visible:border-primary",
            dragging && "border-primary bg-primary/5",
            invalid && "border-destructive/60",
          )}
        >
          {loading ? (
            <Loader2 className="size-7 animate-spin text-primary" />
          ) : (
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ImageUp className="size-6" />
            </span>
          )}
          <p className="text-sm font-medium">
            Arrastrá tus fotos o <span className="text-primary">elegilas</span>
          </p>
          <p className="max-w-xs text-xs text-muted-foreground">{hint}</p>
          <p className="text-[11px] text-muted-foreground">
            {value.length}/{maxPhotos} fotos · JPG o PNG
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ""
            }}
          />
        </div>
      )}

      {value.length > 0 && (
        <ul className="grid grid-cols-4 gap-2">
          {value.map((src, i) => (
            <li key={i} className="group relative aspect-square overflow-hidden rounded-md border bg-muted">
              <Image src={src} alt={`Foto ${i + 1}`} fill sizes="120px" className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:text-destructive"
                aria-label={`Quitar foto ${i + 1}`}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
