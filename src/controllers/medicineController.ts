import { Request, Response } from "express";
import Medicine from "../models/medicineModel";

export const createMedicine = async (req: Request, res: Response) => {
  try {
    const { name, dosage, quantity } = req.body;

    // Validação para garantir que todos os campos obrigatórios estão presentes
    if (!name || !dosage || !quantity) {
      return res
        .status(400)
        .json({
          error: "Todos os campos (name, dosage, quantity) são obrigatórios",
        });
    }

    // Validação adicional para garantir que a quantidade seja um número válido
    if (isNaN(quantity) || quantity < 0) {
      return res
        .status(400)
        .json({
          error: "A quantidade deve ser um número válido e não negativo",
        });
    }

    // Se passar as validações, cria o medicamento
    const medicine = await Medicine.create({ name, dosage, quantity });
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar medicamento", error });
  }
};

export const getMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await Medicine.findAll();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar medicamentos", error });
  }
};
