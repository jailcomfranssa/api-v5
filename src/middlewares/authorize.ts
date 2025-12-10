// src/middlewares/authorize.ts
import { RequestHandler } from "express";
import { AppError } from "../errors/AppError";

export const authorize = (...allowedRoles: string[]): RequestHandler => {
    return (req, _res, next) => {
        const user = req.user;
        if (!user) {
            return next(new AppError("Não autenticado.", 401));
        }

        if (!allowedRoles.includes(user.role)) {
            return next(new AppError("Acesso negado.", 403));
        }

        return next();
    };
};

export default authorize;
