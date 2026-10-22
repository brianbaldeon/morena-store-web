import { expect, test } from "@playwright/test"

test.describe("Home", () => {
  test("HOME-01 (regresión): las 3 secciones de producto usan el mismo carrusel, no un grid más grande", async ({
    page,
  }) => {
    await page.goto("/")
    for (const title of ["Recién salidos del taller", "Los más elegidos", "Muñecos de tus ídolos"]) {
      const section = page.locator("section", { has: page.getByRole("heading", { name: title }) })
      await expect(section.locator('[data-slot="carousel"]')).toBeVisible()
    }
  })

  test("HOME-02: Explorá por categoría muestra los tiles de categoría, distinto del carrusel de productos", async ({
    page,
  }) => {
    await page.goto("/")
    const section = page.locator("section", { has: page.getByRole("heading", { name: "Explorá por categoría" }) })
    await expect(section.locator('a[href^="/categoria/"]').first()).toBeVisible()
  })
})
