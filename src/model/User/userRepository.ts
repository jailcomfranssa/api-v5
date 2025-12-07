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
    async create(
        data: Pick<User, "name" | "email" | "senha" | "telefone" | "role">
    ): Promise<User> {
        return prisma.user.create({ data });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async findById(id: number): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    /** 🔥 findAll com paginação, busca e ordenação */
    async findAll(options?: FindAllOptions): Promise<User[]> {
        const { skip, take, where, orderBy } = options || {};

        return prisma.user.findMany({
            skip,
            take,
            where,
            orderBy,
        });
    }

    /** 🔥 count para paginação */
    async count(where: any = {}): Promise<number> {
        return prisma.user.count({ where });
    }

    async update(
        id: number,
        data: Partial<
            Pick<User, "name" | "email" | "senha" | "telefone" | "role">
        >
    ): Promise<User> {
        const exists = await prisma.user.findUnique({ where: { id } });
        if (!exists) {
            throw new AppError("User not found", 404);
        }

        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<User> {
        const exists = await prisma.user.findUnique({ where: { id } });
        if (!exists) {
            throw new AppError("User not found", 404);
        }
        return prisma.user.delete({ where: { id } });
    }
}
