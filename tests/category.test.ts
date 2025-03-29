import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/database";

jest.mock("../src/middlewares/authMiddleware", () => {
  return {
    authMiddleware: (_req: any, _res: any, next: any) => next(),
  };
});

describe("Category Endpoints", () => {
  let categoryId: number;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /categories - deve criar uma nova categoria", async () => {
    const response = await request(app).post("/categories").send({
      name: "Analgésicos",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Analgésicos");
    categoryId = response.body.id;
  });

  test("GET /categories - deve retornar lista de categorias", async () => {
    const response = await request(app)
      .get("/categories")
      .set({ Authorization: "Bearer fake" });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.categories)).toBe(true);
  });

  test("GET /categories/:id - deve retornar categoria por ID", async () => {
    const response = await request(app)
      .get(`/categories/${categoryId}`)
      .set({ Authorization: "Bearer fake" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Analgésicos");
  });
});
