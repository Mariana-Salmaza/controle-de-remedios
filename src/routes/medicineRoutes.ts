import express from "express";
import {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getMedicinesByUserId,
  getMedicinesByCategory,
} from "../controllers/medicineController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/medicines", authMiddleware, createMedicine);
router.get("/medicines", authMiddleware, getAllMedicines);
router.get("/medicines/:id", authMiddleware, getMedicineById);
router.get("/medicines/user/:userId", authMiddleware, getMedicinesByUserId);
router.get(
  "/medicines/category/:categoryId",
  authMiddleware,
  getMedicinesByCategory
);
router.put("/medicines/:id", authMiddleware, updateMedicine);
router.delete("/medicines/:id", authMiddleware, deleteMedicine);

export default router;
