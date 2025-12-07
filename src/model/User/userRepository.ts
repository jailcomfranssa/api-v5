import { prisma } from "../../lib/prisma";
import { User } from "../../../generated/prisma/client";
import { AppError } from "../../errors/AppError";

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

    async findAll(): Promise<User[]> {
        return prisma.user.findMany();
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
