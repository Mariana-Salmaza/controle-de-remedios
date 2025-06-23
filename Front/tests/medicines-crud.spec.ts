import { test, expect } from "@playwright/test";

test.describe("Fluxo completo de Categoria + Medicamento", () => {
  test("CRUD completo de medicamento com categoria criada", async ({
    page,
  }) => {
    // Login
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("usuario33286@teste.com");
    await page.getByLabel("Senha").fill("senha@123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/.*dashboard/);

    // Cadastrar categoria com nome único
    await page.goto("/add-category");
    await page.getByLabel("Nome").fill("Categoria TestRo");
    await page.getByRole("button", { name: "Cadastrar" }).click();
    await expect(page).toHaveURL(/.*categories/);

    // Cadastrar medicamento
    await page.goto("/add-medicine");
    await page.getByLabel("Nome").fill("Paracetamol");
    await page.getByLabel("Dosagem").fill("750mg");
    await page.getByLabel("Quantidade").fill("20");
    await page.getByLabel("Horários").fill("09:00, 21:00");
    await page.getByLabel("Categoria").click();
    await page
      .getByRole("option", { name: "Categoria TestRo" })
      .first()
      .click();
    await page.getByRole("button", { name: "Cadastrar" }).click();
    await expect(page).toHaveURL(/.*medicines/);

    // Verificar se medicamento foi listado
    const row = page.getByRole("row", { name: /Paracetamol/ });
    await expect(row).toBeVisible();

    // Editar medicamento
    await row.getByRole("link", { name: /Editar/i }).click();
    await expect(page.getByLabel("Nome")).toHaveValue("Paracetamol");
    await page.getByLabel("Nome").fill("Paracetamol Atualizado");
    await page.getByRole("button", { name: "Salvar Alterações" }).click();
    await expect(page).toHaveURL(/.*medicines/);
    await expect(page.getByText("Paracetamol Atualizado")).toBeVisible();

    // Excluir medicamento
    const rowAtualizado = page.getByRole("row", {
      name: /Paracetamol Atualizado/,
    });
    page.once("dialog", (dialog) => dialog.accept());
    await rowAtualizado.getByRole("button", { name: /Excluir/i }).click();
    await expect(page.getByText("Paracetamol Atualizado")).toHaveCount(0);
  });
});
