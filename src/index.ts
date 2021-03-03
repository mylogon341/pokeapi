import express from "express";
import { listAll, pokemon, getEvolutionDetails, allItems, getItem, getEncounterDetails, getMove } from "./requests"
import { NameURL } from "./models/common"
import { getImage, ImageSource } from "./image_handler";

const app = express();
const port = 8081; // default port to listen

app.use(express.json())

app.get("/reachability", (_, res) => res.json())

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

function spammingPokemon(): Promise<Promise<void>[]> {
  return new Promise((res, _) => {

    listAll()
      .then(gens => {
        gens.forEach(g => {
          res(g.pokemon.map(p => {
            return pokemon(p.id)
              .then(() => getEvolutionDetails(p.id))
              .then(() => getEncounterDetails(p.id))
              .then(() => getImage(ImageSource.poke_image, `${p.id}`))
              .then(() => console.log(`success ${p.id}`))
              .catch(e => {
                console.error(`${e}\n${p.id}`)
              })
          })
          )
        })
      })
  })
}

function spammingMoves(): Promise<void>[] {
  return [...Array(850)].map(n => {
    return getMove(n)
      .then(() => console.log(`got move ${n}`))
      .catch(err => console.error(err))
  })
}

app.get("/spam", (_req, res) => {
  res.send("triggered")
  spammingPokemon()
    .then(promises => Promise.all(promises))
    .then(() => spammingMoves())
    .then(moves => Promise.all(moves))
    .then(() => console.log("complete!"))
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

app.get("/encounters/:number", (req, res) => {
  getEncounterDetails(req.params.number)
    .then(information => res.json(information))
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

app.get("/move/:id", (req, res) => {
  getMove(req.params.id)
    .then(flatData => res.json(flatData))
    .catch(err => res.status(500).send(err))
})

app.get("/image/:type/:index", (req, res) => {

  let type: ImageSource

  switch (req.params.type) {
    case "poke_sprite":
      type = ImageSource.poke_sprite
      break
    case "item_sprite":
      type = ImageSource.item_sprite
      break
    case "poke_image":
      type = ImageSource.poke_image
      break
  }

  getImage(type, req.params.index)
    .then(path => res.sendFile(path))
    .catch(err => {
      console.error(err)
      res.status(500).json(err)
    })
})

// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});