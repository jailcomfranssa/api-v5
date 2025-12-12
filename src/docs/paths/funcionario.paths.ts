// docs/paths/funcionario.paths.ts

export const funcionarioPaths = {
    "/api/funcionario": {
        post: {
            tags: ["Funcionários"],
            summary: "Criar cadastro de funcionário",
            description: `
- Funcionário só pode criar o próprio cadastro.
- Admin pode criar cadastro para outros usuários.
- CPF é único: não permite duplicação.
- Admin só pode cadastrar usuários com role = FUNCIONARIO.
            `,
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/CreateFuncionarioDTO",
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "Funcionário cadastrado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Funcionario",
                            },
                        },
                    },
                },
                400: { description: "Erro de validação" },
                403: {
                    description: "Funcionário não pode criar cadastro de outro",
                },
                404: { description: "Usuário não encontrado" },
                409: { description: "CPF já está cadastrado" },
            },
        },

        get: {
            tags: ["Funcionários"],
            summary: "Listar funcionários",
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: "page", in: "query", schema: { type: "number" } },
                { name: "limit", in: "query", schema: { type: "number" } },
                { name: "search", in: "query", schema: { type: "string" } },
            ],
            responses: {
                200: { description: "Lista paginada de funcionários" },
            },
        },
    },

    "/api/funcionario/{id}": {
        get: {
            tags: ["Funcionários"],
            summary: "Buscar cadastro de funcionário por ID",
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
                    description: "Funcionário encontrado",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Funcionario",
                            },
                        },
                    },
                },
                404: { description: "Funcionário não encontrado" },
            },
        },

        put: {
            tags: ["Funcionários"],
            summary: "Atualizar cadastro de funcionário",
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
                            $ref: "#/components/schemas/UpdateFuncionarioDTO",
                        },
                    },
                },
            },
            responses: {
                200: { description: "Funcionário atualizado" },
                403: { description: "Acesso negado" },
                404: { description: "Funcionário não encontrado" },
            },
        },

        delete: {
            tags: ["Funcionários"],
            summary: "Excluir cadastro de funcionário",
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
                204: { description: "Cadastro excluído" },
            },
        },
    },
};
