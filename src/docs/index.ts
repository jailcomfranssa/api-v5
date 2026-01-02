import { userSchema } from "./components/user.schema";
import { authSchema } from "./components/auth.schema";

import { userPaths } from "./paths/user.paths";
import { authPaths } from "./paths/auth.paths";

import { funcionarioSchema } from "./components/funcionario.schema";
import { funcionarioPaths } from "./paths/funcionario.paths";

import { fornecedorSchema } from "./components/fornecedor.schema";
import { fornecedorPaths } from "./paths/fornecedor.paths";

import { CategoriaSchemas } from "./components/categoria.components";
import { CategoriaPaths } from "./paths/categoria.paths";

import { ProdutoSchemas } from "./components/produto.schemas";
import { ProdutoParameters } from "./parameters/produto.parameters";
import { ProdutoPaths } from "./paths/produto.paths";

import { EstoqueSchema } from "./components/estoque.schema";
import { EstoquePaths } from "./paths/estoque.paths";
import { EstoqueParameters } from "./parameters/estoque.parameters";


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
        ...fornecedorPaths,
        ...CategoriaPaths,
        ...ProdutoPaths,
        ...EstoquePaths
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
            ...fornecedorSchema,
            ...CategoriaSchemas,
            ...ProdutoSchemas,
            ...EstoqueSchema
        },
        parameters: {
            ...ProdutoParameters,
            ...EstoqueParameters
        },
    },
};
