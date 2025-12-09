import { userSchema } from "./components/user.schema";
import { userPaths } from "./paths/user.paths";

export const swaggerDocs = {
    openapi: "3.0.0",
    info: {
        title: "API v5",
        version: "1.0.0",
        description: "Documentação da API de Usuários",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Servidor Local",
        },
    ],
    paths: {
        ...userPaths,
    },
    components: {
        schemas: {
            ...userSchema,
        },
    },
};
