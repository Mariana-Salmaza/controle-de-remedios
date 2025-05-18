import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/categories", authMiddleware, createCategory);
router.get("/categories", authMiddleware, getAllCategories);
router.get("/categories/:id", authMiddleware, getCategoryById);
router.put("/categories/:id", authMiddleware, updateCategory);
router.delete("/categories/:id", authMiddleware, deleteCategory);

export default router;
