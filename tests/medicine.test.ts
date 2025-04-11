import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/database";

let mockedUserId = 1;

jest.mock("../src/middlewares/authMiddleware", () => {
  return {
    authMiddleware: (req: any, _res: any, next: any) => {
      req.user = { id: mockedUserId };
      next();
    },
  };
});

describe("Medicine Endpoints", () => {
  let medicineId: number;
  let categoryId: number;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await sequelize.sync({ force: true });

    // Cria dois usuários
    await request(app).post("/users").send({
      name: "Usuário 1",
      email: "usuario1@email.com",
      document: "12312312312",
      password: "senha123",
    });

    await request(app).post("/users").send({
      name: "Usuário 2",
      email: "usuario2@email.com",
      document: "98798798700",
      password: "senha123",
    });

    // Cria uma categoria associada ao usuário 1
    const category = await request(app)
      .post("/categories")
      .send({ name: "Categoria Teste" });

    categoryId = category.body.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /medicines - cria novo medicamento", async () => {
    mockedUserId = 1;

    const res = await request(app).post("/medicines").send({
      name: "Paracetamol",
      dosage: "500mg",
      quantity: 10,
      schedules: "08:00, 12:00",
      categoryId,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    medicineId = res.body.id;
  });

  test("POST /medicines - falha ao criar com campos faltando", async () => {
    const res = await request(app).post("/medicines").send({
      dosage: "500mg",
      quantity: 5,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/obrigatórios/i);
  });

  test("PUT /medicines/:id - atualiza medicamento com sucesso", async () => {
    const res = await request(app).put(`/medicines/${medicineId}`).send({
      name: "Dipirona",
      dosage: "1g",
      quantity: 15,
      schedules: "09:00, 21:00",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/atualizado com sucesso/i);
  });

  test("DELETE /medicines/:id - exclui medicamento com sucesso", async () => {
    const res = await request(app).delete(`/medicines/${medicineId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/excluído com sucesso/i);
  });

  test("PUT /medicines/:id - falha se não for dono", async () => {
    // Cria outro medicamento com user 1
    mockedUserId = 1;
    const med = await request(app).post("/medicines").send({
      name: "Ibuprofeno",
      dosage: "200mg",
      quantity: 5,
      schedules: "10:00",
      categoryId,
    });

    // Tenta atualizar como outro usuário
    mockedUserId = 2;
    const res = await request(app).put(`/medicines/${med.body.id}`).send({
      name: "Ibuprofeno Alterado",
      dosage: "400mg",
      quantity: 10,
      schedules: "08:00",
    });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/acesso negado/i);
  });
});
