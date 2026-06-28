import { test, expect } from "@playwright/test";

test.describe("E2E: exibição de likes e dislikes nos posts", () => {
  test("cada post exibe contadores de curtidas e descurtidas", async ({
    page,
  }) => {
    await page.goto("/");

    const primeiroBotaoCurtir = page
      .getByRole("button", { name: "Curtir" })
      .first();
    await expect(primeiroBotaoCurtir).toBeVisible({ timeout: 15_000 });

    const contadoresCurtidas = page.locator('[aria-label*="curtidas"]');
    await expect(contadoresCurtidas.first()).toBeVisible();

    const contadoresDescurtidas = page.locator('[aria-label*="descurtidas"]');
    await expect(contadoresDescurtidas.first()).toBeVisible();

    const textoCurtidas = await contadoresCurtidas.first().textContent();
    const textoDescurtidas = await contadoresDescurtidas.first().textContent();

    const numeroCurtidas = parseInt(textoCurtidas?.replace(/\D/g, "") ?? "");
    const numeroDescurtidas = parseInt(
      textoDescurtidas?.replace(/\D/g, "") ?? ""
    );

    expect(Number.isNaN(numeroCurtidas)).toBe(false);
    expect(Number.isNaN(numeroDescurtidas)).toBe(false);
    expect(numeroCurtidas).toBeGreaterThanOrEqual(0);
    expect(numeroDescurtidas).toBeGreaterThanOrEqual(0);
  });

  test("todos os posts visíveis possuem a seção de reações", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: "Curtir" }).first()
    ).toBeVisible({ timeout: 15_000 });

    const secoes = page.locator('[aria-label="reações do post"]');
    const quantidade = await secoes.count();

    expect(quantidade).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(quantidade, 3); i++) {
      const secao = secoes.nth(i);
      await expect(secao.locator('[aria-label*="curtidas"]').first()).toBeVisible();
      await expect(secao.locator('[aria-label*="descurtidas"]')).toBeVisible();
    }
  });
});