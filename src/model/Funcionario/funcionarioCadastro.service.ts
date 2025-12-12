// src/modules/funcionario-cadastro/funcionarioCadastro.service.ts

import {
    FuncionarioCadastroRepository,
    FuncionarioUpdateData,
} from "./funcionarioCadastro.repository";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { Decimal } from "@prisma/client/runtime/client";

interface AuthUser {
    id: number;
    role: "ADMIN" | "FUNCIONARIO" | "CLIENTE";
}

interface CreateFuncionarioDTO {
    cpf: string;
    cargo: string;
    salario: number; // <- continua número na entrada
    telefone?: string | null;
    dataAdmissao: Date;
    userId?: number;
}

interface UpdateFuncionarioDTO {
    cpf?: string;
    cargo?: string;
    salario?: number | Decimal; // <- AGORA pode ser Decimal também
    telefone?: string | null;
    dataAdmissao?: Date;
    userId?: number;
}

export class FuncionarioCadastroService {
    private repository = new FuncionarioCadastroRepository();

    // 🔹 Criar cadastro
    async create(user: AuthUser, data: CreateFuncionarioDTO) {
        // 🔹 FUNCIONÁRIO → só cria o próprio cadastro
        if (user.role === "FUNCIONARIO") {
            if (data.userId && data.userId !== user.id) {
                throw new AppError(
                    "Funcionário não pode criar cadastro para outro usuário.",
                    403
                );
            }
            data.userId = user.id;
        }

        // 🔹 ADMIN → pode criar para qualquer user
        const targetUserId = data.userId ?? user.id;

        // 🔹 Verifica duplicação
        const already = await this.repository.findByUserId(targetUserId);
        if (already) {
            throw new AppError(
                "Já existe um cadastro de funcionário para este usuário.",
                400
            );
        }

        // 🔹 Busca o usuário no BD
        const userDB = await prisma.user.findUnique({
            where: { id: targetUserId },
        });

        if (!userDB) throw new AppError("Usuário não encontrado.", 404);

        // 🚫 **NOVO: ADMIN SÓ PODE CADASTRAR FUNCIONÁRIO PARA USUÁRIO COM ROLE = FUNCIONARIO**
        if (user.role === "ADMIN" && userDB.role !== "FUNCIONARIO") {
            throw new AppError(
                `Esse usuário possui papel: ${userDB.role} e não pode receber cadastro de funcionário.`,
                400
            );
        }
        // Validação de CPF único
        if (data.cpf) {
            const cpfExists = await this.repository.findByCpf(data.cpf);

            if (cpfExists) {
                throw new AppError(
                    "Já existe um funcionário cadastrado com este CPF.",
                    400
                );
            }
        }

        const telefoneFinal = data.telefone || userDB.telefone;

        return this.repository.create({
            cpf: data.cpf,
            cargo: data.cargo,
            salario: new Decimal(data.salario),
            telefone: telefoneFinal,
            dataAdmissao: new Date(data.dataAdmissao),
            userId: targetUserId,
        });
    }

    // 🔹 Buscar cadastro por ID
    async findById(user: AuthUser, id: number) {
        const cadastro = await this.repository.findById(id);
        if (!cadastro)
            throw new AppError("Cadastro de funcionário não encontrado.", 404);

        // FUNCIONÁRIO → só pode ver o próprio
        if (user.role === "FUNCIONARIO" && cadastro.userId !== user.id) {
            throw new AppError(
                "Você não pode acessar o cadastro de outro funcionário.",
                403
            );
        }

        return cadastro;
    }

    // 🔹 Listar todos (somente ADMIN)
    async findAll(user: AuthUser, page: number, limit: number) {
        if (user.role !== "ADMIN") {
            throw new AppError(
                "Apenas administradores podem listar funcionários.",
                403
            );
        }

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
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // 🔹 Atualizar cadastro
    async update(user: AuthUser, id: number, data: UpdateFuncionarioDTO) {
        const cadastro = await this.repository.findById(id);
        if (!cadastro) throw new AppError("Cadastro não encontrado.", 404);

        if (user.role === "FUNCIONARIO" && cadastro.userId !== user.id) {
            throw new AppError(
                "Você não tem permissão para editar este cadastro.",
                403
            );
        }

        // Manter telefone se não vier do DTO
        if (!data.telefone) {
            const userDB = await prisma.user.findUnique({
                where: { id: cadastro.userId },
            });
            data.telefone = userDB?.telefone ?? cadastro.telefone;
        }

        // Converter salário para Decimal
        if (data.salario !== undefined) {
            data.salario = new Decimal(data.salario);
        }

        return this.repository.update(id, data as FuncionarioUpdateData);
    }

    // 🔹 Deletar cadastro (somente ADMIN)
    async delete(user: AuthUser, id: number) {
        const cadastro = await this.repository.findById(id);
        if (!cadastro) throw new AppError("Cadastro não encontrado.", 404);

        if (user.role !== "ADMIN") {
            throw new AppError(
                "Apenas administradores podem deletar funcionários.",
                403
            );
        }

        return this.repository.delete(id);
    }
}
