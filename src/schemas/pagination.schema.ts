import Joi from "joi";

export interface PaginationOptions {
    defaultPage?: number;
    defaultLimit?: number;
    maxLimit?: number;
    orderByFields?: string[]; // se quiser limitar colunas ordenáveis
}

/**
 * Create a pagination/query schema for list endpoints.
 * Usage:
 *  const pagination = createPaginationSchema({ defaultLimit: 10, maxLimit: 100 });
 *  router.get('/', validateRequest({ query: pagination }), controller.findAll);
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
        page: Joi.number().integer().positive().default(defaultPage).messages({
            "number.base": "page deve ser um número",
            "number.integer": "page deve ser inteiro",
            "number.positive": "page deve ser positivo",
        }),
        limit: Joi.number()
            .integer()
            .positive()
            .max(maxLimit)
            .default(defaultLimit)
            .messages({
                "number.base": "limit deve ser um número",
                "number.integer": "limit deve ser inteiro",
                "number.positive": "limit deve ser positivo",
                "number.max": `limit deve ser no máximo ${maxLimit}`,
            }),
        search: Joi.string().allow("", null).optional().messages({
            "string.base": "search deve ser texto",
        }),
        orderBy: Joi.string()
            .valid(...orderByFields)
            .default(orderByFields[0])
            .messages({
                "any.only": `orderBy deve ser uma das seguintes: ${orderByFields.join(
                    ", "
                )}`,
            }),
        order: Joi.string().valid("asc", "desc").default("desc").messages({
            "any.only": 'order deve ser "asc" ou "desc"',
        }),
    });
};

// export padrão para uso rápido
export const defaultPaginationSchema = createPaginationSchema();
export default defaultPaginationSchema;
