import { Request, Response } from "express";
import CategoryModel from "../models/categoryModel";

// Cria uma nova categoria
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ error: "O nome da categoria é obrigatório" });
    }

    const category = await CategoryModel.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Algo deu errado ao criar a categoria" });
  }
};

// Busca todas as categorias
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.findAll();
    res.json(categories);
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

    const category = await CategoryModel.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
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
    const category = await CategoryModel.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    await category.destroy();

    res.json({ message: "Categoria excluída com sucesso" });
  } catch {
    res.status(500).json({ error: "Algo deu errado ao excluir a categoria" });
  }
};
