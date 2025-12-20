export const CategoriaPaths = {
    "/categorias": {
        post: {
            tags: ["Categorias"],
            summary: "Criar categoria",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/CategoriaCreate",
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "Categoria criada com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Categoria",
                            },
                        },
                    },
                },
                403: { description: "Acesso negado" },
            },
        },

        get: {
            tags: ["Categorias"],
            summary: "Listar categorias (paginação)",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "query",
                    name: "page",
                    schema: { type: "integer", example: 1 },
                },
                {
                    in: "query",
                    name: "limit",
                    schema: { type: "integer", example: 10 },
                },
            ],
            responses: {
                200: {
                    description: "Lista de categorias",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CategoriaPaginated",
                            },
                        },
                    },
                },
            },
        },
    },

    "/categorias/{id}": {
        get: {
            tags: ["Categorias"],
            summary: "Buscar categoria por ID",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "integer" },
                },
            ],
            responses: {
                200: {
                    description: "Categoria encontrada",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Categoria",
                            },
                        },
                    },
                },
                404: { description: "Categoria não encontrada" },
            },
        },

        put: {
            tags: ["Categorias"],
            summary: "Atualizar categoria",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "integer" },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/CategoriaUpdate",
                        },
                    },
                },
            },
            responses: {
                200: { description: "Categoria atualizada" },
            },
        },

        delete: {
            tags: ["Categorias"],
            summary: "Deletar categoria",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "integer" },
                },
            ],
            responses: {
                204: { description: "Categoria removida" },
            },
        },
    },

    "/categorias/search": {
        get: {
            tags: ["Categorias"],
            summary: "Buscar categorias por nome",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "query",
                    name: "nome",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            responses: {
                200: {
                    description: "Categorias encontradas",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Categoria",
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    "/categorias/{id}/status": {
        patch: {
            tags: ["Categorias"],
            summary: "Atualizar status da categoria",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "integer" },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                status: {
                                    type: "boolean",
                                    example: true,
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: { description: "Status atualizado" },
            },
        },
    },
};
