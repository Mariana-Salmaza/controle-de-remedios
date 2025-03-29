import app from "./app";
import sequelize from "./config/database";

const port = 3001;

// sync database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Banco de dados sincronizado com sucesso.");
    app.listen(port, () => {
      console.log("O servidor está sendo executado na porta", port);
    });
  })
  .catch((error) => {
    console.log("Erro ao sincronizar o banco de dados:", error);
  });
