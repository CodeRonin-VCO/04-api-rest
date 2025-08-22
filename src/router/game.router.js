import { Router } from "express";
import gameController from "../controller/app.controller.js";


const gameRouter = Router();
gameRouter.route("/all").get(gameController.all)
gameRouter.route("/:id").get(gameController.byId)


export default gameRouter;