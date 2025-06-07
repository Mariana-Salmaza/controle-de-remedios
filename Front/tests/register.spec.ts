import { test, expect } from "@playwright/test";

test("Cadastro com sucesso", async ({ page }) => {
  await page.goto("/register");

  const random = Math.floor(Math.random() * 100000);
  const email = `usuario${random}@teste.com`;

  await page.getByLabel("Nome").fill("Rodrigo Teste");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("CPF").fill("12345678900");
  await page.locator('[name="password"]').fill("Senha@123");
  await page.locator('[name="confirmPassword"]').fill("Senha@123");

  await page.getByRole("button", { name: "Cadastrar" }).click();

  await expect(page).toHaveURL(/.*login/);
});

test("Cadastro com erro de senha diferente", async ({ page }) => {
  await page.goto("/register");

  await page.getByLabel("Nome").fill("Teste Erro");
  await page.getByLabel("E-mail").fill("erro@teste.com");
  await page.getByLabel("CPF").fill("12345678900");
  await page.locator('[name="password"]').fill("senha123");
  await page.locator('[name="confirmPassword"]').fill("senha999");

  await page.getByRole("button", { name: "Cadastrar" }).click();

  // Esperar o alerta visual (Snackbar)
  const snackbar = page.locator(".MuiAlert-message");
  await expect(snackbar).toContainText("As senhas não coincidem");
});
