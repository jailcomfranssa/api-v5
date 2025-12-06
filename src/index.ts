import app from "./app";
import logger from "./config/logger";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logger.info(`🚀 Servidor rodando na porta ${PORT}`);
    logger.info(
        `📚 Documentação da API disponível em http://localhost:${PORT}/api-docs`
    );
});

// Graceful shutdown handling
const shutdown = () => {
    logger.info("Recebido sinal de desligamento. Encerrando servidor...");
    server.close(() => {
        logger.info("Servidor encerrado.");
        process.exit(0);
    });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
