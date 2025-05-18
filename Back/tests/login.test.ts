import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/database";
import UserModel from "../src/models/UserModel";

describe("Login Endpoint", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await sequelize.sync({ force: true });

    // Cria um usuário para testar login
    await UserModel.create({
      name: "Usuário Teste",
      email: "teste@email.com",
      document: "12345678900",
      password: "senha123",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /login - login com sucesso deve retornar token", async () => {
    const response = await request(app).post("/login").send({
      email: "teste@email.com",
      password: "senha123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("POST /login - com senha incorreta deve retornar erro", async () => {
    const response = await request(app).post("/login").send({
      email: "teste@email.com",
      password: "senhaErrada",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Senha inválida");
  });

  test("POST /login - com email inexistente deve retornar erro", async () => {
    const response = await request(app).post("/login").send({
      email: "naoexiste@email.com",
      password: "qualquer",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Usuário não encontrado");
  });
});
