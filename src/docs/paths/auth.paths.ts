// doc/paths/auth.paths.ts
export const authPaths = {
    "/api/auth/login": {
        post: {
            tags: ["Auth"],
            summary: "Autenticar um usuário",
            description:
                "Retorna um token JWT válido para acessar as rotas protegidas.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/LoginDTO" },
                    },
                },
            },
            responses: {
                200: {
                    description: "Login efetuado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/LoginResponse",
                            },
                        },
                    },
                },
                401: { description: "Credenciais inválidas" },
            },
        },
    },
};
