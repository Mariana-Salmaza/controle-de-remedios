import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import medicineRoutes from "./routes/medicineRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import loginRoutes from "./routes/loginRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/login", loginRoutes);

export default app;
