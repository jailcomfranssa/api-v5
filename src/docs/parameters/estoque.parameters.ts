export const EstoqueParameters = {
    IdParam: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "integer" },
        example: 1,
    },

    PageParam: {
        name: "page",
        in: "query",
        schema: { type: "integer", default: 1 },
    },

    LimitParam: {
        name: "limit",
        in: "query",
        schema: { type: "integer", default: 10 },
    },

    TipoMovimentoParam: {
        name: "tipo_movimento",
        in: "path",
        required: true,
        schema: {
            type: "string",
            enum: ["ENTRADA", "SAIDA", "AJUSTE"],
        },
    },

    OrigemDestinoParam: {
        name: "origem_destino",
        in: "path",
        required: true,
        schema: { type: "string" },
    },

    DataInicioParam: {
        name: "dataInicio",
        in: "query",
        required: true,
        schema: {
            type: "string",
            format: "date",
        },
        example: "2025-09-01",
    },

    DataFimParam: {
        name: "dataFim",
        in: "query",
        required: true,
        schema: {
            type: "string",
            format: "date",
        },
        example: "2025-09-30",
    },
    OrigemDestinoQuery: {
        name: "origem_destino",
        in: "query",
        required: true,
        schema: {
            type: "string",
        },
        example: "Fornecedor XPTO",
    },

    TipoMovimentoQuery: {
        name: "tipo_movimento",
        in: "query",
        required: true,
        schema: {
            type: "string",
            enum: ["ENTRADA", "SAIDA", "AJUSTE"],
        },
        example: "ENTRADA",
    },
};
