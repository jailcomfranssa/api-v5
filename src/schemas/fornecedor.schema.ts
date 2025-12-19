import Joi from "joi";

export const createFornecedorSchema = Joi.object({
    nome: Joi.string().min(3).max(100).required(),

    cnpj: Joi.string()
        .pattern(/^\d{14}$/)
        .required()
        .messages({
            "string.pattern.base": "CNPJ deve conter 14 números.",
        }),

    telefone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Telefone deve conter 10 ou 11 números.",
        }),

    email: Joi.string().email().required(),
});

export const updateFornecedorSchema = Joi.object({
    nome: Joi.string().min(3).max(100).optional(),

    cnpj: Joi.string()
        .pattern(/^\d{14}$/)
        .optional()
        .messages({
            "string.pattern.base": "CNPJ deve conter 14 números.",
        }),

    telefone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .optional()
        .messages({
            "string.pattern.base":
                "Telefone deve conter 10 ou 11 números.",
        }),

    email: Joi.string().email().optional(),
}).min(1); // ⚠️ obriga enviar pelo menos um campo
