import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * asyncHandler
 * Wrapper para evitar try/catch nos controllers assíncronos.
 */
const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default asyncHandler;
