import { Router } from "express";
import { UserController } from "./userController";
import { validateRequest } from "../../middlewares/validateRequest";
import {
    createUserSchema,
    updateUserSchema,
    deleteUserSchema,
    listUserQuerySchema,
} from "../../schemas/user.schema";
import { idParamSchema } from "../../schemas/common.schema";

import { authMiddleware } from "../../middlewares/authMiddleware";
import { authorizeRole } from "../../middlewares/authorizeRole";
import { checkOwnership } from "../../middlewares/checkOwnership";

const routerUser = Router();
const userController = new UserController();

// Criar usuário (livre)
routerUser.post(
    "/",
    validateRequest({ body: createUserSchema }),
    userController.create
);

// Todas as rotas abaixo exigem token
routerUser.use(authMiddleware);

// Listar todos (somente ADMIN)
routerUser.get(
    "/",
    authorizeRole("ADMIN","FUNCIONARIO"),
    validateRequest({ query: listUserQuerySchema }),
    userController.findAll
);

// Buscar por ID (dono OU ADMIN)
routerUser.get(
    "/:id",
    validateRequest({ params: idParamSchema }),
    checkOwnership(),
    userController.findById
);

// Atualizar usuário (dono OU ADMIN)
routerUser.put(
    "/:id",
    validateRequest({ params: idParamSchema, body: updateUserSchema }),
    checkOwnership(),
    userController.update
);

// Deletar usuário (dono OU ADMIN)
routerUser.delete(
    "/:id",
    validateRequest({ params: idParamSchema }),
    checkOwnership(),
    userController.delete
);

export default routerUser;
