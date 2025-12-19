import { Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { FornecedorService } from "./fornecedor.service";
import { AppError } from "../../errors/AppError";

const service = new FornecedorService();

export class FornecedorController {
    /* ============================
     * Criar fornecedor
     * ============================ */
    create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const data = req.body;

        const result = await service.create(authUser, data);
        return res.status(201).json(result);
    });

    /* ============================
     * Buscar fornecedor por ID
     * ============================ */
    findById = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const id = Number(req.params.id);

            if (isNaN(id)) {
                throw new AppError("ID inválido.", 400);
            }

            const result = await service.findById(authUser, id);
            return res.status(200).json(result);
        }
    );

    /* ============================
     * Listar fornecedores (paginação)
     * ============================ */
    findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await service.findAll(authUser, page, limit);
        return res.status(200).json(result);
    });

    /* ============================
     * Buscar fornecedor por nome
     * ============================ */
    searchByNome = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const nome = String(req.query.nome || "").trim();

            if (!nome) {
                throw new AppError(
                    "Parâmetro 'nome' é obrigatório para busca.",
                    400
                );
            }

            const result = await service.searchByNome(authUser, nome);
            return res.status(200).json(result);
        }
    );

    /* ============================
     * Buscar fornecedor com resumo
     * ============================ */
    findWithResumo = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const id = Number(req.params.id);

            if (isNaN(id)) {
                throw new AppError("ID inválido.", 400);
            }

            const result = await service.findWithResumo(authUser, id);
            return res.status(200).json(result);
        }
    );

    /* ============================
     * Atualizar fornecedor
     * ============================ */
    update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const id = Number(req.params.id);
        const data = req.body;

        if (isNaN(id)) {
            throw new AppError("ID inválido.", 400);
        }

        const result = await service.update(authUser, id, data);
        return res.status(200).json(result);
    });

    /* ============================
     * Deletar fornecedor
     * ============================ */
    delete = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new AppError("ID inválido.", 400);
        }

        await service.delete(authUser, id);
        return res.status(204).send();
    });
}
