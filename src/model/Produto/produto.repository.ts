import { prisma } from "../../lib/prisma";
import { Prisma, Produto, Medida } from "../../../generated/prisma/client";
import { FindAllOptions } from "../../types/pagination";

export type ProdutoCreateDTO = {
    nome: string;
    preco: Prisma.Decimal;
    data_validade: Date;
    medida: Medida;
    descricao: string;
    categoriaId: number;
    fornecedorId: number;
};

export type ProdutoUpdateDTO = Partial<{
    nome: string;
    preco: Prisma.Decimal;
    data_validade: Date;
    medida: Medida;
    descricao: string;
    categoriaId: number;
    fornecedorId: number;
}>;
export type ProdutoWithRelations = Prisma.ProdutoGetPayload<{
    include: {
        categoria: {
            select: {
                id: true;
                nome: true;
            };
        };
        fornecedor: {
            select: {
                id: true;
                nome: true;
            };
        };
    };
}>;

export class ProdutoRepository {
    async create(data: ProdutoCreateDTO): Promise<Produto> {
        return prisma.produto.create({ data });
    }

    async findAll(options?: FindAllOptions): Promise<ProdutoWithRelations[]> {
        const { skip, take, where, orderBy } = options || {};

        return prisma.produto.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                categoria: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
                fornecedor: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
        });
    }

    async findById(id: number): Promise<ProdutoWithRelations | null> {
        return prisma.produto.findUnique({
            where: { id },
            include: {
                categoria: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
                fornecedor: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
        });
    }

    async update(id: number, data: ProdutoUpdateDTO): Promise<Produto> {
        return prisma.produto.update({ where: { id }, data });
    }

    async delete(id: number): Promise<Produto> {
        return prisma.produto.delete({ where: { id } });
    }

    async count(where: Prisma.ProdutoWhereInput = {}): Promise<number> {
        return prisma.produto.count({ where });
    }

    async searchByNome(nome: string): Promise<ProdutoWithRelations[]> {
        return prisma.produto.findMany({
            where: {
                nome: {
                    contains: nome,
                    mode: "insensitive",
                },
            },
            include: {
                categoria: { select: { id: true, nome: true } },
                fornecedor: { select: { id: true, nome: true } },
            },
        });
    }

    //🔹 Verificar se produto existe por nome
    async existsByNome(nome: string): Promise<boolean> {
        const produto = await prisma.produto.findFirst({
            where: { nome },
            select: { id: true },
        });
        return !!produto;
    }

    //🔹 Buscar por categoria
    async findByCategoria(
        categoriaId: number
    ): Promise<ProdutoWithRelations[]> {
        return prisma.produto.findMany({
            where: { categoriaId },
            include: {
                categoria: { select: { id: true, nome: true } },
                fornecedor: { select: { id: true, nome: true } },
            },
        });
    }

    //🔹 Buscar por fornecedor
    async findByFornecedor(
        fornecedorId: number
    ): Promise<ProdutoWithRelations[]> {
        return prisma.produto.findMany({
            where: { fornecedorId },
            include: {
                categoria: { select: { id: true, nome: true } },
                fornecedor: { select: { id: true, nome: true } },
            },
        });
    }

    //🔹 Buscar produtos vencidos
    async findVencidos(): Promise<ProdutoWithRelations[]> {
        return prisma.produto.findMany({
            where: {
                data_validade: {
                    lt: new Date(),
                },
            },
            include: {
                categoria: { select: { id: true, nome: true } },
                fornecedor: { select: { id: true, nome: true } },
            },
        });
    }

    //🔹 Buscar produtos próximos do vencimento
    async findProximosVencimento(
        inicio: Date,
        fim: Date
    ): Promise<ProdutoWithRelations[]> {
        return prisma.produto.findMany({
            where: {
                data_validade: {
                    gte: inicio,
                    lte: fim,
                },
            },
            include: {
                categoria: { select: { id: true, nome: true } },
                fornecedor: { select: { id: true, nome: true } },
            },
        });
    }
}
