import { Request, Response } from "express";
import Medicine from "../models/medicineModel";

// Cria um novo medicamento
export const createMedicine = async (req: Request, res: Response) => {
  try {
    const { name, dosage, quantity, schedules } = req.body;

    if (!name || !dosage || quantity === undefined || !schedules) {
      return res.status(400).json({
        error: "Nome, dosagem, quantidade e horários são obrigatórios",
      });
    }

    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({
        error: "A quantidade deve ser um número válido e não negativa",
      });
    }

    const medicine = await Medicine.create({
      name,
      dosage,
      quantity,
      schedules,
    });
    res.status(201).json(medicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Algo deu errado ao criar o medicamento" });
  }
};

// Busca todos os medicamentos
export const getAllMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await Medicine.findAll();
    res.json(medicines);
  } catch {
    res
      .status(500)
      .json({ error: "Algo deu errado ao buscar os medicamentos" });
  }
};

// Busca um medicamento pelo ID
export const getMedicineById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({ error: "Medicamento não encontrado" });
    }

    res.json(medicine);
  } catch {
    res.status(500).json({ error: "Algo deu errado ao buscar o medicamento" });
  }
};

// Atualiza um medicamento
export const updateMedicine = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({ error: "Medicamento não encontrado" });
    }

    const { name, dosage, quantity, schedules } = req.body;

    if (!name || !dosage || quantity === undefined || schedules === undefined) {
      return res.status(400).json({
        error: "Nome, dosagem, quantidade e horários são obrigatórios",
      });
    }

    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({
        error: "A quantidade deve ser um número válido e não negativa",
      });
    }

    medicine.name = name;
    medicine.dosage = dosage;
    medicine.quantity = quantity;
    medicine.schedules = schedules;

    await medicine.save();

    res.json({ message: "Medicamento atualizado com sucesso", medicine });
  } catch {
    res
      .status(500)
      .json({ error: "Algo deu errado ao atualizar o medicamento" });
  }
};

// Exclui um medicamento
export const deleteMedicine = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({ error: "Medicamento não encontrado" });
    }

    await medicine.destroy();

    res.json({ message: "Medicamento excluído com sucesso" });
  } catch {
    res.status(500).json({ error: "Algo deu errado ao excluir o medicamento" });
  }
};
