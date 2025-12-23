export const ProdutoSchemas = {
    Produto: {
        type: "object",
        properties: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Dipirona" },
            descricao: { type: "string", example: "Analgésico e antitérmico" },
            preco: { type: "string", example: "R$ 10,00" },
            data_validade: { type: "string", example: "22-12-2025" },
            medida: {
                type: "string",
                enum: ["UNIDADE", "CAIXA", "LITRO", "QUILO"],
            },
            categoria: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    nome: { type: "string", example: "Medicamentos" },
                },
            },
            fornecedor: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 2 },
                    nome: { type: "string", example: "Fornecedor XYZ" },
                },
            },
            createdAt: {
                type: "string",
                format: "date-time",
            },
            updatedAt: {
                type: "string",
                format: "date-time",
            },
        },
    },

    ProdutoCreate: {
        type: "object",
        required: [
            "nome",
            "descricao",
            "preco",
            "data_validade",
            "medida",
            "categoriaId",
            "fornecedorId",
        ],
        properties: {
            nome: { type: "string", example: "Dipirona" },
            descricao: { type: "string", example: "Analgésico" },
            preco: { type: "number", example: 10.0 },
            data_validade: {
                type: "string",
                format: "date",
                example: "2025-12-22",
            },
            medida: {
                type: "string",
                enum: ["UNIDADE", "CAIXA", "LITRO", "QUILO"],
            },
            categoriaId: { type: "integer", example: 1 },
            fornecedorId: { type: "integer", example: 2 },
        },
    },

    ProdutoUpdate: {
        type: "object",
        properties: {
            nome: { type: "string" },
            descricao: { type: "string" },
            preco: { type: "number" },
            data_validade: { type: "string", format: "date" },
            medida: {
                type: "string",
                enum: ["UNIDADE", "CAIXA", "LITRO", "QUILO"],
            },
            categoriaId: { type: "integer" },
            fornecedorId: { type: "integer" },
        },
    },

    ProdutoListResponse: {
        type: "object",
        properties: {
            data: {
                type: "array",
                items: { $ref: "#/components/schemas/Produto" },
            },
            meta: {
                type: "object",
                properties: {
                    total: { type: "integer" },
                    page: { type: "integer" },
                    limit: { type: "integer" },
                    totalPages: { type: "integer" },
                },
            },
        },
    },
};
