import { Request, Response } from "express";
import UserModel from "../models/UserModel";

// Funções auxiliares
const validateEmail = (email: string): boolean => {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
};

const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/[.-]/g, "");
  return /^\d{11}$/.test(cleanCPF);
};

const validatePasswordStrength = (password: string): boolean => {
  return password.length >= 6; // Pode adaptar para exigir números, maiúsculas, etc.
};

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

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "E-mail inválido" });
    }

    if (!validateCPF(document)) {
      return res.status(400).json({ error: "CPF inválido" });
    }

    if (!validatePasswordStrength(password)) {
      return res
        .status(400)
        .json({ error: "A senha deve ter no mínimo 6 caracteres" });
    }

    const user = await UserModel.create({ name, email, document, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// método que atualiza um usuário
export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { name, document, password } = req.body;
    const userIdFromToken = (req as any).user?.id;

    if (!name || !document || !password) {
      return res
        .status(400)
        .json({ error: "Nome, documento e senha são obrigatórios." });
    }

    if (!validateCPF(document)) {
      return res.status(400).json({ error: "CPF inválido" });
    }

    if (!validatePasswordStrength(password)) {
      return res
        .status(400)
        .json({ error: "A senha deve ter no mínimo 6 caracteres" });
    }

    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (user.id !== userIdFromToken) {
      return res
        .status(403)
        .json({ error: "Você só pode editar o seu próprio usuário." });
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
