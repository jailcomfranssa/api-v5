export const userPaths = {
    "/api/users": {
        get: {
            tags: ["Users"],
            summary: "Listar usuários com paginação e filtros",
            parameters: [
                { name: "page", in: "query", schema: { type: "number" } },
                { name: "limit", in: "query", schema: { type: "number" } },
                { name: "sortBy", in: "query", schema: { type: "string" } },
                { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"] } }
            ],
            responses: {
                200: { description: "Lista paginada de usuários" }
            }
        },

        post: {
            tags: ["Users"],
            summary: "Criar um novo usuário",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CreateUserDTO" }
                    }
                }
            },
            responses: {
                201: { description: "Usuário criado" }
            }
        }
    },

    "/api/users/{id}": {
        get: {
            tags: ["Users"],
            summary: "Buscar usuário por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string", format: "number" }
                }
            ],
            responses: {
                200: { description: "Usuário encontrado" },
                404: { description: "Usuário não encontrado" }
            }
        },

        put: {
            tags: ["Users"],
            summary: "Atualizar usuário por ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string", format: "namber" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UpdateUserDTO" }
                    }
                }
            },
            responses: {
                200: { description: "Usuário atualizado" }
            }
        },

        delete: {
            tags: ["Users"],
            summary: "Excluir usuário",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true
                }
            ],
            responses: {
                204: { description: "Usuário excluído" }
            }
        }
    }
};
