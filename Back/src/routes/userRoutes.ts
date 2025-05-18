import express from "express";
import {
  getAll,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/users/:id", authMiddleware, getUserById);
router.post("/users", createUser);
router.get("/users", authMiddleware, getAll);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
