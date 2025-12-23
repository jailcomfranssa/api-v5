import Joi from "joi";
import { Medida } from "../../generated/prisma/client";

/**
 * 🔹 Enum Medida (Prisma)
 */
export const medidaEnum = Joi.string()
    .valid(...Object.values(Medida))
    .required()
    .messages({
        "any.required": "O campo medida é obrigatório.",
        "any.only": "Medida inválida.",
        "string.base": "O campo medida deve ser um texto.",
    });

/**
 * 🔹 Criar produto
 */
export const createProdutoSchema = Joi.object({
    nome: Joi.string().trim().min(2).max(150).required().messages({
        "string.base": "O nome deve ser um texto.",
        "string.empty": "O nome é obrigatório.",
        "string.min": "O nome deve ter no mínimo {#limit} caracteres.",
        "string.max": "O nome deve ter no máximo {#limit} caracteres.",
        "any.required": "O nome é obrigatório.",
    }),

    descricao: Joi.string().trim().min(5).max(500).required().messages({
        "string.base": "A descrição deve ser um texto.",
        "string.empty": "A descrição é obrigatória.",
        "string.min": "A descrição deve ter no mínimo {#limit} caracteres.",
        "string.max": "A descrição deve ter no máximo {#limit} caracteres.",
        "any.required": "A descrição é obrigatória.",
    }),

    preco: Joi.number().positive().precision(2).required().messages({
        "number.base": "O preço deve ser um número.",
        "number.positive": "O preço deve ser maior que zero.",
        "number.precision": "O preço deve ter no máximo duas casas decimais.",
        "any.required": "O preço é obrigatório.",
    }),

    data_validade: Joi.date().min("now").required().messages({
        "date.base": "A data de validade deve ser uma data válida.",
        "date.min": "A data de validade não pode ser hoje.",
        "any.required": "A data de validade é obrigatória.",
    }),

    medida: medidaEnum,

    categoriaId: Joi.number().integer().positive().required().messages({
        "number.base": "O ID da categoria deve ser um número.",
        "number.integer": "O ID da categoria deve ser um número inteiro.",
        "number.positive": "O ID da categoria deve ser positivo.",
        "any.required": "O ID da categoria é obrigatório.",
    }),

    fornecedorId: Joi.number().integer().positive().required().messages({
        "number.base": "O ID do fornecedor deve ser um número.",
        "number.integer": "O ID do fornecedor deve ser um número inteiro.",
        "number.positive": "O ID do fornecedor deve ser positivo.",
        "any.required": "O ID do fornecedor é obrigatório.",
    }),
});

/**
 * 🔹 Atualizar produto (parcial)
 */
export const updateProdutoSchema = Joi.object({
    nome: Joi.string().trim().min(2).max(150).messages({
        "string.base": "O nome deve ser um texto.",
        "string.min": "O nome deve ter no mínimo {#limit} caracteres.",
        "string.max": "O nome deve ter no máximo {#limit} caracteres.",
    }),

    descricao: Joi.string().trim().min(5).max(500).messages({
        "string.base": "A descrição deve ser um texto.",
        "string.min": "A descrição deve ter no mínimo {#limit} caracteres.",
        "string.max": "A descrição deve ter no máximo {#limit} caracteres.",
    }),

    preco: Joi.number().positive().precision(2).messages({
        "number.base": "O preço deve ser um número.",
        "number.positive": "O preço deve ser maior que zero.",
        "number.precision": "O preço deve ter no máximo duas casas decimais.",
    }),

    data_validade: Joi.date().messages({
        "date.base": "A data de validade deve ser uma data válida.",
    }),

    medida: Joi.string()
        .valid(...Object.values(Medida))
        .messages({
            "any.only": "Medida inválida.",
            "string.base": "O campo medida deve ser um texto.",
        }),

    categoriaId: Joi.number().integer().positive().messages({
        "number.base": "O ID da categoria deve ser um número.",
        "number.integer": "O ID da categoria deve ser um número inteiro.",
        "number.positive": "O ID da categoria deve ser positivo.",
    }),

    fornecedorId: Joi.number().integer().positive().messages({
        "number.base": "O ID do fornecedor deve ser um número.",
        "number.integer": "O ID do fornecedor deve ser um número inteiro.",
        "number.positive": "O ID do fornecedor deve ser positivo.",
    }),
})
    .min(1)
    .messages({
        "object.min":
            "É necessário informar ao menos um campo para atualização.",
    });

/**
 * 🔹 Query pagination (page & limit)
 */
export const produtoPaginationSchema = Joi.object({
    page: Joi.number().integer().positive().default(1).messages({
        "number.base": "A página deve ser um número.",
        "number.integer": "A página deve ser um número inteiro.",
        "number.positive": "A página deve ser maior que zero.",
    }),

    limit: Joi.number().integer().positive().max(100).default(10).messages({
        "number.base": "O limite deve ser um número.",
        "number.integer": "O limite deve ser um número inteiro.",
        "number.positive": "O limite deve ser maior que zero.",
        "number.max": "O limite máximo é {#limit}.",
    }),
});

/**
 * 🔹 Buscar por categoria
 */
export const produtoCategoriaParamSchema = Joi.object({
    categoriaId: Joi.number().integer().positive().required().messages({
        "number.base": "O ID da categoria deve ser um número.",
        "number.integer": "O ID da categoria deve ser um número inteiro.",
        "number.positive": "O ID da categoria deve ser positivo.",
        "any.required": "O ID da categoria é obrigatório.",
    }),
});

/**
 * 🔹 Buscar por fornecedor
 */
export const produtoFornecedorParamSchema = Joi.object({
    fornecedorId: Joi.number().integer().positive().required().messages({
        "number.base": "O ID do fornecedor deve ser um número.",
        "number.integer": "O ID do fornecedor deve ser um número inteiro.",
        "number.positive": "O ID do fornecedor deve ser positivo.",
        "any.required": "O ID do fornecedor é obrigatório.",
    }),
});

/**
 * 🔹 Query dias (produtos próximos do vencimento)
 */
export const produtoDiasQuerySchema = Joi.object({
    dias: Joi.number().integer().positive().max(365).default(7).messages({
        "number.base": "O campo dias deve ser um número.",
        "number.integer": "O campo dias deve ser um número inteiro.",
        "number.positive": "O campo dias deve ser maior que zero.",
        "number.max": "O valor máximo permitido é {#limit} dias.",
    }),
});
