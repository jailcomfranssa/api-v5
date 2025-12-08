import Joi from "joi";
import { createPaginationSchema } from "./pagination.schema";

const roleEnum = ["ADMIN", "FUNCIONARIO", "CLIENTE"];

/**
 * CREATE USER
 */
export const createUserSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "O campo 'email' deve ser um texto.",
        "string.email": "Formato de email inválido.",
        "any.required": "O campo 'email' é obrigatório.",
    }),

    senha: Joi.string().min(6).max(50).required().messages({
        "string.base": "O campo 'senha' deve ser um texto.",
        "string.min": "A senha deve conter no mínimo 6 caracteres.",
        "string.max": "A senha deve conter no máximo 50 caracteres.",
        "any.required": "O campo 'senha' é obrigatório.",
    }),

    name: Joi.string().min(2).max(60).required().messages({
        "string.base": "O campo 'name' deve ser um texto.",
        "string.min": "O nome deve conter no mínimo 2 caracteres.",
        "string.max": "O nome deve conter no máximo 60 caracteres.",
        "any.required": "O campo 'name' é obrigatório.",
    }),

    telefone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .allow(null)
        .optional()
        .messages({
            "string.pattern.base":
                "O telefone deve conter 10 ou 11 dígitos numéricos.",
        }),

    role: Joi.string()
        .valid(...roleEnum)
        .default("CLIENTE")
        .messages({
            "any.only": `O campo 'role' deve ser um dos seguintes: ${roleEnum.join(
                ", "
            )}.`,
        }),
}).unknown(false);

/**
 * UPDATE USER
 */
export const updateUserSchema = Joi.object({
    email: Joi.string().email().optional().messages({
        "string.email": "Formato de email inválido.",
    }),

    senha: Joi.string().min(6).max(50).optional().messages({
        "string.min": "A senha deve conter no mínimo 6 caracteres.",
        "string.max": "A senha deve conter no máximo 50 caracteres.",
    }),

    name: Joi.string().min(2).max(60).optional().messages({
        "string.min": "O nome deve conter no mínimo 2 caracteres.",
        "string.max": "O nome deve conter no máximo 60 caracteres.",
    }),

    telefone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .allow(null)
        .optional()
        .messages({
            "string.pattern.base":
                "O telefone deve conter 10 ou 11 dígitos numéricos.",
        }),

    role: Joi.string()
        .valid(...roleEnum)
        .optional()
        .messages({
            "any.only": `O campo 'role' deve ser um dos seguintes: ${roleEnum.join(
                ", "
            )}.`,
        }),
})
    .min(1)
    .messages({
        "object.min": "É necessário informar ao menos um campo para atualizar.",
    })
    .unknown(false);

/**
 * DELETE USER (params)
 */
export const deleteUserSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        "number.base": "O parâmetro 'id' deve ser um número.",
        "number.integer": "O parâmetro 'id' deve ser um número inteiro.",
        "number.positive": "O parâmetro 'id' deve ser um número positivo.",
        "any.required": "O parâmetro 'id' é obrigatório.",
    }),
}).unknown(false);

/**
 * LIST USERS (filtros + paginação)
 */
export const listUserSchema = Joi.object({
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

/**
 * LIST USERS COM PAGINAÇÃO MODULAR (opcional)
 */
export const listUserQuerySchema = createPaginationSchema({
    defaultLimit: 10,
    maxLimit: 100,
    orderByFields: ["name", "email", "createdAt"],
});
