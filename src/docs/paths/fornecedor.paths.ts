// docs/paths/fornecedor.paths.ts
export const fornecedorPaths = {
    "/api/fornecedores": {
        post: {
            tags: ["Fornecedores"],
            summary: "Criar fornecedor",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/CreateFornecedorDTO",
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "Fornecedor criado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Fornecedor",
                            },
                        },
                    },
                },
                400: { description: "CNPJ ou e-mail já cadastrado" },
                403: { description: "Acesso negado" },
            },
        },

        get: {
            tags: ["Fornecedores"],
            summary: "Listar fornecedores (paginado)",
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "page", in: "query", schema: { type: "number" } },
                { name: "limit", in: "query", schema: { type: "number" } },
            ],
            responses: {
                200: {
                    description: "Lista paginada de fornecedores",
                },
                403: { description: "Acesso negado" },
            },
        },
    },

    "/api/fornecedores/{id}": {
        get: {
            tags: ["Fornecedores"],
            summary: "Buscar fornecedor por ID",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "number" },
                },
            ],
            responses: {
                200: {
                    description: "Fornecedor encontrado",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Fornecedor",
                            },
                        },
                    },
                },
                404: { description: "Fornecedor não encontrado" },
            },
        },

        put: {
            tags: ["Fornecedores"],
            summary: "Atualizar fornecedor",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "number" },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UpdateFornecedorDTO",
                        },
                    },
                },
            },
            responses: {
                200: { description: "Fornecedor atualizado" },
                400: { description: "CNPJ ou e-mail já existente" },
                403: { description: "Acesso negado" },
            },
        },

        delete: {
            tags: ["Fornecedores"],
            summary: "Excluir fornecedor",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "number" },
                },
            ],
            responses: {
                204: { description: "Fornecedor excluído" },
                400: { description: "Fornecedor possui compras" },
                403: { description: "Acesso negado" },
            },
        },
    },

    "/api/fornecedores/search": {
        get: {
            tags: ["Fornecedores"],
            summary: "Buscar fornecedor por nome (LIKE)",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "nome",
                    in: "query",
                    required: true,
                    schema: { type: "string" },
                },
            ],
            responses: {
                200: { description: "Fornecedores encontrados" },
            },
        },
    },

    "/api/fornecedores/{id}/resumo": {
        get: {
            tags: ["Fornecedores"],
            summary: "Resumo do fornecedor (contador de compras)",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "number" },
                },
            ],
            responses: {
                200: {
                    description: "Resumo do fornecedor",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/FornecedorResumo",
                            },
                        },
                    },
                },
                404: { description: "Fornecedor não encontrado" },
            },
        },
    },
};
