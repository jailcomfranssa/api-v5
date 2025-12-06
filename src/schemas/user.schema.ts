import Joi from "joi";

const roleEnum = ["ADMIN", "FUNCIONARIO", "CLIENTE"];

// 📌 CREATE USER
export const createUserSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email inválido.",
        "any.required": "Email é obrigatório.",
    }),

    senha: Joi.string().min(6).max(50).required().messages({
        "string.min": "A senha deve ter no mínimo 6 caracteres.",
        "string.max": "A senha deve ter no máximo 50 caracteres.",
        "any.required": "Senha é obrigatória.",
    }),

    name: Joi.string().min(2).max(60).required().messages({
        "string.min": "O nome deve ter no mínimo 2 caracteres.",
        "any.required": "Nome é obrigatório.",
    }),

    telefone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .allow(null)
        .optional()
        .messages({
            "string.pattern.base": "Telefone deve ter 10 ou 11 dígitos.",
        }),

    role: Joi.string()
        .valid(...roleEnum)
        .default("CLIENTE"),
});

// 📌 UPDATE USER
export const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    senha: Joi.string().min(6).max(50).optional(),
    name: Joi.string().min(2).max(60).optional(),
    telefone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .allow(null)
        .optional(),
    role: Joi.string()
        .valid(...roleEnum)
        .optional(),
}).min(1); // evita atualização vazia

// 📌 DELETE USER (id obrigatório)
export const deleteUserSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        "any.required": "O ID é obrigatório para deletar um usuário.",
        "number.base": "ID deve ser um número.",
        "number.positive": "ID deve ser positivo.",
    }),
});

// 📌 LIST USERS (filtros de busca, paginação, ordenação)
export const listUserSchema = Joi.object({
    search: Joi.string().optional(), // busca por nome ou email
    role: Joi.string()
        .valid(...roleEnum)
        .optional(),
    page: Joi.number().integer().positive().default(1),
    limit: Joi.number().integer().positive().max(100).default(10),
    orderBy: Joi.string()
        .valid("name", "email", "createdAt")
        .default("createdAt"),
    order: Joi.string().valid("asc", "desc").default("desc"),
});
