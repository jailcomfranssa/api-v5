import { Router } from "express";
import userRouter from "../model/User/user.routes";
import authRoutes from "../model/Auth/auth.routes";
import funcionarioRoutes from "../model/Funcionario/funcionario.routes";
import clienteRoutes from "../model/Cliente/cliente.routes";
import fornecedorRoutes from "../model/Fornecedor/fornecedor.routes";
import catetegoriaRoutes from "../model/Categoria/categoria.routes";

const rootRoutes = Router();

rootRoutes.use("/users", userRouter);
rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/funcionario", funcionarioRoutes);
rootRoutes.use("/cliente", clienteRoutes);
rootRoutes.use("/fornecedores", fornecedorRoutes);
rootRoutes.use("/categorias", catetegoriaRoutes);

export default rootRoutes;
