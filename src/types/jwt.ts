// src/types/jwt.ts
import { Role } from "../../generated/prisma/client";

export interface JwtPayloadCustom {
    sub: string;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
}
