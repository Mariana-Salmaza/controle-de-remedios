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

router.get("/:id", authMiddleware, getUserById);
router.post("/", createUser);
router.get("/", authMiddleware, getAll);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
