import Joi from "joi";

/**
 * Opções configuráveis para o schema de paginação.
 */
export interface PaginationOptions {
    defaultPage?: number;
    defaultLimit?: number;
    maxLimit?: number;
    orderByFields?: string[]; // Campos permitidos para ordenação
}

/**
 * Cria um schema Joi reutilizável para validação de query params de paginação.
 * Exemplo de uso:
 *   const pagination = createPaginationSchema({ maxLimit: 50 });
 *   router.get("/", validateRequest({ query: pagination }), controller.findAll);
 */
export const createPaginationSchema = (
    opts?: PaginationOptions
): Joi.ObjectSchema<any> => {
    const {
        defaultPage = 1,
        defaultLimit = 10,
        maxLimit = 100,
        orderByFields = ["name", "email", "createdAt"],
    } = opts || {};

    return Joi.object({
        page: Joi.number().integer().min(1).default(defaultPage).messages({
            "number.base": "O parâmetro 'page' deve ser um número.",
            "number.integer": "O parâmetro 'page' deve ser um número inteiro.",
            "number.min": "O parâmetro 'page' deve ser maior ou igual a 1.",
        }),

        limit: Joi.number()
            .integer()
            .min(1)
            .max(maxLimit)
            .default(defaultLimit)
            .messages({
                "number.base": "O parâmetro 'limit' deve ser um número.",
                "number.integer":
                    "O parâmetro 'limit' deve ser um número inteiro.",
                "number.min":
                    "O parâmetro 'limit' deve ser maior ou igual a 1.",
                "number.max": `O parâmetro 'limit' deve ser no máximo ${maxLimit}.`,
            }),

        search: Joi.string().allow("", null).optional().messages({
            "string.base": "O parâmetro 'search' deve ser um texto.",
        }),

        orderBy: Joi.string()
            .valid(...orderByFields)
            .default(orderByFields[0])
            .messages({
                "any.only": `O parâmetro 'orderBy' deve ser um dos seguintes: ${orderByFields.join(
                    ", "
                )}.`,
            }),

        order: Joi.string().valid("asc", "desc").default("desc").messages({
            "any.only": "O parâmetro 'order' deve ser 'asc' ou 'desc'.",
        }),
    }).unknown(false); // Impede parâmetros desconhecidos
};

export const defaultPaginationSchema = createPaginationSchema();
export default defaultPaginationSchema;
