import { Router } from "express";
import { UserController } from "./userController";
import { validateRequest } from "../../middlewares/validateRequest";
import {
    createUserSchema,
    updateUserSchema,
    listUserSchema,
    deleteUserSchema,
    listUserQuerySchema,
} from "../../schemas/user.schema";

const routerUser = Router();

const userController = new UserController();

// Criar usuário
routerUser.post(
    "/",
    validateRequest({ body: createUserSchema }),
    userController.create
);

// Listar todos os usuários
routerUser.get(
    "/",
    validateRequest({ query: listUserQuerySchema }),
    userController.findAll
);

// Buscar usuário por ID
routerUser.get(
    "/:id",
    validateRequest({ params: listUserSchema }),
    userController.findById
);

// Atualizar usuário
routerUser.put(
    "/:id",
    validateRequest({ body: updateUserSchema, params: listUserSchema }),
    userController.update
);

// Deletar usuário
routerUser.delete(
    "/:id",
    validateRequest({ params: deleteUserSchema }),
    userController.delete
);

export default routerUser;
