import {
    ClienteCadastroRepository,
    ClienteUpdateData,
} from "./clienteCadastro.repository";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

interface AuthUser {
    id: number;
    role: "ADMIN" | "FUNCIONARIO" | "CLIENTE";
}

interface ClienteDTO {
    cpf: string;
    rg: string;
    telefone: string | null;
    dataNascimento: Date;
    userId: number;
}

export class ClienteCadastroService {
    private repository = new ClienteCadastroRepository();

    // 🔹 Criar cadastro
    async create(user: AuthUser, data: ClienteDTO) {
        // 🔹 Verifica se é Cliente
        if (user.role === "CLIENTE") {
            //🔹se é o dono do registro
            if (data.userId && data.userId !== user.id) {
                throw new AppError(
                    "Cliente nao pode criar cadastro para outro usuário.",
                    403
                );
            }
            data.userId = user.id;
        }
        //🔹 ADMIN
        const targetUserId = data.userId ?? user.id;

        // 🔹 Verifica duplicação
        const already = await this.repository.findByUserId(targetUserId);
        if (already) {
            throw new AppError(
                "Já existe um cadastro de cliente para este usuário.",
                400
            );
        }

        // 🔹 Busca o usuário no BD
        const userDB = await prisma.user.findUnique({
            where: { id: targetUserId },
        });
        if (!userDB) {
            throw new AppError("Usuário nao encontrado.", 404);
        }

        // 🚫 **ADMIN SÓ PODE CADASTRAR CLIENTE PARA USUÁRIO COM ROLE = CLIENTE
        if (user.role === "ADMIN" && userDB.role !== "CLIENTE") {
            throw new AppError(
                `Esse usuário possui papel: ${userDB.role} e não pode receber cadastro de funcionário.`,
                400
            );
        }
        // Validação de CPF único

        const cpfExists = await this.repository.findByCpf(data.cpf);

        if (cpfExists) {
            throw new AppError(
                "Já existe um funcionário cadastrado com este CPF.",
                400
            );
        }
        const telefone = data.telefone || userDB.telefone;

        return this.repository.create({
            cpf: data.cpf,
            rg: data.rg,
            telefone: telefone,
            dataNascimento: new Date(data.dataNascimento),
            userId: targetUserId,
        });
    }

    // 🔹 Buscar cadastro por ID
    async findById(user: AuthUser, id: number) {
        const cadastro = await this.repository.findById(id);
        if (!cadastro) {
            throw new AppError("Cadastro de cliente nao encontrado.", 404);
        }
        // CLIENTE → pode ver o proprio cadastro
        if (user.role === "CLIENTE" && cadastro.userId !== user.id) {
            throw new AppError(
                "Voce nao pode acessar o cadastro de outro cliente.",
                403
            );
        }
        return cadastro;
    }

    // 🔹 Listar todos (somente ADMIN & FUNCIONARIO)
    async findAll(user: AuthUser, page: number, limit: number) {
        if (user.role !== "ADMIN" && user.role !== "FUNCIONARIO") {
            throw new AppError(
                "Apenas administradores e funcionários podem listar clientes.",
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
    async update(user: AuthUser, id: number, data: ClienteDTO) {
        const cliente = await this.repository.findById(id);
        if (!cliente) {
            throw new AppError("Cliente nao encontrado.", 404);
        }
        if (user.role === "CLIENTE" && cliente.userId !== user.id) {
            throw new AppError(
                "Você não tem permissão para editar este cadastro.",
                403
            );
        }
        // Manter telefone se não vier do DTO
        if (!data.telefone) {
            const userDB = await prisma.user.findUnique({
                where: { id: cliente.userId },
            });
            data.telefone = userDB?.telefone ?? cliente.telefone;
        }
        return this.repository.update(id, data as ClienteUpdateData);
    }

    // 🔹 Deletar cadastro (somente ADMIN)
    async delete(user: AuthUser, id: number) {
        const cliente = await this.repository.findById(id);

        if (!cliente) {
            throw new AppError("Cliente não encontrado.", 404);
        }

        const isAdmin = user.role === "ADMIN";
        const isOwner = user.role === "CLIENTE" && cliente.userId === user.id;

        if (!isAdmin && !isOwner) {
            throw new AppError(
                "Você não tem permissão para deletar este cadastro.",
                403
            );
        }

        return this.repository.delete(id);
    }
}
