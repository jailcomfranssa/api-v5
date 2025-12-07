import bcrypt from "bcryptjs";
import { UserRepository } from "./userRepository";
import { AppError } from "../../errors/AppError";
import { User } from "../../../generated/prisma/client";

export class UserService {
    private userRepository = new UserRepository();

    async create(data: {
        name: string;
        email: string;
        senha: string;
        telefone?: string | null;
        role: "ADMIN" | "FUNCIONARIO" | "CLIENTE";
    }): Promise<User> {
        const userExists = await this.userRepository.findByEmail(data.email);
        if (userExists) {
            throw new AppError("E-mail já cadastrado", 409);
        }
        const hashedPassword = await bcrypt.hash(data.senha, 10);

        return this.userRepository.create({
            ...data,
            senha: hashedPassword,
            telefone: data.telefone || null,
        });
    }

    // 🔹 Buscar por ID
    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }
        return user;
    }
    // 🔹 Listar usuários
    async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    // 🔹 Atualizar usuário
    async update(
        id: number,
        data: Partial<{
            name: string;
            email: string;
            senha: string;
            telefone?: string;
            role?: "ADMIN" | "FUNCIONARIO" | "CLIENTE";
        }>
    ): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }

        // Verifica e-mail duplicado se email for atualizado
        if (data.email && data.email !== user.email) {
            const emailExists = await this.userRepository.findByEmail(
                data.email
            );
            if (emailExists) {
                throw new AppError("E-mail já está em uso", 409);
            }
        }

        // Se senha enviada, faz hash. Se não, mantém senha atual.
        const updateData = {
            ...data,
            senha: data.senha ? await bcrypt.hash(data.senha, 10) : user.senha,
        };

        return this.userRepository.update(id, updateData);
    }
    // 🔹 Deletar usuário
    async delete(id: number): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }

        await this.userRepository.delete(id);
    }
}
