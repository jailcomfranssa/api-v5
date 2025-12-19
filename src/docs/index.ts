import { userSchema } from "./components/user.schema";
import { authSchema } from "./components/auth.schema";

import { userPaths } from "./paths/user.paths";
import { authPaths } from "./paths/auth.paths";

import { funcionarioSchema } from "./components/funcionario.schema";
import { funcionarioPaths } from "./paths/funcionario.paths";

import { fornecedorSchema } from "./components/fornecedor.schema";
import { fornecedorPaths } from "./paths/fornecedor.paths";



export const swaggerDocs = {
    openapi: "3.0.0",
    info: {
        title: "API v5",
        version: "1.0.0",
        description: "Documentação da API de Usuários com Autenticação JWT",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Servidor Local",
        },
    ],

    // ROTAS
    paths: {
        ...authPaths,
        ...userPaths,
        ...funcionarioPaths,
        ...fornecedorPaths
    },

    // COMPONENTES
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            ...userSchema,
            ...authSchema,
            ...funcionarioSchema,
            ...fornecedorSchema
        },
    },
};
