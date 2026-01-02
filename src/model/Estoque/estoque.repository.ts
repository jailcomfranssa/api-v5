import { prisma } from "../../lib/prisma";
import { FindAllOptions } from "../../types/pagination";
import { Estoque, Prisma, MOVIMENTO } from "../../../generated/prisma/client";

export type EstoqueCreateDTO = {
    tipo_movimento: MOVIMENTO;
    quantidade: number;
    data_movimento: Date;
    origem_destino: string;
    observacoes: string;
    produtoId: number;
};

export type EstoqueUpdateDTO = Partial<{
    tipo_movimento: MOVIMENTO;
    quantidade: number;
    data_movimento: Date;
    origem_destino: string;
    observacoes: string;
    produtoId: number;
}>;

export type EstoqueResponseDTO = {
    id: number;
    tipo_movimento: string;
    quantidade: number;
    data_movimento: Date | string;
    origem_destino: string;
    observacoes: string;
    produto: {
        id: number;
        nome: string;
    };
    createdAt: Date | string;
    updatedAt: Date | string;
};

export type EstoqueWithRelations = Prisma.EstoqueGetPayload<{
    include: {
        produto: { select: { id: true; nome: true } };
    };
}>;

export type EstoqueMovimentoProdutoDTO = {
    id: number;
    tipo_movimento: MOVIMENTO;
    quantidade: number;
    produto: {
        id: number;
        nome: string;
    };
};

export type EstoquePeriodoDTO = {
    id: number;
    tipo_movimento: MOVIMENTO;
    quantidade: number;
    data_movimento: string;
    produto: {
        id: number;
        nome: string;
    };
};
export type EstoqueTipoDTO = {
    id: number;
    tipo_movimento: MOVIMENTO;
    quantidade: number;
    data_movimento: string;
    produto: {
        id: number;
        nome: string;
    };
};
export type EstoqueOrigemDestinoDTO = {
    id: number;
    tipo_movimento: MOVIMENTO;
    quantidade: number;
    data_movimento: string;
    origem_destino: string;
    produto: {
        id: number;
        nome: string;
    };
};


export class EstoqueRepository {
    async create(data: EstoqueCreateDTO): Promise<Estoque> {
        return prisma.estoque.create({ data });
    }

    async findAll(options?: FindAllOptions): Promise<EstoqueWithRelations[]> {
        const { skip, take, where, orderBy } = options || {};

        return prisma.estoque.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                produto: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
        });
    }

    async findById(id: number): Promise<EstoqueWithRelations | null> {
        return prisma.estoque.findUnique({
            where: { id },
            include: {
                produto: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
        });
    }

    async update(id: number, data: EstoqueUpdateDTO): Promise<Estoque> {
        return prisma.estoque.update({ where: { id }, data });
    }

    async delete(id: number): Promise<Estoque> {
        return prisma.estoque.delete({ where: { id } });
    }

    async count(where: Prisma.EstoqueWhereInput = {}): Promise<number> {
        return prisma.estoque.count({ where });
    }

    // 1. Todas as movimentações de um produto
    async findByProduto(options?: FindAllOptions): Promise<
        {
            id: number;
            tipo_movimento: MOVIMENTO;
            quantidade: number;
            produto: {
                id: number;
                nome: string;
            };
        }[]
    > {
        const { skip, take, where, orderBy } = options || {};

        return prisma.estoque.findMany({
            skip,
            take,
            where,
            orderBy,
            select: {
                id: true,
                tipo_movimento: true,
                quantidade: true,
                produto: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
        });
    }

    //📌 Contagem para paginação
    async countByPeriodo(dataInicio: Date, dataFim: Date): Promise<number> {
        return prisma.estoque.count({
            where: {
                data_movimento: {
                    gte: dataInicio,
                    lte: dataFim,
                },
            },
        });
    }

    // 2. Movimentações em um intervalo de tempo
    async findByPeriodo(
        options: FindAllOptions & {
            dataInicio: Date;
            dataFim: Date;
        }
    ): Promise<EstoqueWithRelations[]> {
        const { skip, take, orderBy, dataInicio, dataFim } = options;

        return prisma.estoque.findMany({
            skip,
            take,
            where: {
                data_movimento: {
                    gte: dataInicio,
                    lte: dataFim,
                },
            },
            orderBy: orderBy ?? { data_movimento: "desc" },
            include: {
                produto: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
        });
    }

    //📌 Contagem para paginação
    async countByTipo(tipo_movimento: MOVIMENTO): Promise<number> {
        return prisma.estoque.count({
            where: { tipo_movimento },
        });
    }

    // 3. Filtrar por tipo de movimento (entrada, saída, ajuste)
    // EstoqueRepository.ts

    async findByTipo(
        options: FindAllOptions & {
            tipo_movimento: MOVIMENTO;
        }
    ): Promise<EstoqueWithRelations[]> {
        const { skip, take, orderBy, tipo_movimento } = options;

        return prisma.estoque.findMany({
            skip,
            take,
            where: { tipo_movimento },
            orderBy: orderBy ?? { data_movimento: "desc" },
            include: {
                produto: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
        });
    }

    //📌 Contagem para paginação
    async countByOrigemDestino(
        origem_destino: string,
        tipo_movimento: MOVIMENTO
    ): Promise<number> {
        return prisma.estoque.count({
            where: {
                origem_destino,
                tipo_movimento,
            },
        });
    }

    // 4. Filtrar por origem/destino e tipo de movimento
    async findByOrigemDestino(
        options: FindAllOptions & {
            origem_destino: string;
            tipo_movimento: MOVIMENTO;
        }
    ): Promise<EstoqueWithRelations[]> {
        const { skip, take, orderBy, origem_destino, tipo_movimento } = options;

        return prisma.estoque.findMany({
            skip,
            take,
            where: {
                origem_destino,
                tipo_movimento,
            },
            orderBy: orderBy ?? { data_movimento: "desc" },
            include: {
                produto: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
        });
    }
}
