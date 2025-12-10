import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";
import { AppError } from "../errors/AppError";

export function authorizeRole(...allowedRoles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError("Usuário não autenticado.", 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError(`Acesso negado para tipo: ${req.user.role}.`, 403);
        }

        return next();
    };
}
