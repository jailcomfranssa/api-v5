import { Request, Response, NextFunction } from "express";
import { AuthService } from "../model/Auth/AuthService";
import { AppError } from "../errors/AppError";
import { Role } from "../../generated/prisma/client";
import { JwtPayloadCustom } from "../types/jwt";

const authService = new AuthService();

export interface AuthenticatedRequest extends Request {}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token não fornecido.", 401);
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
        throw new AppError("Token mal formatado.", 401);
    }

    try {
        const decoded = authService.verifyToken(token);

        req.user = {
            id: Number(decoded.sub),
            email: decoded.email,
            role: decoded.role as Role, // ✔ agora o tipo está correto
        };

        return next();
    } catch (error) {
        throw new AppError("Token inválido ou expirado.", 401);
    }
}
