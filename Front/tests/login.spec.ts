import { test, expect } from "@playwright/test";

test("Login com sucesso", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("E-mail").fill("usuario51872@teste.com");
  await page.getByLabel("Senha").fill("Senha@123");

  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/.*dashboard/);
});

test("Login com falha (credenciais incorretas)", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("E-mail").fill("erro@email.com");
  await page.getByLabel("Senha").fill("senhaErrada");

  await page.getByRole("button", { name: "Entrar" }).click();

  // Espera o alerta com a mensagem de erro
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Erro ao fazer login");
    await dialog.dismiss();
  });
});
