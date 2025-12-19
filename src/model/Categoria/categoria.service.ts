import { AppError } from "../../errors/AppError";
import {
    CategoriaRepository,
    CreateCategoriaDTO,
    UpdateCategoriaDTO,
} from "./categoria.repository";

interface AuthUser {
    id: number;
    role: "ADMIN" | "FUNCIONARIO" | "CLIENTE";
}



export class CategoriaService {
    private categoriaRepository = new CategoriaRepository();

    

    // 🔹 Criar categoria
    async create(user: AuthUser, data: CreateCategoriaDTO) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem cadastrar categorias.",
                403
            );
        }
        const categoriaByNome = await this.categoriaRepository.findByNome(
            data.nome
        );

        if (categoriaByNome) {
            throw new AppError(
                "Já existe uma categoria cadastrada com este nome.",
                400
            );
        }

        return this.categoriaRepository.create(data);
    }

    // 🔹 Buscar todas (paginação, filtros, ordenação)
    async findAll(user: AuthUser, page = 1, limit = 10) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem listar categorias.",
                403
            );
        }
        const skip = (page - 1) * limit;

        const [total, data] = await Promise.all([
            this.categoriaRepository.count(),
            this.categoriaRepository.findAll({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // 🔹 Buscar categoria por id
    async findById(user: AuthUser, id: number) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem listar categorias.",
                403
            );
        }
        const categoria = await this.categoriaRepository.findById(id);
        if (!categoria) {
            throw new AppError("Categoria nao encontrada.", 404);
        }
        return categoria;
    }

    // 🔹 Buscar por nome exato
    async findByNome(user: AuthUser, nome: string) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem listar categorias.",
                403
            );
        }
        const categoria = await this.categoriaRepository.findByNome(nome);
        if (!categoria) {
            throw new AppError("Categoria nao encontrada.", 404);
        }
        return categoria;
    }

    // 🔹 Buscar por nome (LIKE / insensitive)
    async searchByNome(user: AuthUser, nome: string) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem listar categorias.",
                403
            );
        }
        return this.categoriaRepository.searchByNome(nome);
    }

    // 🔹 Buscar por status
    async searchByStatus(user: AuthUser, status: boolean) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem listar categorias.",
                403
            );
        }
        return this.categoriaRepository.searchByStatus(status);
    }

    // 🔹 Atualizar categoria
    async update(user: AuthUser, id: number, data: UpdateCategoriaDTO) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem atualizar categorias.",
                403
            );
        }
        const categoria = await this.categoriaRepository.findById(id);
        if (!categoria) {
            throw new AppError("Categoria nao encontrada.", 404);
        }
        if (data.nome && data.nome !== categoria.nome) {
            const categoriaByNome = await this.categoriaRepository.findByNome(
                data.nome
            );
            if (categoriaByNome) {
                throw new AppError(
                    "Já existe uma categoria cadastrada com este nome.",
                    400
                );
            }
        }
        return this.categoriaRepository.update(id, data);
    }

    // 🔹 Atualizar somente status
    async updateStatus(user: AuthUser, id: number, status: boolean) {
        if (user.role !== "ADMIN") {
            throw new AppError(
                "Apenas administradores podem atualizar categorias.",
                403
            );
        }
        const categoria = await this.categoriaRepository.findById(id);
        if (!categoria) {
            throw new AppError("Categoria nao encontrada.", 404);
        }
        return this.categoriaRepository.updateStatus(id, status);
    }

    // 🔹 Deletar
    async delete(user: AuthUser, id: number) {
        if (user.role !== "ADMIN") {
            throw new AppError(
                "Apenas administradores podem deletar categorias.",
                403
            );
        }
        const categoria = await this.categoriaRepository.findById(id);
        if (!categoria) {
            throw new AppError("Categoria nao encontrada.", 404);
        }
        return this.categoriaRepository.delete(id);
    }

    // 🔹 Buscar categorias ativas
    async findActive(user: AuthUser) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem atualizar categorias.",
                403
            );
        }
        return this.categoriaRepository.findActive();
    }
}
