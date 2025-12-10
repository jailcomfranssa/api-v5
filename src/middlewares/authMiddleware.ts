import { Request, Response, NextFunction } from "express";
import { AuthService } from "../model/Auth/AuthService";
import { AppError } from "../errors/AppError";

const authService = new AuthService();

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        role: string;
        email?: string;
    };
}

export function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
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
            role: (decoded as any).role,
        };

        return next();
    } catch (error) {
        throw new AppError("Token inválido ou expirado.", 401);
    }
}
