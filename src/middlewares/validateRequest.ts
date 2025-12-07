import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";

export interface ValidationSchemas {
    body?: Joi.ObjectSchema<any>;
    query?: Joi.ObjectSchema<any>;
    params?: Joi.ObjectSchema<any>;
}

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

export const validateRequest = (schemas: ValidationSchemas): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationErrors: Record<string, string[]> = {};

        const opts: Joi.ValidationOptions = {
            abortEarly: false,
            stripUnknown: true,
            allowUnknown: false,
            convert: true,
        };

        // 🔹 Params
        if (schemas.params) {
            const { error, value } = schemas.params.validate(req.params, opts);

            if (error) {
                error.details.forEach((d) => {
                    const key = d.path.join(".") || "params";
                    validationErrors[key] = validationErrors[key] || [];
                    validationErrors[key].push(d.message);
                });
            } else {
                Object.assign(req.params, value); // ✔️ CORRETO
            }
        }

        // 🔹 Query
        if (schemas.query) {
            const { error, value } = schemas.query.validate(req.query, opts);

            if (error) {
                error.details.forEach((d) => {
                    const key = d.path.join(".") || "query";
                    validationErrors[key] = validationErrors[key] || [];
                    validationErrors[key].push(d.message);
                });
            } else {
                Object.assign(req.query, value); // ✔️ CORRETO
            }
        }

        // 🔹 Body
        if (schemas.body) {
            const { error, value } = schemas.body.validate(req.body, opts);

            if (error) {
                error.details.forEach((d) => {
                    const key = d.path.join(".") || "body";
                    validationErrors[key] = validationErrors[key] || [];
                    validationErrors[key].push(d.message);
                });
            } else {
                Object.assign(req.body, value); // ✔️ CORRETO
            }
        }

        // 🔥 Se existe algum erro → retornar RFC7807
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                type: `https://httpstatuses.io/400`,
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
