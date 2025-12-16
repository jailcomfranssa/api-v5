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

export const clienteCadastroUpdateSchema = Joi.object({
    cpf: Joi.forbidden().messages({
        "any.unknown": "O CPF não pode ser alterado.",
    }),

    rg: Joi.forbidden().messages({
        "any.unknown": "O RG não pode ser alterado.",
    }),

    telefone: Joi.forbidden().messages({
        "any.unknown": "O telefone não pode ser alterado.",
    }),

    dataNascimento: Joi.forbidden().messages({
        "any.unknown": "A data de nascimento não pode ser alterada.",
    }),

    userId: Joi.forbidden().messages({
        "any.unknown": "O userId não pode ser alterado.",
    }),
}).unknown(false);

export const clienteUpdateSchema = Joi.object({
    cpf: Joi.string()
        .pattern(/^\d{11}$/) // valida CPF com 11 dígitos
        .optional(),

    rg: Joi.string()
        .max(20) // limite de caracteres para RG
        .optional(),

    telefone: Joi.string()
        .pattern(/^\d{10,11}$/) // 10 ou 11 dígitos
        .optional(),

    dataNascimento: Joi.date()
        .iso() // formato ISO (YYYY-MM-DD)
        .optional(),

    userId: Joi.number().integer().optional(),
}).unknown(false);

export const clienteCadastroAdminSchema = Joi.object({
    cpf: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
    rg: Joi.string().allow(null, ""),
    telefone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .allow(null, ""),
    dataNascimento: Joi.date().iso().allow(null),
    userId: Joi.number().integer().required(),
});

export const clienteCadastroUserSchema = Joi.object({
    cpf: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
    rg: Joi.string().allow(null, ""),
    telefone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .allow(null, ""),
    dataNascimento: Joi.date().iso().allow(null),
});
