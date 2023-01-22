"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requests_1 = require("./requests");
const common_1 = require("./models/common");
const image_handler_1 = require("./image_handler");
const app = express_1.default();
const port = 8081; // default port to listen
app.use(express_1.default.json());
app.get("/reachability", (_, res) => res.json());
app.get("/type-charts", (_, res) => {
    res.json([
        new common_1.NameURL("Gen 1", "https://img.pokemondb.net/images/typechart-gen1.png"),
        new common_1.NameURL("Gen 2 - 5", "https://img.pokemondb.net/images/typechart-gen2345.png"),
        new common_1.NameURL("Gen 6+", "https://img.pokemondb.net/images/typechart.png")
    ]);
});
app.get("/pokemon", (_, res) => {
    requests_1.listAll()
        .then(pokemon => {
        res.json(pokemon);
    }).catch(err => res.json(err));
});
function spammingPokemon() {
    return new Promise((res, _) => {
        requests_1.listAll()
            .then(gens => {
            gens.forEach(g => {
                res(g.pokemon.map(p => {
                    return requests_1.pokemon(p.id)
                        .then(() => requests_1.getEvolutionDetails(p.id))
                        .then(() => requests_1.getEncounterDetails(p.id))
                        .then(() => undefined)
                        .catch(e => {
                        console.error(`${e}\n${p.id}`);
                    });
                }));
            });
        });
    });
}
function spammingMoves() {
    return [...Array(850)].map(n => {
        return requests_1.getMove(n)
            .then(() => console.log(`got move ${n}`))
            .catch(err => console.error(err));
    });
}
app.get('/clear-cache', (_req, res) => {
    requests_1.clearRedisCache(() => {
        res.send(200);
    });
});
app.get("/spam", (_req, res) => {
    res.send("triggered");
    spammingPokemon()
        .then(promises => Promise.all(promises))
        .then(() => spammingMoves())
        .then(moves => Promise.all(moves))
        .then(() => console.log("complete!"));
});
app.get("/pokemon/:number", (req, res) => {
    requests_1.pokemon(req.params.number)
        .then(poke => res.json(poke))
        .catch(err => res.status(500).json(err));
});
app.get("/evolution-details/:number", (req, res) => {
    requests_1.getEvolutionDetails(req.params.number)
        .then(detail => res.json(detail))
        .catch(err => res.status(500).json(err));
});
app.get("/encounters/:number", (req, res) => {
    requests_1.getEncounterDetails(req.params.number)
        .then(information => res.json(information))
        .catch(err => res.status(500).json(err));
});
app.get("/items", (_, res) => {
    requests_1.allItems()
        .then(body => res.json(body))
        .catch(err => res.status(500).json(err));
});
app.get("/item/:number", (req, res) => {
    requests_1.getItem(req.params.number)
        .then(body => res.json(body))
        .catch(err => res.status(500).json(err));
});
app.get("/move/:id", (req, res) => {
    requests_1.getMove(req.params.id)
        .then(flatData => res.json(flatData))
        .catch(err => res.status(500).send(err));
});
app.get("/image/:type/:index", (req, res) => {
    let type;
    switch (req.params.type) {
        case "poke_sprite":
            type = image_handler_1.ImageSource.poke_sprite;
            break;
        case "item_sprite":
            type = image_handler_1.ImageSource.item_sprite;
            break;
        case "poke_image":
            type = image_handler_1.ImageSource.poke_image;
            break;
    }
    image_handler_1.getImage(type, req.params.index)
        .then(path => res.sendFile(path))
        .catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});
// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map