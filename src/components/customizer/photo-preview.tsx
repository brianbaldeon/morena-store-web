import Image from "next/image"
import { ArrowRight, ImageIcon } from "lucide-react"

/** Para muñecos y llaveros: "tu foto" → ejemplo de cómo queda. */
export function PhotoPreview({ photo, example }: { photo?: string; example: string }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-muted">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URL local, sin optimizar
            <img src={photo} alt="Tu foto" className="size-full object-cover" />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/40 text-muted-foreground">
              <ImageIcon className="size-8 text-primary/60" />
              <span className="text-xs">Tu foto</span>
            </div>
          )}
        </div>
        <ArrowRight className="size-5 text-primary" />
        <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-muted">
          <Image src={example} alt="Ejemplo de resultado" fill sizes="200px" className="object-cover" />
          <span className="absolute bottom-2 left-2 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium">Ejemplo</span>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Diseñamos el muñeco a partir de tus fotos y te lo mandamos para aprobar antes de coserlo.
      </p>
    </div>
  )
}
