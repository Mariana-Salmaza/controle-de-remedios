import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/database";

// Simula autenticação com ID fixo de usuário (ID 1)
jest.mock("../src/middlewares/authMiddleware", () => {
  return {
    authMiddleware: (req: any, _res: any, next: any) => {
      req.user = { user: { id: 1 } };
      next();
    },
  };
});

describe("User Endpoints", () => {
  let user1Id: number;
  let user2Id: number;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await sequelize.sync({ force: true });

    // Cria usuário 1 (logado)
    const user1 = await request(app).post("/users").send({
      name: "Rodrigo Teste",
      email: "rodrigo@example.com",
      document: "12345678900",
      password: "senha123",
    });
    user1Id = user1.body.id;

    // Cria usuário 2 (outro usuário)
    const user2 = await request(app).post("/users").send({
      name: "Outro Usuário",
      email: "outro@example.com",
      document: "11122233344",
      password: "senha123",
    });
    user2Id = user2.body.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /users - deve falhar ao criar com e-mail duplicado", async () => {
    const response = await request(app).post("/users").send({
      name: "Rodrigo Teste",
      email: "rodrigo@example.com",
      document: "99988877766",
      password: "senha123",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/e-mail já está em uso/i);
  });

  test("POST /users - deve falhar ao criar sem e-mail", async () => {
    const response = await request(app).post("/users").send({
      name: "Sem Email",
      document: "11111111111",
      password: "senha123",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/obrigatórios/i);
  });

  test("POST /users - deve falhar ao criar com CPF inválido", async () => {
    const response = await request(app).post("/users").send({
      name: "CPF Inválido",
      email: "cpf@email.com",
      document: "123",
      password: "senha123",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/cpf inválido/i);
  });

  test("POST /users - deve falhar com senha fraca", async () => {
    const response = await request(app).post("/users").send({
      name: "Senha Fraca",
      email: "senha@email.com",
      document: "12345678900",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/senha deve ter no mínimo/i);
  });

  test("GET /users - deve retornar todos os usuários (com autenticação mockada)", async () => {
    const response = await request(app)
      .get("/users")
      .set({ Authorization: "Bearer fake-token" });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.users)).toBe(true);
  });

  test("PUT /users/:id - deve atualizar usuário com sucesso", async () => {
    const response = await request(app).put(`/users/${user1Id}`).send({
      name: "Rodrigo Atualizado",
      document: "12345678900",
      password: "senha123",
      email: "rodrigo@example.com",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/atualizado com sucesso/i);
  });

  test("PUT /users/:id - deve falhar ao tentar alterar e-mail", async () => {
    const response = await request(app).put(`/users/${user1Id}`).send({
      name: "Rodrigo Alterado",
      document: "12345678900",
      password: "senha123",
      email: "novo@email.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/não é permitido alterar o e-mail/i);
  });

  test("PUT /users/:id - deve falhar ao editar outro usuário", async () => {
    const response = await request(app).put(`/users/${user2Id}`).send({
      name: "Invadindo Outro",
      document: "12345678900",
      password: "senha123",
      email: "outro@example.com",
    });

    expect(response.status).toBe(403);
    expect(response.body.error).toMatch(/editar o seu próprio/i);
  });

  test("DELETE /users/:id - deve excluir usuário com sucesso", async () => {
    const response = await request(app)
      .delete(`/users/${user2Id}`)
      .set({ Authorization: "Bearer fake-token" });

    expect(response.status).toBe(204);
  });

  test("DELETE /users/:id - deve retornar erro se usuário não existir", async () => {
    const response = await request(app)
      .delete(`/users/999`)
      .set({ Authorization: "Bearer fake-token" });

    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/usuário não encontrado/i);
  });
});
