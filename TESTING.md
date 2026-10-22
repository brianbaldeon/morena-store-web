# Testing — Morena Store

Suite profesional de testing: unit/integración con **Vitest** (caja blanca) + E2E/smoke con **Playwright** (caja negra). Ver el razonamiento completo (por qué Playwright, por qué esta pirámide) en `CHANGELOG.md` del 2026-10-22.

## Cómo correr los tests

```bash
npm run test         # unit + integración (Vitest) — ~2 segundos
npm run test:watch   # unit + integración en modo watch
npm run test:e2e     # E2E/smoke (Playwright) — ~15 segundos, levanta next dev solo
npm run test:all     # las dos suites, en ese orden
```

Playwright necesita el browser descargado una sola vez: `npx playwright install chromium`.

## Estado actual

| Suite | Archivos | Tests | Tiempo |
|---|---|---|---|
| Unit (Vitest) | `src/lib/filters.test.ts`, `src/lib/validations/customizer.test.ts`, `src/lib/constants.test.ts` | 46 | ~1s |
| Integración (Vitest + RTL) | `src/components/customizer/print-mockup.test.tsx`, `src/components/catalog/filter-panel.test.tsx` | 11 | ~1s |
| E2E/smoke (Playwright) | `e2e/smoke.spec.ts`, `e2e/catalog.spec.ts`, `e2e/customizer.spec.ts`, `e2e/cart.spec.ts`, `e2e/home.spec.ts` | 24 | ~14s |

**81 tests automatizados en total**, ~16 segundos corriendo todo.

## Pirámide y alcance (por qué no está "todo" automatizado)

- **Unit**: toda la lógica pura de filtros/paginación/precio/validación — el lugar correcto para probar reglas de negocio, corre sin browser.
- **Integración de componentes**: puntual, solo en componentes donde hubo un bug real (ver tabla de regresión abajo), no en todos los componentes del sistema.
- **E2E**: smoke de carga de página + 4-5 flujos críticos de punta a punta. Deliberadamente **no** cubre cada combinación de filtros ni cada una de las 36 páginas del sitio — eso haría la suite lenta sin agregar valor proporcional. El admin (`/admin/*`) no tiene E2E todavía: queda en la columna "manual" de la tabla de casos, se agrega cuando el panel tenga autenticación real (hoy es un mock de sesión).
- `src/lib/services/catalog.ts` (`searchCatalog`) no tiene unit test directo porque depende de `"server-only"` y de `globalThis` — se cubre indirectamente por los E2E de catálogo (que ejercitan el wiring completo) y directamente por los unit tests de `lib/filters.ts` (que es la lógica que `searchCatalog` orquesta).

## Casos de prueba

Convención de IDs: `SMOKE-xx` (carga de página), `CAT-xx` (catálogo/filtros), `CUS-xx` (personalizador), `CART-xx` (carrito), `HOME-xx` (home), `REG-xx` (regresión de un bug ya corregido — puede estar cubierto por un test de cualquiera de las otras categorías).

### Automatizados

| ID | Tipo | Qué prueba | Dónde |
|---|---|---|---|
| SMOKE-01 | Smoke | `/`, `/productos`, `/categoria/munecos`, `/categoria/almohadones`, `/personalizar`, `/personalizar/remera`, `/carrito`, `/favoritos` cargan 200 con su encabezado visible | `e2e/smoke.spec.ts` |
| SMOKE-02 | Smoke | Una categoría inexistente muestra la página de "no encontrado" | `e2e/smoke.spec.ts` |
| SMOKE-03 | Smoke | Se puede navegar del catálogo a una ficha de producto | `e2e/smoke.spec.ts` |
| CAT-01 | Funcional | Filtrar por categoría navega con `?categories=` y cambia el total de resultados | `e2e/catalog.spec.ts` |
| CAT-02 | Funcional | Paginar a la página 2 pide `?page=2` al servidor y muestra productos distintos | `e2e/catalog.spec.ts` |
| CAT-03 | Funcional | Ordenar por "Menor precio" navega con `?sort=price-asc` | `e2e/catalog.spec.ts` |
| CAT-04 | Regresión | El filtro de Color no aparece en `/productos`, `/categoria/remeras` ni `/categoria/buzos` | `e2e/catalog.spec.ts` |
| CAT-05 | Funcional | Un filtro sin resultados muestra el estado vacío y "Limpiar filtros" resetea la URL | `e2e/catalog.spec.ts` |
| CUS-01 | Regresión | El botón "Siguiente paso" no avanza si falta elegir una opción | `e2e/customizer.spec.ts` |
| CUS-02 | Funcional | El Paso 1 pide elegir ubicación antes de mostrar el upload de fotos | `e2e/customizer.spec.ts` |
| CUS-03 | Regresión | "Frente y espalda" muestra 2 slots de foto rotulados | `e2e/customizer.spec.ts` |
| CUS-04 | Regresión | Elegir "Espalda" sincroniza el mockup solo, sin tocar el tab | `e2e/customizer.spec.ts` + `print-mockup.test.tsx` |
| CUS-05 | Funcional | El precio estimado cambia al elegir una opción con recargo | `e2e/customizer.spec.ts` |
| CUS-06 | Funcional | El tamaño "Personalizado" avisa el máximo de 50x70 cm | `e2e/customizer.spec.ts` |
| CART-01 | Regresión | El toast de "agregado" aparece arriba a la derecha y el ítem queda en `/carrito` | `e2e/cart.spec.ts` |
| HOME-01 | Regresión | Las 3 secciones de producto del home usan el mismo carrusel (mismo tamaño de card) | `e2e/home.spec.ts` |
| HOME-02 | Funcional | "Explorá por categoría" muestra tiles de categoría, no productos | `e2e/home.spec.ts` |
| UNIT-* | Caja blanca | `filterProducts`, `sortProducts`, `computeFacets`, `countActiveFilters`, `filtersToSearchParams`, `getPriceBounds`, `buildHistogram`, `createInitialFilters` — ver `src/lib/filters.test.ts` para el detalle de cada caso | `src/lib/filters.test.ts` |
| UNIT-* | Caja blanca | `buildCustomizerSchema`: validación de fotos según ubicación (frente/espalda/ambos), tipos sin preview, límites de fotos/notas/cantidad | `src/lib/validations/customizer.test.ts` |
| UNIT-* | Caja blanca | `estimateCustomPrice`: suma de recargos, opción sin recargo, options vacío | `src/lib/constants.test.ts` |
| INT-* | Integración | `FilterPanel`: `hideCategories`/`hideColors` ocultan su sección; "Limpiar" cuenta y resetea | `src/components/catalog/filter-panel.test.tsx` |

### Manuales (por ahora)

| ID | Qué prueba | Por qué no está automatizado |
|---|---|---|
| MANUAL-01 | Flujo completo de checkout con Mercado Pago (sandbox) | Depende de un servicio externo real; se prueba a mano contra el sandbox de MP antes de cada release |
| MANUAL-02 | Panel de admin: crear/editar producto, categoría, artista | El admin usa un mock de sesión (`useRequireAuth`), falta antes conectar auth real para que un E2E tenga sentido de punta a punta |
| MANUAL-03 | Subida real de fotos en el personalizador (drag & drop de un archivo) | Playwright puede simular upload de archivos, pero no estaba en el alcance de esta primera pasada — se agrega cuando se conecte un storage real (hoy las fotos quedan como data URL en memoria) |
| MANUAL-04 | Revisión visual (dark mode, responsive en dispositivos reales) | Fuera del alcance de esta suite funcional; si se necesita, es un proyecto aparte (regresión visual con Chromatic/Percy) |
| MANUAL-05 | Mails transaccionales (confirmación de compra, etc.) | Todavía no implementado en el producto |

## Regresión: bugs ya corregidos esta sesión, con su test

| Bug | Cubierto por |
|---|---|
| Vista previa del personalizador no mostraba nada al elegir "Espalda" | `print-mockup.test.tsx` + CUS-04 |
| "Siguiente paso" avanzaba sin validar las opciones del Paso 2 | CUS-01 |
| Las 2 fotos de frente/espalda se mezclaban según el orden de subida | CUS-03 |
| El filtro de Color seguía apareciendo en categorías donde se había ocultado | CAT-04 |
| El catálogo cargaba todo al cliente antes de paginar (no escalaba a 500+ productos) | `filters.test.ts` (lógica) + CAT-01/02 (wiring end-to-end) |
| Las 3 secciones de producto del home tenían tamaños de card inconsistentes | HOME-01 |

Verificado en esta sesión que la suite realmente detecta regresiones: se revirtió a mano el fix de `PrintMockup` (volver a arrancar siempre en "frente") y el test de integración falló inmediatamente señalando la línea exacta; se restauró el fix y volvió a pasar.

## Notas de infraestructura

- `vitest.config.ts` / `vitest.setup.ts`: entorno jsdom, alias `@/*` → `src/*`, polyfill de `ResizeObserver` (jsdom no lo implementa y varios componentes de radix-ui lo usan).
- `playwright.config.ts`: un solo proyecto (Chromium desktop), levanta `next dev` solo si no está corriendo (`reuseExistingServer`).
- `src/lib/test-utils/product-factory.ts`: fábrica de productos de prueba para no repetir boilerplate de `ProductWithRelations` en cada test.
- Los `data-testid` agregados al código de producto (ej. `mockup-side-badge` en `PrintMockup`) son mínimos y deliberados: solo donde el texto visible era ambiguo para un test (aparecía dos veces en la pantalla, una vez en un tab y otra en un badge).
