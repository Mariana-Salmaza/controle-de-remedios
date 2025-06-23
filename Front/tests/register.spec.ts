import { test, expect } from "@playwright/test";

let email: string;

test.describe("Fluxo de Cadastro e Login", () => {
  test("Cadastro com sucesso", async ({ page }) => {
    const random = Math.floor(Math.random() * 100000);
    email = `usuario${random}@teste.com`;

    await page.goto("/register");

    await page.getByLabel("Nome").fill("Rodrigo Teste");
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("CPF").fill("39053344705");
    await page.locator('[name="password"]').fill("Senha@123");
    await page.locator('[name="confirmPassword"]').fill("Senha@123");

    await page.getByRole("button", { name: "Cadastrar" }).click();
    await expect(page).toHaveURL(/.*login/);
  });

  test("Login com sucesso após cadastro", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Senha").fill("Senha@123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("Login com falha mostra alerta de erro", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("E-mail").fill("invalido@teste.com");
    await page.getByLabel("Senha").fill("senhaerrada");

    const [dialog] = await Promise.all([
      page.waitForEvent("dialog"),
      page.getByRole("button", { name: "Entrar" }).click(),
    ]);

    expect(dialog.message()).toMatch(/verifique seu e-mail e senha/i);
    await dialog.dismiss();
  });

  test("Cadastro com falha por campos obrigatórios vazios", async ({
    page,
  }) => {
    await page.goto("/register");

    await page.getByRole("button", { name: "Cadastrar" }).click();

    await expect(page.getByText("Nome é obrigatório")).toBeVisible();
    await expect(page.getByText("Email é obrigatório")).toBeVisible();
    await expect(page.getByText("CPF é obrigatório")).toBeVisible();
    await expect(page.getByText("Senha é obrigatória")).toBeVisible();
  });
});
