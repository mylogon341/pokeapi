import express from "express";
import { listAll, pokemon, getEvolutionDetails, allItems, getItem } from "./requests"
import { NameURL } from "./models/common"

const app = express();
const port = 8080; // default port to listen

app.get("/image-urls", (_, res) => {
  res.json(
    {
      "main_image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/$.png",
      "sprite_image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/$.png",
      "item_sprite_image": "http://pokeapi.co/media/sprites/items/$.png"
    }
  )
})

app.get("/type-charts", (_, res) => {
  res.json(
    [
      new NameURL("Gen 1", "https://img.pokemondb.net/images/typechart-gen1.png"),
      new NameURL("Gen 2 - 5", "https://img.pokemondb.net/images/typechart-gen2345.png"),
      new NameURL("Gen 6+", "https://img.pokemondb.net/images/typechart.png")
    ]
  )
})

app.get("/pokemon", (_, res) => {
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

app.get("/evolution-details/:number", (req, res) => {
  getEvolutionDetails(req.params.number)
    .then(detail => res.json(detail))
    .catch(err => res.status(500).json(err))
})

app.get("/items", (_, res) => {
  allItems()
    .then(body => res.json(body))
    .catch(err => res.status(500).json(err))
})

app.get("/item/:number", (req, res) => {
  getItem(req.params.number)
    .then(body => res.json(body))
    .catch(err => res.status(500).json(err))
})

// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});