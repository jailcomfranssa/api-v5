import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 🔹 Se for um erro conhecido (AppError)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            type: `https://httpstatuses.io/${err.statusCode}`,
            title: getTitleByStatus(err.statusCode),
            status: err.statusCode,
            detail: err.message,
        });
    }

    // 🔹 Erro inesperado (500)
    console.error(err);

    return res.status(500).json({
        type: `https://httpstatuses.io/${500}`,
        title: "Internal Server Error",
        status: 500,
        detail: "An unexpected error occurred.",
    });
};

// 🔥 Mapeia o status para títulos RFC 7807
const getTitleByStatus = (status: number): string => {
    switch (status) {
        case 400:
            return "Bad Request";
        case 401:
            return "Unauthorized";
        case 403:
            return "Forbidden";
        case 404:
            return "Not Found";
        case 409:
            return "Conflict";
        case 422:
            return "Unprocessable Entity";
        default:
            return "Error";
    }
};
