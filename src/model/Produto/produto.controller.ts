import { Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { ProdutoService } from "./produto.service";
import { AppError } from "../../errors/AppError";

const service = new ProdutoService();

export class ProdutoController {
    create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const data = req.body;

        if (authUser.role !== "ADMIN" && authUser.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem cadastrar produtos.",
                403
            );
        }

        const result = await service.create(data, authUser);
        return res.status(201).json(result);
    });

    findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;

        if (authUser.role !== "ADMIN" && authUser.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem listar produtos.",
                403
            );
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await service.findAll(authUser, page, limit);
        return res.status(200).json(result);
    });

    findById = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const id = Number(req.params.id);

            if (isNaN(id)) {
                throw new AppError("ID inválido.", 400);
            }

            if (authUser.role !== "ADMIN" && authUser.role !== "FUNCIONARIO") {
                throw new AppError(
                    "Apenas administradores e funcionários podem listar produtos.",
                    403
                );
            }

            const result = await service.findById(authUser, id);
            return res.status(200).json(result);
        }
    );

    update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const id = Number(req.params.id);
        const data = req.body;

        if (isNaN(id)) {
            throw new AppError("ID inválido.", 400);
        }

        if (authUser.role !== "ADMIN" && authUser.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem atualizar produtos.",
                403
            );
        }

        const result = await service.update(authUser, id, data);
        return res.status(200).json(result);
    });

    delete = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new AppError("ID inválido.", 400);
        }

        if (authUser.role !== "ADMIN") {
            throw new AppError(
                "Apenas administradores podem deletar produtos.",
                403
            );
        }

        await service.delete(authUser, id);
        return res.status(204).send();
    });

    // 🔎 Buscar por categoria
    findByCategoria = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const categoriaId = Number(req.params.categoriaId);

            if (isNaN(categoriaId)) {
                throw new AppError("ID da categoria inválido.", 400);
            }

            const result = await service.findByCategoria(authUser, categoriaId);
            return res.status(200).json(result);
        }
    );

    // 🔎 Buscar por fornecedor
    findByFornecedor = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const fornecedorId = Number(req.params.fornecedorId);

            if (isNaN(fornecedorId)) {
                throw new AppError("ID do fornecedor inválido.", 400);
            }

            const result = await service.findByFornecedor(
                authUser,
                fornecedorId
            );
            return res.status(200).json(result);
        }
    );

    // ⛔ Produtos vencidos
    findVencidos = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const result = await service.findProdutosVencidos(authUser);
            return res.status(200).json(result);
        }
    );

    // ⏳ Produtos próximos do vencimento
    findProximosVencimento = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const dias = Number(req.query.dias) || 7;

            const result = await service.findProdutosProximosVencimento(
                authUser,
                dias
            );
            return res.status(200).json(result);
        }
    );
}
