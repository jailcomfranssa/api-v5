import {
    ProdutoRepository,
    ProdutoCreateDTO,
    ProdutoUpdateDTO,
} from "./produto.repository";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";

interface AuthUser {
    id: number;
    role: "ADMIN" | "FUNCIONARIO" | "CLIENTE";
}

export class ProdutoService {
    private repository = new ProdutoRepository();

    /* =======================
       🔹 CREATE
    ======================= */
    async create(data: ProdutoCreateDTO, user: AuthUser) {
        this.ensureAccess(user);

        const nomeExists = await this.repository.existsByNome(data.nome);
        if (nomeExists) {
            throw new AppError(
                "Já existe um produto cadastrado com este nome.",
                400
            );
        }

        await this.validateFornecedorCategoria(
            data.fornecedorId,
            data.categoriaId
        );

        const produto = await this.repository.create(data);

        return this.normalizeProduto(produto);
    }

    /* =======================
       🔹 FIND BY ID
    ======================= */
    async findById(user: AuthUser, id: number) {
        this.ensureAccess(user);

        const produto = await this.repository.findById(id);
        if (!produto) {
            throw new AppError("Produto não encontrado.", 404);
        }

        return this.normalizeProduto(produto);
    }

    /* =======================
       🔹 FIND ALL
    ======================= */
    async findAll(user: AuthUser, page = 1, limit = 10) {
        this.ensureAccess(user);

        const skip = (page - 1) * limit;

        const [total, data] = await Promise.all([
            this.repository.count(),
            this.repository.findAll({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
        ]);

        return {
            data: this.normalizeProduto(data),
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
    async update(user: AuthUser, id: number, data: ProdutoUpdateDTO) {
        this.ensureAccess(user);

        const produto = await this.repository.findById(id);
        if (!produto) {
            throw new AppError("Produto não encontrado.", 404);
        }

        if (data.nome && data.nome !== produto.nome) {
            const nomeExists = await this.repository.existsByNome(data.nome);
            if (nomeExists) {
                throw new AppError(
                    "Já existe um produto cadastrado com este nome.",
                    400
                );
            }
        }

        if (data.fornecedorId || data.categoriaId) {
            await this.validateFornecedorCategoria(
                data.fornecedorId ?? produto.fornecedorId,
                data.categoriaId ?? produto.categoriaId
            );
        }

        const produtoUpdated = await this.repository.update(id, data);
        return this.normalizeProduto(produtoUpdated);
    }

    /* =======================
       🔹 DELETE
    ======================= */
    async delete(user: AuthUser, id: number) {
        this.ensureAccess(user);

        const produto = await this.repository.findById(id);
        if (!produto) {
            throw new AppError("Produto não encontrado.", 404);
        }

        return this.repository.delete(id);
    }

    /* =======================
       🔎 BUSCAS ESPECÍFICAS
    ======================= */

    async findByCategoria(user: AuthUser, categoriaId: number) {
        this.ensureAccess(user);
        return this.repository.findByCategoria(categoriaId);
    }

    async findByFornecedor(user: AuthUser, fornecedorId: number) {
        this.ensureAccess(user);
        return this.repository.findByFornecedor(fornecedorId);
    }

    async findProdutosVencidos(user: AuthUser) {
        this.ensureAccess(user);
        return this.repository.findVencidos();
    }

    async findProdutosProximosVencimento(user: AuthUser, dias = 7) {
        this.ensureAccess(user);

        const hoje = new Date();
        const limite = new Date();
        limite.setDate(hoje.getDate() + dias);

        return this.repository.findProximosVencimento(hoje, limite);
    }

    /* =======================
       🔧 HELPERS PRIVADOS
    ======================= */

    private ensureAccess(user: AuthUser) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem acessar produtos.",
                403
            );
        }
    }

    private async validateFornecedorCategoria(
        fornecedorId: number,
        categoriaId: number
    ) {
        const [fornecedor, categoria] = await Promise.all([
            prisma.fornecedor.findUnique({ where: { id: fornecedorId } }),
            prisma.categoria.findUnique({ where: { id: categoriaId } }),
        ]);

        if (!fornecedor) {
            throw new AppError("Fornecedor não encontrado.", 404);
        }

        if (!categoria) {
            throw new AppError("Categoria não encontrada.", 404);
        }
    }

    private formatDate(date: Date): string {
        const dia = String(date.getDate()).padStart(2, "0");
        const mes = String(date.getMonth() + 1).padStart(2, "0");
        const ano = date.getFullYear();
        return `${dia}-${mes}-${ano}`;
    }

    private formatPrice(valor: any): string {
        const numero = Number(valor);
        return `R$ ${numero.toFixed(2).replace(".", ",")}`;
    }

    private normalizeProduto(produto: any | any[]): any {
        if (Array.isArray(produto)) {
            return produto.map((item) => this.normalizeProduto(item));
        }

        return {
            ...produto,
            preco: this.formatPrice(produto.preco),
            data_validade: this.formatDate(produto.data_validade),
        };
    }
}
