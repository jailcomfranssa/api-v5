import { Router } from "express";
import { CategoriaController } from "./categoria.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import { filtrosPaginaçãoSchema } from "../../schemas/filtrosPaginação.schema";
import { idParamSchema } from "../../schemas/common.schema";
import {
    createCategoriaSchema,
    updateCategoriaSchema,
    updateCategoriaStatusSchema,
    searchCategoriaSchema,
} from "../../schemas/categoria.schema";

const router = Router();
const controller = new CategoriaController();

/**
 * 🔹 Criar categoria
 * POST /categorias
 */
router.post(
    "/",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ body: createCategoriaSchema }),
    controller.create
);

/**
 * 🔹 Listar categorias (paginação)
 * GET /categorias?page=1&limit=10
 */
router.get(
    "/",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ query: filtrosPaginaçãoSchema }),
    controller.findAll
);



/**
 * 🔹 Buscar categoria por nome (LIKE)
 * GET /categorias/search?nome=eletr
 */
router.get(
    "/search",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ query: searchCategoriaSchema }),
    controller.searchByNome
);

/**
 * 🔹 Buscar categorias por status
 * GET /categorias/status?status=true
 */
router.get(
    "/status",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ query: searchCategoriaSchema }),
    controller.searchByStatus
);

/**
 * 🔹 Buscar categoria por ID
 * GET /categorias/:id
 */
router.get(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ params: idParamSchema }),
    controller.findById
);

/**
 * 🔹 Atualizar categoria (geral)
 * PUT /categorias/:id
 */
router.put(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({
        params: idParamSchema,
        body: updateCategoriaSchema,
    }),
    controller.update
);

/**
 * 🔹 Atualizar somente status
 * PATCH /categorias/:id/status
 */
router.patch(
    "/:id/status",
    authMiddleware,
    authorize("ADMIN"),
    validateRequest({
        params: idParamSchema,
        body: updateCategoriaStatusSchema,
    }),
    controller.updateStatus
);

/**
 * 🔹 Deletar categoria
 * DELETE /categorias/:id
 */
router.delete(
    "/:id",
    authMiddleware,
    authorize("ADMIN"),
    validateRequest({ params: idParamSchema }),
    controller.delete
);

export default router;
