import express from "express";
import {
  createMedicine,
  getMedicines,
} from "../controllers/medicineController";

const router = express.Router();

router.post("/medicines", createMedicine);
router.get("/medicines", getMedicines);

export default router;
