import { expect, test } from "@playwright/test"

test.describe("Personalizador — remera (caja negra)", () => {
  test("CUS-01 (regresión): no deja avanzar del Paso 2 sin elegir todas las opciones", async ({ page }) => {
    await page.goto("/personalizar/remera")
    await page.getByRole("button", { name: /elegí los detalles/i }).click()
    await page.getByRole("button", { name: /siguiente paso/i }).click()
    await expect(page.getByText(/te falta elegir/i)).toBeVisible()
  })

  test("CUS-02: el Paso 1 arranca pidiendo elegir ubicación antes de mostrar el upload de fotos", async ({
    page,
  }) => {
    await page.goto("/personalizar/remera")
    await expect(page.getByText(/elegí primero dónde va el estampado/i)).toBeVisible()

    await page.getByRole("radio", { name: "Espalda", exact: true }).click()
    await expect(page.getByText("Foto para la espalda")).toBeVisible()
  })

  test('CUS-03 (regresión): "Frente y espalda" muestra 2 slots de foto rotulados, uno por lado', async ({ page }) => {
    await page.goto("/personalizar/remera")
    await page.getByRole("radio", { name: "Frente y espalda" }).click()
    await expect(page.getByText("Foto para el frente")).toBeVisible()
    await expect(page.getByText("Foto para la espalda")).toBeVisible()
  })

  test('CUS-04 (regresión): al elegir "Espalda" el mockup se sincroniza solo, sin tocar el tab', async ({ page }) => {
    await page.goto("/personalizar/remera")
    await page.getByRole("radio", { name: "Espalda", exact: true }).click()
    await expect(page.getByTestId("mockup-side-badge")).toHaveText("Espalda")
  })

  test("CUS-05: el precio estimado sube al elegir una opción con recargo", async ({ page }) => {
    await page.goto("/personalizar/remera")
    const priceLocator = page.getByText("Precio estimado").locator("xpath=following-sibling::span")
    const priceBefore = await priceLocator.textContent()

    await page.getByRole("radio", { name: "Frente y espalda" }).click()
    await page.getByRole("button", { name: /elegí los detalles/i }).click()
    await page.getByRole("radio", { name: "50x70 cm" }).click()

    await expect(priceLocator).not.toHaveText(priceBefore ?? "")
  })

  test("CUS-06: el tamaño Personalizado avisa el máximo de 50x70 cm en las notas", async ({ page }) => {
    await page.goto("/personalizar/remera")
    await page.getByRole("button", { name: /elegí los detalles/i }).click()
    await page.getByRole("radio", { name: "Personalizado" }).click()
    await page.getByRole("button", { name: /contanos lo que quieras/i }).click()
    await expect(page.getByText(/máximo que podemos estampar es 50x70 cm/i)).toBeVisible()
  })
})
