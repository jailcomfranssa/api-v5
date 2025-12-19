import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import { FornecedorController } from "./fornecedor.controller";
import { filtrosPaginaçãoSchema } from "../../schemas/filtrosPaginação.schema";
import { idParamSchema } from "../../schemas/common.schema";
import {
    createFornecedorSchema,
    updateFornecedorSchema,
} from "../../schemas/fornecedor.schema";

const router = Router();
const controller = new FornecedorController();

/**
 * 🔹 Criar fornecedor
 */
router.post(
    "/",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ body: createFornecedorSchema }),
    controller.create
);

/**
 * 🔹 Listar fornecedores (paginação)
 */
router.get(
    "/",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ query: filtrosPaginaçãoSchema }),
    controller.findAll
);

/**
 * 🔹 Buscar fornecedor por nome
 * /fornecedores/search?nome=abc
 */
router.get(
    "/search",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    controller.searchByNome
);

/**
 * 🔹 Buscar fornecedor por ID
 */
router.get(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ params: idParamSchema }),
    controller.findById
);

/**
 * 🔹 Buscar fornecedor com resumo (contador de compras)
 */
router.get(
    "/:id/resumo",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ params: idParamSchema }),
    controller.findWithResumo
);

/**
 * 🔹 Atualizar fornecedor
 */
router.put(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({
        params: idParamSchema,
        body: updateFornecedorSchema,
    }),
    controller.update
);

/**
 * 🔹 Deletar fornecedor
 */
router.delete(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ params: idParamSchema }),
    controller.delete
);

export default router;
