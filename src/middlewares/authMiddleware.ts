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
    if (decoded && decoded.user && decoded.user.id) {
      (req as any).user = decoded.user;
    } else {
      return res.status(401).json({ error: "Token inválido." });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido." });
  }
};
