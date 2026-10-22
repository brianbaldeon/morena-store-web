import { expect, test } from "@playwright/test"

/**
 * SMOKE-xx: las páginas clave cargan sin errores, con status 200 y su contenido mínimo visible.
 * Si algo de esto falla, el sitio está roto de punta a punta — se corre primero que todo lo demás.
 */
test.describe("Smoke: páginas cargan", () => {
  const paths = [
    { path: "/", heading: /hecho a mano/i },
    { path: "/productos", heading: /resultados?/i },
    { path: "/categoria/munecos", heading: /resultados?/i },
    { path: "/categoria/almohadones", heading: /resultados?/i },
    { path: "/personalizar", heading: /qué querés personalizar/i },
    { path: "/personalizar/remera", heading: /remera dtf personalizada/i },
    { path: "/carrito", heading: /tu carrito/i },
    { path: "/favoritos", heading: /favoritos/i },
  ]

  for (const { path, heading } of paths) {
    test(`${path} responde 200 y muestra su encabezado`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page.getByText(heading).first()).toBeVisible()
    })
  }

  test("una categoría inexistente muestra la página de no encontrado", async ({ page }) => {
    // Nota: en `next dev` con streaming, el status HTTP inicial puede llegar en 200 aunque el
    // contenido sea el de notFound() (ya observado en este proyecto); por eso se valida el
    // contenido, que es lo que realmente ve el usuario. En un build de producción (`next start`)
    // el status sí es 404.
    await page.goto("/categoria/no-existe")
    await expect(page.getByText(/no encontr/i).first()).toBeVisible()
  })

  test("ficha de producto: se llega navegando desde el catálogo y carga bien", async ({ page }) => {
    await page.goto("/categoria/munecos")
    await page.locator('a[href^="/productos/"]').first().click()
    await expect(page.getByRole("button", { name: /agregar al carrito|sin stock/i })).toBeVisible()
  })
})
