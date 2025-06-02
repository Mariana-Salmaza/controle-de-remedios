require("dotenv").config();

const isTest = process.env.NODE_ENV === "test";

const databaseConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: isTest ? process.env.DB_NAME_TEST : process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: "mysql",
  logging: !isTest,
};

module.exports = {
  development: databaseConfig,
  test: databaseConfig,
  production: databaseConfig,
};
