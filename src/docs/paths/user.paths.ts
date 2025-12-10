// doc/paths/user.paths.ts
export const userPaths = {
    "/api/users": {
        get: {
            tags: ["Users"],
            summary: "Listar usuários com paginação e filtros",
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "page", in: "query", schema: { type: "number" } },
                { name: "limit", in: "query", schema: { type: "number" } },
                { name: "search", in: "query", schema: { type: "string" } },
                {
                    name: "orderBy",
                    in: "query",
                    schema: { type: "string", default: "createdAt" },
                },
                {
                    name: "order",
                    in: "query",
                    schema: {
                        type: "string",
                        enum: ["asc", "desc"],
                        default: "desc",
                    },
                },
            ],
            responses: {
                200: { description: "Lista paginada de usuários" },
                403: { description: "Acesso negado" },
            },
        },

        post: {
            tags: ["Users"],
            summary: "Criar um novo usuário",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CreateUserDTO" },
                    },
                },
            },
            responses: {
                201: { description: "Usuário criado" },
                409: { description: "E-mail já cadastrado" },
            },
        },
    },

    "/api/users/{id}": {
        get: {
            tags: ["Users"],
            summary: "Buscar usuário por ID",
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
                200: { description: "Usuário encontrado" },
                404: { description: "Usuário não encontrado" },
            },
        },

        put: {
            tags: ["Users"],
            summary: "Atualizar usuário por ID",
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
                        schema: { $ref: "#/components/schemas/UpdateUserDTO" },
                    },
                },
            },
            responses: {
                200: { description: "Usuário atualizado" },
                403: { description: "Acesso negado" },
            },
        },

        delete: {
            tags: ["Users"],
            summary: "Excluir usuário",
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
                204: { description: "Usuário excluído" },
            },
        },
    },
};
