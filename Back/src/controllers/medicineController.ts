import { Request, Response } from "express";
import Medicine from "../models/medicineModel";
import UserModel from "../models/UserModel";
import CategoryModel from "../models/categoryModel";

export const createMedicine = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, dosage, quantity, schedules, categoryId } = req.body;

    if (!name || !dosage || quantity === undefined || !schedules || !userId) {
      return res.status(400).json({
        error: "Nome, dosagem, quantidade, horários e userId são obrigatórios",
      });
    }

    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({
        error: "A quantidade deve ser um número válido e não negativa",
      });
    }

    // Verificando se a categoria foi fornecida, se não, definindo como NULL
    const validCategoryId = categoryId ? parseInt(categoryId) : null;
    if (validCategoryId && isNaN(validCategoryId)) {
      return res.status(400).json({ error: "Categoria inválida" });
    }

    const category = await CategoryModel.findByPk(categoryId);
    if (!category && categoryId !== null) {
      return res.status(400).json({ error: "Categoria não encontrada" });
    }

    if (categoryId && isNaN(Number(categoryId))) {
      return res.status(400).json({ error: "Categoria inválida" });
    }

    const userExists = await UserModel.findByPk(userId);
    if (!userExists) {
      return res.status(400).json({
        error: "Usuário não encontrado",
      });
    }

    const medicine = await Medicine.create({
      name,
      dosage,
      quantity,
      schedules,
      userId,
      categoryId,
    });
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ error: "Algo deu errado ao criar o medicamento" });
  }
};

export const getAllMedicines = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const medicines = await Medicine.findAndCountAll({
      where: { userId },
      limit,
      offset,
    });

    res.json({
      total: medicines.count,
      pages: Math.ceil(medicines.count / limit),
      currentPage: page,
      medicines: medicines.rows,
    });
  } catch {
    res
      .status(500)
      .json({ error: "Algo deu errado ao buscar os medicamentos" });
  }
};

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

export const getMedicinesByUserId = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const medicines = await Medicine.findAll({
      where: { userId },
    });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({
      error: "Algo deu errado ao buscar os medicamentos do usuário",
    });
  }
};

export const updateMedicine = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const userId = (req as any).user?.id;
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({ error: "Medicamento não encontrado" });
    }

    if (medicine.userId !== userId) {
      return res.status(403).json({ error: "Acesso negado." });
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

export const getMedicinesByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const medicines = await Medicine.findAll({
      where: { categoryId },
      include: [
        {
          model: CategoryModel,
          as: "category",
        },
      ],
    });

    if (medicines.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhum medicamento encontrado para esta categoria" });
    }

    res.json({ medicines });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar medicamentos da categoria" });
  }
};

export const deleteMedicine = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const userId = (req as any).user?.id;
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({ error: "Medicamento não encontrado" });
    }

    if (medicine.userId !== userId) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    await medicine.destroy();
    res.json({ message: "Medicamento excluído com sucesso" });
  } catch {
    res.status(500).json({ error: "Algo deu errado ao excluir o medicamento" });
  }
};
