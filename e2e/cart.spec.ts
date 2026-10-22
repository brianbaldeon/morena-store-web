import { expect, test } from "@playwright/test"

test.describe("Carrito", () => {
  test("CART-01 (regresión): el toast de agregado aparece arriba a la derecha, y el ítem queda en /carrito", async ({
    page,
  }) => {
    await page.goto("/categoria/munecos")
    await page.locator('a[href^="/productos/"]').first().click()
    await page.getByRole("button", { name: /agregar al carrito/i }).click()

    // El toast (sonner) se posiciona top-right — ver src/app/layout.tsx.
    const toast = page.locator("[data-sonner-toast]").first()
    await expect(toast).toBeVisible()
    const toaster = page.locator("[data-sonner-toaster]")
    await expect(toaster).toHaveAttribute("data-x-position", "right")
    await expect(toaster).toHaveAttribute("data-y-position", "top")

    await page.goto("/carrito")
    // "Tu carrito" también aparece en un texto secundario ("Tu carrito queda guardado"),
    // por eso se busca puntualmente el título de la página.
    await expect(page.getByRole("heading", { name: "Tu carrito" })).toBeVisible()
    await expect(page.getByText(/tu carrito está vacío/i)).not.toBeVisible()
  })
})
