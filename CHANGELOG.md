# Changelog — Morena Store

Registro de los ajustes que vamos haciendo al front, para no perder el hilo de qué se arregló y por qué. Los más nuevos van arriba.

## 2026-10-22

### Rendimiento: paginación real en el servidor (pensando en 500+ productos)
- **Problema:** `/productos` y `/categoria/[slug]` traían el catálogo/categoría completo al navegador en cada carga, y recién ahí se filtraba y se cortaban los productos a mostrar. Con pocos productos mock no se nota, pero con un catálogo real de cientos de productos sería lentísimo.
- **Solución:** nueva función `searchCatalog()` en `src/lib/services/catalog.ts` que filtra, ordena y pagina **en el servidor**, devolviendo `{ products, total, facets, filters }` — `products` es solo la página pedida (10 por página, nunca el catálogo entero).
- Los filtros, el orden y la página ahora viven en la URL (`?categories=...&priceMin=...&page=2`). Cada cambio navega y el servidor resuelve de nuevo — así es como se va a comportar con una base de datos real (`WHERE` + `ORDER BY` + `LIMIT/OFFSET`), listo para cuando se conecte Prisma/Postgres en la etapa 2.
- `PAGE_SIZE` pasó de 9 a **10** productos por página.
- El slider de precio ahora solo dispara la navegación al soltar (no en cada pixel de arrastre), y hay un spinner + atenuado sobre la grilla mientras se resuelve un cambio de filtro, sin recargar la página ni perder el scroll.

### Skeletons / loading en todo el sitio
- Se agregó `loading.tsx` (Next.js lo muestra automático mientras el servidor resuelve datos) en: home, carrito, favoritos, checkout (+ éxito/pendiente/error), cuenta, ficha de producto, `/personalizar/[tipo]`, y un `loading.tsx` único para todo `/admin` (dashboard, productos, categorías, pedidos, clientes, pagos, personalizados).
- `/productos` y `/categoria/[slug]` ya lo tenían.
- No se le puso a `/login` ni `/registro`: no hacen ninguna consulta real, no hay espera que mostrar.
- Hoy con datos mock estos loaders casi no se ven (todo resuelve instantáneo). Se van a notar de verdad cuando haya latencia real de base de datos.

### Ícono "N" (Next.js Dev Tools)
- Era el indicador de desarrollo de Next.js, visible solo en `next dev`, nunca en producción. Se desactivó con `devIndicators: false` en `next.config.ts` porque molestaba durante el trabajo.

## 2026-10-21

### Branding: "Store Morena" → "Morena Store"
- Cambiado en: logo del header, `<title>` del sitio (y template de metadata), footer, layout de auth, panel de admin, buscador (fallback), ficha de producto (fallback), `storeName` del mock de admin, y comentarios internos.
- No se tocó "Michi Morena" / "Diseños Morena" (nombres de personajes de diseño, no el nombre de la tienda) ni las claves internas de `localStorage` (`morena-cart`, etc.).

### Home: secciones de producto inconsistentes
- "Los más elegidos" usaba un grid estático de 2-3 columnas mientras "Recién salidos" y "Muñecos de tus ídolos" usaban el carrusel (`ProductRail`) — mismas cards, pero mucho más grandes en el grid. Ahora las 3 secciones usan el mismo carrusel, mismo tamaño de card.
- "Los más elegidos" (`getFeaturedProducts`) no tenía ningún criterio real de orden (tomaba los primeros `isFeatured` cargados en la base, que resultaban ser casi todos muñecos) — ahora ordena por ventas reales y tiene tope de 2 productos por categoría, para no duplicar visualmente la sección de "Muñecos de tus ídolos" de abajo.
- "Muñecos de tus ídolos" traía toda la categoría sin orden ni límite — ahora ordena por ventas y tiene tope de 10, consistente con el resto de los rieles del home.
- "Explorá por categoría" se deja igual a propósito: es navegación, no un listado de productos, tiene sentido que se vea distinto.

### Catálogo: filtro de color
- Se agregó `hideColors` para ocultar el filtro de color en `/productos`, `/categoria/remeras` y `/categoria/buzos` (no aplica todavía a esos productos). Queda reversible: alcanza con quitar el prop si en el futuro escala y vuelve a hacer falta.

### Catálogo: productos personalizables movidos fuera del catálogo normal
- Se eliminaron del catálogo los productos que eran en realidad la versión "catálogo" de algo que ya existe en `/personalizar`: Muñeco personalizado, Remera/Buzo/Llavero personalizado DTF, Almohadón de tu mascota. Ahora lo personalizable vive **solo** en `/personalizar`, separado del catálogo de productos fijos.
- El link del carrito para un ítem personalizado ya no apunta a una ficha de producto (que no debería existir para un pedido a medida) sino al configurador (`/personalizar/[tipo]`).
- Se sacó el switch de filtro "Personalizable" de los filtros del catálogo (ya no tiene sentido, no quedan productos de catálogo marcados así).
- "Llavero Michi" se movió a la categoría Almohadones (era un almohadón mal cargado como llavero) y se renombró a "Almohadón Michi".
- Categoría Almohadones quedó con un solo producto placeholder ("Almohadón Michi") hasta que se carguen los productos reales para producción.
- Se agregó **almohadón** como tipo nuevo en `/personalizar` (tamaño, forma, empaque).

### Personalizador (`/personalizar/[tipo]`)
- El botón "Siguiente paso" del Paso 2 avanzaba sin validar que estén elegidas todas las opciones (talle, color, ubicación, tamaño) — ahora valida y marca en rojo lo que falta.
- La vista previa de remera/buzo no mostraba nada al elegir "Espalda" (el tab interno no se sincronizaba con la ubicación elegida) — ahora se sincroniza solo.
- El estampado se salía del dibujo de la prenda en tamaños grandes — ahora se calcula contra el área real del torso.
- Frente y espalda no se distinguían a simple vista — se agregó cinta de cuello (frente) vs. etiqueta de tela (espalda), más un badge grande con el lado actual.
- Las medidas de estampado pasaron de A5/A4/A3 a **cm reales**: 20x20 / 40x40 / 50x70 (máximo) / Personalizado, con aviso de que el máximo personalizado es 50x70 cm.
- Cuando la ubicación es "Frente y espalda", pedía 2 fotos pero siempre mostraba la primera en ambos lados. Se reordenó el formulario: ahora primero se elige dónde va el estampado (Paso 1), y según esa elección aparecen 1 o 2 recuadros de carga ya rotulados ("Foto para el frente" / "Foto para la espalda"), sin depender del orden de subida.
- `/personalizar/muneco`: tamaño máximo 40cm (antes 45cm), se sacó la opción de accesorios, "Packaging" se renombró a "Empaque".
- En `/personalizar` se reordenaron las secciones: primero el bloque de "cómo funciona" (3 pasos), después las cards para elegir qué personalizar — antes estaba al revés y confundía cuál era el siguiente paso.
- El CTA "Empezar" de cada card de tipo de producto era un link de texto chico — ahora es un botón sólido, más visible.
- Se sacó el botón "Empezar a personalizar" de dentro de `/personalizar` (apuntaba a la misma página en la que ya estás); se mantiene en la home, donde sí tiene sentido.

### Toasts
- El toast de "agregado al carrito" (y todos los demás) se movieron de `bottom-right` a `top-right`.

### Textos
- "También te puede gustar" (ficha de producto): confirmado que ya recomienda por misma categoría/artista, no se tocó.
- "Recién salidos del taller" → descripción cambiada a "Lo último que fabricamos."

## Pendiente / para revisar más adelante
- Conectar `searchCatalog`/`listProducts` a una base real (Prisma/Postgres) en la etapa 2 — hoy todo es un array en memoria (`globalThis.catalogDb`), se resetea al reiniciar `next dev`.
- Cargar productos reales de Almohadones (hoy solo hay 1 placeholder).
- Evaluar si conviene mostrar 12 por página en vez de 10 (quedó en 10 por pedido explícito).
