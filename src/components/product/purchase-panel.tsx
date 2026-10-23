"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ShoppingCart, Sparkles } from "lucide-react"
import type { ProductWithRelations } from "@/types"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { QuantityStepper } from "@/components/shared/quantity-stepper"
import { chipClass } from "@/components/catalog/filters"
import { useCartStore } from "@/store/cart"
import { PRODUCT_TYPE_LABELS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { FavoriteButton } from "./favorite-button"
import { PriceTag } from "./price-tag"

const CUSTOMIZER_BY_TYPE: Record<string, string> = {
  MUNECO: "/personalizar/muneco",
  LLAVERO: "/personalizar/llavero",
  REMERA: "/personalizar/remera",
  BUZO: "/personalizar/buzo",
  OTRO: "/personalizar/muneco",
}

/** Columna derecha del detalle: talle y color (mismos chips que el sidebar), cantidad y agregar al carrito. */
export function PurchasePanel({ product }: { product: ProductWithRelations }) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.open)
  const [size, setSize] = useState("")
  const [color, setColor] = useState(product.colors.length === 1 ? product.colors[0].name : "")
  const [quantity, setQuantity] = useState(1)
  const [showErrors, setShowErrors] = useState(false)

  const needsSize = product.sizes.length > 0
  const needsColor = product.colors.length > 1

  const stock = useMemo(() => {
    if (product.variants.length === 0) return product.stock
    const match = product.variants.filter((v) => (!size || v.size === size) && (!color || v.color === color))
    return match.reduce((acc, v) => acc + v.stock, 0)
  }, [product, size, color])
  // Si al cambiar talle/color baja el stock, la cantidad elegida no puede quedar por encima.
  const qty = Math.min(quantity, Math.max(1, stock))

  function addToCart() {
    if ((needsSize && !size) || (needsColor && !color)) {
      setShowErrors(true)
      return
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      unitPrice: product.price,
      maxStock: Math.max(1, stock),
      size: size || null,
      color: color || null,
      customization: null,
      quantity: qty,
    })
    openCart()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {product.brand?.name ?? "Morena Store"} · {PRODUCT_TYPE_LABELS[product.productType]}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} className="text-xl" />
        <p className="text-xs text-muted-foreground">Pagás con Mercado Pago · hasta 3 cuotas sin interés</p>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

      {needsSize && (
        <fieldset className="space-y-2">
          <legend className="flex w-full items-center justify-between text-sm font-medium">
            Talle
            {showErrors && !size && <span className="text-xs font-normal text-destructive">Elegí un talle</span>}
          </legend>
          <ToggleGroup
            type="single"
            spacing={2}
            value={size}
            onValueChange={setSize}
            className="grid w-full grid-cols-6"
          >
            {product.sizes.map((s) => (
              <ToggleGroupItem key={s} value={s} className={chipClass} aria-label={`Talle ${s}`}>
                {s}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </fieldset>
      )}

      {product.colors.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="flex w-full items-center justify-between text-sm font-medium">
            <span>
              Color {color && <span className="font-normal text-muted-foreground">· {color}</span>}
            </span>
            {showErrors && needsColor && !color && (
              <span className="text-xs font-normal text-destructive">Elegí un color</span>
            )}
          </legend>
          <ToggleGroup type="single" spacing={2} value={color} onValueChange={setColor} className="flex flex-wrap">
            {product.colors.map((c) => (
              <ToggleGroupItem
                key={c.name}
                value={c.name}
                aria-label={c.name}
                title={c.name}
                className="size-8 min-w-0 rounded-full p-0 hover:bg-transparent data-[state=on]:bg-transparent data-[state=on]:ring-2 data-[state=on]:ring-primary data-[state=on]:ring-offset-2 data-[state=on]:ring-offset-background"
              >
                <span className="size-7 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </fieldset>
      )}

      <div className="space-y-3">
        <StockStatus stock={stock} />
        <div className="flex gap-2 sm:gap-3">
          {stock > 1 && (
            <QuantityStepper value={qty} onChange={setQuantity} max={stock} className="shrink-0" />
          )}
          <Button size="lg" className="h-10 min-w-0 flex-1 px-3" onClick={addToCart} disabled={stock <= 0}>
            <ShoppingCart className="max-[379px]:hidden" /> {stock > 0 ? "Agregar al carrito" : "Sin stock"}
          </Button>
          <FavoriteButton productId={product.id} productName={product.name} size="lg" className="size-10 shrink-0" />
        </div>
      </div>

      {product.isCustomizable && (
        <Link
          href={CUSTOMIZER_BY_TYPE[product.productType]}
          className={cn(
            "flex items-center gap-3 rounded-lg border border-dashed border-primary/50 bg-primary/5 p-4 text-sm transition-colors hover:bg-primary/10",
          )}
        >
          <Sparkles className="size-5 shrink-0 text-primary" />
          <span>
            <span className="block font-medium">¿Lo querés con tu foto o tu diseño?</span>
            <span className="text-muted-foreground">Personalizalo paso a paso y mirá cómo queda.</span>
          </span>
        </Link>
      )}
    </div>
  )
}

// Menos de 5 unidades = "quedan pocas". No mostramos la cantidad exacta para no dar pistas del inventario.
const FEW_LEFT = 4

/** Estado de stock arriba del botón: un punto de color + texto corto, sin competir con el precio. */
function StockStatus({ stock }: { stock: number }) {
  const tone = stock <= 0 ? "destructive" : stock <= FEW_LEFT ? "warning" : "success"
  const label =
    stock <= 0
      ? "Sin stock"
      : stock === 1
        ? "¡Último en stock!"
        : stock <= FEW_LEFT
          ? "¡Quedan pocas unidades!"
          : "Stock disponible"

  return (
    <p className="flex items-center gap-2 text-sm" aria-live="polite">
      <span
        aria-hidden
        className={cn(
          "size-2 shrink-0 rounded-full",
          tone === "success" && "bg-success",
          tone === "warning" && "bg-warning",
          tone === "destructive" && "bg-destructive",
        )}
      />
      <span className={cn("font-medium", tone === "destructive" && "text-destructive")}>{label}</span>
    </p>
  )
}
