import { Router } from "express";
import { UserController } from "./userController";
import { validateRequest } from "../../middlewares/validateRequest";
import {
    createUserSchema,
    updateUserSchema,
    deleteUserSchema,
    listUserQuerySchema,
} from "../../schemas/user.schema";
import { idParamSchema } from "../../schemas/common.schema"; // ⬅ Novo

const routerUser = Router();
const userController = new UserController();

// Criar usuário
routerUser.post(
    "/",
    validateRequest({ body: createUserSchema }),
    userController.create
);

// Listar usuários com paginação e filtros
routerUser.get(
    "/",
    validateRequest({ query: listUserQuerySchema }),
    userController.findAll
);

// Buscar usuário por ID
routerUser.get(
    "/:id",
    validateRequest({ params: idParamSchema }),
    userController.findById
);

// Atualizar usuário
routerUser.put(
    "/:id",
    validateRequest({ params: idParamSchema, body: updateUserSchema }),
    userController.update
);

// Deletar usuário
routerUser.delete(
    "/:id",
    validateRequest({ params: idParamSchema }),
    userController.delete
);

export default routerUser;
