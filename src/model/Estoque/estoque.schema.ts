import Joi from "joi";
import { MOVIMENTO } from "../../../generated/prisma/enums";

/* =========================
 * ENUMS
 * ========================= */
const movimentoEnum = Object.values(MOVIMENTO);

/* =========================
 * PARAMS
 * ========================= */

export const produtoIdParamSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
});

export const tipoMovimentoParamSchema = Joi.object({
    tipo_movimento: Joi.string()
        .valid(...movimentoEnum)
        .required(),
});

export const origemDestinoQuerySchema = Joi.object({
    origemDestino: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "origemDestino é obrigatório",
        }),

    tipoMovimento: Joi.string()
        .valid(...Object.values(MOVIMENTO))
        .required()
        .messages({
            "any.only": "tipoMovimento inválido",
        }),
}).concat(
    Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
    })
);

/* =========================
 * QUERY (PAGINAÇÃO)
 * ========================= */
export const paginationQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
});

/* =========================
 * QUERY (PERÍODO)
 * ========================= */
export const periodoQuerySchema = paginationQuerySchema.keys({
    dataInicio: Joi.date().iso().required(),
    dataFim: Joi.date().iso().min(Joi.ref("dataInicio")).required().messages({
        "date.min": "dataFim deve ser maior ou igual a dataInicio",
    }),
});

/* =========================
 * BODY - CREATE
 * ========================= */
export const estoqueCreateSchema = Joi.object({
    tipo_movimento: Joi.string()
        .valid(...movimentoEnum)
        .required(),

    quantidade: Joi.number().integer().positive().required(),

    data_movimento: Joi.date().iso().required(),

    origem_destino: Joi.string().min(2).max(255).required(),

    observacoes: Joi.string().allow("").max(500).required(),

    produtoId: Joi.number().integer().positive().required(),
});

/* =========================
 * BODY - UPDATE
 * ========================= */
export const estoqueUpdateSchema = Joi.object({
    tipo_movimento: Joi.string().valid(...movimentoEnum),

    quantidade: Joi.number().integer().positive(),

    data_movimento: Joi.date().iso(),

    origem_destino: Joi.string().min(2).max(255),

    observacoes: Joi.string().allow("").max(500),

    produtoId: Joi.number().integer().positive(),
}).min(1); // 🔥 obriga ao menos um campo
