"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Images } from "lucide-react"
import type { ShowcaseWork } from "@/types"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CUSTOMIZABLE_TYPE_LABELS } from "@/lib/constants"

const isDataUrl = (src: string) => src.startsWith("data:")

/** Card de la galería: portada + título. Al tocarla abre todas las fotos y el acceso al personalizador. */
export function ShowcaseCard({ work, preload }: { work: ShowcaseWork; preload?: boolean }) {
  const extraPhotos = work.images.length - 1

  return (
    <Dialog>
      <DialogTrigger className="group flex w-full flex-col justify-start self-start text-left">
        <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-muted">
          <Image
            src={work.images[0]}
            alt={work.title}
            fill
            loading={preload ? "eager" : undefined}
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized={isDataUrl(work.images[0])}
          />
          {extraPhotos > 0 && (
            <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-medium">
              <Images className="size-3" /> +{extraPhotos}
            </span>
          )}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{CUSTOMIZABLE_TYPE_LABELS[work.type]}</p>
        <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-primary">{work.title}</h3>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-3 overflow-y-auto p-4 sm:max-w-md sm:p-5">
        <DialogHeader className="pr-6 text-left">
          <p className="text-xs text-muted-foreground">{CUSTOMIZABLE_TYPE_LABELS[work.type]}</p>
          <DialogTitle>{work.title}</DialogTitle>
          {work.description && <DialogDescription>{work.description}</DialogDescription>}
        </DialogHeader>
        <Carousel opts={{ loop: work.images.length > 1 }} className="relative">
          <CarouselContent>
            {work.images.map((src, i) => (
              <CarouselItem key={src + i}>
                <div className="relative aspect-3/4 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={src}
                    alt={`${work.title}, foto ${i + 1}`}
                    fill
                    sizes="(min-width: 640px) 420px, 90vw"
                    className="object-cover"
                    unoptimized={isDataUrl(src)}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {work.images.length > 1 && (
            <>
              <CarouselPrevious className="left-2 bg-background/90" />
              <CarouselNext className="right-2 bg-background/90" />
            </>
          )}
        </Carousel>
        <Button asChild size="lg">
          <Link href={`/personalizar/${work.type}`}>
            Quiero uno así <ArrowRight />
          </Link>
        </Button>
      </DialogContent>
    </Dialog>
  )
}
