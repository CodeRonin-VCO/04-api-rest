import { Router } from "express";
import gameController from "../controller/app.controller.js";
import multer from "multer";

const upload = multer({ dest: './public/cover/' })


const gameRouter = Router();

gameRouter.route("/")
    .get(gameController.all)
    .post(gameController.addGame)

gameRouter.route("/:id")
    .get(gameController.byId)
    .put(gameController.changeItem)
    .delete(gameController.deleteItem)

gameRouter.route("/:id/cover")
    .patch(upload.single("cover"), gameController.addPicture)
    .delete(gameController.removePicture)
    
export default gameRouter;