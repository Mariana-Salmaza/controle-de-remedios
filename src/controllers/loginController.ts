import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { generateToken } from "../utils/jwt";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = generateToken(user);

    return res
      .status(200)
      .json({ message: "Login realizado com sucesso", token });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};
