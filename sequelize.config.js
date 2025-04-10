require("dotenv").config();

const isTest = process.env.NODE_ENV === "test";

const databaseConfig = {
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: isTest
    ? "controle_remedios_test"
    : process.env.DB_NAME || "controle_remedios",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  dialect: "mysql",
  logging: !isTest,
};

module.exports = {
  development: databaseConfig,
  test: databaseConfig,
  production: databaseConfig,
};
