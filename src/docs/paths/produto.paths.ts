export const ProdutoPaths = {
    "/produtos": {
        post: {
            tags: ["Produtos"],
            summary: "Criar produto",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ProdutoCreate" },
                    },
                },
            },
            responses: {
                201: {
                    description: "Produto criado com sucesso",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Produto" },
                        },
                    },
                },
            },
        },

        get: {
            tags: ["Produtos"],
            summary: "Listar produtos",
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: "#/components/parameters/page" },
                { $ref: "#/components/parameters/limit" },
            ],
            responses: {
                200: {
                    description: "Lista de produtos",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ProdutoListResponse",
                            },
                        },
                    },
                },
            },
        },
    },

    "/produtos/{id}": {
        get: {
            tags: ["Produtos"],
            summary: "Buscar produto por ID",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/produtoId" }],
            responses: {
                200: {
                    description: "Produto encontrado",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Produto" },
                        },
                    },
                },
            },
        },

        put: {
            tags: ["Produtos"],
            summary: "Atualizar produto",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/produtoId" }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/ProdutoUpdate" },
                    },
                },
            },
            responses: {
                200: {
                    description: "Produto atualizado",
                },
            },
        },

        delete: {
            tags: ["Produtos"],
            summary: "Deletar produto",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/produtoId" }],
            responses: {
                204: { description: "Produto removido" },
            },
        },
    },

    "/produtos/categoria/{categoriaId}": {
        get: {
            tags: ["Produtos"],
            summary: "Buscar produtos por categoria",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/categoriaId" }],
            responses: {
                200: {
                    description: "Produtos da categoria",
                },
            },
        },
    },

    "/produtos/fornecedor/{fornecedorId}": {
        get: {
            tags: ["Produtos"],
            summary: "Buscar produtos por fornecedor",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/fornecedorId" }],
            responses: {
                200: {
                    description: "Produtos do fornecedor",
                },
            },
        },
    },

    "/produtos/vencimento/vencidos": {
        get: {
            tags: ["Produtos"],
            summary: "Buscar produtos vencidos",
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: "Produtos vencidos",
                },
            },
        },
    },

    "/produtos/vencimento/proximos": {
        get: {
            tags: ["Produtos"],
            summary: "Buscar produtos próximos do vencimento",
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: "#/components/parameters/dias" }],
            responses: {
                200: {
                    description: "Produtos próximos do vencimento",
                },
            },
        },
    },
};
