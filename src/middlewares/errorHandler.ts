import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import Joi from "joi";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 🔹 RFC 7807 base da resposta
    const baseProblem = {
        type: "",
        title: "",
        status: 0,
        detail: "",
        instance: req.originalUrl,
        timestamp: new Date().toISOString(),
    };

    // 🔹 Erro conhecido da aplicação (AppError)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            ...baseProblem,
            type: `https://httpstatuses.io/${err.statusCode}`,
            title: getTitleByStatus(err.statusCode),
            status: err.statusCode,
            detail: err.message,
            errors: err.details || undefined, // opcional
        });
    }

    // 🔹 Erros de validação Joi que escaparem do validateRequest
    if (err instanceof Joi.ValidationError) {
        return res.status(400).json({
            ...baseProblem,
            type: "https://httpstatuses.io/400",
            title: "Requisição inválida",
            status: 400,
            detail: "Os dados enviados não são válidos.",
            errors: err.details.map((d) => d.message),
        });
    }

    // 🔹 Erros inesperados (500)
    console.error("Erro interno:", err);

    return res.status(500).json({
        ...baseProblem,
        type: "https://httpstatuses.io/500",
        title: "Erro interno no servidor",
        status: 500,
        detail: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        // ❗ nunca exponha stack em produção
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

// 🔥 Mapeamento do status para títulos RFC 7807 (pt-br)
const getTitleByStatus = (status: number): string => {
    switch (status) {
        case 400:
            return "Requisição inválida";
        case 401:
            return "Não autorizado";
        case 403:
            return "Acesso negado";
        case 404:
            return "Recurso não encontrado";
        case 409:
            return "Conflito de dados";
        case 422:
            return "Entidade não processável";
        default:
            return "Erro";
    }
};
