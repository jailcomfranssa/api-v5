import { Router } from "express";
import userRouter from "../model/User/user.routes";

const rootRoutes = Router();

rootRoutes.use("/users", userRouter);

export default rootRoutes;
