export const ProdutoParameters = {
    produtoId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "integer" },
        example: 1,
    },

    categoriaId: {
        name: "categoriaId",
        in: "path",
        required: true,
        schema: { type: "integer" },
        example: 1,
    },

    fornecedorId: {
        name: "fornecedorId",
        in: "path",
        required: true,
        schema: { type: "integer" },
        example: 2,
    },

    dias: {
        name: "dias",
        in: "query",
        required: false,
        schema: {
            type: "integer",
            default: 7,
        },
        example: 7,
    },

    page: {
        name: "page",
        in: "query",
        schema: { type: "integer", default: 1 },
    },

    limit: {
        name: "limit",
        in: "query",
        schema: { type: "integer", default: 10 },
    },
};
