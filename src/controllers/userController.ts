import { Request, Response } from "express";
import UserModel from "../models/UserModel";

// método que busca todos
export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Algo deu errado!" });
  }
};

// método que busca um único usuário por ID
export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const user = await UserModel.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Algo deu errado!" });
  }
};

//método que cria um novo usuário
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, document, password } = req.body;

    if (!name || !email || !document || !password) {
      return res
        .status(400)
        .json({ error: "Nome, e-mail, documento e senha são obrigatórios" });
    }

    const user = await UserModel.create({ name, email, document, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json("Erro interno no servido" + error);
  }
};

// método que atualiza um usuário
export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { name, document, password } = req.body;
    if (!name || !document || !password) {
      return res
        .status(400)
        .json({ error: "Nome, documento e senha são obrigatórios." });
    }

    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    user.name = name;
    user.document = document;
    user.password = password;

    await user.save();

    res.json({ message: "Usuário atualizado com sucesso!", user });
  } catch (error) {
    res.status(500).json({ error: "Algo deu errado no servidor!" });
  }
};

// método que exclui o usuário
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const user = await UserModel.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await user.destroy();
    res.status(204).send({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Algo deu errado!" });
  }
};
