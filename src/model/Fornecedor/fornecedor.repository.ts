import { prisma } from "../../lib/prisma";
import { Prisma, Fornecedor } from "../../../generated/prisma/client";
import { FindAllOptions } from "../../types/pagination";

export type CreateFornecedorDTO = {
    nome: string;
    cnpj: string;
    telefone: string;
    email: string;
};

export type UpdateFornecedorDTO = Partial<{
    nome: string;
    cnpj: string;
    telefone: string;
    email: string;
}>;

export class FornecedorRepository {
    /* 🔹 Criar fornecedor */
    async create(data: CreateFornecedorDTO): Promise<Fornecedor> {
        return prisma.fornecedor.create({
            data,
        });
    }

    /* 🔹 Buscar todos (com paginação, filtros e ordenação) */
    async findAll(
        options?: FindAllOptions & { includeCompras?: boolean }
    ): Promise<Fornecedor[]> {
        const { skip, take, where, orderBy, includeCompras } = options || {};

        return prisma.fornecedor.findMany({
            skip,
            take,
            where,
            orderBy,
            include: includeCompras
                ? {
                    compras: {
                        select: {
                            id: true,
                            valor: true,
                            data_compra: true,
                            funcionario: {
                                select: {
                                    id: true,
                                    cargo: true,
                                    user: {
                                        select: {
                                            id: true,
                                            email: true,
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                }
                : undefined,
        });
    }

    /* 🔹 Buscar fornecedor por ID */
    async findById(
        id: number,
        includeCompras = true
    ): Promise<Fornecedor | null> {
        return prisma.fornecedor.findUnique({
            where: { id },
            include: includeCompras
                ? {
                    compras: {
                        select: {
                            id: true,
                            valor: true,
                            data_compra: true,
                            funcionario: {
                                select: {
                                    id: true,
                                    cargo: true,
                                    user: {
                                        select: {
                                            id: true,
                                            email: true,
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                }
                : undefined,
        });
    }

    /* 🔹 Atualizar fornecedor */
    async update(id: number, data: UpdateFornecedorDTO): Promise<Fornecedor> {
        return prisma.fornecedor.update({
            where: { id },
            data,
        });
    }

    /* 🔹 Deletar fornecedor */
    async delete(id: number): Promise<Fornecedor> {
        return prisma.fornecedor.delete({
            where: { id },
        });
    }

    /* 🔹 Verificar se fornecedor possui compras */
    async hasCompras(id: number): Promise<boolean> {
        const count = await prisma.compra.count({
            where: { fornecedorId: id },
        });

        return count > 0;
    }

    /* 🔹 Contar fornecedores (para paginação) */
    async count(where: Prisma.FornecedorWhereInput = {}): Promise<number> {
        return prisma.fornecedor.count({ where });
    }

    /* 🔹 Buscar fornecedor por CNPJ */
    async findByCnpj(cnpj: string): Promise<Fornecedor | null> {
        return prisma.fornecedor.findUnique({
            where: { cnpj },
        });
    }

    /* 🔹 Buscar fornecedor por e-mail */
    async findByEmail(email: string): Promise<Fornecedor | null> {
        return prisma.fornecedor.findUnique({
            where: { email },
        });
    }

    /* 🔹 Buscar fornecedor por nome (LIKE) */
    async searchByNome(nome: string): Promise<Fornecedor[]> {
        return prisma.fornecedor.findMany({
            where: {
                nome: {
                    contains: nome,
                    mode: "insensitive",
                },
            },
        });
    }

    /* 🔹 Buscar fornecedor com resumo (contador de compras) */
    async findWithResumo(id: number) {
        return prisma.fornecedor.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        compras: true,
                    },
                },
            },
        });
    }
}
