import { test, expect } from "@playwright/test";
import { emailUnq, SENHA_VLD } from "../../helpers/data";

test.describe("E2E: cadastro de usuário", () => {
  test("usuário consegue criar conta e é levado ao feed autenticado", async ({
    page,
  }) => {
    const email = emailUnq("e2e_signup");

    await page.goto("/signup");
    await expect(
      page.getByRole("heading", { name: "Criar Conta" })
    ).toBeVisible();

    await page.locator('input[type="email"]').fill(email);
    const senhas = page.locator('input[type="password"]'); 
    await senhas.nth(0).fill(SENHA_VLD);
    await senhas.nth(1).fill(SENHA_VLD);

    await page.locator('form button[type="submit"]').click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Posts Curtidos" })
    ).toBeVisible();
  });
});
