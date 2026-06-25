import { test, expect } from "@playwright/test";

test.describe("E2E: curtida sem autenticação", () => {
  test("visitante ao curtir vê o aviso de que precisa estar autenticado", async ({
    page,
  }) => {
    let dialogMessage: string | null = null;

    page.on("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    await page.goto("/");

    const botaoCurtir = page.getByRole("button", { name: "Curtir" }).first();
    await expect(botaoCurtir).toBeVisible({ timeout: 15_000 });

    await botaoCurtir.click();

    await expect
      .poll(() => dialogMessage, { timeout: 5_000 })
      .toContain("autenticado");

    await expect(
      page.getByRole("button", { name: "Curtido" })
    ).toHaveCount(0);
  });
});
