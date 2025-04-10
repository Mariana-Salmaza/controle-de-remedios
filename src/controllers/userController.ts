import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import {
  validateEmail,
  validateCPF,
  validatePasswordStrength,
} from "../validators/userValidator";

// método que busca todos
export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const users = await UserModel.findAndCountAll({
      limit,
      offset,
    });

    res.json({
      total: users.count,
      pages: Math.ceil(users.count / limit),
      currentPage: page,
      users: users.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Algo deu errado!" });
  }
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const user = await UserModel.findByPk(req.params.id); // Busca o usuário pelo ID

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json(user); // Retorna os dados do usuário
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

    // Verifica se o e-mail já está cadastrado
    const emailExists = await UserModel.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ error: "E-mail já está em uso" });
    }

    const user = await UserModel.create({ name, email, document, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// método que atualiza usuário
export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { name, document, password, email } = req.body;
    const userIdFromToken = (req as any).user?.id; // Obtém o ID do usuário logado do token

    if (!name || !document || !password) {
      return res
        .status(400)
        .json({ error: "Nome, documento e senha são obrigatórios." });
    }

    // Valida o CPF
    if (!validateCPF(document)) {
      return res.status(400).json({ error: "CPF inválido." });
    }

    // Valida a senha
    if (!validatePasswordStrength(password)) {
      return res
        .status(400)
        .json({ error: "A senha deve ter no mínimo 6 caracteres." });
    }

    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Verifica se o usuário logado é o mesmo que está tentando atualizar
    if (user.id !== userIdFromToken) {
      return res
        .status(403)
        .json({ error: "Você só pode atualizar suas próprias informações." });
    }

    // Impede alteração do email
    if (email && email !== user.email) {
      return res
        .status(400)
        .json({ error: "Não é permitido alterar o e-mail." });
    }

    // Atualiza os campos permitidos
    user.name = name;
    user.document = document;
    user.password = password;

    await user.save();

    res.json({ message: "Usuário atualizado com sucesso!", user });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

// método que exclui o usuário
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const userIdFromToken = (req as any).user?.id;

    const user = await UserModel.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Só permite exclusão do próprio usuário
    if (user.id !== userIdFromToken) {
      return res
        .status(403)
        .json({ error: "Você só pode excluir a sua própria conta." });
    }

    await user.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Algo deu errado!" });
  }
};
