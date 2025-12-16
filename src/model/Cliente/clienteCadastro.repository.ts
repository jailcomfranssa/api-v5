import { prisma } from "../../lib/prisma";
import { FindAllOptions } from "../../types/pagination";
import { ClienteCadastro } from "../../../generated/prisma/client";

export type ClienteUpdateData = {
    cpf?: string;
    rg?: string;
    telefone?: string | null;
    dataNascimento?: Date;
    userId?: number;
};

export class ClienteCadastroRepository {
    async create(
        data: Omit<ClienteCadastro, "id" | "createdAt" | "updatedAt">
    ) {
        return prisma.clienteCadastro.create({ data });
    }

    async findAll(options?: FindAllOptions): Promise<ClienteCadastro[]> {
        const { skip, take, where, orderBy } = options || {};

        return prisma.clienteCadastro.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                    },
                },
            },
        });
    }

    async count(where: any = {}): Promise<number> {
        return prisma.clienteCadastro.count({ where });
    }

    async findById(id: number): Promise<ClienteCadastro | null> {
        return prisma.clienteCadastro.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                    },
                },
            },
        });
    }

    // 🔹 Buscar por userId
    async findByUserId(userId: number): Promise<ClienteCadastro | null> {
        return prisma.clienteCadastro.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                    },
                },
            },
        });
    }

    async update(id: number, data: ClienteUpdateData) {
        return prisma.clienteCadastro.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return prisma.clienteCadastro.delete({ where: { id } });
    }

    async findByCpf(cpf: string) {
        return prisma.clienteCadastro.findUnique({ where: { cpf } });
    }
}
