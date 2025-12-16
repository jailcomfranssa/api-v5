// src/routes/funcionario.routes.ts
import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import { FuncionarioCadastroController } from "./funcionarioCadastro.controller";
import {
    funcionarioCadastroSchema,
    funcionarioCadastroUpdateSchema,
} from "../../schemas/funcionarioCadastro.schema";
import { filtrosPaginaçãoSchema } from "../../schemas/filtrosPaginação.schema";
import { idParamSchema } from "../../schemas/common.schema";

const router = Router();
const controller = new FuncionarioCadastroController();

/**
 * ADMIN cria funcionário
 */
router.post(
    "/",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    controller.create
);

/**
 * ADMIN lista todos
 */
router.get(
    "/",
    authMiddleware,
    authorize("ADMIN"),
    validateRequest({ query: filtrosPaginaçãoSchema }),
    controller.findAll
);

/**
 * ADMIN vê qualquer funcionário
 * FUNCIONÁRIO vê apenas seu próprio cadastro
 */
router.get(
    "/:id",
    validateRequest({ params: idParamSchema }),
    authMiddleware,
    controller.findById
);

/**
 * ADMIN edita qualquer funcionário
 * FUNCIONÁRIO edita apenas o próprio cadastro
 */
router.put(
    "/:id",
    authMiddleware,
    validateRequest({
        params: idParamSchema,
        body: funcionarioCadastroUpdateSchema,
    }),
    controller.update
);

/**
 * ❌ FUNCIONÁRIO NÃO PODE DELETAR
 * ✔ SOMENTE ADMIN PODE DELETAR FUNCIONÁRIO
 */
router.delete(
    "/:id",
    validateRequest({ params: idParamSchema }),
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"), // <- regra aplicada aqui
    controller.delete
);

export default router;
