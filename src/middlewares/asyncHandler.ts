import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * asyncHandler
 * --------------------------------------------------------------------
 * Wrapper para lidar com rotas assíncronas sem necessidade de try/catch
 * em todos os controllers.
 *
 * - Captura automaticamente exceções síncronas e assíncronas
 * - Garante que erros sejam encaminhados ao errorHandler
 * - Compatível com métodos de classe (ex: this.userService)
 */
const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => any | Promise<any>
): RequestHandler => {
    return (req, res, next) => {
        try {
            const result = fn(req, res, next);

            // Caso retorne Promessa → capturar erros
            if (result instanceof Promise) {
                result.catch(next);
            }
        } catch (err) {
            // Captura erros síncronos
            next(err);
        }
    };
};

export default asyncHandler;
