import { Router } from "express";
import { ProdutoController } from "./produto.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";

import { idParamSchema } from "../../schemas/common.schema";
import {
    createProdutoSchema,
    updateProdutoSchema,
    produtoPaginationSchema,
    produtoCategoriaParamSchema,
    produtoFornecedorParamSchema,
    produtoDiasQuerySchema,
} from "../../schemas/produto.schema";

const router = Router();
const controller = new ProdutoController();

/**
 * 🔹 Criar produto
 * POST /produtos
 */
router.post(
    "/",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ body: createProdutoSchema }),
    controller.create
);

/**
 * 🔹 Listar produtos (paginação)
 * GET /produtos?page=1&limit=10
 */
router.get(
    "/",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ query: produtoPaginationSchema }),
    controller.findAll
);

/**
 * 🔹 Buscar produtos próximos do vencimento
 * GET /produtos/vencimento/proximos?dias=7
 */
router.get(
    "/vencimento/proximos",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ query: produtoDiasQuerySchema }),
    controller.findProximosVencimento
);

/**
 * 🔹 Buscar produtos vencidos
 * GET /produtos/vencimento/vencidos
 */
router.get(
    "/vencimento/vencidos",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    controller.findVencidos
);

/**
 * 🔹 Buscar produto por ID
 * GET /produtos/:id
 */
router.get(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ params: idParamSchema }),
    controller.findById
);

/**
 * 🔹 Atualizar produto
 * PUT /produtos/:id
 */
router.put(
    "/:id",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({
        params: idParamSchema,
        body: updateProdutoSchema,
    }),
    controller.update
);

/**
 * 🔹 Deletar produto
 * DELETE /produtos/:id
 */
router.delete(
    "/:id",
    authMiddleware,
    authorize("ADMIN"),
    validateRequest({ params: idParamSchema }),
    controller.delete
);

/**
 * 🔹 Buscar produtos por categoria
 * GET /produtos/categoria/:categoriaId
 */
router.get(
    "/categoria/:categoriaId",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ params: produtoCategoriaParamSchema }),
    controller.findByCategoria
);

/**
 * 🔹 Buscar produtos por fornecedor
 * GET /produtos/fornecedor/:fornecedorId
 */
router.get(
    "/fornecedor/:fornecedorId",
    authMiddleware,
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ params: produtoFornecedorParamSchema }),
    controller.findByFornecedor
);

export default router;
