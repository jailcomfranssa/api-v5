import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { UserRepository } from "../User/userRepository";
import { AppError } from "../../errors/AppError";

dotenv.config();

/**
 * Converte `JWT_EXPIRES_IN` do .env para número em segundos.
 * Exemplo válido: 86400
 */
function normalizeExpiresIn(value?: string): number {
    if (!value) return 60 * 60 * 24; // padrão: 1 dia

    const num = Number(value);
    if (Number.isFinite(num) && num > 0) {
        return num;
    }

    throw new Error("JWT_EXPIRES_IN deve ser um número em segundos.");
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = normalizeExpiresIn(process.env.JWT_EXPIRES_IN);

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não foi definido no arquivo .env");
}

interface UserPayload {
    id: number;
    email: string;
    senha: string;
    role: string;
    nome?: string;
}

export class AuthService {
    private userRepository = new UserRepository();

    /**
     * Autentica o usuário com email/senha
     */
    async authenticate(email: string, senha: string) {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new AppError("Credenciais inválidas.", 401);
        }

        const isValid = await bcrypt.compare(senha, user.senha);
        if (!isValid) {
            throw new AppError("Credenciais inválidas.", 401);
        }

        const token = this.generateToken(user);

        return {
            token,
            user: {
                id: user.id,
                nome: user.name ?? null,
                email: user.email,
                role: user.role,
            },
        };
    }

    /**
     * Gera um token JWT seguro contendo apenas o essencial
     */
    private generateToken(user: UserPayload) {
        const payload = {
            sub: user.id,
            role: user.role,
        };

        const options: SignOptions = {
            expiresIn: JWT_EXPIRES_IN,
        };

        return jwt.sign(payload, JWT_SECRET as Secret, options);
    }

    /**
     * Verifica se o token JWT é válido
     */
    verifyToken(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET as Secret);
        } catch {
            throw new AppError("Token inválido ou expirado.", 401);
        }
    }
}
