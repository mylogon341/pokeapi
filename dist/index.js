"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requests_1 = require("./requests");
const app = express_1.default();
const port = 8080; // default port to listen
app.get("/sprite-url", (_, res) => {
    res.json({ "baseurl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/$.png" });
});
app.get("/larger-image", (_, res) => {
    res.json({ "baseurl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/$.png" });
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