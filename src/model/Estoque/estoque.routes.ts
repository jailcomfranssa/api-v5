import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import { EstoqueController } from "./estoque.controller";
import { filtrosPaginaçãoSchema } from "../../schemas/filtrosPaginação.schema";
import { idParamSchema } from "../../schemas/common.schema";

import {
    produtoIdParamSchema,
    tipoMovimentoParamSchema,
    origemDestinoQuerySchema,
    paginationQuerySchema,
    periodoQuerySchema,
    estoqueCreateSchema,
    estoqueUpdateSchema,
    
} from "./estoque.schema";

const router = Router();
const controller = new EstoqueController();

router.use(authMiddleware);

/**
 * 🔹 Criar estoque
 */
router.post(
    "/",
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ body: estoqueCreateSchema }),
    controller.create
);

/**
 * 🔹 Listar estoques (paginação)
 */
router.get(
    "/",
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ query: filtrosPaginaçãoSchema }),
    controller.findAll
);

/* 🔹 Movimentações por PERÍODO */
router.get(
    "/periodo",
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({
        query: periodoQuerySchema,
    }),
    controller.findByPeriodo
);
/* 🔹 Movimentações por ORIGEM/DESTINO + TIPO */
router.get(
    "/origem-destino",
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({
        query: origemDestinoQuerySchema,
    }),
    controller.findByOrigemDestino
);

/* 🔹 Movimentações por TIPO */
router.get(
    "/tipo/:tipo_movimento",
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({
        params: tipoMovimentoParamSchema,
        query: paginationQuerySchema,
    }),
    controller.findByTipo
);

/**
 * 🔹 Buscar estoque por ID
 */
router.get(
    "/:id",
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ params: idParamSchema }),
    controller.findById
);

/**
 * 🔹 Atualizar estoque
 */
router.put(
    "/:id",
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({
        params: idParamSchema,
        body: estoqueUpdateSchema,
    }),
    controller.update
);

/**
 * 🔹 Deletar estoque
 */
router.delete(
    "/:id",
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({ params: idParamSchema }),
    controller.delete
);

/**
 * 🔹 Buscar estoque por produto
 */
router.get(
    "/produto/:id",
    authorize("ADMIN", "FUNCIONARIO"),
    validateRequest({
        params: produtoIdParamSchema,
        query: paginationQuerySchema,
    }),
    controller.findByProduto
);

export default router;
