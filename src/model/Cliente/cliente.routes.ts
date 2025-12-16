import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import { ClienteCadastroController } from "./clienteCadastro.controller";
import {
    clienteUpdateSchema,
} from "../../schemas/clienteCadastro.schema";
import { filtrosPaginaçãoSchema } from "../../schemas/filtrosPaginação.schema";
import { idParamSchema } from "../../schemas/common.schema";

const router = Router();
const controller = new ClienteCadastroController();

/**
 * ADMIN cria cliente
 */
router.post(
    "/",
    authMiddleware,
    authorize("ADMIN", "CLIENTE"),
    controller.create
);

/**
 * ADMIN lista todos
 */
router.get(
    "/",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ query: filtrosPaginaçãoSchema }),
    controller.findAll
);

/**
 * ADMIN busca por id
 * CLIENTE vê apenas seu próprio cadastro
 */
router.get(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "CLIENTE"),
    validateRequest({ params: idParamSchema }),
    controller.findById
);

/**
 * ADMIN edita qualquer funcionário
 * FUNCIONÁRIO edita apenas o próprio cadastro
 */
router.put(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "CLIENTE"),
    validateRequest({
        params: idParamSchema,
        body: clienteUpdateSchema,
    }),
    controller.update
);

/**
 * ❌ CLIENTE NÃO PODE DELETAR
 * ✔ SOMENTE ADMIN PODE DELETAR CLIENTE
 */
router.delete(
    "/:id",
    validateRequest({ params: idParamSchema }),
    authMiddleware,
    authorize("ADMIN", "CLIENTE"), // <- regra aplicada aqui
    controller.delete
);

export default router;
