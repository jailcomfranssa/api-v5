import { Request, Response } from "express";
import { AuthService } from "./AuthService";
import asyncHandler from "../../middlewares/asyncHandler";

export class AuthController {
    private authService = new AuthService();

    login = asyncHandler(async (req: Request, res: Response) => {
        const { email, senha } = req.body;
        const result = await this.authService.authenticate(email, senha);
        return res.status(200).json(result);
    });

    me = asyncHandler(async (req: Request, res: Response) => {
        // req.user foi populado no middleware authenticate
        return res.status(200).json({ user: req.user });
    });
}
