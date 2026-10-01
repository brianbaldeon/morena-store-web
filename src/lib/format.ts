const PRICE_FORMATTER = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatPrice(value: number) {
  if (Number.isNaN(value)) return "$0"
  return PRICE_FORMATTER.format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("es-AR").format(value)
}

export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
}

export function formatDateTime(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
