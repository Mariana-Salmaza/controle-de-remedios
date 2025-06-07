// register.spec.ts
import { test, expect } from "@playwright/test";

let email: string;

test.describe("Fluxo completo de cadastro e login", () => {
  test("Cadastro com sucesso", async ({ page }) => {
    const random = Math.floor(Math.random() * 100000);
    email = `usuario${random}@teste.com`;

    await page.goto("/register");

    await page.getByLabel("Nome").fill("Rodrigo Teste");
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("CPF").fill("12345678900");
    await page.locator('[name="password"]').fill("Senha@123");
    await page.locator('[name="confirmPassword"]').fill("Senha@123");

    await page.getByRole("button", { name: "Cadastrar" }).click();
    await expect(page).toHaveURL(/.*login/);
  });

  test("Login com sucesso usando o e-mail recém-cadastrado", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Senha").fill("Senha@123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
