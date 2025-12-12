// src/modules/funcionario-cadastro/funcionarioCadastro.repository.ts
import { prisma } from "../../lib/prisma";
import { FuncionarioCadastro } from "../../../generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

export interface FindAllOptions {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
}

export type FuncionarioUpdateData = {
    cpf?: string;
    cargo?: string;
    telefone?: string | null;
    salario?: Decimal;
    dataAdmissao?: Date;
    userId?: number;
};

export class FuncionarioCadastroRepository {
    // 🔹 Criar
    async create(
        data: Omit<FuncionarioCadastro, "id" | "createdAt" | "updatedAt">
    ) {
        return prisma.funcionarioCadastro.create({ data });
    }

    // 🔹 Buscar todos
    async findAll(options?: FindAllOptions): Promise<FuncionarioCadastro[]> {
        const { skip, take, where, orderBy } = options || {};

        return prisma.funcionarioCadastro.findMany({
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

    // 🔹 Contagem
    async count(where: any = {}): Promise<number> {
        return prisma.funcionarioCadastro.count({ where });
    }

    // 🔹 Buscar por ID
    async findById(id: number): Promise<FuncionarioCadastro | null> {
        return prisma.funcionarioCadastro.findUnique({
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
    async findByUserId(userId: number): Promise<FuncionarioCadastro | null> {
        return prisma.funcionarioCadastro.findUnique({
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

    // 🔹 Atualizar cadastro
    async update(id: number, data: FuncionarioUpdateData) {
        return prisma.funcionarioCadastro.update({
            where: { id },
            data,
        });
    }

    // 🔹 Deletar
    async delete(id: number) {
        return prisma.funcionarioCadastro.delete({
            where: { id },
        });
    }

    async findByCpf(cpf: string) {
        return prisma.funcionarioCadastro.findUnique({
            where: { cpf },
        });
    }
}
