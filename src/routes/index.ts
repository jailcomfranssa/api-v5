import { Router } from "express";
import userRouter from "../model/User/user.routes";
import authRoutes from "../model/Auth/auth.routes";

const rootRoutes = Router();

rootRoutes.use("/users", userRouter);
rootRoutes.use("/auth", authRoutes);

export default rootRoutes;
