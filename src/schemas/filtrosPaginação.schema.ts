import Joi from "joi";
import { createPaginationSchema } from "./pagination.schema";

const roleEnum = ["ADMIN", "FUNCIONARIO", "CLIENTE"];

export const filtrosPaginaçãoSchema = Joi.object({
    search: Joi.string().allow("", null).optional().messages({
        "string.base": "O parâmetro 'search' deve ser um texto.",
    }),

    role: Joi.string()
        .valid(...roleEnum)
        .optional()
        .messages({
            "any.only": `O parâmetro 'role' deve ser um dos seguintes: ${roleEnum.join(
                ", "
            )}.`,
        }),

    page: Joi.number().integer().min(1).default(1).messages({
        "number.base": "O parâmetro 'page' deve ser um número.",
        "number.integer": "O parâmetro 'page' deve ser inteiro.",
        "number.min": "O parâmetro 'page' deve ser maior ou igual a 1.",
    }),

    limit: Joi.number().integer().min(1).max(100).default(10).messages({
        "number.base": "O parâmetro 'limit' deve ser um número.",
        "number.integer": "O parâmetro 'limit' deve ser inteiro.",
        "number.min": "O parâmetro 'limit' deve ser maior ou igual a 1.",
        "number.max": "O parâmetro 'limit' deve ser no máximo 100.",
    }),

    orderBy: Joi.string()
        .valid("name", "email", "createdAt")
        .default("createdAt")
        .messages({
            "any.only":
                "O parâmetro 'orderBy' deve ser 'name', 'email' ou 'createdAt'.",
        }),

    order: Joi.string().valid("asc", "desc").default("desc").messages({
        "any.only": "O parâmetro 'order' deve ser 'asc' ou 'desc'.",
    }),
}).unknown(false);

export const listUserQuerySchema = createPaginationSchema({
    defaultLimit: 10,
    maxLimit: 100,
    orderByFields: ["name", "email", "createdAt"],
});
