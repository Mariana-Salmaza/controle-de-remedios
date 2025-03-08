import express from "express";
import sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";
import medicineRoutes from "./routes/medicineRoutes";

const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.send("Hello, Word! :) ");
});

app.use(express.json());
app.use(userRoutes);
app.use(medicineRoutes);

// sync database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("database foi sincronizado com sucesso");
  })
  .catch((error) => {
    console.log("deu zica no bagulho", error);
  });

app.listen(port, () => {
  console.log("O servidor está sendo executado na porta", port);
});
