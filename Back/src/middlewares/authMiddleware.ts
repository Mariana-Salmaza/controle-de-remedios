import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Token não fornecido." });
  }

  try {
    const decoded = verifyToken(token);

    // Armazena os dados do usuário direto no req.user
    if (decoded?.user?.id) {
      (req as any).user = decoded.user;
      return next();
    }

    return res.status(401).json({ error: "Token inválido." });
  } catch (error) {
    return res.status(401).json({ error: "Token inválido." });
  }
};
