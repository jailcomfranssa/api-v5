import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import { UserService } from "./userService";
import { AuthenticatedRequest } from "../../middlewares/authMiddleware";
import { AppError } from "../../errors/AppError";

export class UserController {
    private userService = new UserService();

    // 🔹 Criar usuário
    create = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userService.create(req.body);
        return res.status(201).json(user);
    });

    // 🔹 Listar usuários com paginação
    findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
        page = "1",
        limit = "10",
        search,
        orderBy = "createdAt",
        order = "desc",
    } = req.query as Record<string, string>;

    const { role } = req.user!;

    // filtro inicial vazio
    let filter: any = {};

    // Se for FUNCIONARIO, só vê CLIENTES
    if (role === "FUNCIONARIO") {
        filter = { role: "CLIENTE" };
    }

    const result = await this.userService.findAll({
        filter, //  ✅ correto
        page: Number(page),
        limit: Number(limit),
        search: search || undefined,
        orderBy,
        order,
    });

    return res.status(200).json(result);
});

    // 🔹 Buscar por ID
    findById = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const user = await this.userService.findById(id);
        return res.status(200).json(user);
    });

    // 🔹 Atualizar usuário
    update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const id = Number(req.params.id);

        // 🔥 Regra aqui também (camada 1)
        if (req.body.role && req.user?.role !== "ADMIN") {
            throw new AppError("Somente ADMIN pode alterar o papel.", 403);
        }

        const user = await this.userService.update(
            id,
            req.body,
            req.user!.role
        );
        return res.status(200).json(user);
    });

    // 🔹 Deletar usuário
    delete = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        await this.userService.delete(id);

        // 204 → NÃO DEVE retornar body
        return res.status(204).send();
    });
}
