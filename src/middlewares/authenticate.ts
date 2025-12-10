// src/middlewares/authenticate.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthService } from "../model/Auth/AuthService";
import { UserRepository } from "../model/User/userRepository";
import { AppError } from "../errors/AppError";

const authService = new AuthService();
const userRepository = new UserRepository();

export const authenticate = (): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const header = req.headers.authorization;
            if (!header) throw new AppError("Token não fornecido.", 401);

            const parts = header.split(" ");
            if (parts.length !== 2 || parts[0] !== "Bearer") {
                throw new AppError(
                    "Formato do token inválido. Use: Bearer <token>",
                    401
                );
            }

            const token = parts[1];
            const decoded: any = authService.verifyToken(token);

            // decoded.sub é o id do usuário (nós definimos assim)
            const userId = Number(decoded.sub);
            if (!userId) throw new AppError("Token inválido.", 401);

            const user = await userRepository.findById(userId);
            if (!user) throw new AppError("Usuário não encontrado.", 401);

            // Anexa informação essencial ao req.user (não exposicional)
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role,
            };

            return next();
        } catch (err) {
            next(err);
        }
    };
};

export default authenticate;
