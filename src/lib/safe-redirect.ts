/** Solo permite volver a rutas internas (evita redirecciones abiertas con ?next=). */
export function safeNext(next: unknown, fallback = "/") {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : fallback
}
