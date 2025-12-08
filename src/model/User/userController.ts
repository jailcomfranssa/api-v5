import { Request, Response } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import { UserService } from "./userService";

export class UserController {
    private userService = new UserService();

    // 🔹 Criar usuário
    create = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userService.create(req.body);
        return res.status(201).json(user);
    });

    // 🔹 Listar usuários com paginação
    findAll = asyncHandler(async (req: Request, res: Response) => {
        const {
            page = "1",
            limit = "10",
            search,
            orderBy = "createdAt",
            order = "desc",
        } = req.query as Record<string, string>;

        const result = await this.userService.findAll({
            page: Number(page),
            limit: Number(limit),
            search: search || undefined,
            orderBy,
            order: order === "asc" ? "asc" : "desc",
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
    update = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const user = await this.userService.update(id, req.body);
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
