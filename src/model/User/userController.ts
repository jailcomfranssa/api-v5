import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middlewares/asyncHandler";
import { UserService } from "./userService";

export class UserController {
    private userService = new UserService();

    // 🔹 Criar usuário
    create = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userService.create(req.body);
        return res.status(201).json(user);
    });

    // 🔹 Listar todos
    findAll = asyncHandler(async (req: Request, res: Response) => {
        const {
            page = 1,
            limit = 10,
            search,
            orderBy = "createdAt",
            order = "desc",
        } = req.query;

        const result = await this.userService.findAll({
            page: Number(page),
            limit: Number(limit),
            search: search ? String(search) : undefined,
            orderBy: String(orderBy),
            order: order as "asc" | "desc",
        });

        return res.status(200).json(result);
    });

    // 🔹 Buscar por ID
    findById = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const user = await this.userService.findById(id);
        return res.status(200).json(user);
    });

    // 🔹 Atualizar
    update = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const user = await this.userService.update(id, req.body);
        return res.status(200).json(user);
    });

    // 🔹 Deletar
    delete = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        await this.userService.delete(id);
        return res
            .status(204)
            .send({ message: "Usuário deletado com sucesso" });
    });
}
