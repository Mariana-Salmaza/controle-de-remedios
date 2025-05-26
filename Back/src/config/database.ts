import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isTest = process.env.NODE_ENV === "test";

const sequelize = new Sequelize(
  isTest ? process.env.DB_NAME_TEST! : process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: !isTest,
  }
);

export default sequelize;
