export const EstoquePaths = {
    "/estoques": {
        post: {
            tags: ["Estoque"],
            summary: "Criar movimentação de estoque",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/EstoqueCreate" },
                    },
                },
            },
            responses: {
                201: {
                    description: "Movimentação criada",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Estoque" },
                        },
                    },
                },
            },
        },

        get: {
            tags: ["Estoque"],
            summary: "Listar movimentações (paginado)",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/PageParam" },
                { $ref: "#/components/parameters/LimitParam" },
            ],
            responses: {
                200: {
                    description: "Lista de movimentações",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PaginatedEstoque",
                            },
                        },
                    },
                },
            },
        },
    },

    "/estoques/produto/{id}": {
        get: {
            tags: ["Estoque"],
            summary: "Buscar movimentações por produto",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/IdParam" },
                { $ref: "#/components/parameters/PageParam" },
                { $ref: "#/components/parameters/LimitParam" },
            ],
            responses: {
                200: {
                    description: "Movimentações do produto",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PaginatedEstoque",
                            },
                        },
                    },
                },
            },
        },
    },

    "/estoques/periodo": {
        get: {
            tags: ["Estoque"],
            summary: "Buscar movimentações por período",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/DataInicioQuery" },
                { $ref: "#/components/parameters/DataFimQuery" },
                { $ref: "#/components/parameters/PageParam" },
                { $ref: "#/components/parameters/LimitParam" },
            ],
            responses: {
                200: {
                    description: "Movimentações do período",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PaginatedEstoque",
                            },
                        },
                    },
                },
            },
        },
    },

    "/estoques/tipo/{tipo_movimento}": {
        get: {
            tags: ["Estoque"],
            summary: "Buscar movimentações por tipo",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/TipoMovimentoParam" },
                { $ref: "#/components/parameters/PageParam" },
                { $ref: "#/components/parameters/LimitParam" },
            ],
            responses: {
                200: {
                    description: "Movimentações por tipo",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PaginatedEstoque",
                            },
                        },
                    },
                },
            },
        },
    },

    "/estoques/origem-destino": {
    get: {
        tags: ["Estoque"],
        summary: "Buscar movimentações por origem/destino",
        security: [{ bearerAuth: [] }],
        parameters: [
            { $ref: "#/components/parameters/OrigemDestinoQuery" },
            { $ref: "#/components/parameters/TipoMovimentoQuery" },
            { $ref: "#/components/parameters/PageParam" },
            { $ref: "#/components/parameters/LimitParam" },
        ],
        responses: {
            200: {
                description: "Movimentações por origem/destino",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/PaginatedEstoque",
                        },
                    },
                },
            },
        },
    },
},

    "/estoques/{id}": {
        get: {
            tags: ["Estoque"],
            summary: "Buscar movimentação por ID",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/IdParam" }],
            responses: {
                200: {
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Estoque" },
                        },
                    },
                },
            },
        },

        put: {
            tags: ["Estoque"],
            summary: "Atualizar movimentação",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/IdParam" }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/EstoqueUpdate",
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "Atualizado com sucesso",
                },
            },
        },

        delete: {
            tags: ["Estoque"],
            summary: "Excluir movimentação",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/IdParam" }],
            responses: {
                200: {
                    description: "Excluído com sucesso",
                },
            },
        },
    },
};
