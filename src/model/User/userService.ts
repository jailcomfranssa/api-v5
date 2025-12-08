import bcrypt from "bcryptjs";
import { UserRepository } from "./userRepository";
import { AppError } from "../../errors/AppError";
import { User } from "../../../generated/prisma/client";
import { PaginationQuery } from "../../types/pagination";

export class UserService {
    private userRepository = new UserRepository();

    // 🔹 Criar usuário
    async create(data: {
        name: string;
        email: string;
        senha: string;
        telefone?: string | null;
        role: "ADMIN" | "FUNCIONARIO" | "CLIENTE";
    }): Promise<User> {
        const userExists = await this.userRepository.findByEmail(data.email);
        if (userExists) {
            throw new AppError("O e-mail informado já está cadastrado.", 409);
        }

        const hashedPassword = await bcrypt.hash(data.senha, 10);

        return this.userRepository.create({
            ...data,
            senha: hashedPassword,
            telefone: data.telefone || null,
        });
    }

    // 🔹 Buscar usuário por ID
    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        return user;
    }

    // 🔹 Listar usuários (com paginação e filtro)
    async findAll(params: PaginationQuery) {
        const { page, limit, search, orderBy, order } = params;

        const skip = (page - 1) * limit;

        const where = search
            ? {
                  OR: [
                      { name: { contains: search, mode: "insensitive" } },
                      { email: { contains: search, mode: "insensitive" } },
                  ],
              }
            : {};

        const [total, users] = await Promise.all([
            this.userRepository.count(where),
            this.userRepository.findAll({
                skip,
                take: limit,
                where,
                orderBy: { [orderBy]: order },
            }),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // 🔹 Atualizar usuário
    async update(
        id: number,
        data: Partial<{
            name: string;
            email: string;
            senha: string;
            telefone?: string;
            role?: "ADMIN" | "FUNCIONARIO" | "CLIENTE";
        }>
    ): Promise<User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        // Verificar se o e-mail já pertence a outro usuário
        if (data.email && data.email !== user.email) {
            const emailExists = await this.userRepository.findByEmail(
                data.email
            );

            if (emailExists) {
                throw new AppError("O e-mail informado já está em uso.", 409);
            }
        }

        // Atualiza senha somente se enviada
        const updateData = {
            ...data,
            senha: data.senha ? await bcrypt.hash(data.senha, 10) : user.senha,
        };

        return this.userRepository.update(id, updateData);
    }

    // 🔹 Deletar usuário
    async delete(id: number): Promise<void> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        await this.userRepository.delete(id);
    }
}
