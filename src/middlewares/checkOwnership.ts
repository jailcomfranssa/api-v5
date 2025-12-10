import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";
import { AppError } from "../errors/AppError";

export function checkOwnership() {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userId = Number(req.params.id);

        if (!req.user) {
            throw new AppError("Usuário não autenticado.", 401);
        }

        // ADMIN pode tudo
        if (req.user.role === "ADMIN") {
            return next();
        }

        // Usuário comum só pode acessar a si mesmo
        if (req.user.id !== userId) {
            throw new AppError(
                "Você não pode acessar dados de outro usuário.",
                403
            );
        }

        return next();
    };
}
