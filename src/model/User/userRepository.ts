import { prisma } from "../../lib/prisma";
import { User } from "../../../generated/prisma/client";
import { AppError } from "../../errors/AppError";

interface FindAllOptions {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
}

export class UserRepository {
    // 🔹 Criar usuário
    async create(
        data: Pick<User, "name" | "email" | "senha" | "telefone" | "role">
    ): Promise<User> {
        return prisma.user.create({ data });
    }

    // 🔹 Buscar por e-mail
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    // 🔹 Buscar por ID
    async findById(id: number): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    // 🔹 Listar usuários com paginação, busca e ordenação
    async findAll(options?: FindAllOptions): Promise<User[]> {
        const { skip, take, where, orderBy } = options || {};

        return prisma.user.findMany({
            skip,
            take,
            where,
            orderBy,
        });
    }

    // 🔹 Contagem para paginação
    async count(where: any = {}): Promise<number> {
        return prisma.user.count({ where });
    }

    // 🔹 Atualizar usuário
    async update(
        id: number,
        data: Partial<
            Pick<User, "name" | "email" | "senha" | "telefone" | "role">
        >
    ): Promise<User> {
        const exists = await prisma.user.findUnique({ where: { id } });

        if (!exists) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        return prisma.user.update({
            where: { id },
            data,
        });
    }

    // 🔹 Deletar usuário
    async delete(id: number): Promise<User> {
        const exists = await prisma.user.findUnique({ where: { id } });

        if (!exists) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        return prisma.user.delete({ where: { id } });
    }
}
