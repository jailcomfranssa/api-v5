import { AppError } from "../../errors/AppError";
import {
    FornecedorRepository,
    CreateFornecedorDTO,
    UpdateFornecedorDTO,
} from "./fornecedor.repository";

interface AuthUser {
    id: number;
    role: "ADMIN" | "FUNCIONARIO" | "CLIENTE";
}

export class FornecedorService {
    private fornecedorRepository = new FornecedorRepository();

    /* ============================
     * Criar fornecedor
     * ============================ */
    async create(user: AuthUser, data: CreateFornecedorDTO) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem cadastrar fornecedores.",
                403
            );
        }

        // CNPJ único
        const cnpjExists = await this.fornecedorRepository.findByCnpj(data.cnpj);
        if (cnpjExists) {
            throw new AppError(
                "Já existe um fornecedor cadastrado com este CNPJ.",
                400
            );
        }

        // Email único
        const emailExists = await this.fornecedorRepository.findByEmail(
            data.email
        );
        if (emailExists) {
            throw new AppError(
                "Já existe um fornecedor cadastrado com este e-mail.",
                400
            );
        }

        return this.fornecedorRepository.create(data);
    }

    /* ============================
     * Buscar fornecedor por ID
     * ============================ */
    async findById(user: AuthUser, id: number) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem acessar fornecedores.",
                403
            );
        }

        const fornecedor = await this.fornecedorRepository.findById(id);
        if (!fornecedor) {
            throw new AppError("Fornecedor não encontrado.", 404);
        }

        return fornecedor;
    }

    /* ============================
     * Listar fornecedores (paginação)
     * ============================ */
    async findAll(user: AuthUser, page = 1, limit = 10) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem listar fornecedores.",
                403
            );
        }

        const skip = (page - 1) * limit;

        const [total, data] = await Promise.all([
            this.fornecedorRepository.count(),
            this.fornecedorRepository.findAll({
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

    /* ============================
     * Buscar fornecedor por nome (LIKE)
     * ============================ */
    async searchByNome(user: AuthUser, nome: string) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem buscar fornecedores.",
                403
            );
        }

        return this.fornecedorRepository.searchByNome(nome);
    }

    /* ============================
     * Buscar fornecedor com resumo
     * ============================ */
    async findWithResumo(user: AuthUser, id: number) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem acessar fornecedores.",
                403
            );
        }

        const fornecedor = await this.fornecedorRepository.findWithResumo(id);
        if (!fornecedor) {
            throw new AppError("Fornecedor não encontrado.", 404);
        }

        return fornecedor;
    }

    /* ============================
     * Atualizar fornecedor
     * ============================ */
    async update(user: AuthUser, id: number, data: UpdateFornecedorDTO) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem atualizar fornecedores.",
                403
            );
        }

        const fornecedor = await this.fornecedorRepository.findById(id, false);
        if (!fornecedor) {
            throw new AppError("Fornecedor não encontrado.", 404);
        }

        // 🔐 Validação de CNPJ (se enviado)
        if (data.cnpj) {
            const cnpjExists = await this.fornecedorRepository.findByCnpj(
                data.cnpj
            );

            if (cnpjExists && cnpjExists.id !== id) {
                throw new AppError(
                    "Já existe outro fornecedor cadastrado com este CNPJ.",
                    400
                );
            }
        }

        // 🔐 Validação de Email (se enviado)
        if (data.email) {
            const emailExists = await this.fornecedorRepository.findByEmail(
                data.email
            );

            if (emailExists && emailExists.id !== id) {
                throw new AppError(
                    "Já existe outro fornecedor cadastrado com este e-mail.",
                    400
                );
            }
        }

        return this.fornecedorRepository.update(id, data);
    }

    async delete(user: AuthUser, id: number) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem deletar fornecedores.",
                403
            );
        }

        const fornecedor = await this.fornecedorRepository.findById(id, false);
        if (!fornecedor) {
            throw new AppError("Fornecedor não encontrado.", 404);
        }

        const hasCompras = await this.fornecedorRepository.hasCompras(id);
        if (hasCompras) {
            throw new AppError(
                "Não é possível excluir fornecedor com compras registradas.",
                409
            );
        }

        return this.fornecedorRepository.delete(id);
    }
}
