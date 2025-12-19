import Joi from "joi";

export const createCategoriaSchema = Joi.object({
    nome: Joi.string().min(3).max(100).trim().required().messages({
        "string.base": "Nome deve ser um texto.",
        "string.empty": "Nome é obrigatório.",
        "string.min": "Nome deve ter no mínimo 3 caracteres.",
        "any.required": "Nome é obrigatório.",
    }),

    descricao: Joi.string().min(3).max(255).trim().required().messages({
        "string.base": "Descrição deve ser um texto.",
        "string.empty": "Descrição é obrigatória.",
        "any.required": "Descrição é obrigatória.",
    }),

    status: Joi.boolean().optional().messages({
        "boolean.base": "Status deve ser booleano.",
    }),
});

export const updateCategoriaSchema = Joi.object({
    nome: Joi.string().min(3).max(100).trim().optional(),

    descricao: Joi.string().min(3).max(255).trim().optional(),

    status: Joi.boolean().optional(),
})
    .min(1)
    .messages({
        "object.min": "Informe ao menos um campo para atualização.",
    });

export const updateCategoriaStatusSchema = Joi.object({
    status: Joi.boolean().required().messages({
        "boolean.base": "Status deve ser booleano.",
        "any.required": "Status é obrigatório.",
    }),
});

export const searchCategoriaSchema = Joi.object({
    nome: Joi.string().min(1).trim().optional(),
    status: Joi.boolean().optional(),
});
