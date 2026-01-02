import { AppError } from "../../errors/AppError";
import {
    EstoqueRepository,
    EstoqueCreateDTO,
    EstoqueUpdateDTO,
    EstoqueResponseDTO,
    EstoqueMovimentoProdutoDTO,
    EstoquePeriodoDTO,
    EstoqueTipoDTO,
    EstoqueOrigemDestinoDTO,
} from "./estoque.repository";
import { ProdutoRepository } from "../Produto/produto.repository";
import { prisma } from "../../lib/prisma";
import { normalizeEntity } from "../../utils/formatters/entity-normalizer";
import { PaginatedResponse } from "../../types/pagination";
import { MOVIMENTO } from "../../../generated/prisma/enums";
import { EstoqueMapper } from "./estoque.mapper";

interface AuthUser {
    id: number;
    role: "ADMIN" | "FUNCIONARIO" | "CLIENTE";
}

export class EstoqueService {
    private estoqueRepository = new EstoqueRepository();
    private produtoRepository = new ProdutoRepository();

    /* ============================
     * Criar fornecedor
     * ============================ */
    async create(
        user: AuthUser,
        data: EstoqueCreateDTO
    ): Promise<EstoqueResponseDTO> {
        // 🔐 Controle de acesso
        this.authAccess(user);

        if (data.quantidade <= 0) {
            throw new AppError("A quantidade deve ser maior que zero.", 400);
        }

        const result = await prisma.$transaction(async (tx) => {
            // 🔎 Buscar produto dentro da transação
            const produto = await tx.produto.findUnique({
                where: { id: data.produtoId },
                select: {
                    id: true,
                    total: true,
                    nome: true,
                },
            });

            if (!produto) {
                throw new AppError("Produto não encontrado.", 404);
            }

            // 🚫 Validação de saída
            if (
                data.tipo_movimento === "SAIDA" &&
                data.quantidade > produto.total
            ) {
                throw new AppError(
                    "Quantidade maior que o estoque disponível.",
                    400
                );
            }

            // 📦 Criar movimento de estoque
            const movimento = await tx.estoque.create({
                data,
                include: {
                    produto: {
                        select: {
                            id: true,
                            nome: true,
                        },
                    },
                },
            });

            // ➕➖ Calcular novo total
            const novoTotal =
                data.tipo_movimento === "ENTRADA"
                    ? produto.total + data.quantidade
                    : produto.total - data.quantidade;

            // 🔄 Atualizar total do produto
            await tx.produto.update({
                where: { id: produto.id },
                data: { total: novoTotal },
            });

            return EstoqueMapper.toResponse(movimento);
        });

        // 🎯 Normalização de resposta (DTO)
        return normalizeEntity(result, {
            data_movimento: "date",
            createdAt: "date",
            updatedAt: "date",
        });
    }

    /* =======================
    🔹 FIND BY ID
    ======================= */
    async findById(user: AuthUser, id: number): Promise<EstoqueResponseDTO> {
        this.authAccess(user);

        const estoque = await this.estoqueRepository.findById(id);

        if (!estoque) {
            throw new AppError("Movimento de estoque não encontrado.", 404);
        }

        const mapped = EstoqueMapper.toResponse(estoque);

        return normalizeEntity(mapped, {
            data_movimento: "date",
            createdAt: "date",
            updatedAt: "date",
        });
    }
    /* =======================
    🔹 FIND ALL
    ======================= */
    async findAll(
        user: AuthUser,
        page = 1,
        limit = 10
    ): Promise<PaginatedResponse<EstoqueResponseDTO>> {
        this.authAccess(user);

        const skip = (page - 1) * limit;

        const [total, data] = await Promise.all([
            this.estoqueRepository.count(),
            this.estoqueRepository.findAll({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
        ]);

        // 🎯 Normalização de resposta (DTO)
        const mapped = EstoqueMapper.toResponseList(data);

        return {
            data: normalizeEntity(mapped, {
                data_movimento: "date",
                createdAt: "date",
                updatedAt: "date",
            }),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /* =======================
    🔹 UPDATE
    ======================= */
    async update(
        user: AuthUser,
        id: number,
        data: EstoqueUpdateDTO
    ): Promise<EstoqueResponseDTO> {
        this.authAccess(user);

        if (data.quantidade !== undefined && data.quantidade <= 0) {
            throw new AppError("A quantidade deve ser maior que zero.", 400);
        }

        const result = await prisma.$transaction(async (tx) => {
            // 🔎 Buscar movimento atual
            const movimentoAtual = await tx.estoque.findUnique({
                where: { id },
                include: {
                    produto: {
                        select: {
                            id: true,
                            total: true,
                        },
                    },
                },
            });

            if (!movimentoAtual) {
                throw new AppError("Movimento de estoque não encontrado.", 404);
            }

            // 🔎 Produto destino (pode mudar)
            const produtoIdFinal = data.produtoId ?? movimentoAtual.produtoId;

            const produto = await tx.produto.findUnique({
                where: { id: produtoIdFinal },
                select: {
                    id: true,
                    total: true,
                },
            });

            if (!produto) {
                throw new AppError("Produto não encontrado.", 404);
            }

            // 🔄 Reverter impacto antigo
            let totalAjustado = produto.total;

            if (movimentoAtual.tipo_movimento === "ENTRADA") {
                totalAjustado -= movimentoAtual.quantidade;
            } else {
                totalAjustado += movimentoAtual.quantidade;
            }

            // 📦 Dados finais
            const novaQuantidade = data.quantidade ?? movimentoAtual.quantidade;

            const novoTipo =
                data.tipo_movimento ?? movimentoAtual.tipo_movimento;

            // 🚫 Validação de saída
            if (novoTipo === "SAIDA" && novaQuantidade > totalAjustado) {
                throw new AppError(
                    "Quantidade maior que o estoque disponível.",
                    400
                );
            }

            // ➕➖ Aplicar novo impacto
            if (novoTipo === "ENTRADA") {
                totalAjustado += novaQuantidade;
            } else {
                totalAjustado -= novaQuantidade;
            }

            // 🔄 Atualizar movimento
            const movimentoAtualizado = await tx.estoque.update({
                where: { id },
                data,
                include: {
                    produto: {
                        select: {
                            id: true,
                            nome: true,
                        },
                    },
                },
            });

            // 🔄 Atualizar total do produto
            await tx.produto.update({
                where: { id: produto.id },
                data: { total: totalAjustado },
            });

            return movimentoAtualizado;
        });
        const mapped = EstoqueMapper.toResponse(result);

        // 🎯 Normalizar resposta
        return normalizeEntity(mapped, {
            data_movimento: "date",
            createdAt: "date",
            updatedAt: "date",
        });
    }

    /* =======================
    🔹 DELETE
    ======================= */
    async delete(user: AuthUser, id: number) {
        this.authAccess(user);

        const movimento = await this.estoqueRepository.findById(id);

        if (!movimento) {
            throw new AppError("Movimento de estoque não encontrado.", 404);
        }

        // ⏱️ BLOQUEIO POR TEMPO
        const limiteHoras = 24;
        const agora = new Date();
        const diffHoras =
            (agora.getTime() - movimento.createdAt.getTime()) /
            (1000 * 60 * 60);

        if (diffHoras > limiteHoras) {
            throw new AppError(
                "Movimentos com mais de 24 horas não podem ser excluídos.",
                403
            );
        }

        const produto = await this.produtoRepository.findUnique(
            movimento.produtoId
        );

        if (!produto) {
            throw new AppError("Produto não encontrado.", 404);
        }

        return prisma.$transaction(async (tx) => {
            let novoTotal = produto.total;

            if (movimento.tipo_movimento === "ENTRADA") {
                novoTotal -= movimento.quantidade;
            }

            if (movimento.tipo_movimento === "SAIDA") {
                novoTotal += movimento.quantidade;
            }

            if (novoTotal < 0) {
                throw new AppError("Estoque não pode ficar negativo.", 400);
            }

            await tx.produto.update({
                where: { id: produto.id },
                data: { total: novoTotal },
            });

            const deleted = await tx.estoque.delete({
                where: { id },
            });

            return normalizeEntity(deleted, {
                data_movimento: "date",
                createdAt: "date",
                updatedAt: "date",
            });
        });
    }

    /* =======================
    🔎 BUSCAS movimentações de um produto
    ======================= */
    async findByProduto(
        user: AuthUser,
        produtoId: number,
        page = 1,
        limit = 10
    ): Promise<PaginatedResponse<EstoqueMovimentoProdutoDTO>> {
        this.authAccess(user);

        const skip = (page - 1) * limit;

        const [total, movimentos] = await Promise.all([
            this.estoqueRepository.count({ produtoId }),
            this.estoqueRepository.findByProduto({
                skip,
                take: limit,
                where: { produtoId },
                orderBy: { data_movimento: "desc" },
            }),
        ]);

        return {
            data: movimentos.map((item) => ({
                id: item.id,
                tipo_movimento: item.tipo_movimento,
                quantidade: item.quantidade,
                produto: item.produto,
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /* =======================
    🔎 BUSCAS Movimentações em um intervalo de tempo
    ======================= */
    async findByPeriodo(
        user: AuthUser,
        dataInicio: Date,
        dataFim: Date,
        page = 1,
        limit = 10
    ): Promise<PaginatedResponse<EstoquePeriodoDTO>> {
        this.authAccess(user);

        if (dataInicio > dataFim) {
            throw new AppError(
                "A data inicial não pode ser maior que a data final.",
                400
            );
        }

        const skip = (page - 1) * limit;

        const [total, movimentos] = await Promise.all([
            this.estoqueRepository.countByPeriodo(dataInicio, dataFim),
            this.estoqueRepository.findByPeriodo({
                skip,
                take: limit,
                dataInicio,
                dataFim,
                orderBy: { data_movimento: "desc" },
            }),
        ]);

        return {
            data: normalizeEntity(movimentos, {
                data_movimento: "date",
            }) as EstoquePeriodoDTO[],
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /* =======================
        🔎 BUSCAS Movimentações de um tipo em um intervalo de tempo
    ======================= */
    async findByTipo(
        user: AuthUser,
        tipo_movimento: MOVIMENTO,
        page = 1,
        limit = 10
    ): Promise<PaginatedResponse<EstoqueTipoDTO>> {
        this.authAccess(user);

        const skip = (page - 1) * limit;

        const [total, movimentos] = await Promise.all([
            this.estoqueRepository.countByTipo(tipo_movimento),
            this.estoqueRepository.findByTipo({
                skip,
                take: limit,
                tipo_movimento,
                orderBy: { data_movimento: "desc" },
            }),
        ]);

        return {
            data: normalizeEntity(movimentos, {
                data_movimento: "date",
            }) as EstoqueTipoDTO[],
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /* =======================
        🔎 BUSCAS Movimentações de um tipo em um intervalo de tempo
    ======================= */
    async findByOrigemDestino(
        user: AuthUser,
        origemDestino: string,
        tipoMovimento: MOVIMENTO,
        page = 1,
        limit = 10
    ): Promise<PaginatedResponse<EstoqueOrigemDestinoDTO>> {
        this.authAccess(user);

        // 🔐 Validações de negócio
        if (!origemDestino.trim()) {
            throw new AppError("Origem/Destino não pode ser vazio.", 400);
        }

        if (!Object.values(MOVIMENTO).includes(tipoMovimento)) {
            throw new AppError("Tipo de movimento inválido.", 400);
        }

        const skip = (page - 1) * limit;

        const [total, movimentos] = await Promise.all([
            this.estoqueRepository.countByOrigemDestino(
                origemDestino,
                tipoMovimento
            ),
            this.estoqueRepository.findByOrigemDestino({
                skip,
                take: limit,
                origem_destino: origemDestino,
                tipo_movimento: tipoMovimento,
                orderBy: { data_movimento: "desc" },
            }),
        ]);

        return {
            data: normalizeEntity(movimentos, {
                data_movimento: "date",
            }) as EstoqueOrigemDestinoDTO[],
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /* =======================
        🔧 HELPERS PRIVADOS
    ======================= */

    public authAccess(user: AuthUser) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem acessar movimentações de estoque.",
                403
            );
        }
    }
}
