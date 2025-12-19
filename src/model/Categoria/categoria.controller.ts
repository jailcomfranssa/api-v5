import { Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { CategoriaService } from "./categoria.service";
import { AppError } from "../../errors/AppError";

const service = new CategoriaService();

export class CategoriaController {
    // 🔹 Criar categoria
    create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const data = req.body;

        const result = await service.create(authUser, data);
        return res.status(201).json(result);
    });

    // 🔹 Listar todas (paginação)
    findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await service.findAll(authUser, page, limit);
        return res.status(200).json(result);
    });

    // 🔹 Buscar por ID
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

    // 🔹 Buscar por nome exato
    findByNome = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const { nome } = req.query;

            if (!nome || typeof nome !== "string") {
                throw new AppError("Nome é obrigatório.", 400);
            }

            const result = await service.findByNome(authUser, nome);
            return res.status(200).json(result);
        }
    );

    // 🔹 Buscar por nome (LIKE)
    searchByNome = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const { nome } = req.query;

            if (!nome || typeof nome !== "string") {
                throw new AppError("Nome é obrigatório.", 400);
            }

            const result = await service.searchByNome(authUser, nome);
            return res.status(200).json(result);
        }
    );

    // 🔹 Buscar por status
    searchByStatus = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const statusParam = req.query.status;

            if (statusParam === undefined) {
                throw new AppError("Status é obrigatório.", 400);
            }

            const status = statusParam === "true";

            const result = await service.searchByStatus(authUser, status);
            return res.status(200).json(result);
        }
    );

    // 🔹 Atualizar categoria
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

    // 🔹 Atualizar somente status
    updateStatus = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const id = Number(req.params.id);
            const { status } = req.body;

            if (isNaN(id)) {
                throw new AppError("ID inválido.", 400);
            }

            if (typeof status !== "boolean") {
                throw new AppError("Status deve ser boolean.", 400);
            }

            const result = await service.updateStatus(authUser, id, status);
            return res.status(200).json(result);
        }
    );

    // 🔹 Deletar categoria
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
