import { ClienteCadastroService } from "./clienteCadastro.service";
import asyncHandler from "./../../middlewares/asyncHandler";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { Response } from "express";
import {
    clienteCadastroAdminSchema,
    clienteCadastroUserSchema,
} from "../../schemas/clienteCadastro.schema";

const service = new ClienteCadastroService();

export class ClienteCadastroController {
    // 🔹 Criar cadastro
    create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const data = req.body;

        if (req.user!.role === "ADMIN") {
            await clienteCadastroAdminSchema.validateAsync(req.body);
        } else {
            await clienteCadastroUserSchema.validateAsync(req.body);
        }

        const result = await service.create(authUser, data);
        return res.status(201).json(result);
    });

    // 🔹 Buscar cadastro pelo ID
    findById = asyncHandler(
        async (req: AuthenticatedRequest, res: Response) => {
            const authUser = req.user!;
            const id = Number(req.params.id);

            const cliente = await service.findById(authUser, id);

            return res.json(cliente);
        }
    );
    // 🔹 Listar todos (somente ADMIN & FUNCIONARIO)
    findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
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

        const result = await service.update(authUser, id, data);
        return res.json(result);
    });

    // 🔹 Deletar cadastro (ADMIN ou proprio cliente)
    delete = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const authUser = req.user!;
        const id = Number(req.params.id);
        await service.delete(authUser, id);
        return res.status(204).send();
    });
}
