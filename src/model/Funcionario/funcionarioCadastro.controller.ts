// src/modules/funcionario-cadastro/funcionarioCadastro.controller.ts
import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import { FuncionarioCadastroService } from "./funcionarioCadastro.service";
import { AppError } from "../../errors/AppError";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { funcionarioCadastroAdminSchema, funcionarioCadastroUserSchema } from "../../schemas/funcionarioCadastro.schema";

const service = new FuncionarioCadastroService();

export class FuncionarioCadastroController {
    // 🔹 Criar cadastro
    create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const data = req.body;

        if (req.user!.role === "ADMIN") {
            await funcionarioCadastroAdminSchema.validateAsync(req.body);
        } else {
            await funcionarioCadastroUserSchema.validateAsync(req.body);
        }

        const result = await service.create(authUser, data);
        return res.status(201).json(result );
    });

    // 🔹 Buscar cadastro pelo ID
    findById = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const id = Number(req.params.id);

            const cadastro = await service.findById(authUser, id);

            // FUNCIONÁRIO só pode acessar o próprio
            if (
                authUser.role === "FUNCIONARIO" &&
                cadastro.userId !== authUser.id
            ) {
                throw new AppError(
                    "Você não pode acessar outro funcionário.",
                    403
                );
            }

            return res.json(cadastro);
        }
    );

    // 🔹 Listar todos (somente ADMIN)
    findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;

        if (authUser.role !== "ADMIN") {
            throw new AppError(
                "Apenas administradores podem listar funcionários.",
                403
            );
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await service.findAll(authUser, page, limit);
        return res.json(result);
    });

    // 🔹 Atualizar cadastro
    update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const id = Number(req.params.id);
        const data = req.body;

        const cadastro = await service.findById(authUser, id);

        // FUNCIONÁRIO só pode atualizar o próprio cadastro
        if (
            authUser.role === "FUNCIONARIO" &&
            cadastro.userId !== authUser.id
        ) {
            throw new AppError(
                "Você não pode atualizar outro funcionário.",
                403
            );
        }

        const result = await service.update(authUser, id, data);
        return res.json(result);
    });

    // 🔹 Deletar cadastro (apenas ADMIN)
    delete = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const id = Number(req.params.id);
        await service.delete(authUser, id);
        return res.status(204).send();
    });
}
