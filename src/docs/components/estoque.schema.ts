export const EstoqueSchema = {
    Estoque: {
        type: "object",
        properties: {
            id: { type: "integer", example: 1 },
            tipo_movimento: {
                type: "string",
                enum: ["ENTRADA", "SAIDA"],
                example: "ENTRADA",
            },
            quantidade: { type: "integer", example: 10 },
            data_movimento: {
                type: "string",
                format: "date",
                example: "10/09/2025",
            },
            origem_destino: { type: "string", example: "Fornecedor XPTO" },
            observacoes: { type: "string", example: "Nota fiscal 123" },
            produto: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 5 },
                    nome: { type: "string", example: "Arroz 5kg" },
                },
            },
            createdAt: {
                type: "string",
                format: "date",
                example: "10/09/2025",
            },
            updatedAt: {
                type: "string",
                format: "date",
                example: "10/09/2025",
            },
        },
    },

    EstoqueCreate: {
        type: "object",
        required: [
            "tipo_movimento",
            "quantidade",
            "data_movimento",
            "origem_destino",
            "produtoId",
        ],
        properties: {
            tipo_movimento: {
                type: "string",
                enum: ["ENTRADA", "SAIDA", "AJUSTE"],
            },
            quantidade: { type: "integer", example: 10 },
            data_movimento: {
                type: "string",
                format: "date-time",
                example: "2025-09-10T10:00:00Z",
            },
            origem_destino: { type: "string", example: "Fornecedor XPTO" },
            observacoes: { type: "string", example: "Nota fiscal 123" },
            produtoId: { type: "integer", example: 5 },
        },
    },

    EstoqueUpdate: {
        type: "object",
        properties: {
            tipo_movimento: {
                type: "string",
                enum: ["ENTRADA", "SAIDA", "AJUSTE"],
            },
            quantidade: { type: "integer", example: 5 },
            data_movimento: {
                type: "string",
                format: "date-time",
            },
            origem_destino: { type: "string" },
            observacoes: { type: "string" },
            produtoId: { type: "integer" },
        },
    },

    PaginatedEstoque: {
        type: "object",
        properties: {
            data: {
                type: "array",
                items: { $ref: "#/components/schemas/Estoque" },
            },
            meta: {
                type: "object",
                properties: {
                    total: { type: "integer", example: 100 },
                    page: { type: "integer", example: 1 },
                    limit: { type: "integer", example: 10 },
                    totalPages: { type: "integer", example: 10 },
                },
            },
        },
    },
};
