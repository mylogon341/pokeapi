import axios from "axios"
import { BasicPokemon, EvolutionChain, Pokemon, PokemonSpecies, BasePokemon } from "./models/pokemon"

const baseUrl = "https://pokeapi.co/api/v2/"

async function pokemon(index: string): Promise<Pokemon> {
    let basePokemon: BasePokemon
    let pokeSpecies: PokemonSpecies
    console.log("going to call pokemon with id " + index)

    return new Promise((success, reject) => {
        axios.get(baseUrl + "pokemon/" + index)
        .then(body => new BasePokemon(body.data) )
        .then(base => {
            basePokemon = base
            return base.species_url
        })
        .then(speciesUrl => axios.get(speciesUrl))
        .then(speciesResponse => new PokemonSpecies(speciesResponse.data))
        .then(species => {
            pokeSpecies = species
            return species.evolution_chain_url
        })
        .then(chainUrl => axios.get(chainUrl))
        .then(chainResponse => new EvolutionChain(chainResponse.data))
        .then(chain => success(new Pokemon(basePokemon, pokeSpecies, chain)))
        .catch(err => {
            console.log(err)
            reject(err)}
            )
    })
}

////
async function listAll(): Promise<BasicPokemon[]> {
    return new Promise((success, reject) => {
        axios.get(baseUrl + "pokemon?limit=1200")
            .then(body => {
                success(body.data.results
                    .map(obj => new BasicPokemon(obj))
                )
            }).catch(err => reject(err))
    })
}

export { listAll, pokemon }