import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/database";

// Mock da autenticação
jest.mock("../src/middlewares/authMiddleware", () => {
  return {
    authMiddleware: (_req: any, _res: any, next: any) => next(),
  };
});

describe("Medicine Endpoints", () => {
  let createdMedicineId: number;
  let userId: number;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await sequelize.sync({ force: true });

    // Cria um usuário para vincular ao medicamento
    const user = await request(app).post("/users").send({
      name: "Paciente Medicado",
      email: "paciente@email.com",
      document: "99999999999",
      password: "senha123",
    });
    userId = user.body.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /medicines - deve criar um novo medicamento", async () => {
    const response = await request(app).post("/medicines").send({
      name: "Paracetamol",
      dosage: "500mg",
      quantity: 20,
      schedules: "08:00, 12:00, 18:00",
      userId,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    createdMedicineId = response.body.id;
  });

  test("GET /medicines - deve listar os medicamentos com paginação", async () => {
    const response = await request(app)
      .get("/medicines?page=1&limit=10")
      .set({ Authorization: "Bearer fake" });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.medicines)).toBe(true);
  });

  test("GET /medicines/:id - deve buscar medicamento por ID", async () => {
    const response = await request(app)
      .get(`/medicines/${createdMedicineId}`)
      .set({ Authorization: "Bearer fake" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Paracetamol");
  });
});
