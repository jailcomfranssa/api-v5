import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Minha API Profissional",
            version: "1.0.0",
            description:
                "Documentação da API com Node.js, Express e TypeScript",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor de Desenvolvimento",
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/modules/**/**/*.ts"],  // Path to your future route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express): void => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
