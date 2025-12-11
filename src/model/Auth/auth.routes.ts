// src/routes/auth.routes.ts
import { Router } from "express";
import { AuthController } from "./authController";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginSchema } from "../../schemas/auth.schema";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();
const authController = new AuthController();

router.post("/login", validateRequest({ body: loginSchema }), authController.login);
router.get("/me", authenticate, authController.me);

export default router;

