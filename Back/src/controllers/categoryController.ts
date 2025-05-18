import { Request, Response } from "express";
import CategoryModel from "../models/categoryModel";
import UserModel from "../models/UserModel";

// Cria uma nova categoria
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = (req as any).user?.id;

    if (!name) {
      return res
        .status(400)
        .json({ error: "O nome da categoria é obrigatório" });
    }

    const category = await CategoryModel.create({ name, userId });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Algo deu errado ao criar a categoria" });
  }
};

// Busca todas as categorias
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const categories = await CategoryModel.findAndCountAll({
      where: { userId },
      limit,
      offset,
    });

    res.json({
      total: categories.count,
      pages: Math.ceil(categories.count / limit),
      currentPage: page,
      categories: categories.rows,
    });
  } catch {
    res.status(500).json({ error: "Algo deu errado ao buscar as categorias" });
  }
};

// Busca uma categoria pelo ID
export const getCategoryById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const category = await CategoryModel.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json(category);
  } catch {
    res.status(500).json({ error: "Algo deu errado ao buscar a categoria" });
  }
};

// Atualiza uma categoria
export const updateCategory = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { name } = req.body;
    const userId = (req as any).user?.id;

    const category = await CategoryModel.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    if (category.userId !== userId) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    category.name = name;
    await category.save();

    res.json({ message: "Categoria atualizada com sucesso", category });
  } catch {
    res.status(500).json({ error: "Algo deu errado ao atualizar a categoria" });
  }
};

// Exclui uma categoria
export const deleteCategory = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const userId = (req as any).user?.id;
    const category = await CategoryModel.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    if (category.userId !== userId) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    await category.destroy();
    res.json({ message: "Categoria excluída com sucesso" });
  } catch {
    res.status(500).json({ error: "Algo deu errado ao excluir a categoria" });
  }
};
