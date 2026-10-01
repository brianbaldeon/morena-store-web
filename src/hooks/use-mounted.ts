import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/**
 * true solo en el navegador. Evita errores de hidratación al leer
 * stores persistidos (carrito, favoritos, sesión) en el primer render.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
