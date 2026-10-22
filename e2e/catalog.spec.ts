import { expect, test } from "@playwright/test"

test.describe("Catálogo: filtros y paginación (server-side)", () => {
  test("CAT-01: filtrar por categoría navega con query param y cambia el conteo de resultados", async ({ page }) => {
    await page.goto("/productos")
    const totalLabel = page.getByText(/resultados para/i)
    const totalBefore = await totalLabel.textContent()

    await page.locator('label[for^="cat-"]').first().click()
    await expect(page).toHaveURL(/categories=/)
    await expect(totalLabel).not.toHaveText(totalBefore ?? "")
  })

  test("CAT-02: paginar a la página 2 pide esa página al servidor (?page=2) y no repite la página 1", async ({
    page,
  }) => {
    await page.goto("/productos")
    const firstPageFirstProduct = await page.locator('a[href^="/productos/"]').first().getAttribute("href")

    await page.getByRole("link", { name: "2" }).click()
    await expect(page).toHaveURL(/page=2/)
    const secondPageFirstProduct = await page.locator('a[href^="/productos/"]').first().getAttribute("href")
    expect(secondPageFirstProduct).not.toBe(firstPageFirstProduct)
  })

  test("CAT-03: ordenar por precio ascendente reordena los resultados", async ({ page }) => {
    await page.goto("/productos")
    await page.getByRole("button", { name: /ordenar por/i }).click()
    await page.getByRole("menuitemradio", { name: /menor precio/i }).click()
    await expect(page).toHaveURL(/sort=price-asc/)
  })

  test("CAT-04 (regresión): el filtro de Color no aparece en /productos ni en remeras/buzos", async ({ page }) => {
    await page.goto("/productos")
    await expect(page.getByText("Color", { exact: true })).not.toBeVisible()

    await page.goto("/categoria/remeras")
    await expect(page.getByText("Color", { exact: true })).not.toBeVisible()

    await page.goto("/categoria/buzos")
    await expect(page.getByText("Color", { exact: true })).not.toBeVisible()
  })

  test("CAT-05: sin resultados para un filtro imposible, muestra el estado vacío con botón de limpiar", async ({
    page,
  }) => {
    await page.goto("/productos?priceMin=999999999&priceMax=999999999")
    await expect(page.getByText(/no encontramos productos/i)).toBeVisible()
    await page.getByRole("button", { name: /limpiar filtros/i }).click()
    await expect(page).toHaveURL("/productos")
  })
})
