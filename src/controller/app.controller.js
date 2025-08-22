import games from "./../data/game.json" with { type: "json" };


const gameController = {
    all: (req, res) => {
        const result = games.map(game => ({
            id:         game.id,
            name:       game.name,
            shortDesc:  game.shortDesc
        }))
        res.status(200).json(result);
    },
    byId: (req, res) => {

    },
}

export default gameController;