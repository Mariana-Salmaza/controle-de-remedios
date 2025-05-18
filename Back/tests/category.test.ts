import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/database";

// Variável para simular dinamicamente o usuário autenticado
let mockedUserId = 1;

// Mock do middleware de autenticação
jest.mock("../src/middlewares/authMiddleware", () => {
  return {
    authMiddleware: (req: any, _res: any, next: any) => {
      req.user = { id: mockedUserId };
      next();
    },
  };
});

describe("Category Endpoints", () => {
  let categoryId: number;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await sequelize.sync({ force: true });

    // Cria dois usuários (userId 1 e 2)
    await request(app).post("/users").send({
      name: "Usuário Categoria 1",
      email: "categoria1@email.com",
      document: "12312312300",
      password: "senha123",
    });

    await request(app).post("/users").send({
      name: "Usuário Categoria 2",
      email: "categoria2@email.com",
      document: "99999999999",
      password: "senha123",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /categories - cria nova categoria", async () => {
    mockedUserId = 1;
    const res = await request(app).post("/categories").send({
      name: "Antibióticos",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Antibióticos");
    categoryId = res.body.id;
  });

  test("GET /categories - retorna lista de categorias", async () => {
    const res = await request(app).get("/categories");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.categories)).toBe(true);
  });

  test("GET /categories/:id - retorna categoria por ID", async () => {
    const res = await request(app).get(`/categories/${categoryId}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Antibióticos");
  });

  test("PUT /categories/:id - atualiza categoria com sucesso", async () => {
    const res = await request(app).put(`/categories/${categoryId}`).send({
      name: "Antibióticos Atualizados",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/atualizada com sucesso/i);
  });

  test("DELETE /categories/:id - exclui categoria com sucesso", async () => {
    const res = await request(app).delete(`/categories/${categoryId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/excluída com sucesso/i);
  });

  test("PUT /categories/:id - falha se não for dono", async () => {
    // Cria uma categoria com usuário 1
    mockedUserId = 1;
    const cat = await request(app).post("/categories").send({
      name: "Exclusiva do User 1",
    });

    // Tenta editar como usuário 2
    mockedUserId = 2;
    const res = await request(app).put(`/categories/${cat.body.id}`).send({
      name: "Tentativa de Invasão",
    });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/acesso negado/i);
  });

  test("DELETE /categories/:id - falha se não for dono", async () => {
    // Cria outra categoria com usuário 1
    mockedUserId = 1;
    const cat = await request(app).post("/categories").send({
      name: "Categoria Protegida",
    });

    // Tenta deletar como usuário 2
    mockedUserId = 2;
    const res = await request(app).delete(`/categories/${cat.body.id}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/acesso negado/i);
  });
});
