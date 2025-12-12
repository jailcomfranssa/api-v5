import { Router } from "express";
import userRouter from "../model/User/user.routes";
import authRoutes from "../model/Auth/auth.routes";
import funcionarioRoutes from "../model/Funcionario/funcionario.routes";

const rootRoutes = Router();

rootRoutes.use("/users", userRouter);
rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/funcionario", funcionarioRoutes);

export default rootRoutes;
