import { Sequelize } from "sequelize";

const sequelize = new Sequelize("controle_remedios", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
