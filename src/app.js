import express from "express";
import morgan from "morgan";
import appRouter from "./router/app.router.js";

// ==== Setup ====
const app = express();
const { PORT, NODE_ENV } = process.env;

// ==== Middleware ====
app.use(morgan("tiny"));
app.use(express.json());

// ==== Routing ====
app.use("/api", appRouter);

// ==== Serveur ====
app.listen(PORT, (error) => {
    if (error) {
        console.log(`Erreur au démarrage du serveur`, error);
        return;
    }
    console.log(`Le serveur est sur le port ${PORT} [${NODE_ENV}]`);
    console.log('mon serveur', `http://localhost:${PORT}`);
})