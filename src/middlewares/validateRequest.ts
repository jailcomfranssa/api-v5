import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";

export interface ValidationSchemas {
    body?: Joi.ObjectSchema<any>;
    query?: Joi.ObjectSchema<any>;
    params?: Joi.ObjectSchema<any>;
}

/**
 * Gera título baseado no status HTTP (RFC7807)
 */
const getTitleByStatus = (status: number): string => {
    const map: Record<number, string> = {
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        409: "Conflict",
        422: "Unprocessable Entity",
    };

    return map[status] ?? "Error";
};

/**
 * Middleware de validação universal (params, query, body)
 * Com suporte a RFC7807
 */
export const validateRequest = (schemas: ValidationSchemas): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationErrors: Record<string, string[]> = {};

        const opts: Joi.ValidationOptions = {
            abortEarly: false,
            stripUnknown: true,
            allowUnknown: false,
            convert: true,
        };

        // -----------------------------
        // 1. PARAMS
        // -----------------------------
        if (schemas.params) {
            const { error, value } = schemas.params.validate(req.params, opts);

            if (error) {
                error.details.forEach((d) => {
                    const key = d.path.join(".") || "params";
                    validationErrors[key] ??= [];
                    validationErrors[key].push(d.message);
                });
            } else {
                // ⚠️ CORRETO: somente substituir as chaves, não o objeto inteiro
                for (const key of Object.keys(req.params)) delete req.params[key];
                Object.assign(req.params, value);
            }
        }

        // -----------------------------
        // 2. QUERY
        // -----------------------------
        if (schemas.query) {
            const { error, value } = schemas.query.validate(req.query, opts);

            if (error) {
                error.details.forEach((d) => {
                    const key = d.path.join(".") || "query";
                    validationErrors[key] ??= [];
                    validationErrors[key].push(d.message);
                });
            } else {
                // ⚠️ IMPORTANTE: req.query pode ser imutável em alguns drivers
                Object.keys(req.query).forEach((k) => delete (req.query as any)[k]);
                Object.assign(req.query, value);
            }
        }

        // -----------------------------
        // 3. BODY
        // -----------------------------
        if (schemas.body) {
            const { error, value } = schemas.body.validate(req.body, opts);

            if (error) {
                error.details.forEach((d) => {
                    const key = d.path.join(".") || "body";
                    validationErrors[key] ??= [];
                    validationErrors[key].push(d.message);
                });
            } else {
                if (!req.body || typeof req.body !== "object") {
                    req.body = {};
                }
                Object.assign(req.body, value);
            }
        }

        // -----------------------------
        // SE EXISTEM ERROS — RFC7807
        // -----------------------------
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                type: "https://httpstatuses.io/400",
                title: getTitleByStatus(400),
                status: 400,
                detail: "Erros de validação encontrados.",
                errors: validationErrors,
            });
        }

        return next();
    };
};

export default validateRequest;
