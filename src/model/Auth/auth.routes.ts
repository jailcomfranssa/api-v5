// src/routes/auth.routes.ts
import { Router } from "express";
import { AuthService } from "./AuthService";
import asyncHandler from "../../middlewares/asyncHandler";
import authenticate from "../../middlewares/authenticate";

const router = Router();
const authService = new AuthService();

// Login
router.post(
    "/login",
    asyncHandler(async (req, res) => {
        const { email, senha } = req.body;
        const result = await authService.authenticate(email, senha);
        return res.status(200).json(result);
    })
);

// Rota protegida exemplo: retorna dados do usuário logado
router.get(
    "/me",
    authenticate(),
    asyncHandler(async (req, res) => {
        // req.user foi populado no middleware authenticate
        return res.status(200).json({ user: req.user });
    })
);

export default router;
