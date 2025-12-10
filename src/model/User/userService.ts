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
            role: "CLIENTE",
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
    async findAll(params: any) {
        const { page, limit, search, orderBy, order, filter } = params;

        const skip = (page - 1) * limit;

        const where: any = {
            ...filter, //  ✅ entra primeiro
        };

        // se houver busca, adiciona OR
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

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
        }>,
        currentUserRole: string // 🔥 role de quem está autenticado
    ): Promise<User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        // 🔥 Somente ADMIN pode alterar a role
        if (data.role && currentUserRole !== "ADMIN") {
            throw new AppError("Somente ADMIN pode alterar o papel.", 403);
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
