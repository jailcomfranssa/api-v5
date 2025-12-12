// src/types/express.d.ts
import { Role, User } from "../../generated/prisma/client";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: number;
            email?: string;
            role: Role;
        };
    }
}
