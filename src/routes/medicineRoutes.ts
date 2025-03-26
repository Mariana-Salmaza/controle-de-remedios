import express from "express";
import {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getMedicinesByUserId,
} from "../controllers/medicineController";

const router = express.Router();

router.post("/medicines", createMedicine);
router.get("/medicines", getAllMedicines);
router.get("/medicines/:id", getMedicineById);
router.get("/medicines/user/:userId", getMedicinesByUserId);
router.put("/medicines/:id", updateMedicine);
router.delete("/medicines/:id", deleteMedicine);

export default router;
