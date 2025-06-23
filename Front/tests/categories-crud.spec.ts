import { test, expect } from "@playwright/test";

test.describe("CRUD completo de categorias com usuário fixo", () => {
  test("Cadastrar, editar e excluir categoria", async ({ page }) => {
    // Login com usuário existente
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("usuario33294@teste.com");
    await page.getByLabel("Senha").fill("senha@123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/.*dashboard/);

    // Cadastrar categoria com nome único
    const nomeCategoria = `Categoria Teste ${Math.floor(
      Math.random() * 100000
    )}`;
    const nomeEditado = `${nomeCategoria} Editada`;

    await page.goto("/add-category");
    await page.getByLabel("Nome").fill(nomeCategoria);
    await page.getByRole("button", { name: "Cadastrar" }).click();
    await expect(page).toHaveURL(/.*categories/);
    await expect(page.getByText(nomeCategoria)).toBeVisible();

    // Editar a categoria (com seletor compatível com seu layout)
    await page
      .locator(`.MuiPaper-root:has-text("${nomeCategoria}") >> text=Editar`)
      .click();
    await page.getByLabel("Nome").fill(nomeEditado);
    await page.getByRole("button", { name: "Atualizar" }).click();
    await expect(page).toHaveURL(/.*categories/);
    await expect(page.getByText(nomeEditado)).toBeVisible();

    // Excluir a categoria editada
    page.once("dialog", (dialog) => dialog.accept());
    await page
      .locator(`.MuiPaper-root:has-text("${nomeEditado}") >> text=Excluir`)
      .click();
    await expect(page.getByText(nomeEditado)).toHaveCount(0);
  });
});
