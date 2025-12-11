import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        "string.base": "O campo 'email' deve ser um texto.",
        "string.email": "Formato de email inválido.",
        "string.empty": "O campo 'email' não pode estar vazio.",
        "any.required": "O campo 'email' é obrigatório.",
    }),

    senha: Joi.string().trim().min(6).max(50).required().messages({
        "string.base": "O campo 'senha' deve ser um texto.",
        "string.empty": "O campo 'senha' não pode estar vazio.",
        "string.min": "A senha deve conter no mínimo 6 caracteres.",
        "string.max": "A senha deve conter no máximo 50 caracteres.",
        "any.required": "O campo 'senha' é obrigatório.",
    }),
}).unknown(false);

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().trim().required().messages({
        "string.base": "O campo 'refreshToken' deve ser um texto.",
        "string.empty": "O campo 'refreshToken' não pode estar vazio.",
        "any.required": "O campo 'refreshToken' é obrigatório.",
    }),
}).unknown(false);