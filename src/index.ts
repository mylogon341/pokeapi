import express from "express";
import { listAll, pokemon } from "./requests"
const app = express();
const port = 8080; // default port to listen

app.get("/image-urls", (_, res) => {
  res.json(
    {
      "main_image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/$.png",
      "sprite_image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/$.png"
    }
  )
})

app.get("/pokemon", (req, res) => {
  listAll()
  .then(pokemon => {
    res.json(pokemon)
  }).catch(err => res.json(err))
})

app.get("/pokemon/:number", (req, res) => {
  pokemon(req.params.number)
  .then(poke => res.json(poke))
  .catch(err => res.status(500).json(err))
})

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );