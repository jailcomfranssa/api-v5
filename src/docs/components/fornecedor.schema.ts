// docs/components/fornecedor.schema.ts
export const fornecedorSchema = {
    Fornecedor: {
        type: "object",
        properties: {
            id: { type: "number" },
            nome: { type: "string" },
            cnpj: { type: "string", example: "12345678000199" },
            telefone: { type: "string" },
            email: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
        },
    },

    CreateFornecedorDTO: {
        type: "object",
        required: ["nome", "cnpj", "telefone", "email"],
        properties: {
            nome: { type: "string" },
            cnpj: {
                type: "string",
                minLength: 14,
                maxLength: 14,
            },
            telefone: { type: "string" },
            email: { type: "string", format: "email" },
        },
    },

    UpdateFornecedorDTO: {
        type: "object",
        properties: {
            nome: { type: "string" },
            cnpj: { type: "string", minLength: 14, maxLength: 14 },
            telefone: { type: "string" },
            email: { type: "string", format: "email" },
        },
    },

    FornecedorResumo: {
        type: "object",
        properties: {
            id: { type: "number" },
            nome: { type: "string" },
            totalCompras: { type: "number" },
            valorTotalCompras: { type: "number", example: 15000.50 },
        },
    },
};
