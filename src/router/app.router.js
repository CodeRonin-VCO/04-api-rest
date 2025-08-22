import { Router } from "express";
import gameRouter from "./game.router.js";

const appRouter = Router();
appRouter.use("/videogame", gameRouter);

export default appRouter;