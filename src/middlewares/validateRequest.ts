import { Request, Response, NextFunction } from "express";
import Joi from "joi";

interface ValidationSchemas {
    body?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
}

/**
 * Middleware global de validação usando Joi
 * Suporta body, query, params
 * Retorna erros no padrão RFC 7807
 */
export const validateRequest = (schemas: ValidationSchemas) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationErrors: Record<string, any> = {};

        // 🔹 Validar body
        if (schemas.body) {
            const { error } = schemas.body.validate(req.body, {
                abortEarly: false,
                stripUnknown: true, // remove campos não permitidos
            });
            if (error) {
                error.details.forEach((err) => {
                    validationErrors[err.path.join(".")] = err.message;
                });
            }
        }

        // 🔹 Validar query
        if (schemas.query) {
            const { error } = schemas.query.validate(req.query, {
                abortEarly: false,
                stripUnknown: true,
            });
            if (error) {
                error.details.forEach((err) => {
                    validationErrors[err.path.join(".")] = err.message;
                });
            }
        }

        // 🔹 Validar params
        if (schemas.params) {
            const { error } = schemas.params.validate(req.params, {
                abortEarly: false,
                stripUnknown: true,
            });
            if (error) {
                error.details.forEach((err) => {
                    validationErrors[err.path.join(".")] = err.message;
                });
            }
        }

        // 🔥 Se houve erros → responder no padrão RFC 7807
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                type: "https://example.com/validation-error",
                title: "Validation Error",
                status: 400,
                detail: "One or more validation errors occurred.",
                errors: validationErrors,
            });
        }

        return next();
    };
};
