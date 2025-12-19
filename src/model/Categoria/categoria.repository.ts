import { prisma } from "../../lib/prisma";
import { FindAllOptions } from "../../types/pagination";
import { Categoria } from "../../../generated/prisma/client";

/* =======================
 * DTOs
 ======================= */
export type CreateCategoriaDTO = {
    nome: string;
    descricao: string;
    status?: boolean;
};

export type UpdateCategoriaDTO = Partial<{
    nome: string;
    descricao: string;
    status: boolean;
}>;

/* =======================
 * Repository
 ======================= */
export class CategoriaRepository {
    /* 🔹 Criar categoria */
    async create(data: CreateCategoriaDTO): Promise<Categoria> {
        return prisma.categoria.create({ data });
    }

    /* 🔹 Buscar todas (paginação, filtros, ordenação) */
    async findAll(options?: FindAllOptions): Promise<Categoria[]> {
        const { skip, take, where, orderBy } = options || {};

        return prisma.categoria.findMany({
            skip,
            take,
            where,
            orderBy,
        });
    }

    /* 🔹 Buscar por ID */
    async findById(id: number): Promise<Categoria | null> {
        return prisma.categoria.findUnique({
            where: { id },
        });
    }

    /* 🔹 Verifica se categoria existe */
    async existsById(id: number): Promise<boolean> {
        const count = await prisma.categoria.count({ where: { id } });
        return count > 0;
    }

    /* 🔹 Buscar por nome exato */
    async findByNome(nome: string): Promise<Categoria | null> {
        return prisma.categoria.findFirst({
            where: { nome },
        });
    }

    /* 🔹 Verifica se nome já existe */
    async existsByNome(nome: string): Promise<boolean> {
        const count = await prisma.categoria.count({
            where: { nome },
        });
        return count > 0;
    }

    /* 🔹 Buscar por nome (LIKE / insensitive) */
    async searchByNome(nome: string): Promise<Categoria[]> {
        return prisma.categoria.findMany({
            where: {
                nome: {
                    contains: nome,
                    mode: "insensitive",
                },
            },
        });
    }

    /* 🔹 Buscar categorias ativas */
    async findActive(): Promise<Categoria[]> {
        return prisma.categoria.findMany({
            where: { status: true },
        });
    }

    /* 🔹 Buscar por status */
    async searchByStatus(status: boolean): Promise<Categoria[]> {
        return prisma.categoria.findMany({
            where: { status },
        });
    }

    /* 🔹 Atualizar categoria */
    async update(id: number, data: UpdateCategoriaDTO): Promise<Categoria> {
        return prisma.categoria.update({
            where: { id },
            data,
        });
    }

    /* 🔹 Atualizar somente status */
    async updateStatus(id: number, status: boolean): Promise<Categoria> {
        return prisma.categoria.update({
            where: { id },
            data: { status },
        });
    }

    /* 🔹 Alternar status (ativo/inativo) */
    async toggleStatus(id: number): Promise<Categoria> {
        const categoria = await this.findById(id);
        if (!categoria) {
            throw new Error("Categoria não encontrada");
        }

        return prisma.categoria.update({
            where: { id },
            data: { status: !categoria.status },
        });
    }

    /* 🔹 Deletar categoria */
    async delete(id: number): Promise<Categoria> {
        return prisma.categoria.delete({
            where: { id },
        });
    }

    /* 🔹 Contagem (paginação) */
    async count(where: any = {}): Promise<number> {
        return prisma.categoria.count({ where });
    }
}
