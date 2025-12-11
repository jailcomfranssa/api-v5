import Joi from "joi";

export const funcionarioCadastroSchema = Joi.object({
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

    cargo: Joi.string().min(2).max(100).required().messages({
        "string.base": "O campo 'cargo' deve ser um texto.",
        "string.min": "O cargo deve conter no mínimo 2 caracteres.",
        "string.max": "O cargo deve conter no máximo 100 caracteres.",
        "any.required": "O campo 'cargo' é obrigatório.",
    }),

    telefone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .allow(null, "")
        .messages({
            "string.pattern.base":
                "O telefone deve ter entre 10 e 11 dígitos numéricos.",
        }),

    salario: Joi.number().precision(2).positive().required().messages({
        "number.base": "O campo 'salario' deve ser numérico.",
        "number.positive": "O salário deve ser maior que zero.",
        "number.precision": "O salário deve ter no máximo 2 casas decimais.",
        "any.required": "O campo 'salario' é obrigatório.",
    }),

    dataAdmissao: Joi.date().iso().required().messages({
        "date.base": "O campo 'dataAdmissao' deve ser uma data válida.",
        "any.required": "A data de admissão é obrigatória.",
    }),

    userId: Joi.number().integer().required().messages({
        "number.base": "O campo 'userId' deve ser numérico.",
        "any.required": "O campo 'userId' é obrigatório.",
    }),
}).unknown(false);
