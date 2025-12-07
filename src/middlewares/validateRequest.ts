import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";

/**
 * Tipagem do parâmetro aceito pelo middleware
 */
export interface ValidationSchemas {
    body?: Joi.ObjectSchema<any>;
    query?: Joi.ObjectSchema<any>;
    params?: Joi.ObjectSchema<any>;
}

/**
 * Gera título a partir do status (usado no RFC7807)
 */
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

/**
 * validateRequest
 * - Recebe um objeto com schemas Joi: { body?, query?, params? }
 * - Valida cada parte da request (params, query, body)
 * - Em caso de erro responde com RFC 7807 (type, title, status, detail, errors)
 * - Em caso de sucesso chama next()
 */
export const validateRequest = (schemas: ValidationSchemas): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationErrors: Record<string, string[]> = {};

        const opts: Joi.ValidationOptions = {
            abortEarly: false, // coletar todos os erros
            stripUnknown: true, // remove chaves não especificadas no schema
            allowUnknown: false,
            convert: true,
        };

        // Params
        if (schemas.params) {
            const { error, value } = schemas.params.validate(req.params, opts);
            if (error) {
                error.details.forEach((d) => {
                    const key = d.path.join(".") || "params";
                    validationErrors[key] = validationErrors[key] || [];
                    validationErrors[key].push(d.message);
                });
            } else {
                // apply sanitized values back to req.params
                req.params = value;
            }
        }

        // Query
        if (schemas.query) {
            const { error, value } = schemas.query.validate(req.query, opts);
            if (error) {
                error.details.forEach((d) => {
                    const key = d.path.join(".") || "query";
                    validationErrors[key] = validationErrors[key] || [];
                    validationErrors[key].push(d.message);
                });
            } else {
                req.query = value;
            }
        }

        // Body
        if (schemas.body) {
            const { error, value } = schemas.body.validate(req.body, opts);
            if (error) {
                error.details.forEach((d) => {
                    const key = d.path.join(".") || "body";
                    validationErrors[key] = validationErrors[key] || [];
                    validationErrors[key].push(d.message);
                });
            } else {
                req.body = value;
            }
        }

        // Se tiver erros => retornar RFC 7807 400
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                type: `https://httpstatuses.io/400`,
                title: getTitleByStatus(400),
                status: 400,
                detail: "One or more validation errors occurred.",
                errors: validationErrors, // cada campo -> array de mensagens
            });
        }

        return next();
    };
};

export default validateRequest;
