import path from "path";
import games from "./../data/game.json" with { type: "json" };
import fs from "fs/promises";

function isValidGame(body) {
    if (!body.name || !body.shortDesc || !body.releaseDate || !body.genres || !body.mode) {
        return false;
    };

    console.log(body.mode);

    const modeCheck = body.mode.every(m => m.match(/^(?!multi$)(?!solo$).*/i));
    if (modeCheck) {
        return false
    };

    return true;
}

const gameController = {
    all: (req, res) => {
        const result = games.map(game => ({
            id: game.id,
            name: game.name,
            shortDesc: game.shortDesc
        }))
        res.status(200).json(result);
        // 👍
    },
    byId: (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.sendStatus(400) // Id dans un mauvais format
            return;
        }

        const findItem = games.find(game => game.id === id);
        if (!findItem) {
            res.status(404).json({ error: "Aucun jeu trouvé 🥲" });
            return;
        }

        res.status(200).json(findItem);
        // 👍
    },
    addGame: (req, res) => {
        const lastId = games.length > 0 ? Math.max(...games.map(game => game.id)) : 0;

        if (!isValidGame(req.body)) {
            res.status(422).json({ errors: 'Boum...' })
            return;
        }

        const findItem = games.find(game => game.name === req.body.name);
        if (findItem) {
            res.status(409).json({ error: "Le jeu existe déjà dans la db.", existing: findItem });
            return;
        }

        const newgame = { ...req.body, id: lastId + 1, cover: null };
        games.push(newgame)

        res.status(201).location(`/api/videogame/${newgame.id}`).json(newgame);
    },
    changeItem: (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.sendStatus(400)
            return;
        }

        const index = games.findIndex(game => game.id === id);
        if (index === -1) {
            res.sendStatus(404)
            return
        }

        if (!isValidGame(req.body)) {
            res.status(422).json({ errors: 'Les données entrées ne sont pas correctes ou manquantes' })
            return;
        }

        // games[index].name = req.body.name; 
        // games[index].desc = req.body.desc; 
        // games[index].shortDesc = req.body.shortDesc; 
        // games[index].releaseDate = req.body.releaseDate; 
        // games[index].genres = req.body.genres; 
        // games[index].mode = req.body.mode;

        const changedGame = { ...games[index], ...req.body };
        games[index] = changedGame;

        res.status(200).json(changedGame);

    },
    deleteItem: (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.sendStatus(400)
            return;
        }

        const index = games.findIndex(game => game.id === id);
        if (index === -1) {
            res.sendStatus(404)
            return
        }

        games.splice(index, 1);

        res.sendStatus(204);
        // 👍
    },
    addPicture: (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.sendStatus(400)
            return;
        }

        // TODO Que faire si l'image est upload mais que le jeu n'est pas trouvé
        const index = games.findIndex(game => game.id === id);
        if (index === -1) {
            // Jeux Non trouvé -> Via le module "fs", tu supp le fichier
            const uploadedFile = req.file;
            if (uploadedFile) {
                const filePath = path.join(__dirname, "./public/cover/", uploadedFile.filename);
                fs.rmdir(filePath, (err) => {
                    if (err) {
                        console.error("Erreur lors de la suppression du fichier.");
                        res.sendStatus(500);
                    } else {
                        console.log("Fichier supprimé car aucun jeu associé.");
                        res.sendStatus(404);
                    }
                })
            }
            res.sendStatus(404)
            return
        }

        if (!req.file) return res.status(400).json({ error: "Fichier manquant" });

        games[index].cover = `/cover/${req.file.filename}`;

        res.status(200).json({ message: "Image enregistrée", cover: games[index].cover });
        console.log(req.file);
    },
    removePicture: (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.sendStatus(400)
            return;
        }

        const index = games.findIndex(game => game.id === id);
        if (index === -1) {
            res.sendStatus(404)
            return
        }

        games[index].cover = null;
        //-> Via le module "fs", tu supp le fichier

        res.status(200).json({ message: "Image supprimée de la DB" })
    }
}

export default gameController;