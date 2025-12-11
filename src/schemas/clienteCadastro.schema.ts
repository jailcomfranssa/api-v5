import Joi from "joi";

export const clienteCadastroSchema = Joi.object({
    cpf: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            "string.base": "O campo 'cpf' deve ser um texto.",
            "string.length": "O CPF deve conter 11 dígitos.",
            "string.pattern.base": "O CPF deve conter apenas números.",
            "any.required": "O campo 'cpf' é obrigatório.",
        }),

    rg: Joi.string().allow(null, "").messages({
        "string.base": "O campo 'rg' deve ser um texto.",
    }),

    telefone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .allow(null, "")
        .messages({
            "string.pattern.base":
                "O telefone deve ter entre 10 e 11 dígitos numéricos.",
        }),

    dataNascimento: Joi.date().iso().allow(null).messages({
        "date.base": "A data de nascimento deve ser uma data válida.",
        "date.format": "A data deve estar no padrão ISO (YYYY-MM-DD).",
    }),

    userId: Joi.number().integer().required().messages({
        "number.base": "O campo 'userId' deve ser numérico.",
        "any.required": "O campo 'userId' é obrigatório.",
    }),
}).unknown(false);
