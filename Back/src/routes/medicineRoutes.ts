import express from "express";
import {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getMedicinesByCategory,
} from "../controllers/medicineController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createMedicine);
router.get("/", authMiddleware, getAllMedicines);
router.get("/:id", authMiddleware, getMedicineById);
router.get("/category/:categoryId", authMiddleware, getMedicinesByCategory);
router.put("/:id", authMiddleware, updateMedicine);
router.delete("/:id", authMiddleware, deleteMedicine);

export default router;
