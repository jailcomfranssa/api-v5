import { Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { EstoqueService } from "./estoque.service";
import { AppError } from "../../errors/AppError";
import { MOVIMENTO } from "../../../generated/prisma/enums";

const service = new EstoqueService();

export class EstoqueController {
    create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const data = req.body;

        service.authAccess(authUser);

        const estoque = await service.create(authUser, data);
        return res.status(201).json(estoque);
    });

    findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        service.authAccess(authUser);

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
                throw new AppError("ID inválido.", 400);
            }

            service.authAccess(authUser);

            const estoque = await service.findById(authUser, id);
            return res.status(200).json(estoque);
        }
    );

    update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const id = Number(req.params.id);
        const data = req.body;

        if (isNaN(id)) {
            throw new AppError("ID inválido.", 400);
        }

        service.authAccess(authUser);

        const estoque = await service.update(authUser, id, data);
        return res.status(200).json(estoque);
    });

    delete = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new AppError("ID inválido.", 400);
        }

        service.authAccess(authUser);

        const estoque = await service.delete(authUser, id);
        return res.status(200).json(estoque);
    });

    findByProduto = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const id = Number(req.params.id);

            if (isNaN(id)) {
                throw new AppError("ID inválido.", 400);
            }

            service.authAccess(authUser);

            const estoque = await service.findByProduto(authUser, id);
            return res.status(200).json(estoque);
        }
    );

    findByPeriodo = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;

            const dataInicio = new Date(req.query.dataInicio as string);
            const dataFim = new Date(req.query.dataFim as string);

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            service.authAccess(authUser);

            const estoque = await service.findByPeriodo(
                authUser,
                dataInicio,
                dataFim,
                page,
                limit
            );
            return res.status(200).json(estoque);
        }
    );

    findByTipo = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const tipo_movimento = req.params.tipo_movimento as MOVIMENTO;

            service.authAccess(authUser);

            const estoque = await service.findByTipo(
                authUser,
                tipo_movimento,
                page,
                limit
            );
            return res.status(200).json(estoque);
        }
    );

    findByOrigemDestino = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;

            const {
                origemDestino,
                tipoMovimento,
                page = 1,
                limit = 10,
            } = req.query;

            const estoque = await service.findByOrigemDestino(
                authUser,
                String(origemDestino),
                tipoMovimento as MOVIMENTO,
                Number(page),
                Number(limit)
            );

            return res.status(200).json(estoque);
        }
    );
}
