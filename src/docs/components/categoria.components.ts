export const CategoriaSchemas = {
    Categoria: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                example: 1,
            },
            nome: {
                type: "string",
                example: "Medicamentos",
            },
            status: {
                type: "boolean",
                example: true,
            },
            createdAt: {
                type: "string",
                format: "date-time",
                example: "2024-01-01T10:00:00Z",
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                example: "2024-01-02T10:00:00Z",
            },
        },
    },

    CategoriaCreate: {
        type: "object",
        required: ["nome"],
        properties: {
            nome: {
                type: "string",
                example: "Eletrônicos",
            },
        },
    },

    CategoriaUpdate: {
        type: "object",
        properties: {
            nome: {
                type: "string",
                example: "Alimentos",
            },
            status: {
                type: "boolean",
                example: false,
            },
        },
    },

    CategoriaPaginated: {
        type: "object",
        properties: {
            data: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/Categoria",
                },
            },
            meta: {
                type: "object",
                properties: {
                    total: { type: "integer", example: 20 },
                    page: { type: "integer", example: 1 },
                    limit: { type: "integer", example: 10 },
                    totalPages: { type: "integer", example: 2 },
                },
            },
        },
    },
};
