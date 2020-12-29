"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requests_1 = require("./requests");
const image_1 = require("./models/image");
const app = express_1.default();
const port = 8080; // default port to listen
app.get("/image-urls", (_, res) => {
    res.json({
        "main_image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/$.png",
        "sprite_image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/$.png"
    });
});
app.get("/type-charts", (_, res) => {
    res.json([
        new image_1.Image("https://img.pokemondb.net/images/typechart-gen1.png", "Gen 1"),
        new image_1.Image("https://img.pokemondb.net/images/typechart-gen2345.png", "Gen 2 - 5"),
        new image_1.Image("https://img.pokemondb.net/images/typechart.png", "Gen 6+")
    ]);
});
app.get("/pokemon", (req, res) => {
    requests_1.listAll()
        .then(pokemon => {
        res.json(pokemon);
    }).catch(err => res.json(err));
});
app.get("/pokemon/:number", (req, res) => {
    requests_1.pokemon(req.params.number)
        .then(poke => res.json(poke))
        .catch(err => res.status(500).json(err));
});
// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map