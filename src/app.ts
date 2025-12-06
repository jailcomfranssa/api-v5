import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import logger from "./config/logger";
import { setupSwagger } from "./config/swagger";

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
setupSwagger(app);

// Basic health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: `Rota ${req.originalUrl} não encontrada.`,
    });
});

// Global error handler (to be expanded later)
app.use(
    (
        error: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        logger.error("Erro não tratado:", error);
        res.status(500).json({
            message: "Ocorreu um erro interno no servidor.",
        });
    }
);

export default app;
