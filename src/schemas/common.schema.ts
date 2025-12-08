import Joi from "joi";

export const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        "any.required": "O ID é obrigatório.",
        "number.base": "O ID deve ser um número.",
        "number.integer": "O ID deve ser um número inteiro.",
        "number.positive": "O ID deve ser positivo.",
    }),
});
