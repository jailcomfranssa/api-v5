import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import logger from "./config/logger";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./docs";
import { errorHandler } from "./middlewares/errorHandler";
import rootRoutes from "./routes";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Logging middleware
app.use(
    morgan("combined", {
        stream: { write: (message) => logger.http(message.trim()) },
    })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Basic health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

// 🧩 Todas as rotas da aplicação
app.use("/api", rootRoutes);

// Global error handler
app.use(errorHandler);

export default app;
